        
        use actix_web::{
    get, post, web, HttpResponse, Responder, Result,
    error::ErrorInternalServerError,
};
use chrono::Utc;
use log::{error, info};
use reqwest::Client as HttpClient;
use serde_json::json;
use std::env;

use crate::db::DbClient;
use crate::ipc::{extract_subnet_id, is_valid_ipc_address};
use crate::ipc::client::IPCClient;
use crate::models::{
    AIPredictionRequest, AIPredictionResponse,
    WalletCheck, WalletCheckRequest, WalletCheckResponse,
    SubnetStats,
};

#[post("/check")]
async fn check_wallet(
    db: web::Data,
    req: web::Json,
) -> Result {
    let address = req.address.clone();
    info!("Checking wallet address: {}", address);
    
    // Validate address format
    if !is_valid_ipc_address(&address) {
        return Ok(HttpResponse::BadRequest().json(json!({
            "error": "Invalid IPC or Ethereum address format"
        })));
    }
    
    // Extract subnet ID if present
    let subnet_id = extract_subnet_id(&address);
    
    // Create initial wallet check record
    let wallet_check = WalletCheck::new(address.clone(), subnet_id.clone());
    
    // Store initial record in MongoDB
    if let Err(e) = db.insert_wallet_check(wallet_check).await {
        error!("Failed to insert wallet check: {}", e);
        return Err(ErrorInternalServerError("Database error"));
    }
    
    // Send request to AI service
    let ai_service_url = env::var("AI_SERVICE_URL")
        .unwrap_or_else(|_| "http://localhost:8000".to_string());
    
    let http_client = HttpClient::new();
    let ai_request = AIPredictionRequest { 
        address: address.clone(),
        subnet_id: subnet_id.clone(),
    };
    
    let ai_response = match http_client
        .post(format!("{}/predict", ai_service_url))
        .json(&ai_request)
        .send()
        .await
    {
        Ok(response) => {
            if !response.status().is_success() {
                error!("AI service returned error: {}", response.status());
                return Err(ErrorInternalServerError("AI service error"));
            }
            
            match response.json::().await {
                Ok(prediction) => prediction,
                Err(e) => {
                    error!("Failed to parse AI response: {}", e);
                    return Err(ErrorInternalServerError("Failed to parse AI response"));
                }
            }
        }
        Err(e) => {
            error!("Failed to connect to AI service: {}", e);
            return Err(ErrorInternalServerError("Failed to connect to AI service"));
        }
    };
    
    // Update MongoDB record with AI prediction
    if let Err(e) = db
        .update_wallet_check(
            &address,
            &ai_response.risk_level,
            &ai_response.reason,
            ai_response.ipc_specific_flags.clone(),
        )
        .await
    {
        error!("Failed to update wallet check: {}", e);
        return Err(ErrorInternalServerError("Database error"));
    }
    
    // Return response to client
    let response = WalletCheckResponse {
        address,
        subnet_id,
        timestamp: Utc::now(),
        risk_level: ai_response.risk_level,
        reason: ai_response.reason,
        ipc_specific_flags: ai_response.ipc_specific_flags,
    };
    
    Ok(HttpResponse::Ok().json(response))
}

#[get("/recent-checks")]
async fn get_recent_checks(db: web::Data, query: web::Query) -> Result {
    let limit = query.limit.unwrap_or(10);
    
    match db.get_recent_checks(limit).await {
        Ok(checks) => {
            let response = checks
                .into_iter()
                .map(|doc| {
                    let address = doc.get_str("address").unwrap_or("").to_string();
                    let subnet_id = doc.get_str("subnet_id").ok().map(|s| s.to_string());
                    let timestamp = doc.get_datetime("timestamp").unwrap_or(&bson::DateTime::now()).to_chrono();
                    let risk_level = doc.get_str("risk_level").unwrap_or("Unknown").to_string();
                    let reason = doc.get_str("reason").unwrap_or("").to_string();
                    
                    // Extract IPC-specific flags if present
                    let ipc_specific_flags = match doc.get_array("ipc_specific_flags") {
                        Ok(flags_array) => {
                            let flags = flags_array
                                .iter()
                                .filter_map(|f| f.as_str().map(|s| s.to_string()))
                                .collect::>();
                            
                            if flags.is_empty() { None } else { Some(flags) }
                        },
                        Err(_) => None,
                    };
                    
                    json!({
                        "address": address,
                        "subnet_id": subnet_id,
                        "timestamp": timestamp,
                        "risk_level": risk_level,
                        "reason": reason,
                        "ipc_specific_flags": ipc_specific_flags,
                    })
                })
                .collect::>();
                
            Ok(HttpResponse::Ok().json(response))
        }
        Err(e) => {
            error!("Failed to get recent checks: {}", e);
            Err(ErrorInternalServerError("Database error"))
        }
    }
}

#[get("/subnet-stats/{subnet_id}")]
async fn get_subnet_stats(path: web::Path) -> Result {
    let subnet_id = path.into_inner();
    
    match IPCClient::new() {
        Ok(client) => {
            match client.get_subnet_info(&subnet_id).await {
                Ok(info) => {
                    let stats = SubnetStats {
                        id: info.id,
                        total_addresses: info.total_addresses,
                        active_validators: info.active_validators,
                        cross_subnet_txs: info.cross_subnet_txs,
                        risk_score: info.risk_score,
                    };
                    
                    Ok(HttpResponse::Ok().json(stats))
                },
                Err(e) => {
                    error!("Failed to get subnet info: {}", e);
                    Err(ErrorInternalServerError("Failed to get subnet information"))
                }
            }
        },
        Err(e) => {
            error!("Failed to create IPC client: {}", e);
            Err(ErrorInternalServerError("Failed to initialize IPC client"))
        }
    }
}

#[derive(serde::Deserialize)]
struct RecentChecksQuery {
    limit: Option,
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(check_wallet)
       .service(get_recent_checks)
       .service(get_subnet_stats);
}
      