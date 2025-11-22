import { useState, useEffect } from "react";
import { useGetInfiniteLpList } from "../hooks/queries/useGetinfiniteLPList";
import { PAGINATION_ORDER } from "../enums/common";
import { useInView } from "react-intersection-observer";
import { LpCard } from "../components/LpCard/LpCard";
import { useNavigate } from "react-router-dom";
import { LpCreateModal } from "../components/LpCreateModal/LpCreateModal";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const {
    data: lps,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useGetInfiniteLpList(10, search, order);

  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  return (
    <div className="container mx-auto bg-black min-h-screen px-4 py-6">
      {/* 정렬 버튼 */}
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

      {/* LP 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {lps?.pages
          ?.map((page) => page.data.data)
          .flat()
          .map((lp) => (
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
        className="fixed bottom-6 right-6 w-14 h-14 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-10 group"
        aria-label="LP 생성"
      >
        <svg 
          className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 4v16m8-8H4" 
          />
        </svg>
      </button>

      {/* LP 생성 모달 */}
      <LpCreateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* 무한 스크롤 트리거 */}
      <div ref={ref} className="h-10"></div>
    </div>
  );
};

export default HomePage;

