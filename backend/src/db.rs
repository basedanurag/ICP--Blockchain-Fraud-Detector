
        
        use mongodb::{
    bson::{doc, Document, to_bson},
    options::ClientOptions,
    Client, Collection, Database,
};
use std::env;
use thiserror::Error;

use crate::models::WalletCheck;

#[derive(Debug, Error)]
pub enum DbError {
    #[error("MongoDB error: {0}")]
    MongoError(#[from] mongodb::error::Error),
    
    #[error("Environment variable not found: {0}")]
    EnvVarError(#[from] std::env::VarError),
    
    #[error("Failed to parse MongoDB URI: {0}")]
    UriParseError(String),
    
    #[error("BSON serialization error: {0}")]
    BsonError(#[from] mongodb::bson::ser::Error),
}

#[derive(Clone)]
pub struct DbClient {
    pub db: Database,
}

impl DbClient {
    pub fn get_collection(&self, name: &str) -> Collection {
        self.db.collection(name)
    }
    
    pub async fn insert_wallet_check(&self, wallet_check: WalletCheck) -> Result<(), DbError> {
        let collection = self.get_collection("wallet_checks");
        collection.insert_one(wallet_check.into_document(), None).await?;
        Ok(())
    }
    
    pub async fn update_wallet_check(
        &self,
        address: &str,
        risk_level: &str,
        reason: &str,
        ipc_specific_flags: Option>,
    ) -> Result<(), DbError> {
        let collection = self.get_collection("wallet_checks");
        
        // Find the most recent check for this address
        let filter = doc! { "address": address };
        
        let mut update_doc = doc! {
            "$set": {
                "risk_level": risk_level,
                "reason": reason,
            }
        };
        
        // Add IPC-specific flags if present
        if let Some(flags) = ipc_specific_flags {
            let flags_bson = to_bson(&flags)?;
            update_doc = doc! {
                "$set": {
                    "risk_level": risk_level,
                    "reason": reason,
                    "ipc_specific_flags": flags_bson,
                }
            };
        }
        
        let options = mongodb::options::FindOneAndUpdateOptions::builder()
            .sort(doc! { "timestamp": -1 })
            .build();
            
        collection.find_one_and_update(filter, update_doc, options).await?;
        Ok(())
    }
    
    pub async fn get_recent_checks(&self, limit: i64) -> Result, DbError> {
        let collection = self.get_collection("wallet_checks");
        
        let options = mongodb::options::FindOptions::builder()
            .sort(doc! { "timestamp": -1 })
            .limit(limit)
            .build();
            
        let cursor = collection.find(None, options).await?;
        let documents: Vec = cursor.try_collect().await?;
        
        Ok(documents)
    }
}

pub async fn init_db() -> Result {
    let uri = env::var("MONGODB_URI")?;
    let db_name = env::var("DATABASE_NAME")?;
    
    let client_options = ClientOptions::parse(&uri).await?;
    let client = Client::with_options(client_options)?;
    
    // Ping the database to confirm connection
    client
        .database("admin")
        .run_command(doc! { "ping": 1 }, None)
        .await?;
        
    println!("Connected to MongoDB");
    
    let db = client.database(&db_name);
    
    Ok(DbClient { db })
}