import React from 'react';

const ErrorMessage = ({ 
  error, 
  onRetry, 
  type = 'default',
  size = 'md',
  showRetry = true,
  retryText = 'Try Again',
  className = '',
  children
}) => {
  // Error type variants
  const typeVariants = {
    default: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-400',
      titleColor: 'text-red-800',
      textColor: 'text-red-700',
      buttonBg: 'bg-red-600 hover:bg-red-700',
      buttonText: 'text-white'
    },
    network: {
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconColor: 'text-orange-400',
      titleColor: 'text-orange-800',
      textColor: 'text-orange-700',
      buttonBg: 'bg-orange-600 hover:bg-orange-700',
      buttonText: 'text-white'
    },
    validation: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-400',
      titleColor: 'text-yellow-800',
      textColor: 'text-yellow-700',
      buttonBg: 'bg-yellow-600 hover:bg-yellow-700',
      buttonText: 'text-white'
    },
    server: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-400',
      titleColor: 'text-red-800',
      textColor: 'text-red-700',
      buttonBg: 'bg-red-600 hover:bg-red-700',
      buttonText: 'text-white'
    },
    notFound: {
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      iconColor: 'text-gray-400',
      titleColor: 'text-gray-800',
      textColor: 'text-gray-700',
      buttonBg: 'bg-gray-600 hover:bg-gray-700',
      buttonText: 'text-white'
    }
  };

  // Size variants
  const sizeVariants = {
    sm: {
      padding: 'p-3',
      iconSize: 'w-4 h-4',
      titleSize: 'text-sm',
      textSize: 'text-xs',
      buttonPadding: 'px-3 py-1',
      buttonTextSize: 'text-xs'
    },
    md: {
      padding: 'p-4',
      iconSize: 'w-5 h-5',
      titleSize: 'text-base',
      textSize: 'text-sm',
      buttonPadding: 'px-4 py-2',
      buttonTextSize: 'text-sm'
    },
    lg: {
      padding: 'p-6',
      iconSize: 'w-6 h-6',
      titleSize: 'text-lg',
      textSize: 'text-base',
      buttonPadding: 'px-6 py-3',
      buttonTextSize: 'text-base'
    }
  };

  const variant = typeVariants[type] || typeVariants.default;
  const sizing = sizeVariants[size] || sizeVariants.md;

  // Error type detection based on error message
  const getErrorType = (errorMessage) => {
    const message = errorMessage.toLowerCase();
    
    if (message.includes('network') || message.includes('connection') || message.includes('fetch')) {
      return 'network';
    }
    if (message.includes('not found') || message.includes('wallet not found')) {
      return 'notFound';
    }
    if (message.includes('server') || message.includes('500') || message.includes('503')) {
      return 'server';
    }
    if (message.includes('invalid') || message.includes('validation')) {
      return 'validation';
    }
    return 'default';
  };

  // Auto-detect error type if not specified
  const detectedType = type === 'default' && error ? getErrorType(error) : type;
  const finalVariant = typeVariants[detectedType] || typeVariants.default;

  // Error icons based on type
  const getErrorIcon = (errorType) => {
    switch (errorType) {
      case 'network':
        return (
          <svg className={`${sizing.iconSize} ${finalVariant.iconColor}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        );
      case 'notFound':
        return (
          <svg className={`${sizing.iconSize} ${finalVariant.iconColor}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        );
      case 'validation':
        return (
          <svg className={`${sizing.iconSize} ${finalVariant.iconColor}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'server':
        return (
          <svg className={`${sizing.iconSize} ${finalVariant.iconColor}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className={`${sizing.iconSize} ${finalVariant.iconColor}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  // Get title based on error type
  const getErrorTitle = (errorType) => {
    switch (errorType) {
      case 'network':
        return 'Connection Error';
      case 'notFound':
        return 'Not Found';
      case 'validation':
        return 'Invalid Input';
      case 'server':
        return 'Server Error';
      default:
        return 'Error';
    }
  };

  return (
    <div className={`${finalVariant.bgColor} ${finalVariant.borderColor} border rounded-lg ${sizing.padding} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {getErrorIcon(detectedType)}
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`${sizing.titleSize} font-medium ${finalVariant.titleColor}`}>
            {getErrorTitle(detectedType)}
          </h3>
          <div className={`mt-1 ${sizing.textSize} ${finalVariant.textColor}`}>
            {error && <p>{error}</p>}
            {children}
          </div>
          {showRetry && onRetry && (
            <div className="mt-3">
              <button
                onClick={onRetry}
                className={`${finalVariant.buttonBg} ${finalVariant.buttonText} ${sizing.buttonPadding} ${sizing.buttonTextSize} font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-current`}
              >
                {retryText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Specialized error components for common scenarios
export const NetworkError = ({ onRetry, className = '' }) => (
  <ErrorMessage
    error="Network error: Please check your connection"
    type="network"
    onRetry={onRetry}
    className={className}
  />
);

export const WalletNotFoundError = ({ walletId, onRetry, className = '' }) => (
  <ErrorMessage
    error={`Wallet not found: ${walletId || 'Invalid wallet address'}`}
    type="notFound"
    onRetry={onRetry}
    retryText="Search Again"
    className={className}
  />
);

export const ServerError = ({ onRetry, className = '' }) => (
  <ErrorMessage
    error="Server error: Please try again later"
    type="server"
    onRetry={onRetry}
    className={className}
  />
);

export const ValidationError = ({ message, className = '' }) => (
  <ErrorMessage
    error={message || "Please check your input and try again"}
    type="validation"
    showRetry={false}
    className={className}
  />
);

// Inline error component for forms
export const InlineError = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="flex items-center mt-1 text-sm text-red-600">
      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {error}
    </div>
  );
};

export default ErrorMessage;
