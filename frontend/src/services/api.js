import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for logging and authentication
apiClient.interceptors.request.use(
  (config) => {
    // Log request details in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    // Add authentication token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and logging
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Log error responses
    console.error('❌ API Error:', error);
    
    // Create standardized error object
    const standardizedError = {
      message: 'An unexpected error occurred',
      status: null,
      data: null,
      isNetworkError: false,
    };

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      standardizedError.status = status;
      standardizedError.data = data;

      switch (status) {
        case 400:
          standardizedError.message = data?.message || 'Invalid request parameters';
          break;
        case 401:
          standardizedError.message = 'Authentication required';
          // Optionally redirect to login or clear auth token
          localStorage.removeItem('authToken');
          break;
        case 403:
          standardizedError.message = 'Access denied';
          break;
        case 404:
          standardizedError.message = data?.message || 'Resource not found';
          break;
        case 422:
          standardizedError.message = data?.message || 'Invalid data provided';
          break;
        case 429:
          standardizedError.message = 'Too many requests. Please try again later';
          break;
        case 500:
          standardizedError.message = 'Internal server error. Please try again later';
          break;
        case 502:
          standardizedError.message = 'Service temporarily unavailable';
          break;
        case 503:
          standardizedError.message = 'Service unavailable. Please try again later';
          break;
        case 504:
          standardizedError.message = 'Request timeout. Please try again';
          break;
        default:
          standardizedError.message = data?.message || `Server error (${status})`;
      }
    } else if (error.request) {
      // Network error - no response received
      standardizedError.isNetworkError = true;
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        standardizedError.message = 'Unable to connect to server. Please check your internet connection';
      } else if (error.code === 'TIMEOUT' || error.code === 'ECONNABORTED') {
        standardizedError.message = 'Request timeout. Please try again';
      } else {
        standardizedError.message = 'Network error. Please check your connection and try again';
      }
    } else {
      // Request setup error
      standardizedError.message = error.message || 'Request configuration error';
    }

    // Attach standardized error to the original error object
    error.standardized = standardizedError;
    
    return Promise.reject(error);
  }
);

// API service methods
const apiService = {
  /**
   * Fetches all transactions from the API
   * @returns {Promise<Array>} Array of transaction objects
   * @throws {Error} Standardized error object with message, status, and other details
   */
  async getAllTransactions() {
    try {
      const response = await apiClient.get('/api/fraud');
      
      // Validate response data structure
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: expected array of transactions');
      }
      
      return response.data;
    } catch (error) {
      // Re-throw with additional context
      if (error.standardized) {
        throw new Error(error.standardized.message);
      }
      throw error;
    }
  },

  /**
   * Fetches transactions for a specific wallet
   * @param {string} walletId - The wallet ID/address to fetch transactions for
   * @returns {Promise<Array>} Array of transaction objects for the specified wallet
   * @throws {Error} Standardized error object with message, status, and other details
   */
  async getWalletTransactions(walletId) {
    if (!walletId || typeof walletId !== 'string') {
      throw new Error('Wallet ID is required and must be a string');
    }

    // Basic Ethereum address validation
    const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethereumAddressRegex.test(walletId)) {
      throw new Error('Invalid Ethereum address format. Must be 42 characters starting with 0x');
    }

    try {
      const response = await apiClient.get(`/api/fraud/${walletId}`);
      
      // Validate response data structure
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: expected array of transactions');
      }
      
      return response.data;
    } catch (error) {
      // Handle wallet not found specifically
      if (error.response?.status === 404) {
        throw new Error(`No transactions found for wallet: ${walletId}`);
      }
      
      // Re-throw with additional context
      if (error.standardized) {
        throw new Error(error.standardized.message);
      }
      throw error;
    }
  },

  /**
   * Generic method to handle both all transactions and wallet-specific transactions
   * @param {string} [walletId] - Optional wallet ID. If provided, fetches wallet transactions; otherwise, fetches all transactions
   * @returns {Promise<Array>} Array of transaction objects
   * @throws {Error} Standardized error object with message, status, and other details
   */
  async getTransactions(walletId = '') {
    const trimmedWalletId = walletId?.trim();
    
    if (trimmedWalletId) {
      return this.getWalletTransactions(trimmedWalletId);
    } else {
      return this.getAllTransactions();
    }
  },

  /**
   * Health check endpoint to verify API connectivity
   * @returns {Promise<Object>} Health status object
   */
  async healthCheck() {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      if (error.standardized) {
        throw new Error(error.standardized.message);
      }
      throw error;
    }
  },
};

// Export the configured axios instance for advanced usage
export { apiClient };

// Export the API service methods
export default apiService;
