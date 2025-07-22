#!/usr/bin/env python3
"""
Fraud Detection Model Training Script

This script creates and trains a RandomForestClassifier for fraud detection
using synthetic blockchain transaction data.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import pickle
import logging
import os
from datetime import datetime, timedelta
import random

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def generate_synthetic_data(n_samples=10000):
    """
    Generate synthetic blockchain transaction data for fraud detection
    
    Args:
        n_samples (int): Number of samples to generate
        
    Returns:
        pd.DataFrame: Generated transaction data
    """
    logging.info(f"Generating {n_samples} synthetic transactions...")
    
    # Define transaction methods and their fraud probabilities
    methods = {
        'transfer': 0.02,    # 2% fraud rate
        'swap': 0.05,        # 5% fraud rate  
        'stake': 0.01,       # 1% fraud rate
        'deposit': 0.03,     # 3% fraud rate
        'withdraw': 0.08,    # 8% fraud rate
        'mint': 0.15,        # 15% fraud rate
        'burn': 0.02,        # 2% fraud rate
        'approve': 0.04,     # 4% fraud rate
        'trade': 0.06,       # 6% fraud rate
        'lend': 0.03,        # 3% fraud rate
        'borrow': 0.07,      # 7% fraud rate
        'farm': 0.04,        # 4% fraud rate
        'bridge': 0.12,      # 12% fraud rate
        'auction': 0.09,     # 9% fraud rate
        'vote': 0.01         # 1% fraud rate
    }
    
    data = []
    
    for i in range(n_samples):
        # Select random method
        method = random.choice(list(methods.keys()))
        method_fraud_prob = methods[method]
        
        # Generate base features
        amount = np.random.lognormal(mean=2, sigma=1.5)  # Log-normal distribution for amounts
        gas_fee = np.random.exponential(scale=0.002)     # Exponential distribution for gas fees
        
        # Time-related features
        time_since_last = np.random.exponential(scale=24)  # Hours since last transaction
        transaction_frequency = np.random.poisson(lam=5)    # Transactions per day
        
        # Block-related features
        block_number = random.randint(18000000, 19000000)
        transaction_index = random.randint(0, 200)
        
        # Generate fraud label based on various factors
        fraud_probability = method_fraud_prob
        
        # Increase fraud probability for suspicious patterns
        if amount > 1000:  # Large amounts
            fraud_probability *= 2
        if gas_fee < 0.0001:  # Very low gas fees (potential bot activity)
            fraud_probability *= 1.5
        if time_since_last < 0.1:  # Very frequent transactions
            fraud_probability *= 1.8
        if transaction_frequency > 20:  # High frequency
            fraud_probability *= 1.6
            
        # Decrease fraud probability for normal patterns
        if 10 <= amount <= 100:  # Normal transaction amounts
            fraud_probability *= 0.5
        if 1 <= time_since_last <= 12:  # Normal timing
            fraud_probability *= 0.7
            
        # Cap probability at 0.8 to maintain realism
        fraud_probability = min(fraud_probability, 0.8)
        
        # Determine if transaction is fraud
        is_fraud = random.random() < fraud_probability
        
        data.append({
            'amount': amount,
            'gas_fee': gas_fee,
            'time_since_last_transaction': time_since_last,
            'transaction_frequency': transaction_frequency,
            'method': method,
            'block_number': block_number,
            'transaction_index': transaction_index,
            'is_fraud': is_fraud
        })
    
    df = pd.DataFrame(data)
    
    # Add method mapping (same as in fraud_detection.py)
    method_mapping = {
        'transfer': 0, 'swap': 1, 'stake': 2, 'deposit': 3, 'withdraw': 4,
        'mint': 5, 'burn': 6, 'approve': 7, 'trade': 8, 'lend': 9,
        'borrow': 10, 'farm': 11, 'bridge': 12, 'auction': 13, 'vote': 14
    }
    
    df['method_numeric'] = df['method'].map(method_mapping)
    
    logging.info(f"Generated {len(df)} transactions")
    logging.info(f"Fraud rate: {df['is_fraud'].mean():.3f} ({df['is_fraud'].sum()} fraudulent transactions)")
    
    return df

def prepare_features(df):
    """
    Prepare features for training
    
    Args:
        df (pd.DataFrame): Raw transaction data
        
    Returns:
        tuple: (X, y) features and labels
    """
    logging.info("Preparing features for training...")
    
    # Select features (same as used in fraud_detection.py)
    feature_columns = [
        'amount',
        'gas_fee', 
        'time_since_last_transaction',
        'transaction_frequency',
        'method_numeric'
    ]
    
    X = df[feature_columns].copy()
    y = df['is_fraud'].astype(int)
    
    # Handle any missing values
    X = X.fillna(0)
    
    logging.info(f"Features shape: {X.shape}")
    logging.info(f"Labels distribution - Fraud: {y.sum()}, Normal: {len(y) - y.sum()}")
    
    return X, y

def train_model(X, y):
    """
    Train RandomForestClassifier
    
    Args:
        X: Feature matrix
        y: Labels
        
    Returns:
        sklearn model: Trained RandomForest model
    """
    logging.info("Training RandomForest model...")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Create and train model
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        class_weight='balanced'  # Handle class imbalance
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate model
    logging.info("Evaluating model performance...")
    
    # Cross-validation
    cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='roc_auc')
    logging.info(f"Cross-validation AUC scores: {cv_scores}")
    logging.info(f"Mean CV AUC: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")
    
    # Test set evaluation
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    test_auc = roc_auc_score(y_test, y_pred_proba)
    logging.info(f"Test AUC: {test_auc:.3f}")
    
    # Classification report
    logging.info("Classification Report:")
    logging.info("\n" + classification_report(y_test, y_pred))
    
    # Confusion matrix
    logging.info("Confusion Matrix:")
    logging.info("\n" + str(confusion_matrix(y_test, y_pred)))
    
    # Feature importance
    feature_names = X.columns
    importances = model.feature_importances_
    feature_importance = pd.DataFrame({
        'feature': feature_names,
        'importance': importances
    }).sort_values('importance', ascending=False)
    
    logging.info("Feature Importances:")
    for _, row in feature_importance.iterrows():
        logging.info(f"  {row['feature']}: {row['importance']:.3f}")
    
    return model

def save_model(model, filename='fraud_model.pkl'):
    """
    Save trained model to file
    
    Args:
        model: Trained sklearn model
        filename (str): Filename to save to
    """
    logging.info(f"Saving model to {filename}...")
    
    try:
        with open(filename, 'wb') as f:
            pickle.dump(model, f)
        
        # Verify the saved model
        with open(filename, 'rb') as f:
            loaded_model = pickle.load(f)
            
        logging.info(f"Model saved successfully to {filename}")
        logging.info(f"File size: {os.path.getsize(filename)} bytes")
        
        # Test loaded model
        test_input = [[100.0, 0.001, 5.0, 3, 0]]  # Sample transaction
        prediction = loaded_model.predict_proba(test_input)
        logging.info(f"Test prediction on saved model: {prediction}")
        
    except Exception as e:
        logging.error(f"Error saving model: {e}")
        raise

def main():
    """
    Main training pipeline
    """
    print("🚀 Fraud Detection Model Training")
    print("=" * 50)
    
    try:
        # Generate synthetic data
        df = generate_synthetic_data(n_samples=10000)
        
        # Prepare features
        X, y = prepare_features(df)
        
        # Train model
        model = train_model(X, y)
        
        # Save model
        save_model(model)
        
        print("\n" + "=" * 50)
        print("✅ Model training completed successfully!")
        print("✅ Model saved as 'fraud_model.pkl'")
        print("✅ You can now use the fraud detection module")
        print("\nNext steps:")
        print("1. Set up MongoDB with transaction data")
        print("2. Run: python fraud_detection.py")
        print("3. Or import and use: from fraud_detection import analyze_wallet")
        print("=" * 50)
        
    except Exception as e:
        logging.error(f"Training failed: {e}")
        print(f"\n❌ Training failed: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
