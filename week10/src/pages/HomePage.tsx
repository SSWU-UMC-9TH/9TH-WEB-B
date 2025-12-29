import { useCallback, useMemo, useState } from "react";
import { MovieFilter } from "../components/MovieFilter";
import { MovieList } from "../components/MovieList";
import useFetch from "../hooks/useFetch"
import type { MovieFilters, MovieResponse } from "../types/movie";

export const HomePage = () => {
    const [filters, setFilters] = useState<MovieFilters>({
        query: "어벤져스",
        include_adult:false,
        language: "ko-KR",
    });

     const axiosRequestConfig = useMemo((): { params: MovieFilters } => ({
        params: filters, // params 속성에 filters 객체 할당 - 의존성 배열 잘 적어줘야 함!
    }),
        [filters],
    );
    // useMemo를 사용하여 axiosRequestConfig 객체가 filters가 변경될 때만 새로 생성되도록 최적화 => 원래 참조하면 계속 렌더링 되는데 참조가 같은 경우에는 불필요한 렌더링 막아줌

    const {data, error, isLoading} = useFetch<MovieResponse>("/search/movie", axiosRequestConfig,);

    const handleMovieFilters = useCallback((filters: MovieFilters) => {
        setFilters(filters);
    },[setFilters]); //useCallback을 사용하여 handleMovieFilters 함수가 setFilters가 변경될 때만 새로 생성되도록 최적화 - 여기 있다고만 해서 되는게 아니라 불필요한 렌더링 막고 싶은, 즉 이 home과는 관련이 없는 페이지에 memo로 감싸서 묶어줘야 함!

    if (error) {
        return <div>{error}</div>
    }
  return (
    <div className="container mx-auto p-4">
        <MovieFilter onChange={handleMovieFilters}/>
        {isLoading ? (
            <div>로딩 중 입니다..</div>
        ) : (
            <MovieList movies={data?.results || []}/>
        )}
        
    </div>
  )
}