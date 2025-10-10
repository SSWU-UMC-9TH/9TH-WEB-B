import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { Movie, MovieResponse } from "../types/movie";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import useCustomFetch from "../hooks/useCustomFetch";

export default function MoviePage() {
  const [page, setPage] = useState(1); // page: 페이지네이션을 위한 현재 페이지 번호 관리
  const { category } = useParams<{ category: string }>();

  // useCustomFetch 훅을 사용하여 영화 데이터 가져오기
  const { data: movieData, isPending, isError } = useCustomFetch<MovieResponse>(
    `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
    { dependencies: [category, page] }
  );

  // 타입 가드를 사용하여 안전하게 데이터 접근
  const movies: Movie[] = Array.isArray(movieData) 
    ? [] 
    : movieData?.results || [];

  // 카테고리가 변경될 때 페이지를 1로 초기화
  useEffect(() => {
    setPage(1);
  }, [category]);

  if (isError) {
    return (
      <div>
        <span className="text-red-500">
          영화 정보를 불러오는 데 실패했습니다.
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center gap-6 mb-7">
        <button
          className="bg-[black] text-white px-3 py-2 rounded-lg shadow-md hover:bg-[gray] transition-all duration-200 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          {"<"}
        </button>
        <span>{page} 페이지</span>
        <button
          className="bg-[black] text-white px-3 py-2 rounded-lg shadow-md hover:bg-[gray] transition-all duration-200 cursor-pointer"
          onClick={() => setPage((prev) => prev + 1)}
        >
          {">"}
        </button>
      </div>

      {isPending && (
        <div className="flex justify-center items-center h-dvh">
          <LoadingSpinner />
        </div>
      )}


      {!isPending && (
        <div className="p-3 pb-10 grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 place-items-center">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}