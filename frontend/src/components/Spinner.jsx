import React from 'react';

const Spinner = ({ 
  size = 'md', 
  color = 'blue', 
  text = '', 
  centered = false,
  className = '',
  fullScreen = false
}) => {
  // Size variants
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16'
  };

  // Color variants
  const colorClasses = {
    blue: 'text-blue-600',
    gray: 'text-gray-600',
    white: 'text-white',
    red: 'text-red-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    indigo: 'text-indigo-600',
    purple: 'text-purple-600',
    pink: 'text-pink-600'
  };

  // Text size based on spinner size
  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  };

  const spinnerElement = (
    <div className={`flex items-center ${centered ? 'justify-center' : ''} ${className}`}>
      <svg
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Loading"
        role="status"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <span className={`ml-2 ${colorClasses[color]} ${textSizeClasses[size]} font-medium`}>
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center">
          {spinnerElement}
        </div>
      </div>
    );
  }

  if (centered) {
    return (
      <div className="flex items-center justify-center p-4">
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
};

// Specialized spinner components for common use cases
export const PageSpinner = ({ text = 'Loading...' }) => (
  <Spinner size="xl" color="blue" text={text} centered fullScreen />
);

export const InlineSpinner = ({ text = '', size = 'sm', color = 'blue' }) => (
  <Spinner size={size} color={color} text={text} />
);

export const ButtonSpinner = ({ text = 'Loading...' }) => (
  <Spinner size="sm" color="white" text={text} />
);

export const CardSpinner = ({ text = 'Loading...' }) => (
  <div className="flex items-center justify-center p-8">
    <Spinner size="lg" color="blue" text={text} />
  </div>
);

export const TableSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <Spinner size="lg" color="blue" text="Loading data..." />
  </div>
);

export default Spinner;
