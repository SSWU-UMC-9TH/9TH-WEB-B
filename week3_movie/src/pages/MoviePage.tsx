import axios from "axios";
import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { Movie, MovieResponse } from "../types/movie";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]); // movies라는 상태를 만들어서 영화 데이터 배열을 저장
  const [isPending, setIsPending] = useState(false); // isPending: 로딩 상태를 관리
  const [isError, setIsError] = useState(false); // isError: 에러 상태를 관리
  const [page, setPage] = useState(1); // page: 페이지네이션을 위한 현재 페이지 번호 관리

  const { category } = useParams<{ category: string }>();

  // 카테고리가 변경될 때 페이지를 1로 초기화
  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsPending(true); // 로딩 시작
  
      try {
        const { data } = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );
        console.log("API 응답 데이터:", data);
        setMovies(data.results); // useEffect 안에서 API 호출을 통해 받아온 영화 데이터를 setMovies(data.results)로 상태에 저장
        setIsError(false); // 성공 시 에러 상태 초기화(=> 사용자가 페이지를 변경하거나 카테고리를 변경했을 때, 이전에 발생했던 에러가 해결되어도 에러 메시지가 계속 표시되는 문제를 방지할 수 있음)
      } catch (error) {
        console.error("API 요청 실패:", error);
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };
  
    fetchMovies();
  }, [category, page]); // page가 의존성 배열에 포함됨 => 페이지가 변경될 때마다 useEffect 재호출(새로운 API 호출 실행) => 새로운 데이터를 가져와서 화면에 표시

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