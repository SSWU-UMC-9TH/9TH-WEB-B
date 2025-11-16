import { useNavigate } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import { useEffect, useRef, useState } from "react";
import LpCardSkeletonList from "../components/LpCardSkeletonList";
import LpCard from "../components/LpCard";

const Homepage = () => {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetLpList({ limit: 20 });

  const observerRef = useRef<HTMLDivElement>(null);

  // 👇 스켈레톤 최소 노출 위한 state
  const [showBottomSkeleton] = useState(false);



  // 무한스크롤 옵저버
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          fetchNextPage();
        }
      },
      { threshold: 0 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 초기 로딩: 스켈레톤 전체 출력
  if (isLoading) {
    return (
      <div className="mt-20 px-10 pb-10">
        <LpCardSkeletonList count={20} />
      </div>
    );
  }

  // 데이터 평탄화
  const lpList = data?.pages.flatMap((page) => page.data.data) ?? [];

  return (
    <div className="mt-20 px-10 pb-10">
      {/* LP 카드들 */}
      <div
  className="
    grid 
    grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6
    gap-3
  "
>
  {lpList.map((lp) => (
    <LpCard
      key={lp.id}
      lp={lp}
      onClick={() => navigate(`/lps/${lp.id}`)}
    />
  ))}
</div>
      

      {/*  무한스크롤 로딩 스켈레톤 (항상 위에 배치 + 최소시간 유지) */}
      {showBottomSkeleton && (
        <div className="mt-6">
          <LpCardSkeletonList count={20} />
        </div>
      )}

      {/* 옵저버 트리거 */}
      <div ref={observerRef} className="h-10 w-full" />
    </div>
  );
};

export default Homepage;