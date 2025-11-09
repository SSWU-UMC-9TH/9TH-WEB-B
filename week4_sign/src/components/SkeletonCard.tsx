import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-4 animate-pulse">
      {/* 썸네일 */}
      <div className="aspect-video bg-gray-700 rounded-lg"></div>
      
      {/* 제목 */}
      <div className="space-y-2">
        <div className="h-6 bg-gray-700 rounded w-3/4"></div>
        <div className="h-6 bg-gray-700 rounded w-1/2"></div>
      </div>
      
      {/* 메타 정보 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
          <div className="h-4 bg-gray-700 rounded w-20"></div>
        </div>
        <div className="h-4 bg-gray-700 rounded w-16"></div>
      </div>
      
      {/* 태그들 */}
      <div className="flex flex-wrap gap-2">
        <div className="h-6 bg-gray-700 rounded-full w-16"></div>
        <div className="h-6 bg-gray-700 rounded-full w-12"></div>
        <div className="h-6 bg-gray-700 rounded-full w-20"></div>
      </div>
      
      {/* 상태 */}
      <div className="flex justify-between items-center">
        <div className="h-5 bg-gray-700 rounded w-12"></div>
        <div className="flex space-x-4">
          <div className="h-4 bg-gray-700 rounded w-8"></div>
          <div className="h-4 bg-gray-700 rounded w-8"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;