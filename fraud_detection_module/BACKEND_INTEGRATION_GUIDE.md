# Backend Integration Guide for Fraud Detection Module

This guide provides comprehensive instructions for backend developers to integrate the fraud detection module into their applications for **global blockchain transaction analysis**.

## 🌍 Global Fraud Detection Overview

This module is designed to analyze transactions from **any blockchain wallet address globally**, not limited to specific networks. It works with:
- **Ethereum** and EVM-compatible chains
- **Bitcoin** (with address format adaptation)
- **Other blockchain networks** (with proper data formatting)

### Real-Time Global Analysis Requirements

To enable real-time global fraud detection, you need:
1. **Blockchain Data Providers**: Integration with services like Alchemy, Infura, Moralis, or QuickNode
2. **Live Data Pipeline**: Continuous updates to your MongoDB with global transaction data
3. **Dynamic Address Processing**: Handle any wallet address format from supported networks
4. **Scalable Infrastructure**: Handle high-volume transaction data across multiple blockchains

## 📋 Prerequisites

### System Requirements
- **Python**: 3.8 or higher
- **MongoDB**: Running at `mongodb://localhost:27017/` with proper indexing for large datasets
- **Blockchain Data Provider**: API keys for real-time data access
- **Dependencies**: Listed in requirements section

### Required Files
- `fraud_detection.py` - Main module
- `fraud_model.pkl` - Trained ML model (2.2MB)
- Database with `fraud_detection.transactions` collection
- Real-time data ingestion pipeline

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install pymongo scikit-learn pandas numpy
```

### 2. Import and Use
```python
from fraud_detection import analyze_wallet

# Analyze a wallet
wallet_address = "0x742d35Cc6634C0532925a3b8D5C9C89D05afe3b2"
results = analyze_wallet(wallet_address)
print(f"Found {len(results)} transactions")
```

## 🔧 API Integration Examples

### Flask (Python)
```python
from flask import Flask, jsonify, request
from flask_cors import CORS
from fraud_detection import analyze_wallet
import logging

app = Flask(__name__)
CORS(app)

