import React, { useState } from 'react';

const InfoPage = () => {
  const [activeTab, setActiveTab] = useState('architecture');

  const tabClasses = (tabName) => {
    return `px-4 py-2 font-medium text-sm rounded-lg transition-colors ${
      activeTab === tabName
        ? 'bg-blue-600 text-white'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">🚀 Fraud Detection System - Developer Guide</h1>
      
      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-8 bg-gray-100 p-2 rounded-lg">
        <button
          onClick={() => setActiveTab('architecture')}
          className={tabClasses('architecture')}
        >
          🏗️ Architecture
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={tabClasses('api')}
        >
          🔌 API Endpoints
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={tabClasses('data')}
        >
          📊 Data Types
        </button>
        <button
          onClick={() => setActiveTab('testing')}
          className={tabClasses('testing')}
        >
          🧪 Testing Guide
        </button>
      </div>

      {/* Architecture Tab */}
      {activeTab === 'architecture' && (
        <div className="space-y-8">
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔧 System Architecture</h2>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Data Flow:</h3>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li><strong>Frontend</strong> → User inputs optional wallet ID</li>
                  <li><strong>API Request</strong> → Frontend sends request to backend</li>
                  <li><strong>Backend</strong> → Queries MongoDB for transaction data</li>
                  <li><strong>AI Module</strong> → Loads model and processes transactions</li>
                  <li><strong>ML Processing</strong> → Assigns risk_score and risk_level</li>
                  <li><strong>Response</strong> → Returns analyzed transactions to frontend</li>
                  <li><strong>Display</strong> → Frontend shows results with color coding</li>
                </ol>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">🎯 Frontend Components</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <code className="bg-gray-200 px-1 rounded">Dashboard.jsx</code> - Main logic & state</li>
                  <li>• <code className="bg-gray-200 px-1 rounded">WalletSearch.jsx</code> - Input & buttons</li>
                  <li>• <code className="bg-gray-200 px-1 rounded">TransactionTable.jsx</code> - Results display</li>
                  <li>• <code className="bg-gray-200 px-1 rounded">api.js</code> - API communication</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">🧠 AI Module Components</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <code className="bg-gray-200 px-1 rounded">fraud_detection.py</code> - Main module</li>
                  <li>• <code className="bg-gray-200 px-1 rounded">fraud_model.pkl</code> - Trained ML model</li>
                  <li>• <code className="bg-gray-200 px-1 rounded">MongoDB</code> - Transaction database</li>
                  <li>• <code className="bg-gray-200 px-1 rounded">Feature extraction</code> - Data preprocessing</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">🗄️ Database Schema</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">MongoDB Collection: <code>fraud_detection.transactions</code></h4>
              <pre className="text-sm text-gray-700 overflow-x-auto">
{`{
  "_id": ObjectId,
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
}`}
              </pre>
            </div>
          </section>
        </div>
      )}

      {/* API Endpoints Tab */}
      {activeTab === 'api' && (
        <div className="space-y-8">
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔌 API Endpoints</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-green-400 bg-green-50 p-4 rounded">
                <h3 className="font-semibold text-green-800 mb-2">GET /api/fraud</h3>
                <p className="text-green-700 mb-2">Fetch all transactions from the database</p>
                <div className="bg-white p-3 rounded border">
                  <p class="text-sm text-gray-600 mb-2"><strong>Response:</strong></p>
                  <pre className="text-xs text-gray-700">
{`[
  {
    "transaction_id": "tx_001",
    "wallet_id": "0x742d35Cc...",
    "method": "transfer",
    "amount": 1500.5,
    "risk_score": 0.8542,
    "risk_level": "high"
  }
]`}
                  </pre>
                </div>
              </div>
              
              <div className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded">
                <h3 className="font-semibold text-blue-800 mb-2">GET /api/fraud/:wallet_id</h3>
                <p className="text-blue-700 mb-2">Fetch transactions for a specific wallet</p>
                <div className="bg-white p-3 rounded border">
                  <p class="text-sm text-gray-600 mb-2"><strong>Parameters:</strong></p>
                  <ul className="text-sm text-gray-700 mb-3">
                    <li>• <code>wallet_id</code>: Ethereum address (42 chars, starts with 0x)</li>
                  </ul>
                  <p class="text-sm text-gray-600 mb-2"><strong>Example URL:</strong></p>
                  <code className="text-xs bg-gray-100 p-1 rounded">/api/fraud/0x742d35Cc6634C0532925a3b8D5C9C89D05afe3b2</code>
                </div>
              </div>
              
              <div className="border-l-4 border-purple-400 bg-purple-50 p-4 rounded">
                <h3 className="font-semibold text-purple-800 mb-2">GET /health</h3>
                <p className="text-purple-700 mb-2">Health check endpoint</p>
                <div className="bg-white p-3 rounded border">
                  <p class="text-sm text-gray-600 mb-2"><strong>Response:</strong></p>
                  <pre className="text-xs text-gray-700">
{`{
  "status": "healthy",
  "service": "fraud-detection"
}`}
                  </pre>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Data Types Tab */}
      {activeTab === 'data' && (
        <div className="space-y-8">
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">📊 Data Types & Structures</h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-3">🔍 Input Data (Frontend → Backend)</h3>
                <div className="bg-white p-3 rounded border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Field</th>
                        <th className="text-left py-2">Type</th>
                        <th className="text-left py-2">Description</th>
                        <th className="text-left py-2">Required</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2"><code>wallet_id</code></td>
                        <td className="py-2">string</td>
                        <td className="py-2">Ethereum wallet address (42 chars)</td>
                        <td className="py-2">Optional</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-3">📤 Output Data (Backend → Frontend)</h3>
                <div className="bg-white p-3 rounded border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Field</th>
                        <th className="text-left py-2">Type</th>
                        <th className="text-left py-2">Description</th>
                        <th className="text-left py-2">Example</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2"><code>tx_hash</code></td>
                        <td className="py-2">string</td>
                        <td className="py-2">Transaction hash identifier</td>
                        <td className="py-2">"0xabc123..."</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2"><code>risk_score</code></td>
                        <td className="py-2">float</td>
                        <td className="py-2">Fraud probability (0.0 - 1.0)</td>
                        <td className="py-2">0.8542</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2"><code>risk_level</code></td>
                        <td className="py-2">string</td>
                        <td className="py-2">Risk category</td>
                        <td className="py-2">"high", "medium", "low"</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2"><code>transaction_id</code></td>
                        <td className="py-2">string</td>
                        <td className="py-2">Internal transaction ID</td>
                        <td className="py-2">"tx_001"</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2"><code>wallet_id</code></td>
                        <td className="py-2">string</td>
                        <td className="py-2">Associated wallet address</td>
                        <td className="py-2">"0x742d35Cc..."</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2"><code>amount</code></td>
                        <td className="py-2">float</td>
                        <td className="py-2">Transaction amount</td>
                        <td className="py-2">1500.5</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2"><code>method</code></td>
                        <td className="py-2">string</td>
                        <td className="py-2">Transaction type</td>
                        <td className="py-2">"transfer", "swap", "stake"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-3">⚠️ Risk Level Categories</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-green-100 border border-green-300 p-3 rounded">
                    <h4 className="font-semibold text-green-800">🟢 Low Risk</h4>
                    <p className="text-sm text-green-700 mt-1">Risk Score: 0.0 - 0.3</p>
                    <p className="text-xs text-green-600 mt-1">Normal transaction pattern</p>
                  </div>
                  <div className="bg-orange-100 border border-orange-300 p-3 rounded">
                    <h4 className="font-semibold text-orange-800">🟡 Medium Risk</h4>
                    <p className="text-sm text-orange-700 mt-1">Risk Score: 0.3 - 0.7</p>
                    <p className="text-xs text-orange-600 mt-1">Suspicious activity detected</p>
                  </div>
                  <div className="bg-red-100 border border-red-300 p-3 rounded">
                    <h4 className="font-semibold text-red-800">🔴 High Risk</h4>
                    <p className="text-sm text-red-700 mt-1">Risk Score: 0.7 - 1.0</p>
                    <p className="text-xs text-red-600 mt-1">Likely fraudulent transaction</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Testing Guide Tab */}
      {activeTab === 'testing' && (
        <div className="space-y-8">
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">🧪 Backend Developer Testing Guide</h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <h3 className="font-semibold text-blue-800 mb-3">🚀 Quick Start Testing</h3>
                <ol className="list-decimal list-inside space-y-2 text-blue-700">
                  <li>Start your backend server on <code className="bg-blue-100 px-1 rounded">http://localhost:8000</code></li>
                  <li>Start the React frontend with <code className="bg-blue-100 px-1 rounded">npm start</code></li>
                  <li>Open <code className="bg-blue-100 px-1 rounded">http://localhost:3000</code> in your browser</li>
                  <li>Use the interface to test your API endpoints</li>
                </ol>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-3">✅ Frontend Testing Features</h3>
                <ul className="space-y-2 text-green-700">
                  <li>• <strong>Global Transactions:</strong> Click "Fetch All Transactions" to test <code>/api/fraud</code></li>
                  <li>• <strong>Wallet-Specific:</strong> Enter wallet ID and click "Search Wallet" to test <code>/api/fraud/:wallet_id</code></li>
                  <li>• <strong>Error Handling:</strong> Invalid wallet formats show validation errors</li>
                  <li>• <strong>Loading States:</strong> Visual feedback during API calls</li>
                  <li>• <strong>Color Coding:</strong> Risk levels are visually distinguished</li>
                  <li>• <strong>Responsive Design:</strong> Works on mobile and desktop</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">🔧 Backend Setup Requirements</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-700">1. Install Dependencies</h4>
                    <pre className="bg-gray-800 text-white p-2 rounded text-sm mt-1">
{`pip install pymongo scikit-learn pandas numpy flask flask-cors`}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">2. Start MongoDB</h4>
                    <pre className="bg-gray-800 text-white p-2 rounded text-sm mt-1">
{`mongod --dbpath /path/to/your/db`}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">3. Ensure Required Files</h4>
                    <ul className="text-sm text-gray-600 mt-1 space-y-1">
                      <li>• <code>fraud_detection.py</code> - AI module</li>
                      <li>• <code>fraud_model.pkl</code> - Trained model</li>
                      <li>• MongoDB with sample transaction data</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-3">🧪 Testing Scenarios</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-yellow-700 mb-2">Valid Test Cases:</h4>
                    <ul className="text-sm text-yellow-600 space-y-1">
                      <li>• Empty input (fetch all transactions)</li>
                      <li>• Valid wallet: <code>0x742d35Cc6634C0532925a3b8D5C9C89D05afe3b2</code></li>
                      <li>• Wallet with no transactions</li>
                      <li>• Multiple transactions with different risk levels</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-700 mb-2">Error Test Cases:</h4>
                    <ul className="text-sm text-yellow-600 space-y-1">
                      <li>• Invalid format: <code>not-a-wallet</code></li>
                      <li>• Wrong length: <code>0x123</code></li>
                      <li>• Server not running</li>
                      <li>• Database connection errors</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-3">🐛 Common Issues & Solutions</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium text-red-700">CORS Errors:</h4>
                    <p className="text-red-600">Add <code>flask-cors</code> to your Flask app or set proper headers</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-700">Connection Refused:</h4>
                    <p className="text-red-600">Ensure backend is running on port 8000 or update <code>REACT_APP_API_BASE_URL</code></p>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-700">Model Not Found:</h4>
                    <p className="text-red-600">Ensure <code>fraud_model.pkl</code> is in the correct directory</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-700">Empty Results:</h4>
                    <p className="text-red-600">Check if MongoDB has transaction data in the correct format</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default InfoPage;

