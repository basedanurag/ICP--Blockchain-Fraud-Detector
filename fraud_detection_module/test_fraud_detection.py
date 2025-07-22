#!/usr/bin/env python3
"""
Test Script for Fraud Detection Module

This script tests the fraud detection module to verify:
1. Module loads correctly
2. Database connection works
3. Model predictions run without errors
4. Results are formatted properly
"""

import sys
import os
import logging
import tempfile
import pickle
from datetime import datetime
from unittest.mock import Mock, patch, MagicMock
import json

# Add current directory to path to import fraud_detection module
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_module_import():
    """Test 1: Verify the module loads correctly"""
    print("=" * 60)
    print("TEST 1: Module Import Test")
    print("=" * 60)
    
    try:
        import fraud_detection
        print("✅ Module imported successfully")
        
        # Check if required functions exist
        required_functions = ['analyze_wallet', 'extract_features', 'categorize_risk']
        for func_name in required_functions:
            if hasattr(fraud_detection, func_name):
                print(f"✅ Function '{func_name}' found")
            else:
                print(f"❌ Function '{func_name}' not found")
                return False
        
        # Check if METHOD_MAPPING exists
        if hasattr(fraud_detection, 'METHOD_MAPPING'):
            print(f"✅ METHOD_MAPPING found with {len(fraud_detection.METHOD_MAPPING)} methods")
        else:
            print("❌ METHOD_MAPPING not found")
            return False
            
        return True
        
    except ImportError as e:
        print(f"❌ Failed to import module: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error during import: {e}")
        return False

class MockModel:
    """Simple mock model class for testing"""
    def predict_proba(self, X):
        # Return realistic fraud probability for each input
        return [[0.3, 0.7] for _ in range(len(X))]

def create_mock_model():
    """Create a mock ML model for testing"""
    return MockModel()

def create_test_model_file():
    """Create a temporary model file for testing"""
    mock_model = create_mock_model()
    
    try:
        with open('fraud_model.pkl', 'wb') as f:
            pickle.dump(mock_model, f)
        print("✅ Test model file created successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to create test model file: {e}")
        return False

def test_database_connection():
    """Test 2: Verify database connection handling"""
    print("\n" + "=" * 60)
    print("TEST 2: Database Connection Test")
    print("=" * 60)
    
    try:
        import fraud_detection
        
        # Test with mock MongoDB to avoid requiring actual MongoDB
        with patch('fraud_detection.MongoClient') as mock_client:
            mock_instance = MagicMock()
            mock_client.return_value = mock_instance
            
            # Mock successful connection
            mock_instance.admin.command.return_value = {'ok': 1.0}
            mock_db = MagicMock()
            mock_collection = MagicMock()
            mock_instance.__getitem__.return_value = mock_db
            mock_db.__getitem__.return_value = mock_collection
            
            # Mock transaction data
            mock_collection.find.return_value = [
                {
                    '_id': 'test_transaction_1',
                    'wallet_id': 'test_wallet',
                    'method': 'transfer',
                    'amount': 100.0,
                    'gas_fee': 0.001,
                    'timestamp': datetime.now().isoformat(),
                    'to_address': '0xtest_to',
                    'from_address': '0xtest_from',
                    'block_number': 12345,
                    'transaction_index': 1,
                    'frequency': 2
                }
            ]
            
            # Test the analyze_wallet function
            results = fraud_detection.analyze_wallet('test_wallet')
            
            if results:
                print("✅ Database connection simulation successful")
                print(f"✅ Retrieved {len(results)} transactions")
                return True
            else:
                print("❌ No results returned from analyze_wallet")
                return False
                
    except Exception as e:
        print(f"❌ Database connection test failed: {e}")
        return False

