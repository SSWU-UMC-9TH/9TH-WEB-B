import type { Dispatch, SetStateAction } from "react";
import type { Movie } from "../types/movie";

interface MovieDetailProps {
  movie: Movie;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const MovieDetail = ({ movie, isOpen, setIsOpen }: MovieDetailProps) => {
  if (!isOpen) return null; 

  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const fallbackImage = "https://via.placeholder.com/640x480";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => setIsOpen(false)} 
    >
      <div
        className="bg-white rounded-lg overflow-hidden w-full max-w-2xl relative shadow-lg"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="relative h-64 w-full overflow-hidden">
          <img
            src={
              movie.backdrop_path
                ? `${imageBaseUrl}${movie.backdrop_path}`
                : fallbackImage
            }
            alt={`${movie.title} 배경`}
            className="w-full h-full object-cover"
          />
          {/* 닫기 버튼 */}
          <button
            onClick={() => setIsOpen(false)}
            className="cursor-pointer absolute top-2 right-2 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-2">
          <h2 className="text-2xl font-bold">{movie.title}</h2>
          <p className="text-gray-500 text-sm italic">{movie.original_title}</p>
          <p className="text-sm text-gray-600">
            개봉일: {movie.release_date} | 언어: {movie.original_language.toUpperCase()}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 font-bold">{movie.vote_average.toFixed(1)}</span>
            <span className="text-xs text-gray-500">({movie.vote_count} 평가)</span>
          </div>
          <p className="text-gray-700 text-sm mt-2">{movie.overview}</p>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setIsOpen(false)}
              className="cursor-pointer bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};