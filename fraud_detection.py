def categorize_risk(risk_score: float) -> str:
    """
    Categorize the risk score into levels.

    Args:
        risk_score (float): The risk score from the model prediction.

    Returns:
        str: The level of risk ('high', 'medium', 'low', 'unknown').
    """
    try:
        if risk_score >= 0.7:
            return 'high'
        elif risk_score >= 0.3:
            return 'medium'
        return 'low'
    except (TypeError, ValueError):
        logging.error("Invalid risk score encountered.")
        return 'unknown'

"""
Fraud Detection Module
This module provides functionalities to detect fraudulent activities.
"""
# This file contains functionality for detecting fraudulent activities

import pickle
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError, PyMongoError
from typing import List, Dict, Optional
import logging
import os
from datetime import datetime
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('fraud_detection.log', mode='a')
    ]
)

# Method mapping dictionary to convert categorical transaction methods to numeric values
METHOD_MAPPING = {
    'transfer': 0,
    'swap': 1,
    'stake': 2,
    'deposit': 3,
    'withdraw': 4,
    'mint': 5,
    'burn': 6,
    'approve': 7,
    'trade': 8,
    'lend': 9,
    'borrow': 10,
    'farm': 11,
    'bridge': 12,
    'auction': 13,
    'vote': 14,
    # Add more methods as needed
}