def test_model_predictions():
    """Test 3: Verify model predictions run without errors"""
    print("\n" + "=" * 60)
    print("TEST 3: Model Prediction Test")
    print("=" * 60)
    
    try:
        import fraud_detection
        
        # Create test transaction data
        test_transaction = {
            '_id': 'test_transaction_predict',
            'wallet_id': 'test_wallet_predict',
            'method': 'transfer',
            'amount': 500.0,
            'gas_fee': 0.002,
            'timestamp': datetime.now().isoformat(),
            'to_address': '0xtest_to_predict',
            'from_address': '0xtest_from_predict',
            'block_number': 67890,
            'transaction_index': 2,
            'frequency': 3
        }
        
        # Test feature extraction
        try:
            features = fraud_detection.extract_features(test_transaction)
            print("✅ Feature extraction successful")
            print(f"✅ Extracted features: {list(features.keys())}")
            
            # Validate feature types
            expected_numeric = ['amount', 'gas_fee', 'time_since_last_transaction', 
                              'transaction_frequency', 'block_number', 'transaction_index']
            for feature in expected_numeric:
                if feature in features and isinstance(features[feature], (int, float)):
                    print(f"✅ Feature '{feature}': {features[feature]} (type: {type(features[feature]).__name__})")
                else:
                    print(f"⚠️  Feature '{feature}' missing or wrong type")
                    
        except Exception as e:
            print(f"❌ Feature extraction failed: {e}")
            return False
        
        # Test risk categorization function
        try:
            risk_scores = [0.1, 0.5, 0.8, 0.95, -1, "invalid"]
            for score in risk_scores:
                try:
                    risk_level = fraud_detection.categorize_risk(score)
                    print(f"✅ Risk score {score} -> {risk_level}")
                except Exception as e:
                    print(f"⚠️  Risk score {score} caused error: {e}")
        except Exception as e:
            print(f"❌ Risk categorization test failed: {e}")
            return False
            
        return True
        
    except Exception as e:
        print(f"❌ Model prediction test failed: {e}")
        return False

def test_result_formatting():
    """Test 4: Verify results are formatted properly"""
    print("\n" + "=" * 60)
    print("TEST 4: Result Formatting Test")
    print("=" * 60)
    
    try:
        import fraud_detection
        
        # Mock the entire analyze_wallet pipeline
        with patch('fraud_detection.MongoClient') as mock_client, \
             patch('builtins.open', create=True) as mock_open, \
             patch('pickle.load') as mock_pickle_load:
            
            # Setup mocks
            mock_model = create_mock_model()
            mock_pickle_load.return_value = mock_model
            
            mock_instance = MagicMock()
            mock_client.return_value = mock_instance
            mock_instance.admin.command.return_value = {'ok': 1.0}
            
            # Mock database
            mock_db = MagicMock()
            mock_collection = MagicMock()
            mock_instance.__getitem__.return_value = mock_db
            mock_db.__getitem__.return_value = mock_collection
            
            # Mock transaction data with various scenarios
            mock_collection.find.return_value = [
                {
                    '_id': 'format_test_1',
                    'wallet_id': 'format_test_wallet',
                    'method': 'transfer',
                    'amount': 1000.0,
                    'gas_fee': 0.005,
                    'timestamp': datetime.now().isoformat(),
                    'to_address': '0xformat_test_to',
                    'from_address': '0xformat_test_from',
                    'block_number': 98765,
                    'transaction_index': 5,
                    'frequency': 1
                },
                {
                    '_id': 'format_test_2',
                    'wallet_id': 'format_test_wallet',
                    'method': 'swap',
                    'amount': 50.0,
                    'gas_fee': 0.001,
                    'timestamp': datetime.now().isoformat(),
                    'to_address': '0xformat_test_to2',
                    'from_address': '0xformat_test_from2',
                    'block_number': 98766,
                    'transaction_index': 6,
                    'frequency': 4
                }
            ]
            
            # Test the full pipeline
            results = fraud_detection.analyze_wallet('format_test_wallet')
            
            if not results:
                print("❌ No results returned for formatting test")
                return False
            
            print(f"✅ Returned {len(results)} formatted results")
            
            # Validate result format
            required_fields = ['transaction_id', 'wallet_id', 'method', 'amount', 
                             'timestamp', 'risk_score', 'risk_level', 'features']
            
            for i, result in enumerate(results):
                print(f"\n--- Result {i + 1} ---")
                
                # Check if result is a dictionary
                if not isinstance(result, dict):
                    print(f"❌ Result {i + 1} is not a dictionary")
                    return False
                
                # Check required fields
                missing_fields = []
                for field in required_fields:
                    if field in result:
                        print(f"✅ Field '{field}': {result[field]}")
                    else:
                        missing_fields.append(field)
                
                if missing_fields:
                    print(f"❌ Missing fields: {missing_fields}")
                    return False
                
                # Validate field types and values
                if not isinstance(result['risk_score'], (int, float)):
                    print(f"❌ risk_score is not numeric: {type(result['risk_score'])}")
                    return False
                
                if result['risk_level'] not in ['high', 'medium', 'low', 'unknown']:
                    print(f"❌ Invalid risk_level: {result['risk_level']}")
                    return False
                
                if not isinstance(result['features'], dict):
                    print(f"❌ features is not a dictionary: {type(result['features'])}")
                    return False
                
                print(f"✅ Result {i + 1} formatting is valid")
            
            # Test JSON serialization
            try:
                json_str = json.dumps(results, indent=2, default=str)
                print("✅ Results can be serialized to JSON")
                print(f"✅ JSON output length: {len(json_str)} characters")
            except Exception as e:
                print(f"❌ JSON serialization failed: {e}")
                return False
                
            return True
            
    except Exception as e:
        print(f"❌ Result formatting test failed: {e}")
        return False

