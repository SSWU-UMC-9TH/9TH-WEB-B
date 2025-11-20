// src/components/comments/LpCommentSkeletonList.tsx
import LpCommentSkeleton from "./LpCommentSkeleton";

const LpCommentSkeletonList = ({ count }: { count: number }) => {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <LpCommentSkeleton key={i} />
      ))}
    </div>
  );
};

export default LpCommentSkeletonList;