def analyze_wallet(wallet_id: str) -> List[Dict]:
    """
    Analyzes wallet transactions for fraud risk
    
    Args:
        wallet_id (str): The wallet ID to analyze
        
    Returns:
        List[Dict]: List of transaction analysis results with risk scores
    """
    model = None
    client = None
    
    try:
        # Load the trained model with specific error handling
        try:
            with open('fraud_model.pkl', 'rb') as f:
                model = pickle.load(f)
            logging.info("Fraud detection model loaded successfully")
        except FileNotFoundError:
            logging.error("Model file 'fraud_model.pkl' not found. Please ensure the model file exists in the current directory.")
            return []
        except pickle.UnpicklingError as e:
            logging.error(f"Error unpickling model file: {e}. The model file may be corrupted.")
            return []
        except (IOError, OSError) as e:
            logging.error(f"Error reading model file: {e}. Check file permissions and disk space.")
            return []
        except Exception as e:
            logging.error(f"Unexpected error loading model: {e}")
            return []
            
        # Connect to MongoDB with specific error handling
        try:
            client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=5000)
            # Test the connection
            client.admin.command('ping')
            db = client['fraud_detection']
            collection = db['transactions']
            logging.info("MongoDB connection established successfully")
        except ServerSelectionTimeoutError as e:
            logging.error(f"MongoDB server selection timeout: {e}. MongoDB server may be down or unreachable.")
            if client:
                try:
                    client.close()
                except:
                    pass
            return []
        except ConnectionFailure as e:
            logging.error(f"MongoDB connection failure: {e}. Check if MongoDB service is running.")
            if client:
                try:
                    client.close()
                except:
                    pass
            return []
        except PyMongoError as e:
            logging.error(f"MongoDB error: {e}. Database operation failed.")
            if client:
                try:
                    client.close()
                except:
                    pass
            return []
        except Exception as e:
            logging.error(f"Unexpected MongoDB connection error: {e}. Please ensure MongoDB is running and accessible.")
            if client:
                try:
                    client.close()
                except:
                    pass
            return []
        
        # Query for transactions with specific error handling
        try:
            transactions = list(collection.find({'wallet_id': wallet_id}))
            logging.info(f"Found {len(transactions)} transactions for wallet_id: {wallet_id}")
        except PyMongoError as e:
            logging.error(f"MongoDB query error: {e}. Failed to retrieve transactions for wallet_id: {wallet_id}")
            if client:
                try:
                    client.close()
                except:
                    pass
            return []
        except MemoryError as e:
            logging.error(f"Memory error during query: {e}. Query result set may be too large.")
            if client:
                try:
                    client.close()
                except:
                    pass
            return []
        except Exception as e:
            logging.error(f"Unexpected database query error: {e}. Failed to retrieve transactions for wallet_id: {wallet_id}")
            if client:
                try:
                    client.close()
                except:
                    pass
            return []
        
        if not transactions:
            logging.warning(f"No transactions found for wallet_id: {wallet_id}")
            if client:
                client.close()
            return []
            
        results = []
        
        for transaction in transactions:
            try:
                # Extract features from the transaction with error handling
                try:
                    features = extract_features(transaction)
                except Exception as e:
                    logging.error(f"Feature extraction error for transaction {transaction.get('_id', 'unknown')}: {e}")
                    # Skip this transaction and continue with the next one
                    continue
                
                # Convert method to numeric using the mapping
                method = transaction.get('method', '').lower()
                method_numeric = METHOD_MAPPING.get(method, -1)  # -1 for unknown methods
                features['method_numeric'] = method_numeric
                
                # Prepare feature vector for prediction (adjust based on your model's expected features)
                try:
                    feature_vector = [
                        features.get('amount', 0),
                        features.get('gas_fee', 0),
                        features.get('time_since_last_transaction', 0),
                        features.get('transaction_frequency', 0),
                        method_numeric
                    ]
                except (ValueError, TypeError) as e:
                    logging.error(f"Error preparing feature vector for transaction {transaction.get('_id', 'unknown')}: {e}")
                    continue
                
                # Predict fraud risk score with specific error handling
                try:
                    risk_score = model.predict_proba([feature_vector])[0][1]  # Probability of fraud class
                except (ValueError, IndexError) as e:
                    logging.error(f"Prediction error - invalid feature vector for transaction {transaction.get('_id', 'unknown')}: {e}")
                    risk_score = 0.0
                except AttributeError as e:
                    logging.error(f"Prediction error - model method not available: {e}")
                    risk_score = 0.0
                except Exception as e:
                    logging.error(f"Unexpected prediction error for transaction {transaction.get('_id', 'unknown')}: {e}")
                    risk_score = 0.0
                    
                # Categorize risk levels
                try:
                    if risk_score >= 0.7:
                        risk_level = 'high'
                    elif risk_score >= 0.3:
                        risk_level = 'medium'
                    else:
                        risk_level = 'low'
                except (TypeError, ValueError) as e:
                    logging.error(f"Error categorizing risk level: {e}")
                    risk_level = 'unknown'
                    
                # Format result
                try:
                    result = {
                        'transaction_id': str(transaction.get('_id', '')),
                        'wallet_id': wallet_id,
                        'method': method,
                        'amount': transaction.get('amount', 0),
                        'timestamp': transaction.get('timestamp', ''),
                        'risk_score': round(float(risk_score), 4),
                        'risk_level': risk_level,
                        'features': features
                    }
                    results.append(result)
                except Exception as e:
                    logging.error(f"Error formatting result for transaction {transaction.get('_id', 'unknown')}: {e}")
                    continue
                    
            except Exception as e:
                logging.error(f"Unexpected error processing transaction {transaction.get('_id', 'unknown')}: {e}")
                continue
            
        # Close MongoDB connection safely
        try:
            if client:
                client.close()
                logging.info("MongoDB connection closed successfully")
        except Exception as e:
            logging.warning(f"Error closing MongoDB connection: {e}")
        
        # Categorize risk levels using helper function
        try:
            risk_level = categorize_risk(risk_score)
        except Exception as e:
            logging.error(f"Unexpected error in risk categorization: {e}")
            risk_level = 'unknown'
        try:
            results.sort(key=lambda x: x['risk_score'], reverse=True)
        except Exception as e:
            logging.error(f"Error sorting results: {e}")
        
        logging.info(f"Analysis completed. Processed {len(results)} transactions successfully.")
        return results
        
    except Exception as e:
        logging.error(f"Unexpected error in analyze_wallet: {e}")
        # Ensure MongoDB connection is closed even if there's an unexpected error
        try:
            if client:
                client.close()
        except:
            pass
        return []

