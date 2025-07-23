import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [systemStatus, setSystemStatus] = useState({
    apiStatus: 'online',
    lastUpdate: new Date(),
    uptime: '99.9%'
  });

  useEffect(() => {
    // Update the last update time every minute
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        lastUpdate: new Date()
      }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* System Status */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">System Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Service</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Uptime</span>
                <span className="text-sm font-medium text-gray-900">{systemStatus.uptime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Update</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatTime(systemStatus.lastUpdate)}
                </span>
              </div>
            </div>
          </div>

          {/* Application Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Application</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Version</span>
                <span className="text-sm font-medium text-gray-900">v1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Environment</span>
                <span className="text-sm font-medium text-gray-900">
                  {process.env.NODE_ENV || 'development'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Build</span>
                <span className="text-sm font-medium text-gray-900">
                  {process.env.REACT_APP_BUILD || 'latest'}
                </span>
              </div>
            </div>
          </div>

          {/* Support & Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Support</h3>
            <div className="space-y-2">
              <a 
                href="#documentation" 
                className="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Documentation
              </a>
              <a 
                href="#api-reference" 
                className="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                API Reference
              </a>
              <a 
                href="#support" 
                className="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} AI Fraud Detection System. Built for DoraHacks.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path 
                    fillRule="evenodd" 
                    d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <span className="text-sm text-gray-500">
                  Powered by React & AI
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
