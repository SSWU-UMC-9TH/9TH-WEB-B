import { useNavigate } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import { useEffect, useRef, useState } from "react";
import { useThrottle } from "../hooks/useThrottle";
import { useDebounce } from "../hooks/useDebounce";
import LpCardSkeletonList from "../components/LpCardSkeletonList";
import LpCard from "../components/LpCard";
import SearchBar from "../components/SearchBar";



const Homepage = () => {
  
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  }  = useGetLpList({
    limit: 20,
    order: "desc",
    search: debouncedSearch,
    enabled: true
  });


  // const observerRef = useRef<HTMLDivElement>(null);

  // 👇 스켈레톤 최소 노출 위한 state
  const [showBottomSkeleton] = useState(false);

  const [scrollY, setScrollY] = useState(0);
  const throttledScrollY = useThrottle(scrollY, 2000);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const scrollPosition = window.innerHeight + throttledScrollY;
    const pageHeight = document.body.scrollHeight;
    const isBottom = scrollPosition >= pageHeight - 300;

    if (isBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [throttledScrollY, hasNextPage, isFetchingNextPage]);


  // 무한스크롤 옵저버 제거됨 (스크롤 기반으로 대체)

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
      <SearchBar value={search} onChange={setSearch} />
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

      {/* 옵저버 트리거 제거됨 */}
    </div>
  );
};

export default Homepage;