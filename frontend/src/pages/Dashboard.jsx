import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import WalletSearch from '../components/WalletSearch';
import TransactionTable from '../components/TransactionTable';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async (walletId = '') => {
    setLoading(true);
    setError('');
    try {
      const transactions = await apiService.getTransactions(walletId);
      setTransactions(transactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const transactionCount = transactions.length;
  const riskDistribution = transactions.reduce((acc, transaction) => {
    const riskLevel = transaction.risk_level || 'unknown';
    if (!acc[riskLevel]) {
      acc[riskLevel] = 0;
    }
    acc[riskLevel] += 1;
    return acc;
  }, {});

  const averageRiskScore = transactionCount > 0 
    ? transactions.reduce((total, transaction) => {
        const riskScore = transaction.risk_score || 0;
        return total + riskScore;
      }, 0) / transactionCount
    : 0;

  return (
    <div className="flex-1">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Component */}
        <WalletSearch onSearch={fetchTransactions} loading={loading} />
        
        {/* Statistics Summary */}
        {!loading && transactions.length > 0 && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Transactions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <svg className="w-8 h-8 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{transactionCount}</p>
                </div>
              </div>
            </div>

            {/* Average Risk Score */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <svg className="w-8 h-8 text-yellow-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Risk Score</p>
                  <p className="text-2xl font-bold text-gray-900">{(averageRiskScore * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>

            {/* High Risk Count */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <svg className="w-8 h-8 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-600">High Risk</p>
                  <p className="text-2xl font-bold text-red-600">{riskDistribution.high || 0}</p>
                </div>
              </div>
            </div>

            {/* Risk Distribution */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <svg className="w-8 h-8 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-600">Risk Distribution</p>
                  <div className="flex space-x-4 mt-1">
                    <span className="text-sm text-red-600 font-medium">H: {riskDistribution.high || 0}</span>
                    <span className="text-sm text-orange-600 font-medium">M: {riskDistribution.medium || 0}</span>
                    <span className="text-sm text-green-600 font-medium">L: {riskDistribution.low || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Transaction Table */}
        <TransactionTable transactions={transactions} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default Dashboard;
