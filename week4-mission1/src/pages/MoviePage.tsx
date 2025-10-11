import { useState } from "react"
import { type MovieResponse} from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import { useCustomFetch } from "../hook/useCustomFetch";
useCustomFetch


export default function MoviePage() {
    
    //4. 현재 페이지 번호
    const [page, setPage] = useState(1);
    // React Router를 통해 URL에 포함된 category 값을 추출
    const { category } = useParams<{ category: string }>();

    const { data, loading, error}  = useCustomFetch<MovieResponse>(
    `/movie/${category}?language=en-US&page=${page}`
  );
            if (error) {
            return (
            <div>
                <span className="text-red-500 text-2xl">
                에러가 발생했습니다: {error}
                </span>
            </div>
            );
        }

        // 로딩 처리
        if (loading) {
            return (
            <div className="flex items-center justify-center h-dvh">
                <LoadingSpinner />
            </div>
            );
        }

        // 데이터가 없을 경우
        if (!data) {
            return <div>데이터가 없습니다.</div>;
        }

    

    return (
  <>
    {/* 페이지네이션 버튼 */}
    <div className="flex items-center justify-center gap-6 mt-5">
      <button
        className="bg-[#000000] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#333333] transition-all duration-200 disabled:bg-grey-300 cursor-pointer disabled:cursor-not-allowed"
        disabled={page === 1}
        onClick={() => setPage((prev) => prev - 1)}
      >
        {'<'}
      </button>
      <span>{page} 페이지 </span>
      <button
        className="bg-[#000000] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#333333] transition-all duration-200 disabled:bg-grey-300 cursor-pointer"
        onClick={() => setPage((prev) => prev + 1)}
      >
        {'>'}
      </button>
            </div>

    
    <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {data.results.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  </>
);
    }