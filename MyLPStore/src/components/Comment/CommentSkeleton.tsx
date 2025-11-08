export const CommentSkeleton = () => {
    return (
      <div className="bg-gray-700/50 p-4 rounded-lg shadow-md animate-pulse">
          <div className="bg-gray-600 h-4 w-1/4 rounded mb-2"></div>
          <div className="bg-gray-600 h-4 w-full rounded mb-1"></div>
          <div className="bg-gray-600 h-4 w-3/4 rounded mb-2"></div>
          <div className="bg-gray-600 h-3 w-20 rounded"></div>
      </div>
    )
  }
