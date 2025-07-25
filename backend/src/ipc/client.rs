    
        use ethers::{
    prelude::*,
    providers::{Http, Provider},
    types::{Address, U256},
};
use serde::{Deserialize, Serialize};
use std::env;
use std::str::FromStr;
use std::sync::Arc;
use thiserror::Error;

use super::{extract_eth_address, extract_subnet_id};

#[derive(Error, Debug)]
pub enum IPCClientError {
    #[error("Invalid address format")]
    InvalidAddress,
    
    #[error("Provider error: {0}")]
    ProviderError(String),
    
    #[error("Environment variable not found: {0}")]
    EnvVarError(#[from] std::env::VarError),
    
    #[error("Ethers error: {0}")]
    EthersError(#[from] ethers::prelude::ProviderError),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SubnetInfo {
    pub id: String,
    pub total_addresses: u64,
    pub active_validators: u64,
    pub cross_subnet_txs: u64,
    pub risk_score: u8,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WalletInfo {
    pub address: String,
    pub subnet_id: String,
    pub eth_address: String,
    pub balance: String,
    pub tx_count: u64,
    pub subnet_info: Option,
}

pub struct IPCClient {
    provider: Arc>,
}

impl IPCClient {
    pub fn new() -> Result {
        let ipc_rpc_url = env::var("IPC_RPC_URL")?;
        let provider = Provider::::try_from(ipc_rpc_url)
            .map_err(|e| IPCClientError::ProviderError(e.to_string()))?;
            
        Ok(Self {
            provider: Arc::new(provider),
        })
    }
    
    pub async fn get_wallet_info(&self, address: &str) -> Result {
        // Extract Ethereum address and subnet ID
        let eth_address = extract_eth_address(address)
            .ok_or(IPCClientError::InvalidAddress)?;
            
        let subnet_id = extract_subnet_id(address)
            .unwrap_or_else(|| "default".to_string());
            
        // Convert to ethers Address type
        let eth_addr = Address::from_str(ð_address)
            .map_err(|_| IPCClientError::InvalidAddress)?;
            
        // Get balance and transaction count
        let balance = self.provider.get_balance(eth_addr, None).await?;
        let tx_count = self.provider.get_transaction_count(eth_addr, None).await?;
        
        // Get subnet info if not default
        let subnet_info = if subnet_id != "default" {
            Some(self.get_subnet_info(&subnet_id).await?)
        } else {
            None
        };
        
        Ok(WalletInfo {
            address: address.to_string(),
            subnet_id,
            eth_address,
            balance: format_ether(balance),
            tx_count: tx_count.as_u64(),
            subnet_info,
        })
    }
    
    pub async fn get_subnet_info(&self, subnet_id: &str) -> Result {
        // In a real implementation, this would query the IPC blockchain
        // For this demo, we'll return mock data based on the subnet ID
        
        // Use subnet_id to generate deterministic values
        let hash_value = subnet_id.chars()
            .map(|c| c as u64)
            .sum::();
            
        Ok(SubnetInfo {
            id: subnet_id.to_string(),
            total_addresses: 1000 + (hash_value % 9000),
            active_validators: 10 + (hash_value % 90),
            cross_subnet_txs: 500 + (hash_value % 1500),
            risk_score: ((hash_value % 100) as u8).min(100),
        })
    }
}

fn format_ether(wei: U256) -> String {
    let wei_f: f64 = wei.as_u128() as f64;
    let ether = wei_f / 1_000_000_000_000_000_000.0;
    format!("{:.6}", ether)
}
      