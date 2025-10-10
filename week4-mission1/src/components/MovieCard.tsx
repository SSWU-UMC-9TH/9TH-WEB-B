import { useNavigate} from "react-router-dom";
import type { Movie } from "../types/movie";
import { useState } from "react";

interface MovieCardProps{
    movie: Movie;
}

export default function MovieCard({movie}:MovieCardProps){
    const [isHovered, setIsHovered] = useState(false);
    const navigate  = useNavigate();
    

    return (
    <div
    onClick={(): void | Promise<void> => navigate(`/movie/${movie.id}`)}
        className="relative rounded-xl shadow-lg overflow-hidden cursor-pointer w-45 transition-transform duraiton-300 hover:scale-105"
        onMouseEnter={():void => setIsHovered(true)}
        onMouseLeave={():void => setIsHovered(false)}
        
    >
        <img 
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        
        className=""   
        />

        {isHovered &&(
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent backdrop-blur-md flex flex-col justify-center items-center text-white p-4">
                <h2 className="text-lg font-bold text-center leading-snug">
                {movie.title || movie.name}
                </h2>
                <p className="text-sm text-grey-300 leading-relaxed mt-2 line-clamp-5">{movie.overview}</p>
            </div>
        )}
       
    </div>
    );
}