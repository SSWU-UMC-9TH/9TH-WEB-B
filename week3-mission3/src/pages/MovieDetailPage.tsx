import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { Cast, Crew, MovieDetail } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";



const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [crew, setCrew] = useState<Crew[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_TMOB_KEY}`, 
            },
          }
        );
        setMovie(data);

        const creditsRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_TMOB_KEY}`,
            },
          }
        );
        setCast(creditsRes.data.cast);
        setCrew(creditsRes.data.crew);
      } catch (err) {
        setError("영화 상세 정보를 불러오는 데 실패했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetail();
    }
  }, [movieId]);

  if (isLoading) return <div className="flex justify-center items-center h-dvh">
      <LoadingSpinner />
    </div>;
  if (error) return <div>{error}</div>;
  if (!movie) return <div>영화 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="rounded-lg shadow-lg w-full md:w-1/3"
          />
          <div>
            <h1 className="text-3xl mb-5">{movie.title}</h1>
            <p className="text-sm">개봉일: <span>{movie.release_date}</span></p>
            <p className="text-sm">평점: <span>{movie.vote_average}</span></p>
            <p className="text-sm mb-7">상영 시간:<span> {movie.runtime}분</span>
            </p>
            <p className="italic text-sm mb-10 font-extralight ">{movie.overview}</p>
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">감독</h2>
          <ul className="mb-8">
            {crew
              .filter((member) => member.job === "Director")
              .map((director) => (
                <li key={director.id} className="mb-2">
                   {director.name}
                </li>
              ))}
          </ul>

          <h2 className="text-2xl font-bold mb-4">출연진</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {cast.slice(0, 8).map((actor) => (
              <div key={actor.id} className="text-center">
                {actor.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                    alt={actor.name}
                    className="rounded-lg mx-auto mb-2"
                  />
                ) : (
                  <div className="w-[200px] h-[300px] bg-gray-700 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <span className="text-gray-300">No Image</span>
                  </div>
                )}
                <p className="font-semibold">{actor.name}</p>
                <p className="text-sm text-gray-400">as {actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
