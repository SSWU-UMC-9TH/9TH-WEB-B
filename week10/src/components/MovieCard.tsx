import { useState } from "react";
import type { Movie } from "../types/movie";
import { MovieDetail } from "./MovieDetail";


interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const fallbackImageImage = "https://via.placeholder.com/640x480";

  return (
    <>
      <div
        className="cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all bg-white"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative h-80 overflow-hidden">
          <img
            src={movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : fallbackImageImage}
            alt={`${movie.title} 포스터`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 ease-in-out"
          />
          <div className="absolute top-2 right-2 rounded-md bg-black px-2 py-1 text-sm font-bold text-white">
            {movie.vote_average.toFixed(1)}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold mb-2 text-gray-800">{movie.title}</h3>
          <p className="text-sm text-gray-600">
            {movie.release_date} | {movie.original_language.toUpperCase()}
          </p>
          <p className="mt-2 text-gray-700 text-sm">
            {movie.overview.length > 100
              ? `${movie.overview.slice(0, 100)}...`
              : movie.overview}
          </p>
        </div>
        <MovieDetail movie={movie} isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
     
    </>
  );
}