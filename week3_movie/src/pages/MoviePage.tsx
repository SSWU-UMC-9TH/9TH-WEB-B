import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Movie } from '../types/movie'; // 경로 수정
import { useParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function MoviePage() {
    const [movies, setMovies] = useState<Movie[]>([]);

    const [isPending, setIsPending] = useState(false);
    const [isError, setError] = useState(false);
    const [page, setPage] = useState(1);
    const { category } = useParams<{ category?: string }>();
    const movieCategory = category || 'popular';

    useEffect(() => {
        const fetchMovie = async () => {
            setIsPending(true);
            try {
                const { data } = await axios(`https://api.themoviedb.org/3/movie/${movieCategory}?language=ko-US&page=${page}`, {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                    },
                });
                setMovies(data.results);
                setIsPending(false);
            } catch {
                setError(true);
            } finally {
                setIsPending(false);
            }
        };
        fetchMovie();
    }, [page, category]);
   
    if (isError) {
        return (
            <div>
                <span className='text-red-500 text-2xl'>에러가 발생했습니다.</span>
            </div>
        );
    }

    return (
        <>
            <div className='flex items-center justify-center gap-6 mt-5'>
                <button className='[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
                hover: bg-[#b2da1] transition-all duration-200 disabled:bg-gray-300
                cursor-pointer disabled:sursor-not-allowed'
                onClick={() => setPage((prev) => prev - 1)}>{'<'}</button>
                <span>{page}페이지</span>
                <button 
className='bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
                hover: bg-[#b2da1] transition-all duration-200 disabled:bg-gray-300
                cursor-pointer curcor-pointer'
                onClick={() :void => setPage((prev): number => prev +1)}>{'>'}</button>
                
            </div>
            {isPending && (
                <div className='flex items-center justify-center h-dvh'>
                    <LoadingSpinner />
                </div>
            )}

            <div className='p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
                {movies &&
                    movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
            </div>

            {!isPending && <div className='p-10 grid gap-4 grid-cols-2 sm:grid-cols-3
            md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>}
        </>
    ); 
}