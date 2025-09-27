import React from 'react';

/**
 * Loading Spinner Component
 * Reusable loading spinner for the application
 */
const LoadingSpinner = ({ size = 'large', className = '' }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xlarge: 'h-16 w-16'
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-primary-600 mx-auto mb-4 ${sizeClasses[size]}`}></div>
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;