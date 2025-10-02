import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres: Array<{ id: number; name: string }> | null;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId?: string }>();  // URL 파라미터에서 movieId를 추출
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setIsPending(true);
  
      try {
        const { data } = await axios.get<MovieDetail>(
          `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`, // movieId를 사용한 영화 상세 정보 API
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );
        console.log("영화 상세 데이터:", data);
        setMovie(data);
      } catch (error) {
        console.error("API 요청 실패:", error);
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };
  
    fetchMovieDetail();
    const fetchCast = async () => {
      try {
        const { data } = await axios.get<{ cast: CastMember[] }>(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?language=`, // movieId를 사용한 출연진 정보 API
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );
        console.log("출연진 데이터:", data.cast);
        setCast(data.cast);
      } catch (error) {
        console.error("출연진 API 요청 실패:", error);
      }
    };
    fetchCast();
  }, [movieId]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="text-red-500 text-center mt-10 bg-black h-screen flex items-center justify-center">
        영화 정보를 불러오는 데 실패했습니다.
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">

      <div className="bg-black p-15">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-15 mt-20">
          <img
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            alt={movie.title}
            className="rounded-lg shadow-lg w-64 md:w-100"
          />

          <div className="flex-1">
            <h1 className="text-7xl font-bold mb-5 mt-50">{movie.title}</h1>
            <p className="text-gray-300 text-2xl font-base mb-8 mt-10">{movie.overview}</p>
            <p className="text-lg font-light text-gray-400">개봉일: {movie.release_date}</p>
            <p className="text-lg font-light text-gray-400">평점: {movie.vote_average} / 10</p>
            <p className="text-lg font-light text-gray-400 mb-2">장르: {movie.genres?.map((genre) => genre.name).join(", ")}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white my-6"></div>
      
      <div className="bg-black p-6 mt-5">
        <h2 className="text-3xl font-bold mb-15 ml-10">주요 출연진</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
          {cast.slice(0, 5).map((member) => (
            <div key={member.id} className="text-center">
              <img
                src={
                  member.profile_path
                    ? `https://image.tmdb.org/t/p/w200/${member.profile_path}`
                    : "https://via.placeholder.com/200x300?text=No+Image"
                }
                alt={member.name}
                className="rounded-lg shadow-lg mx-auto mb-2"
              />
              <p className="text-2xl text-gray-200 font-semibold mt-10">{member.name}</p>
              <p className="text-xl text-gray-400 text-sm">{member.character}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}