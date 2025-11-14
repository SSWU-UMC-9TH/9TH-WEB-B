import LpCardSkeleton from "./LpCardSkeleton";

interface Props {
  count: number;
}

const LpCardSkeletonList = ({ count }: Props) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <LpCardSkeleton key={i} />
      ))}
    </>
  );
};

export default LpCardSkeletonList;