def test_error_handling():
    """Test 5: Verify error handling works correctly"""
    print("\n" + "=" * 60)
    print("TEST 5: Error Handling Test")
    print("=" * 60)
    
    try:
        import fraud_detection
        
        # Test 1: Missing model file
        if os.path.exists('fraud_model.pkl'):
            os.rename('fraud_model.pkl', 'fraud_model.pkl.backup')
        
        try:
            results = fraud_detection.analyze_wallet('test_wallet_error')
            if results == []:
                print("✅ Handles missing model file correctly")
            else:
                print("⚠️  Expected empty results for missing model")
        except Exception as e:
            print(f"⚠️  Unexpected exception for missing model: {e}")
        
        # Restore model file
        if os.path.exists('fraud_model.pkl.backup'):
            os.rename('fraud_model.pkl.backup', 'fraud_model.pkl')
        
        # Test 2: Invalid transaction data
        try:
            invalid_transactions = [
                None,  # None transaction
                {},    # Empty transaction
                "not_a_dict",  # String instead of dict
                {"invalid": "data"}  # Missing required fields
            ]
            
            for i, invalid_tx in enumerate(invalid_transactions):
                try:
                    if invalid_tx is not None and isinstance(invalid_tx, dict):
                        features = fraud_detection.extract_features(invalid_tx)
                        print(f"✅ Handled invalid transaction {i + 1}: returned features")
                    else:
                        # This should raise an exception
                        features = fraud_detection.extract_features(invalid_tx)
                        print(f"⚠️  Should have raised exception for transaction {i + 1}")
                except (TypeError, ValueError) as e:
                    print(f"✅ Correctly handled invalid transaction {i + 1}: {e}")
                except Exception as e:
                    print(f"⚠️  Unexpected error for transaction {i + 1}: {e}")
        
        except Exception as e:
            print(f"❌ Error handling test failed: {e}")
            return False
            
        print("✅ Error handling tests completed")
        return True
        
    except Exception as e:
        print(f"❌ Error handling test failed: {e}")
        return False

