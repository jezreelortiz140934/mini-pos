import React from 'react';

const Spinner = ({ size = 'md', color = 'teal' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const colorClasses = {
    teal: 'border-teal-500',
    pink: 'border-pink-500',
    purple: 'border-purple-500',
    white: 'border-white'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} ${colorClasses[color]} border-4 border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );
};

export default Spinner;
