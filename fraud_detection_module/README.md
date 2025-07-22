# Fraud Detection Module

This module provides functionality to detect fraud in blockchain transactions using a trained RandomForestClassifier model.

## Requirements
- Python 3.x
- `fraud_model.pkl` in the project directory
- MongoDB running at `mongodb://localhost:27017/`

## Usage

### Importing Module
```python
from fraud_detection import analyze_wallet
```

### Analyzing a Wallet
```python
wallet_id = "0x1234567890abcdef1234567890abcdef12345678"
results = analyze_wallet(wallet_id)
```

### Sample Output
```json
[
    {
        "tx_hash": "0xabc123",
        "risk_score": 0.85,
        "risk_level": "high"
    },
    ...
]
```

## REST API Integration
Wrap the `analyze_wallet` function within an endpoint using Flask or another web framework to expose the functionality as a REST API.

### Example using Flask
```python
from flask import Flask, jsonify, request
from fraud_detection import analyze_wallet

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze():
    # Implementation here
```

Ensure error handling and logging are properly configured.

### Contributions
Feel free to contribute by improving features or adding more functionalities.

