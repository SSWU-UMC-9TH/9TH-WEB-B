// src/components/comments/LpCommentSkeleton.tsx

const LpCommentSkeleton = () => {
  return (
    <div className="flex items-start gap-3 py-3 animate-pulse">
      {/* 프로필 이미지 */}
      <div className="w-10 h-10 bg-gray-700 rounded-full" />

      {/* 텍스트 영역 */}
      <div className="flex-1 space-y-2">
        <div className="w-1/3 h-3 bg-gray-700 rounded" />
        <div className="w-2/3 h-3 bg-gray-700 rounded" />
        <div className="w-1/4 h-3 bg-gray-700 rounded" />
      </div>
    </div>
  );
};

export default LpCommentSkeleton;