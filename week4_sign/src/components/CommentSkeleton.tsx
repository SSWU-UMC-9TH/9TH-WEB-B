import React from 'react';

// 개별 댓글 스켈레톤
export const CommentSkeleton = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 bg-gray-700 rounded w-16"></div>
            <div className="h-3 bg-gray-700 rounded w-12"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 댓글 목록 스켈레톤
const CommentListSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <CommentSkeleton key={`comment-skeleton-${i}`} />
      ))}
    </div>
  );
};

export default CommentListSkeleton;