@app.route('/api/fraud/analyze', methods=['POST'])
def analyze_fraud():
    try:
        # Get wallet ID from request
        data = request.get_json()
        wallet_id = data.get('wallet_id')
        
        if not wallet_id:
            return jsonify({
                'error': 'wallet_id is required',
                'status': 'error'
            }), 400
        
        # Validate wallet address format (basic check)
        if not wallet_id.startswith('0x') or len(wallet_id) != 42:
            return jsonify({
                'error': 'Invalid wallet address format',
                'status': 'error'
            }), 400
        
        # Analyze wallet
        results = analyze_wallet(wallet_id)
        
        # Format response
        response = {
            'status': 'success',
            'wallet_id': wallet_id,
            'total_transactions': len(results),
            'high_risk_count': len([r for r in results if r['risk_level'] == 'high']),
            'medium_risk_count': len([r for r in results if r['risk_level'] == 'medium']),
            'low_risk_count': len([r for r in results if r['risk_level'] == 'low']),
            'transactions': results
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        logging.error(f"Error analyzing wallet {wallet_id}: {e}")
        return jsonify({
            'error': f'Internal server error: {str(e)}',
            'status': 'error'
        }), 500

@app.route('/api/fraud/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        # Test if model loads
        from fraud_detection import categorize_risk
        test_score = categorize_risk(0.5)
        
        return jsonify({
            'status': 'healthy',
            'model_loaded': True,
            'test_result': test_score
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e)
        }), 503

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

### Express.js (Node.js) - Using Python Child Process
```javascript
const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/fraud/analyze', (req, res) => {
    const { wallet_id } = req.body;
    
    if (!wallet_id) {
        return res.status(400).json({
            error: 'wallet_id is required',
            status: 'error'
        });
    }
    
    // Validate wallet address
    if (!wallet_id.startsWith('0x') || wallet_id.length !== 42) {
        return res.status(400).json({
            error: 'Invalid wallet address format',
            status: 'error'
        });
    }
    
    // Call Python script
    const python = spawn('python', ['fraud_detection.py', wallet_id]);
    
    let output = '';
    let error = '';
    
    python.stdout.on('data', (data) => {
        output += data.toString();
    });
    
    python.stderr.on('data', (data) => {
        error += data.toString();
    });
    
    python.on('close', (code) => {
        if (code === 0) {
            try {
                const results = JSON.parse(output);
                res.json({
                    status: 'success',
                    wallet_id: wallet_id,
                    results: results
                });
            } catch (parseError) {
                res.status(500).json({
                    error: 'Failed to parse results',
                    status: 'error'
                });
            }
        } else {
            res.status(500).json({
                error: error || 'Python script execution failed',
                status: 'error'
            });
        }
    });
});

app.listen(3000, () => {
    console.log('Fraud detection API running on port 3000');
});
```

### FastAPI (Python) - Async Support
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fraud_detection import analyze_wallet
import asyncio
import logging

app = FastAPI(title="Fraud Detection API", version="1.0.0")

class WalletRequest(BaseModel):
    wallet_id: str

class AnalysisResponse(BaseModel):
    status: str
    wallet_id: str
    total_transactions: int
    high_risk_count: int
    medium_risk_count: int
    low_risk_count: int
    transactions: list

@app.post("/api/fraud/analyze", response_model=AnalysisResponse)
async def analyze_fraud(request: WalletRequest):
    try:
        wallet_id = request.wallet_id
        
        # Validate wallet address
        if not wallet_id.startswith('0x') or len(wallet_id) != 42:
            raise HTTPException(
                status_code=400, 
                detail="Invalid wallet address format"
            )
        
        # Run analysis in thread pool to avoid blocking
        def run_analysis():
            return analyze_wallet(wallet_id)
        
        loop = asyncio.get_event_loop()
        results = await loop.run_in_executor(None, run_analysis)
        
        # Format response
        return AnalysisResponse(
            status="success",
            wallet_id=wallet_id,
            total_transactions=len(results),
            high_risk_count=len([r for r in results if r['risk_level'] == 'high']),
            medium_risk_count=len([r for r in results if r['risk_level'] == 'medium']),
            low_risk_count=len([r for r in results if r['risk_level'] == 'low']),
            transactions=results
        )
        
    except Exception as e:
        logging.error(f"Error analyzing wallet {wallet_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "fraud-detection"}
```

## 📊 Response Format

### Successful Response
```json
{
    "status": "success",
    "wallet_id": "0x742d35Cc6634C0532925a3b8D5C9C89D05afe3b2",
    "total_transactions": 25,
    "high_risk_count": 3,
    "medium_risk_count": 8,
    "low_risk_count": 14,
    "transactions": [
        {
            "transaction_id": "tx_001",
            "wallet_id": "0x742d35Cc6634C0532925a3b8D5C9C89D05afe3b2",
            "method": "transfer",
            "amount": 1500.5,
            "timestamp": "2024-01-15T10:30:00Z",
            "risk_score": 0.8542,
            "risk_level": "high",
            "features": {
                "amount": 1500.5,
                "gas_fee": 0.002,
                "time_since_last_transaction": 2.5,
                "transaction_frequency": 15,
                "method_numeric": 0
            }
        }
    ]
}
```

### Error Response
```json
{
    "status": "error",
    "error": "Invalid wallet address format"
}
```

## 🛠️ Database Setup

### MongoDB Collections Required

#### Collection: `fraud_detection.transactions`
```javascript
{
    "_id": ObjectId,
    "wallet_id": "0x742d35Cc6634C0532925a3b8D5C9C89D05afe3b2",
    "method": "transfer",
    "amount": 250.5,
    "gas_fee": 0.003,
    "timestamp": "2024-01-15T10:30:00Z",
    "to_address": "0x123...",
    "from_address": "0x456...",
    "block_number": 18500000,
    "transaction_index": 45,
    "frequency": 3
}
```

### Database Indexes (Recommended)
```javascript
// Create index on wallet_id for faster queries
db.transactions.createIndex({ "wallet_id": 1 })

// Create compound index for better performance
db.transactions.createIndex({ 
    "wallet_id": 1, 
    "timestamp": -1 
})
```

## 🔍 Available Functions

### Core Functions
```python
from fraud_detection import analyze_wallet, extract_features, categorize_risk

# Main analysis function
analyze_wallet(wallet_id: str) -> List[Dict]

# Helper functions
extract_features(transaction: Dict) -> Dict
categorize_risk(risk_score: float) -> str
```

### Function Parameters

#### `analyze_wallet(wallet_id)`
- **Parameter**: `wallet_id` (str) - Ethereum wallet address
- **Returns**: List of transaction analysis results
- **Raises**: Various exceptions for invalid inputs or system errors

#### `extract_features(transaction)`
- **Parameter**: `transaction` (Dict) - Transaction data from MongoDB
- **Returns**: Dictionary of extracted features
- **Raises**: `TypeError`, `ValueError` for invalid input

#### `categorize_risk(risk_score)`
- **Parameter**: `risk_score` (float) - Model prediction score (0.0 - 1.0)
- **Returns**: Risk level string ('low', 'medium', 'high', 'unknown')

## ⚙️ Configuration

### Environment Variables
```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DATABASE=fraud_detection
MONGODB_COLLECTION=transactions

# Model Configuration
MODEL_PATH=./fraud_model.pkl
LOG_LEVEL=INFO
```

### Logging Configuration
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('fraud_detection.log'),
        logging.StreamHandler()
    ]
)
```

## 🚨 Error Handling

### Common Error Scenarios

1. **Model File Missing**
   - Error: `FileNotFoundError`
   - Solution: Ensure `fraud_model.pkl` exists in the working directory

2. **MongoDB Connection Failed**
   - Error: `ServerSelectionTimeoutError`
   - Solution: Verify MongoDB is running and accessible

3. **Invalid Wallet Address**
   - Error: `ValueError`
   - Solution: Validate address format before calling

4. **No Transactions Found**
   - Returns: Empty list `[]`
   - Not an error - wallet has no transaction history

### Recommended Error Handling Pattern
```python
try:
    results = analyze_wallet(wallet_id)
    if not results:
        return {"message": "No transactions found for this wallet"}
    return {"results": results}
except Exception as e:
    logging.error(f"Analysis failed: {e}")
    return {"error": str(e)}, 500
```

## 🔧 Performance Considerations

### Optimization Tips
1. **Caching**: Cache results for frequently analyzed wallets
2. **Async Processing**: Use async frameworks for better concurrency
3. **Connection Pooling**: Reuse MongoDB connections
4. **Batch Processing**: Analyze multiple wallets in batches

### Expected Performance
- **Small wallets** (< 100 transactions): < 1 second
- **Medium wallets** (100-1000 transactions): 1-5 seconds
- **Large wallets** (> 1000 transactions): 5-30 seconds

## 🧪 Testing

### Unit Tests
```python
import unittest
from fraud_detection import analyze_wallet, categorize_risk

class TestFraudDetection(unittest.TestCase):
    def test_categorize_risk(self):
        self.assertEqual(categorize_risk(0.1), 'low')
        self.assertEqual(categorize_risk(0.5), 'medium')
        self.assertEqual(categorize_risk(0.8), 'high')
    
    def test_invalid_wallet(self):
        # Should return empty list for invalid wallet
        results = analyze_wallet("invalid_address")
        self.assertEqual(results, [])
```

### API Testing with curl
```bash
# Test analysis endpoint
curl -X POST http://localhost:5000/api/fraud/analyze \
  -H "Content-Type: application/json" \
  -d '{"wallet_id": "0x742d35Cc6634C0532925a3b8D5C9C89D05afe3b2"}'

# Test health endpoint
curl http://localhost:5000/api/fraud/health
```

## 🔒 Security Considerations

1. **Input Validation**: Always validate wallet addresses
2. **Rate Limiting**: Implement rate limiting for API endpoints
3. **Authentication**: Add API key or JWT authentication
4. **Logging**: Log all analysis requests for audit trails
5. **Data Privacy**: Ensure compliance with data protection regulations

## 📝 Troubleshooting

### Common Issues

1. **ImportError: No module named 'fraud_detection'**
   - Solution: Ensure the module is in your Python path

2. **Model predictions are all zeros**
   - Solution: Check if model file is corrupted, retrain if necessary

3. **MongoDB timeout errors**
   - Solution: Increase timeout settings or check database connectivity

4. **Memory issues with large datasets**
   - Solution: Implement pagination or process transactions in batches

## 🤝 Support

For technical support or questions:
1. Check the logs for detailed error messages
2. Verify all prerequisites are met
3. Test with the provided examples
4. Contact the development team with specific error details

## 📈 Monitoring

### Key Metrics to Monitor
- **Response Times**: API endpoint performance
- **Error Rates**: Failed analysis requests
- **Model Accuracy**: Fraud detection effectiveness
- **Database Performance**: Query execution times

### Logging Events
- Analysis requests and results
- Error conditions and exceptions
- Model loading and initialization
- Database connection status

---

**Version**: 1.0.0
**Last Updated**: 2024-01-15
**Maintained by**: AI/ML Team Anurag and Trisha
