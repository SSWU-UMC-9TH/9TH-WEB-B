import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import useCustomFetch from "../hooks/useCustomFetch";
import { MovieDetail, CastMember, CastResponse } from "../types/movie";

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId?: string }>();  // URL 파라미터에서 movieId를 추출

  // 영화 상세 정보와 출연진 정보를 동시에 가져오기
  const urls = movieId ? [
    `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
    `https://api.themoviedb.org/3/movie/${movieId}/credits?language=`
  ] : [];

  const { data, isPending, isError } = useCustomFetch<MovieDetail | CastResponse>(
    urls,
    { enabled: !!movieId }
  );

  // 타입 가드를 사용하여 데이터 분리
  const movie = Array.isArray(data) && data.length > 0 && 'title' in data[0] 
    ? data[0] as MovieDetail 
    : null;
  
  const cast = Array.isArray(data) && data.length > 1 && 'cast' in data[1] 
    ? (data[1] as CastResponse).cast 
    : [];

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
            <p className="text-lg font-light text-gray-400 mb-2">장르: {movie.genres?.map((genre: { id: number; name: string }) => genre.name).join(", ")}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white my-6"></div>
      
      <div className="bg-black p-6 mt-5">
        <h2 className="text-3xl font-bold mb-15 ml-10">주요 출연진</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
          {cast.slice(0, 5).map((member: CastMember) => (
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