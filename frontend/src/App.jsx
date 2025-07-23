import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <div className="App min-h-screen bg-gray-50 flex flex-col">
        {/* Header with application title */}
        <Header />
        
        {/* Main content area with Dashboard */}
        <main className="flex-1">
          <Dashboard />
        </main>
        
        {/* Footer with system status */}
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
