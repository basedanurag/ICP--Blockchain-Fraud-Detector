import React, { useState } from 'react';

const WalletSearch = ({ onSearch, loading = false }) => {
  const [walletId, setWalletId] = useState('');
  const [error, setError] = useState('');

  // Ethereum address validation regex
  const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;

  const validateWalletId = (value) => {
    if (!value.trim()) {
      // Empty value is valid (optional search)
      setError('');
      return true;
    }
    
    if (!ethereumAddressRegex.test(value)) {
      setError('Invalid Ethereum address format. Must be 42 characters starting with 0x.');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setWalletId(value);
    validateWalletId(value);
  };

  const handleWalletSearch = () => {
    const trimmedValue = walletId.trim();
    
    if (!trimmedValue) {
      setError('Please enter a wallet ID for wallet-specific search');
      return;
    }
    
    if (validateWalletId(trimmedValue)) {
      onSearch(trimmedValue);
    }
  };

  const handleGlobalSearch = () => {
    // Clear any wallet ID and fetch all transactions
    onSearch('');
  };

  const handleClear = () => {
    setWalletId('');
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading && !error) {
      handleWalletSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Transactions</h2>
      
      <div className="flex flex-col space-y-4">
        {/* Input Field */}
        <div className="flex-1">
          <input
            type="text"
            value={walletId}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter wallet ID (optional)"
            disabled={loading}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              error
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
            } ${loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          />
          
          {/* Error Message */}
          {error && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          {/* Fetch All Transactions Button */}
          <button
            onClick={handleGlobalSearch}
            disabled={loading}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center ${
              loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-200'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Fetch All Transactions
              </>
            )}
          </button>

          {/* Search Wallet Button */}
          <button
            onClick={handleWalletSearch}
            disabled={loading || !walletId.trim()}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center ${
              loading || !walletId.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                Search Wallet
              </>
            )}
          </button>

          {/* Clear Button */}
          <button
            onClick={handleClear}
            disabled={loading}
            className={`px-6 py-2 rounded-lg font-medium border transition-colors flex items-center ${
              loading
                ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Clear
          </button>
        </div>

        {/* Helper Text */}
        <div className="text-sm text-gray-500 space-y-2">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-gray-600">🌍 Global Search:</p>
              <p>Click "Fetch All Transactions" to retrieve all transactions from the database.</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">🔍 Wallet Search:</p>
              <p>Enter a valid Ethereum address (0x...) and click "Search Wallet" for specific wallet transactions.</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Note: Wallet search requires a valid 42-character Ethereum address starting with 0x</p>
        </div>
      </div>
    </div>
  );
};

export default WalletSearch;
