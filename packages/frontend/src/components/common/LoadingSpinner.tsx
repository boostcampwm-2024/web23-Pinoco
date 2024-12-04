import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-16 h-16 border-t-2 border-b-2 rounded-full animate-spin border-primary"></div>
    </div>
  );
};

export default LoadingSpinner;
