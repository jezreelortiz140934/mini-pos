import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
      {/* Image placeholder */}
      <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg mb-4 shimmer"></div>
      
      {/* Title placeholder */}
      <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 mb-3 shimmer"></div>
      
      {/* Description placeholder */}
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full mb-2 shimmer"></div>
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-5/6 mb-4 shimmer"></div>
      
      {/* Price placeholder */}
      <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2 shimmer"></div>
    </div>
  );
};

export default SkeletonCard;
