# API Service Documentation

This module provides a centralized API service for making HTTP requests to the backend API. It includes proper error handling, request/response interceptors, and standardized methods for transaction-related operations.

## Features

- **Centralized Configuration**: Single axios instance with base URL and timeout settings
- **Error Handling**: Comprehensive error handling with standardized error messages
- **Request/Response Interceptors**: Automatic logging and authentication token handling
- **Type Validation**: Input validation and response data structure validation
- **Network Error Handling**: Proper handling of network issues and timeouts

## Setup

### Environment Configuration

Create a `.env` file in your project root with the following variables:

```env
REACT_APP_API_BASE_URL=http://localhost:8000
NODE_ENV=development
```

### Import and Usage

```javascript
import apiService from '../services/api';

// Or import specific methods
import { getAllTransactions, getWalletTransactions } from '../services/api';
```

## API Methods

### `getAllTransactions()`

Fetches all transactions from the API.

```javascript
try {
  const transactions = await apiService.getAllTransactions();
  console.log('All transactions:', transactions);
} catch (error) {
  console.error('Error:', error.message);
}
```

**Returns:** `Promise<Array>` - Array of transaction objects

**Throws:** `Error` - Standardized error with descriptive message

### `getWalletTransactions(walletId)`

Fetches transactions for a specific wallet address.

```javascript
try {
  const walletTransactions = await apiService.getWalletTransactions('0x742d35cc6635c0532925a3b8138789c0cf25865b');
  console.log('Wallet transactions:', walletTransactions);
} catch (error) {
  console.error('Error:', error.message);
}
```

**Parameters:**
- `walletId` (string): Valid Ethereum wallet address (42 characters starting with 0x)

**Returns:** `Promise<Array>` - Array of transaction objects for the specified wallet

**Throws:** `Error` - Standardized error with descriptive message

### `getTransactions(walletId?)`

Generic method that handles both all transactions and wallet-specific transactions.

```javascript
// Get all transactions
const allTransactions = await apiService.getTransactions();

// Get wallet-specific transactions
const walletTransactions = await apiService.getTransactions('0x742d35cc6635c0532925a3b8138789c0cf25865b');
```

**Parameters:**
- `walletId` (string, optional): Wallet address. If provided, fetches wallet transactions; otherwise, fetches all transactions

**Returns:** `Promise<Array>` - Array of transaction objects

### `healthCheck()`

Verifies API connectivity and server health.

```javascript
try {
  const health = await apiService.healthCheck();
  console.log('API Health:', health);
} catch (error) {
  console.error('API is not available:', error.message);
}
```

**Returns:** `Promise<Object>` - Health status object

## Error Handling

The API service provides comprehensive error handling with standardized error messages:

### HTTP Status Code Errors

- **400**: Invalid request parameters
- **401**: Authentication required (also clears auth token)
- **403**: Access denied
- **404**: Resource not found
- **422**: Invalid data provided
- **429**: Too many requests
- **500**: Internal server error
- **502**: Service temporarily unavailable
- **503**: Service unavailable
- **504**: Request timeout

### Network Errors

- **Connection Refused**: Unable to connect to server
- **Timeout**: Request timeout
- **Network Error**: General network issues

### Usage Example

```javascript
const fetchData = async () => {
  try {
    const transactions = await apiService.getAllTransactions();
    setTransactions(transactions);
    setError('');
  } catch (error) {
    console.error('API Error:', error);
    setError(error.message); // User-friendly error message
    setTransactions([]);
  }
};
```

## Advanced Usage

### Direct Axios Instance

If you need to make custom API calls, you can import the configured axios instance:

```javascript
import { apiClient } from '../services/api';

// Custom API call
const customRequest = async () => {
  try {
    const response = await apiClient.get('/api/custom-endpoint');
    return response.data;
  } catch (error) {
    throw error;
  }
};
```

### Authentication

The service automatically handles authentication tokens stored in localStorage:

```javascript
// Set auth token (usually done after login)
localStorage.setItem('authToken', 'your-jwt-token');

// The API service will automatically include this in requests
const transactions = await apiService.getAllTransactions();

// Token is automatically cleared on 401 errors
```

## Development

### Logging

In development mode (`NODE_ENV=development`), the service automatically logs:
- 🚀 API requests with method and URL
- ✅ Successful responses with status and URL
- ❌ Error responses with full error details

### Request/Response Flow

1. **Request Interceptor**:
   - Logs request details (development only)
   - Adds authentication token if available
   
2. **Response Interceptor**:
   - Logs successful responses (development only)
   - Handles errors and creates standardized error objects
   - Clears auth token on 401 errors

## Best Practices

1. **Always use try-catch blocks** when calling API methods
2. **Handle errors gracefully** with user-friendly messages
3. **Use environment variables** for API configuration
4. **Validate wallet addresses** before making requests (built-in validation included)
5. **Check response data structure** (built-in validation included)
6. **Use loading states** in your components when making API calls

## Example Component Integration

```javascript
import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const TransactionComponent = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTransactions = async (walletId = '') => {
    setLoading(true);
    setError('');
    
    try {
      const data = await apiService.getTransactions(walletId);
      setTransactions(data);
    } catch (err) {
      setError(err.message);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {transactions.map(tx => (
        <div key={tx.id}>{tx.transaction_hash}</div>
      ))}
    </div>
  );
};
```
