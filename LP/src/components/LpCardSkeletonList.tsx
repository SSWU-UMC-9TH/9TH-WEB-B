import LpCardSkeleton from "./LpCardSkeleton";

const LpCardSkeletonList = ({ count = 10 }) => {
  return (
    <div
      className="
        grid 
        grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6
        gap-3
      "
    >
      {Array.from({ length: count }).map((_, idx) => (
        <LpCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export default LpCardSkeletonList;