import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import profile from '../assets/profile.png';
import type { Credits, Movie } from "../movie";

const MovieDetailPage = () => {
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);
    const [movie, setMovie] = useState<Movie>();
    const [credits, setCredits] = useState<Credits>();
    const params = useParams();
    console.log(params);

    useEffect(() => {
        const fetchMovie = async () => {
            setIsPending(true);
            try {
                const { data } = await axios.get(
                    `https://api.themoviedb.org/3/movie/${params.movieId}?language=ko`,
                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
                        }
                    }
                );
                console.log('영화 정보', data);
                setMovie(data);
            } catch {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        }
        fetchMovie();
    }, [])

    useEffect(() => {
        const fetchCredits = async () => {
            setIsPending(true);
            try {
                const { data } = await axios.get(
                    `https://api.themoviedb.org/3/movie/${params.movieId}/credits`,
                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
                        }
                    }
                );
                console.log("감독/출연 정보", data);
                setCredits({
                    cast: data.cast, 
                    crew:data.crew,
                });
            } catch {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        }
        fetchCredits();
    }, [])
    

    if (isError) {
        return (
            <div>
                <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
            </div>
        )
    }
    
    return (
        <>
            {isPending && (
                <div className="flex items-center justify-center h-dvh">
                    <LoadingSpinner />
                </div>
            )}
            {(!isPending && movie && credits) && (
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
                            {credits.cast.map((credit) => (
                                <div className="flex flex-col items-center"> 
                                    <img 
                                        className="w-[100px] aspect-square object-cover rounded-full border-[2px] border-white text-white"
                                        src={credit.profile_path!=null ? `https://image.tmdb.org/t/p/original${credit.profile_path}` : profile}  
                                        alt={`${credit.original_name}의 프로필 사진`}
                                    />
                                    <h4 className="text-white font-bold text-center">{credit.original_name}</h4>
                                    <p className="text-gray-500 text-center">{credit.known_for_department}</p>
                                </div>
                            ))}
                            {credits.crew.map((credit) => (
                                <div className="flex flex-col items-center"> 
                                    <img 
                                        className="w-[100px] aspect-square object-cover rounded-full border-[2px] border-white text-white"
                                        src={credit.profile_path!=null ? `https://image.tmdb.org/t/p/original${credit.profile_path}` : profile}  
                                        alt={`${credit.original_name}의 프로필 사진`}
                                    />
                                    <h4 className="text-white font-bold text-center">{credit.original_name}</h4>
                                    <p className="text-gray-500 text-center">{credit.known_for_department}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default MovieDetailPage;
