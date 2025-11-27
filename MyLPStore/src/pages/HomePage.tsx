import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useGetInfiniteLpList } from "../hooks/queries/useGetinfiniteLPList";
import { PAGINATION_ORDER } from "../enums/common";
import { useInView } from "react-intersection-observer";
import { LpCard } from "../components/LpCard/LpCard";
import { useNavigate } from "react-router-dom";
import { LpCreateModal } from "../components/LpCreateModal/LpCreateModal";
import { FaSearch } from "react-icons/fa";
import { useThrottle } from "../hooks/useThrottle";

const HomePage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Debounce 적용
  const debouncedQuery = useDebounce(searchInput.trim(), 300);
  const isSearching = debouncedQuery.length > 0;

  // 전체 목록 (검색어 없을 때만 실행)
  const {
    data: allLps,
    fetchNextPage: fetchNextAll,
    hasNextPage: hasNextAll,
    isFetching: isFetchingAll,
  } = useGetInfiniteLpList(10, "", order, !isSearching);

  // 검색 목록 (검색어 있을 때만 실행)
  const {
    data: searchLps,
    fetchNextPage: fetchNextSearch,
    hasNextPage: hasNextSearch,
    isFetching: isFetchingSearch,
  } = useGetInfiniteLpList(10, debouncedQuery, order, isSearching);

  // 어떤 쿼리를 사용할지 결정
  const lps = isSearching ? searchLps : allLps;
  const hasNextPage = isSearching ? hasNextSearch : hasNextAll;
  const isFetching = isSearching ? isFetchingSearch : isFetchingAll;
  const fetchNextPage = isSearching ? fetchNextSearch : fetchNextAll;

  // fetchNextPage를 throttle로 감싸기 (500ms) - throttle 적용한 무한스크롤 => 500ms 동안 최대 1번만 fetchNextPage 실행됨
  const throttledFetchNext = useThrottle(() => {
    if (!isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, 500);

  // 무한스크롤
  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (inView) throttledFetchNext();
  }, [inView, throttledFetchNext]);

  // LP 목록 평탄화 - 여러 페이지의 LP 데이터를 한 번에 화면에 보여주기 위해 평탄화(flatten)
  const lpPages = lps?.pages?.flatMap((p) => p.data.data) ?? [];

  return (
    <div className="container mx-auto bg-black min-h-screen px-4 py-6">
      <div className="flex justify-between mb-4">
        {/* 검색바 */}
        <div className="relative w-80">
          <input
            type="text"
            className="w-full px-3 py-2 rounded-3xl border border-gray-400 
              focus:outline-none focus:border-pink-400 text-white"
            placeholder="검색어를 입력하세요"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-sm"
            aria-label="검색"
          >
            <FaSearch className="text-pink-300 hover:text-pink-400" />
          </button>
        </div>

        {/* 정렬 */}
        <div className="flex justify-end gap-2 mb-4">
          <button
            onClick={() => setOrder(PAGINATION_ORDER.asc)}
            className={`px-3 py-1 rounded-2xl border ${
              order === PAGINATION_ORDER.asc
                ? "bg-white text-black font-semibold text-sm"
                : "bg-gray-800 text-white text-sm"
            }`}
          >
            오래된순
          </button>
          <button
            onClick={() => setOrder(PAGINATION_ORDER.desc)}
            className={`px-3 py-1 rounded-2xl border ${
              order === PAGINATION_ORDER.desc
                ? "bg-white text-black font-semibold text-sm"
                : "bg-gray-800 text-white text-sm"
            }`}
          >
            최신순
          </button>
        </div>
      </div>

      {/* LP 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {lpPages.map((lp) => (
          <div
            key={lp.id}
            onClick={() => navigate(`/lp/${lp.id}`)}
            className="cursor-pointer shadow-md hover:bg-gray-700 hover:shadow-lg transition duration-300"
          >
            <LpCard lp={lp} />
          </div>
        ))}
      </div>

      {/* LP 생성 플로팅 버튼 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-pink-500 hover:bg-pink-600 text-white 
          rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center 
          justify-center z-10 group"
        aria-label="LP 생성"
      >
        <svg
          className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* LP 생성 모달 */}
      <LpCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* 무한 스크롤 트리거 */}
      <div ref={ref} className="h-[300px]"></div>
    </div>
  );
};

export default HomePage;
