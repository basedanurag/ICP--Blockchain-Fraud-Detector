 use chrono::{DateTime, Utc};
use mongodb::bson::{self, doc, Document};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct WalletCheckRequest {
    pub address: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WalletCheck {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option,
    pub address: String,
    pub subnet_id: Option,
    pub timestamp: DateTime,
    pub risk_level: Option,
    pub reason: Option,
    pub ipc_specific_flags: Option>,
}

impl WalletCheck {
    pub fn new(address: String, subnet_id: Option) -> Self {
        Self {
            id: None,
            address,
            subnet_id,
            timestamp: Utc::now(),
            risk_level: None,
            reason: None,
            ipc_specific_flags: None,
        }
    }
    
    pub fn into_document(self) -> Document {
        doc! {
            "address": self.address,
            "subnet_id": self.subnet_id,
            "timestamp": self.timestamp,
            "risk_level": self.risk_level,
            "reason": self.reason,
            "ipc_specific_flags": self.ipc_specific_flags,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AIPredictionRequest {
    pub address: String,
    pub subnet_id: Option,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AIPredictionResponse {
    pub risk_level: String,
    pub reason: String,
    pub ipc_specific_flags: Option>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WalletCheckResponse {
    pub address: String,
    pub subnet_id: Option,
    pub timestamp: DateTime,
    pub risk_level: String,
    pub reason: String,
    pub ipc_specific_flags: Option>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SubnetStats {
    pub id: String,
    pub total_addresses: u64,
    pub active_validators: u64,
    pub cross_subnet_txs: u64,
    pub risk_score: u8,
}
      

      
      