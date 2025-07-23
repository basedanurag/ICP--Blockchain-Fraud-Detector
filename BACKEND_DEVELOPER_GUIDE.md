# 🚀 Backend Developer Guide - Fraud Detection System

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Quick Start Setup](#quick-start-setup)
4. [API Endpoints Required](#api-endpoints-required)
5. [Data Contracts](#data-contracts)
6. [Testing with Frontend](#testing-with-frontend)
7. [AI Module Integration](#ai-module-integration)
8. [Database Schema](#database-schema)
9. [Error Handling](#error-handling)
10. [Troubleshooting](#troubleshooting)
11. [Performance Considerations](#performance-considerations)

---

## 🎯 Project Overview

This is a **Web3-based fraud detection system** that analyzes blockchain transactions in real-time using AI and machine learning. The system consists of:

- **Frontend**: React.js application for visualization and testing
- **Backend**: Python/Flask API (to be implemented by you)
- **AI Module**: Pre-built fraud detection module with trained ML model
- **Database**: MongoDB for transaction storage

### 🎨 Use Case
- Analyze ICP blockchain transactions for fraud patterns
- Provide real-time risk scoring (0.0 - 1.0)
- Categorize transactions as low, medium, or high risk
- Support both global and wallet-specific analysis

---

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │───▶│  Backend API    │───▶│   AI Module     │
│  (Port 3000)    │    │  (Port 8000)    │    │ fraud_detection │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       ▼
         │              ┌─────────────────┐    ┌─────────────────┐
         └──────────────│    MongoDB      │    │ fraud_model.pkl │
                        │   Database      │    │   ML Model      │
                        └─────────────────┘    └─────────────────┘
```

### 📊 Data Flow
1. **User Input** → Frontend receives optional wallet ID
2. **API Request** → Frontend calls your backend endpoints
3. **Data Query** → Backend queries MongoDB for transaction data
4. **AI Processing** → Backend calls AI module to analyze transactions
5. **ML Analysis** → AI module loads model and processes features  
6. **Risk Scoring** → AI assigns risk_score (float) and risk_level (string)
7. **Response** → Backend returns analyzed transactions to frontend
8. **Visualization** → Frontend displays results with color-coded risk levels

---

## ⚡ Quick Start Setup

### 1. Prerequisites
```bash
# Python dependencies
pip install flask flask-cors pymongo scikit-learn pandas numpy

# Ensure MongoDB is running
mongod --dbpath /path/to/your/db

# Verify AI module files exist
ls fraud_detection_module/
# Should contain: fraud_detection.py, fraud_model.pkl
```

### 2. Environment Setup
Create a `.env` file in your backend directory:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DATABASE=fraud_detection
MONGODB_COLLECTION=transactions

# API Configuration
FLASK_PORT=8000
FLASK_DEBUG=True

# AI Module Path
AI_MODULE_PATH=./fraud_detection_module

# CORS Settings
CORS_ORIGINS=http://localhost:3000
```

### 3. Start the System
```bash
# Terminal 1: Start your backend server
python app.py  # Your Flask application

# Terminal 2: Start the React frontend
cd frontend
npm install
npm start

# Open browser: http://localhost:3000
```

---

## 🔌 API Endpoints Required

Your backend needs to implement these endpoints:

### 1. Get All Transactions
```http
GET /api/fraud
Content-Type: application/json
```

**Response Format:**
```json
[
  {
    "tx_hash": "0xabc123def456...",
    "risk_score": 0.8542,
    "risk_level": "high",
    "transaction_id": "tx_001",
    "wallet_id": "0x742d35Cc6634C0532925a3b8D5C9C89D05afe3b2",
    "amount": 1500.5,
    "method": "transfer",
    "timestamp": "2024-01-15T10:30:00Z"
  }
]
```

### 2. Get Wallet-Specific Transactions
```http
GET /api/fraud/{wallet_id}
Content-Type: application/json
```

**Parameters:**
- `wallet_id`: Ethereum address (42 characters, starts with `0x`)

**Example URL:** `/api/fraud/0x742d35Cc6634C0532925a3b8D5C9C89D05afe3b2`

**Response:** Same format as above, filtered by wallet

### 3. Health Check
```http
GET /health
Content-Type: application/json
```

**Response:**
```json
{
  "status": "healthy",
  "service": "fraud-detection",
  "model_loaded": true,
  "database_connected": true
}
```

---

## 📊 Data Contracts

### Input Data (Frontend → Backend)
| Field | Type | Description | Required | Example |
|-------|------|-------------|----------|---------|
| `wallet_id` | string | Ethereum wallet address | Optional | `"0x742d35Cc..."` |

### Output Data (Backend → Frontend)
| Field | Type | Description | Range/Options |
|-------|------|-------------|---------------|
| `tx_hash` | string | Transaction hash identifier | Any valid hash |
| `risk_score` | float | Fraud probability | 0.0 - 1.0 |
| `risk_level` | string | Risk category | "low", "medium", "high" |
| `transaction_id` | string | Internal transaction ID | Any string |
| `wallet_id` | string | Associated wallet address | Valid Ethereum address |
| `amount` | float | Transaction amount | Any positive number |
| `method` | string | Transaction type | "transfer", "swap", "stake", etc. |
| `timestamp` | string | Transaction time | ISO 8601 format |

### Risk Level Categories
- **Low Risk**: `risk_score` 0.0 - 0.3 → Normal transaction pattern
- **Medium Risk**: `risk_score` 0.3 - 0.7 → Suspicious activity detected  
- **High Risk**: `risk_score` 0.7 - 1.0 → Likely fraudulent transaction

---

## 🧪 Testing with Frontend

### Frontend Testing Interface

The React frontend provides a comprehensive testing interface:

#### 🌍 Global Transaction Testing
1. Click **"Fetch All Transactions"** button
2. Tests the `GET /api/fraud` endpoint
3. Should return all transactions in the database

#### 🔍 Wallet-Specific Testing  
1. Enter a valid Ethereum address (e.g., `0x742d35Cc6634C0532925a3b8D5C9C89D05afe3b2`)
2. Click **"Search Wallet"** button
3. Tests the `GET /api/fraud/{wallet_id}` endpoint

#### ✨ Features Available for Testing
- **Real-time validation** of wallet address format
- **Visual feedback** with loading states
- **Error handling** display for network issues
- **Color-coded results** based on risk levels:
  - 🟢 Green background for low risk
  - 🟡 Orange background for medium risk  
  - 🔴 Red background for high risk
- **Responsive design** works on mobile and desktop
- **Developer guide** with complete API documentation

### Test Cases to Verify

#### ✅ Valid Test Cases
```bash
# 1. Empty request (fetch all transactions)
curl -X GET http://localhost:8000/api/fraud

# 2. Valid wallet address
curl -X GET http://localhost:8000/api/fraud/0x742d35Cc6634C0532925a3b8D5C9C89D05afe3b2

# 3. Health check
curl -X GET http://localhost:8000/health
```

#### ❌ Error Test Cases
```bash
# 1. Invalid wallet format
curl -X GET http://localhost:8000/api/fraud/not-a-wallet

# 2. Wrong address length
curl -X GET http://localhost:8000/api/fraud/0x123

# 3. Non-existent wallet
curl -X GET http://localhost:8000/api/fraud/0x0000000000000000000000000000000000000000
```

### Expected Frontend Behavior
- **Loading State**: Shows spinner during API calls
- **Success State**: Displays transaction table with color coding
- **Error State**: Shows error message with details
- **Empty State**: Shows "No transactions found" message
- **Validation**: Real-time wallet address format checking

---

## 🤖 AI Module Integration

The AI module (`fraud_detection.py`) is already implemented. Here's how to integrate it:

### Import and Use
```python
# In your Flask app
import sys
import os
sys.path.append('./fraud_detection_module')
from fraud_detection import analyze_wallet

# Example Flask route
@app.route('/api/fraud/<wallet_id>', methods=['GET'])
def get_wallet_transactions(wallet_id):
    try:
        # Call AI module
        results = analyze_wallet(wallet_id)
        
        # Transform results for frontend
        transactions = []
        for result in results:
            transactions.append({
                'tx_hash': result.get('transaction_id', ''),  # Use transaction_id as tx_hash
                'risk_score': result.get('risk_score', 0.0),
                'risk_level': result.get('risk_level', 'unknown'),
                'transaction_id': result.get('transaction_id', ''),
                'wallet_id': result.get('wallet_id', ''),
                'amount': result.get('amount', 0.0),
                'method': result.get('method', ''),
                'timestamp': result.get('timestamp', '')
            })
        
        return jsonify(transactions)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

### AI Module Functions Available
```python
from fraud_detection import analyze_wallet, extract_features, categorize_risk

# Main analysis function
analyze_wallet(wallet_id: str) -> List[Dict]

# Helper functions  
extract_features(transaction: Dict) -> Dict
categorize_risk(risk_score: float) -> str
```

### AI Module Output Format
```python
[
  {
    'transaction_id': 'tx_001',
    'wallet_id': '0x742d35Cc6634C0532925a3b8D5C9C89D05afe3b2', 
    'method': 'transfer',
    'amount': 1500.5,
    'timestamp': '2024-01-15T10:30:00Z',
    'risk_score': 0.8542,
    'risk_level': 'high',
    'features': {
      'amount': 1500.5,
      'gas_fee': 0.002,
      'time_since_last_transaction': 2.5,
      'transaction_frequency': 15,
      'method_numeric': 0
    }
  }
]
```

---

## 🗄️ Database Schema

### MongoDB Collection: `fraud_detection.transactions`

```javascript
{
  "_id": ObjectId("..."),
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

### Required Indexes
```javascript
// Create indexes for better performance
db.transactions.createIndex({ "wallet_id": 1 })
db.transactions.createIndex({ "wallet_id": 1, "timestamp": -1 })
```

### Sample Data for Testing
```javascript
// Insert sample data
db.transactions.insertMany([
  {
    "wallet_id": "0x742d35Cc6634C0532925a3b8D5C9C89D05afe3b2",
    "method": "transfer",
    "amount": 1500.5,
    "gas_fee": 0.002,
    "timestamp": new Date("2024-01-15T10:30:00Z"),
    "to_address": "0x123abc...",
    "from_address": "0x456def...",
    "block_number": 18500000,
    "transaction_index": 45,
    "frequency": 15
  },
  {
    "wallet_id": "0x742d35Cc6634C0532925a3b8D5C9C89D05afe3b2", 
    "method": "swap",
    "amount": 50.0,
    "gas_fee": 0.001,
    "timestamp": new Date("2024-01-15T11:00:00Z"),
    "to_address": "0x789ghi...",
    "from_address": "0x742d35Cc...",
    "block_number": 18500001,
    "transaction_index": 23,
    "frequency": 8
  }
])
```

---

## ⚠️ Error Handling

### HTTP Status Codes to Implement
```python
# Success cases
200 - OK (successful request)
204 - No Content (valid request, no data)

# Client error cases  
400 - Bad Request (invalid wallet format)
404 - Not Found (wallet not found)
422 - Unprocessable Entity (invalid data)

# Server error cases
500 - Internal Server Error (AI module error)
502 - Bad Gateway (database connection error)
503 - Service Unavailable (system overload)
```

### Error Response Format
```json
{
  "error": "Invalid wallet address format",
  "message": "Wallet address must be 42 characters starting with 0x",
  "status": "error",
  "code": 400
}
```

### Common Error Scenarios
1. **Invalid Wallet Format**: Return 400 with validation message
2. **Database Connection Error**: Return 502 with database error
3. **AI Module Error**: Return 500 with processing error  
4. **No Transactions Found**: Return 200 with empty array `[]`
5. **Model File Missing**: Return 503 with service unavailable

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. CORS Errors
```python
# Add to your Flask app
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])
```

#### 2. Connection Refused
- Ensure backend is running on port 8000
- Check if frontend is configured with correct API URL
- Update `REACT_APP_API_BASE_URL` in frontend `.env` if needed

#### 3. Model Not Found Error
```bash
# Verify model file exists
ls fraud_detection_module/fraud_model.pkl

# If missing, run the training script
cd fraud_detection_module
python train_model.py
```

#### 4. MongoDB Connection Issues
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB if not running
mongod --dbpath /path/to/your/db

# Test connection
mongo --eval "db.adminCommand('ping')"
```

#### 5. Empty Results
- Check if MongoDB has transaction data
- Verify database name and collection name
- Test with sample data provided above

#### 6. Import Errors
```python
# Add AI module to Python path
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'fraud_detection_module'))
```

### Debug Mode
```python
# Enable debug logging
import logging
logging.basicConfig(level=logging.DEBUG)

# Add debug prints
@app.route('/api/fraud/<wallet_id>')
def get_wallet_transactions(wallet_id):
    print(f"Received request for wallet: {wallet_id}")
    # ... rest of your code
```

---

## ⚡ Performance Considerations

### Optimization Tips
1. **Connection Pooling**: Reuse MongoDB connections
2. **Caching**: Cache frequent wallet queries  
3. **Async Processing**: Use async frameworks for better concurrency
4. **Pagination**: Implement pagination for large result sets
5. **Indexing**: Ensure proper database indexes

### Expected Performance
- **Small wallets** (<100 transactions): <1 second
- **Medium wallets** (100-1000 transactions): 1-5 seconds  
- **Large wallets** (>1000 transactions): 5-30 seconds

### Monitoring
```python
import time

@app.route('/api/fraud/<wallet_id>')
def get_wallet_transactions(wallet_id):
    start_time = time.time()
    
    # Your processing code here
    results = analyze_wallet(wallet_id)
    
    end_time = time.time()
    processing_time = end_time - start_time
    
    # Log performance metrics
    print(f"Processed {len(results)} transactions in {processing_time:.2f}s")
    
    return jsonify(results)
```

---

## 📝 Example Implementation

Here's a complete Flask application example:

```python
from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os
import logging

# Add AI module to path
sys.path.append('./fraud_detection_module')
from fraud_detection import analyze_wallet

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

# Configure logging
logging.basicConfig(level=logging.INFO)

@app.route('/api/fraud', methods=['GET'])
def get_all_transactions():
    """Fetch all transactions - implement your logic here"""
    try:
        # TODO: Implement logic to get all transactions
        # This might involve calling analyze_wallet for all known wallets
        # or maintaining a separate collection of analyzed transactions
        
        return jsonify([])  # Replace with actual implementation
        
    except Exception as e:
        logging.error(f"Error fetching all transactions: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/fraud/<wallet_id>', methods=['GET'])
def get_wallet_transactions(wallet_id):
    """Fetch transactions for specific wallet"""
    try:
        # Validate wallet format
        if not wallet_id.startswith('0x') or len(wallet_id) != 42:
            return jsonify({
                'error': 'Invalid wallet address format',
                'message': 'Wallet address must be 42 characters starting with 0x'
            }), 400
        
        # Call AI module
        results = analyze_wallet(wallet_id)
        
        # Transform results for frontend
        transactions = []
        for result in results:
            transactions.append({
                'tx_hash': result.get('transaction_id', ''),
                'risk_score': result.get('risk_score', 0.0),
                'risk_level': result.get('risk_level', 'unknown'),
                'transaction_id': result.get('transaction_id', ''),
                'wallet_id': result.get('wallet_id', ''),
                'amount': result.get('amount', 0.0),
                'method': result.get('method', ''),
                'timestamp': result.get('timestamp', '')
            })
        
        return jsonify(transactions)
        
    except Exception as e:
        logging.error(f"Error analyzing wallet {wallet_id}: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        # Test AI module import
        from fraud_detection import categorize_risk
        test_result = categorize_risk(0.5)
        
        return jsonify({
            'status': 'healthy',
            'service': 'fraud-detection',
            'model_loaded': True,
            'test_result': test_result
        })
        
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e)
        }), 503

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
```

---

## 🎉 Final Testing Checklist

Before deploying, verify all these work:

### ✅ Backend API Tests
- [ ] `GET /api/fraud` returns all transactions
- [ ] `GET /api/fraud/{valid_wallet}` returns wallet transactions
- [ ] `GET /api/fraud/{invalid_wallet}` returns 400 error
- [ ] `GET /health` returns healthy status
- [ ] CORS headers allow frontend requests

### ✅ Frontend Integration Tests  
- [ ] "Fetch All Transactions" button works
- [ ] "Search Wallet" button works with valid address
- [ ] Invalid addresses show validation errors
- [ ] Loading states display during API calls
- [ ] Results show with proper color coding
- [ ] Error messages display for API failures

### ✅ AI Module Tests
- [ ] `fraud_model.pkl` loads without errors
- [ ] MongoDB connection establishes successfully  
- [ ] Sample transactions return risk scores
- [ ] Risk levels categorize correctly (low/medium/high)

### ✅ Performance Tests
- [ ] Response times under 5 seconds for typical wallets
- [ ] No memory leaks during extended use
- [ ] Database queries use proper indexes

---

## 📞 Support & Contact

If you encounter any issues:

1. **Check the logs** for detailed error messages  
2. **Verify prerequisites** are installed and running
3. **Test with provided examples** to isolate issues
4. **Review troubleshooting section** for common problems

**Good luck with your implementation!** 🚀

---

*Last Updated: January 2024 | Version: 1.0.0*