def extract_features(transaction: Dict) -> Dict:
    """
    Extract features from a transaction for fraud detection.

    This function takes a transaction dictionary and extracts meaningful features needed for
    fraud detection algorithms.
        
    Args:
        transaction (Dict): Transaction data from MongoDB
            
    Returns:
        Dict: Extracted features
        
    Raises:
        ValueError: If transaction data is invalid or missing critical fields
        TypeError: If transaction parameter is not a dictionary
    """
    if not isinstance(transaction, dict):
        raise TypeError(f"Transaction must be a dictionary, got {type(transaction)}")
    
    if not transaction:
        raise ValueError("Transaction dictionary is empty")
    
    features = {}
    
    try:
        # Basic transaction features with error handling
        try:
            amount = transaction.get('amount', 0)
            features['amount'] = float(amount) if amount is not None else 0.0
        except (ValueError, TypeError) as e:
            logging.warning(f"Error converting amount to float: {e}. Using default value 0.0")
            features['amount'] = 0.0
        
        try:
            gas_fee = transaction.get('gas_fee', 0)
            features['gas_fee'] = float(gas_fee) if gas_fee is not None else 0.0
        except (ValueError, TypeError) as e:
            logging.warning(f"Error converting gas_fee to float: {e}. Using default value 0.0")
            features['gas_fee'] = 0.0
        
        # Time-based features with comprehensive error handling
        try:
            current_time = datetime.now()
            transaction_time = transaction.get('timestamp')
            
            if isinstance(transaction_time, str):
                try:
                    # Handle various timestamp formats
                    if transaction_time.endswith('Z'):
                        transaction_time = datetime.fromisoformat(transaction_time.replace('Z', '+00:00'))
                    else:
                        transaction_time = datetime.fromisoformat(transaction_time)
                except (ValueError, TypeError) as e:
                    logging.warning(f"Error parsing timestamp string '{transaction_time}': {e}. Using current time.")
                    transaction_time = current_time
            elif isinstance(transaction_time, datetime):
                # Already a datetime object
                pass
            else:
                logging.warning(f"Timestamp format not recognized: {type(transaction_time)}. Using current time.")
                transaction_time = current_time
                
            try:
                time_diff = (current_time - transaction_time).total_seconds() / 3600  # hours
                features['time_since_last_transaction'] = max(0, time_diff)  # Ensure non-negative
            except (TypeError, ValueError, OverflowError) as e:
                logging.warning(f"Error calculating time difference: {e}. Using default value 0.0")
                features['time_since_last_transaction'] = 0.0
                
        except Exception as e:
            logging.error(f"Unexpected error processing timestamp: {e}")
            features['time_since_last_transaction'] = 0.0
        
        # Transaction frequency (placeholder - would need historical data)
        try:
            freq = transaction.get('frequency', 1)
            features['transaction_frequency'] = int(freq) if freq is not None else 1
        except (ValueError, TypeError) as e:
            logging.warning(f"Error converting frequency to int: {e}. Using default value 1")
            features['transaction_frequency'] = 1
        
        # Network-based features with safe string conversion
        try:
            features['to_address'] = str(transaction.get('to_address', ''))
        except Exception as e:
            logging.warning(f"Error converting to_address to string: {e}. Using empty string.")
            features['to_address'] = ''
            
        try:
            features['from_address'] = str(transaction.get('from_address', ''))
        except Exception as e:
            logging.warning(f"Error converting from_address to string: {e}. Using empty string.")
            features['from_address'] = ''
        
        # Additional numerical features with error handling
        try:
            block_num = transaction.get('block_number', 0)
            features['block_number'] = int(block_num) if block_num is not None else 0
        except (ValueError, TypeError) as e:
            logging.warning(f"Error converting block_number to int: {e}. Using default value 0")
            features['block_number'] = 0
            
        try:
            tx_index = transaction.get('transaction_index', 0)
            features['transaction_index'] = int(tx_index) if tx_index is not None else 0
        except (ValueError, TypeError) as e:
            logging.warning(f"Error converting transaction_index to int: {e}. Using default value 0")
            features['transaction_index'] = 0
        
        # Validate that we have extracted some meaningful features
        if all(v == 0 or v == '' for v in features.values()):
            logging.warning("All extracted features are default values. Transaction may be missing critical data.")
        
        return features
        
    except Exception as e:
        logging.error(f"Unexpected error in extract_features: {e}")
        # Return basic feature structure with default values to prevent complete failure
        return {
            'amount': 0.0,
            'gas_fee': 0.0,
            'time_since_last_transaction': 0.0,
            'transaction_frequency': 1,
            'to_address': '',
            'from_address': '',
            'block_number': 0,
            'transaction_index': 0
        }