def run_performance_test():
    """Test 6: Basic performance test"""
    print("\n" + "=" * 60)
    print("TEST 6: Performance Test")
    print("=" * 60)
    
    try:
        import time
        import fraud_detection
        
        # Create multiple test transactions
        num_transactions = 10
        
        with patch('fraud_detection.MongoClient') as mock_client, \
             patch('builtins.open', create=True) as mock_open, \
             patch('pickle.load') as mock_pickle_load:
            
            mock_model = create_mock_model()
            mock_pickle_load.return_value = mock_model
            
            mock_instance = MagicMock()
            mock_client.return_value = mock_instance
            mock_instance.admin.command.return_value = {'ok': 1.0}
            
            mock_db = MagicMock()
            mock_collection = MagicMock()
            mock_instance.__getitem__.return_value = mock_db
            mock_db.__getitem__.return_value = mock_collection
            
            # Create mock transactions
            mock_transactions = []
            for i in range(num_transactions):
                mock_transactions.append({
                    '_id': f'perf_test_{i}',
                    'wallet_id': 'perf_test_wallet',
                    'method': 'transfer',
                    'amount': 100.0 + i * 10,
                    'gas_fee': 0.001 + i * 0.0001,
                    'timestamp': datetime.now().isoformat(),
                    'to_address': f'0xperf_test_to_{i}',
                    'from_address': f'0xperf_test_from_{i}',
                    'block_number': 12345 + i,
                    'transaction_index': i,
                    'frequency': 1 + i
                })
            
            mock_collection.find.return_value = mock_transactions
            
            # Measure execution time
            start_time = time.time()
            results = fraud_detection.analyze_wallet('perf_test_wallet')
            end_time = time.time()
            
            execution_time = end_time - start_time
            
            if results and len(results) == num_transactions:
                print(f"✅ Processed {len(results)} transactions successfully")
                print(f"✅ Execution time: {execution_time:.4f} seconds")
                print(f"✅ Average time per transaction: {execution_time/len(results):.6f} seconds")
                return True
            else:
                print(f"❌ Expected {num_transactions} results, got {len(results) if results else 0}")
                return False
                
    except Exception as e:
        print(f"❌ Performance test failed: {e}")
        return False

def cleanup_test_files():
    """Clean up test files created during testing"""
    try:
        files_to_clean = ['fraud_model.pkl', 'fraud_model.pkl.backup', 'fraud_detection.log']
        for file in files_to_clean:
            if os.path.exists(file):
                os.remove(file)
                print(f"✅ Cleaned up {file}")
    except Exception as e:
        print(f"⚠️  Error during cleanup: {e}")

def main():
    """Run all tests"""
    print("🚀 Starting Fraud Detection Module Tests")
    print("=" * 60)
    
    test_results = []
    
    # Test 1: Module Import
    test_results.append(("Module Import", test_module_import()))
    
    # Create test model file for subsequent tests
    create_test_model_file()
    
    # Test 2: Database Connection
    test_results.append(("Database Connection", test_database_connection()))
    
    # Test 3: Model Predictions
    test_results.append(("Model Predictions", test_model_predictions()))
    
    # Test 4: Result Formatting
    test_results.append(("Result Formatting", test_result_formatting()))
    
    # Test 5: Error Handling
    test_results.append(("Error Handling", test_error_handling()))
    
    # Test 6: Performance
    test_results.append(("Performance", run_performance_test()))
    
    # Print test summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    passed_tests = 0
    total_tests = len(test_results)
    
    for test_name, result in test_results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name:<20}: {status}")
        if result:
            passed_tests += 1
    
    print(f"\nOverall Result: {passed_tests}/{total_tests} tests passed")
    
    if passed_tests == total_tests:
        print("🎉 All tests passed! The fraud detection module is working correctly.")
        success = True
    else:
        print("⚠️  Some tests failed. Please review the output above.")
        success = False
    
    # Cleanup
    cleanup_test_files()
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
