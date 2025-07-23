import React, { useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import InfoPage from './pages/InfoPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'info':
        return <InfoPage />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="App min-h-screen bg-gray-50 flex flex-col">
        {/* Header with application title */}
        <Header />
        
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  currentPage === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🏠 Dashboard
              </button>
              <button
                onClick={() => setCurrentPage('info')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  currentPage === 'info'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📚 Developer Guide
              </button>
            </div>
          </div>
        </nav>
        
        {/* Main content area */}
        <main className="flex-1">
          {renderCurrentPage()}
        </main>
        
        {/* Footer with system status */}
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