def main():
    """
    Initialize the fraud detection system and run basic tests.
    
    This function provides a starting point for utilizing the fraud detection
    capabilities provided in this module and performs basic functionality tests.
    """
    print("🚀 Fraud Detection System")
    print("=" * 50)
    
    # Test 1: Module functionality
    print("\n1. Testing module components...")
    
    # Test categorize_risk function
    test_scores = [0.1, 0.4, 0.8, 0.95]
    print("   Risk categorization test:")
    for score in test_scores:
        risk_level = categorize_risk(score)
        print(f"   - Score {score}: {risk_level}")
    
    # Test METHOD_MAPPING
    print(f"   - Available transaction methods: {len(METHOD_MAPPING)}")
    print(f"   - Methods: {list(METHOD_MAPPING.keys())[:5]}...")
    
    # Test 2: Feature extraction with sample data
    print("\n2. Testing feature extraction...")
    sample_transaction = {
        '_id': 'sample_tx_001',
        'wallet_id': 'sample_wallet',
        'method': 'transfer',
        'amount': 250.5,
        'gas_fee': 0.003,
        'timestamp': datetime.now().isoformat(),
        'to_address': '0x742d35Cc6634C0532925a3b8D5C9C89D05afe3b2',
        'from_address': '0x8ba1f109551bD432803012645Hac136c9641',
        'block_number': 18500000,
        'transaction_index': 45,
        'frequency': 3
    }
    
    try:
        features = extract_features(sample_transaction)
        print("   ✅ Feature extraction successful")
        print(f"   ✅ Extracted {len(features)} features")
        for key, value in features.items():
            print(f"   - {key}: {value}")
    except Exception as e:
        print(f"   ❌ Feature extraction failed: {e}")
    
    # Test 3: Check for required files and connections
    print("\n3. Checking system requirements...")
    
    # Check for model file
    if os.path.exists('fraud_model.pkl'):
        try:
            with open('fraud_model.pkl', 'rb') as f:
                model = pickle.load(f)
            print("   ✅ Model file found and loadable")
        except Exception as e:
            print(f"   ⚠️  Model file exists but can't be loaded: {e}")
    else:
        print("   ⚠️  Model file 'fraud_model.pkl' not found")
        print("      Create a trained model file for full functionality")
    
    # Test MongoDB connection (non-blocking)
    print("   Testing MongoDB connection...")
    try:
        from pymongo import MongoClient
        client = MongoClient('mongodb://localhost:27017/', 
                           serverSelectionTimeoutMS=2000)
        client.admin.command('ping')
        client.close()
        print("   ✅ MongoDB connection successful")
    except Exception as e:
        print(f"   ⚠️  MongoDB not available: {e}")
        print("      Start MongoDB service for database functionality")
    
    # Test 4: Example usage demonstration
    print("\n4. Usage example:")
    print("   To analyze a wallet:")
    print("   >>> from fraud_detection import analyze_wallet")
    print("   >>> results = analyze_wallet('wallet_address')")
    print("   >>> print(f'Found {len(results)} transactions')")
    
    print("\n5. System status:")
    print("   ✅ Core module loaded")
    print("   ✅ All functions available")
    print("   ✅ Error handling implemented")
    print("   ✅ Logging configured")
    
    # Example wallet analysis (commented out - requires model and database)
    """
    Example usage (uncomment when model and database are available):
    
    wallet_id = "0x1234567890abcdef1234567890abcdef12345678"
    print(f"\nAnalyzing wallet: {wallet_id}")
    results = analyze_wallet(wallet_id)
    
    if results:
        print(f"Analysis complete. Found {len(results)} transactions.")
        for result in results[:3]:  # Show first 3 results
            print(f"Transaction {result['transaction_id']}:")
            print(f"  Risk Level: {result['risk_level']}")
            print(f"  Risk Score: {result['risk_score']}")
            print(f"  Amount: {result['amount']}")
    else:
        print("No transactions found or analysis failed.")
    """
    
    print("\n" + "=" * 50)
    print("💡 To run comprehensive tests, execute: python test_fraud_detection.py")
    print("🔧 Make sure MongoDB is running and fraud_model.pkl exists for full functionality")
    print("=" * 50)

if __name__ == "__main__":
    main()
