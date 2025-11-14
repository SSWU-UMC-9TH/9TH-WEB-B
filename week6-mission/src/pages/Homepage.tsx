import { useNavigate } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import { useEffect, useRef } from "react";

const Homepage = () => {
  const navigate = useNavigate();
  // 파라미터 예시 (필요에 따라 상태로 관리 가능)
  const { 
    data, 
    isLoading,
    hasNextPage, 
    fetchNextPage, 
    isFetchingNextPage 
  } = useGetLpList({ 
    limit: 10,
    // search: searchText, // 검색 기능 연동 시
    // order: sortOption // 정렬 기능 연동 시
  });

  const skeletonItems = Array.from({ length: 12 });

  const LpCardSkeleton = () => (
    <div
      className="
        relative overflow-hidden rounded-md 
        bg-neutral-900 shadow-lg
        animate-pulse
      "
    >
      {/* shimmer overlay */}
      <div
        className="
          absolute inset-0 
          bg-gradient-to-r from-transparent via-white/10 to-transparent
          shimmer
          pointer-events-none
          z-100
        "
      />

      {/* 이미지 영역 (실제 카드의 썸네일과 동일 높이) */}
      <div className="w-full h-40 bg-neutral-700 z-10 relative" />

      {/* 텍스트 영역 */}
      <div className="p-3 space-y-2 z-10 relative">
        <div className="h-3 bg-neutral-700 rounded w-3/4" />
        <div className="h-3 bg-neutral-700 rounded w-1/2" />
        <div className="h-3 bg-neutral-700 rounded w-1/3" />
      </div>
    </div>
  );

  // 무한 스크롤 트리거를 위한 ref
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 관찰 대상이 화면에 들어오고, 다음 페이지가 있으며, 현재 로딩 중이 아닐 때
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 } // 요소의 50%가 보일 때 트리거
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  // ✅ 요구사항 1: isLoading일 때 상단 스켈레톤 UI 표시
  if (isLoading) {
    return (
      <div className="mt-20 px-10 pb-10">
        <div
          className="
            grid 
            grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6
            gap-3
          "
        >
          {skeletonItems.map((_, idx) => (
            <LpCardSkeleton key={idx} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 px-10 pb-10">
      <div
        className="
          grid 
          grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6
          gap-3
        "
      >
        {/* useInfiniteQuery의 데이터 구조는 data.pages 배열 안에 각 페이지 데이터가 존재함 */}
        {data?.pages
          .flatMap((page) => page.data.data)
          .map((lp) => (
            <div
              key={lp.id}
              onClick={() => {
                navigate(`/lps/${lp.id}`);
              }}
              className="
                relative group cursor-pointer
                overflow-hidden rounded-md
                hover:scale-105 transition-transform duration-300
              "
            >
              <img
                src={lp.thumbnail}
                alt={lp.title}
                className="w-full h-40 object-cover"
              />

              <div
                className="
                  absolute inset-0 bg-black/60 opacity-0 
                  group-hover:opacity-100 transition-opacity duration-300 
                  flex flex-col justify-end p-3 text-white
                "
              >
                <p className="text-sm font-semibold line-clamp-2">
                  {lp.title}
                </p>
                <p className="text-xs text-gray-300">
                  {new Date(lp.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-300">
                  ❤️ {lp.likes.length}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* ✅ 요구사항 2: isFetchingNextPage일 때 하단 스켈레톤 UI 표시 */}
      <div
        ref={observerRef}
        className="w-full h-10 flex justify-center items-center mt-6"
      >
        {isFetchingNextPage && (
          <div
            className="
              grid 
              grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6
              gap-3 w-full
            "
          >
            {skeletonItems.slice(0, 6).map((_, idx) => (
              <LpCardSkeleton key={`bottom-skeleton-${idx}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;