import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { CreditProfile } from "../components/CreditProfile";
import type { Credits, Movie } from "../types/movie";
import useCustomFetch from "../hooks/useCustomFetch";

const MovieDetailPage = () => {
    const params = useParams();
    console.log('params',params);
    console.log('params.movieId',params.movieId);

    // 영화 상세 정보 불러오기
    const movieUrl = `https://api.themoviedb.org/3/movie/${params.movieId}?language=ko`;
    const {data: movie, isPending: isMoviePending, isError: isMovieError} = useCustomFetch<Movie>(movieUrl);
    console.log('movie', movie);

    // 영화 감독 및 출연진 정보 불러오기
    const creditUrl = `https://api.themoviedb.org/3/movie/${params.movieId}/credits`;
    const {data: credits, isPending: isCreditsPending, isError: isCreditsError} = useCustomFetch<Credits>(creditUrl);
    console.log('credits', credits);

    if (isMovieError || isCreditsError) {
        return (
            <div>
                <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
            </div>
        )
    }
    
    return (
        <>
            {(isMoviePending || isCreditsPending) && (
                <div className="flex items-center justify-center h-dvh">
                    <LoadingSpinner />
                </div>
            )}
            {(!isMoviePending && !isCreditsPending && movie && credits) && (
                <div className="bg-black p-[10px]">
                    <div className="w-full h-110 relative">
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} 
                            alt={`${movie.title} 영화의 이미지`} 
                            className="w-full h-110 object-cover rounded-lg"
                        />
                        <div className="absolute top-0 text-white p-[10px]">
                            <h1 className="text-[30px] font-bold">{movie.title}</h1>
                            <div className="text-[18px] mt-[15px] mb-[15px]">
                                <p className="">평균 {movie.vote_average}</p>
                                <p>{movie.release_date.split('-')[0]}</p>
                                <p>{movie.runtime}분</p>
                            </div>
                            <h2 className="text-[25px] italic">{movie.tagline}</h2>
                            <h3 className="max-w-150 mt-[15px]">{movie.overview}</h3>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-[30px] font-bold mt-[15px] text-white">감독/출연</h1>
                        <div className="p-10 grid gap-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
                            <CreditProfile credits={credits.cast}/>
                            <CreditProfile credits={credits.crew}/>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default MovieDetailPage;
