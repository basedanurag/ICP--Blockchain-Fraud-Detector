import React from 'react';

const TransactionTable = ({ transactions = [], loading = false, error = null }) => {
  // Function to get background color based on risk level
  const getRiskLevelBgColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
        return 'bg-green-100';
      case 'medium':
        return 'bg-orange-100';
      case 'high':
        return 'bg-red-100';
      default:
        return 'bg-gray-50';
    }
  };

  // Function to get text color based on risk level
  const getRiskLevelTextColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
        return 'text-green-800';
      case 'medium':
        return 'text-orange-800';
      case 'high':
        return 'text-red-800';
      default:
        return 'text-gray-800';
    }
  };

  // Function to format risk score as percentage
  const formatRiskScore = (score) => {
    if (score === null || score === undefined) return 'N/A';
    return `${(score * 100).toFixed(2)}%`;
  };

  // Function to truncate transaction hash for better display
  const truncateHash = (hash) => {
    if (!hash) return 'N/A';
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <div className="flex items-center space-x-2">
        <svg 
          className="animate-spin h-8 w-8 text-blue-600" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="text-gray-600 font-medium">Loading transactions...</span>
      </div>
    </div>
  );

  // Error message component
  const ErrorMessage = () => (
    <div className="flex justify-center items-center py-12">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center">
          <svg 
            className="w-6 h-6 text-red-600 mr-3" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="flex justify-center items-center py-12">
      <div className="text-center">
        <svg 
          className="mx-auto h-12 w-12 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
        <p className="mt-1 text-sm text-gray-500">There are no transactions to display.</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Transaction Analysis</h2>
        <p className="text-sm text-gray-600 mt-1">
          Risk assessment results for blockchain transactions
        </p>
      </div>

      {/* Content */}
      <div className="">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage />
        ) : transactions.length === 0 ? (
          <EmptyState />
        ) : (
          /* Table with horizontal scroll for mobile */
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Transaction Hash
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Risk Score
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Risk Level
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction, index) => (
                  <tr 
                    key={transaction.tx_hash || transaction.transaction_id || index}
                    className={`${getRiskLevelBgColor(transaction.risk_level)} hover:opacity-80 transition-opacity`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div 
                          className="text-sm font-mono text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                          title={transaction.tx_hash || transaction.transaction_id}
                        >
                          {truncateHash(transaction.tx_hash || transaction.transaction_id)}
                        </div>
                        <div className="text-xs text-gray-500 sm:hidden">
                          {/* Show full hash on mobile when needed */}
                          <span className="break-all">{transaction.tx_hash || transaction.transaction_id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatRiskScore(transaction.risk_score)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          getRiskLevelTextColor(transaction.risk_level)
                        } ${getRiskLevelBgColor(transaction.risk_level)} border border-opacity-20 ${
                          transaction.risk_level?.toLowerCase() === 'low' ? 'border-green-300' :
                          transaction.risk_level?.toLowerCase() === 'medium' ? 'border-orange-300' :
                          transaction.risk_level?.toLowerCase() === 'high' ? 'border-red-300' :
                          'border-gray-300'
                        }`}
                      >
                        {transaction.risk_level || 'Unknown'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer with transaction count */}
      {!loading && !error && transactions.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
