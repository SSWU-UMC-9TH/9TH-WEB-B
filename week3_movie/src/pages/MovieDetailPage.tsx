// MovieDetailPage.tsx (요청 취소 + 에러 메시지 개선 + setIsPending 정리)
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  release_date?: string;
  runtime?: number;
  vote_average?: number;
  backdrop_path?: string;
  poster_path?: string;
  genres?: { id: number; name: string }[];
};

type Credits = {
  cast: Array<{
    id: number;
    name: string;
    character?: string;
    profile_path?: string;
  }>;
  crew: Array<{
    id: number;
    name: string;
    job?: string;
    profile_path?: string;
  }>;
};

const IMG = {
  poster: (p?: string, size: 'w300' | 'w500' = 'w500') =>
    p ? `https://image.tmdb.org/t/p/${size}${p}` : '',
  backdrop: (p?: string) =>
    p ? `https://image.tmdb.org/t/p/original${p}` : '',
  profile: (p?: string) =>
    p ? `https://image.tmdb.org/t/p/w185${p}` : '',
};

const TMDB_TOKEN = import.meta.env.VITE_TMDB_KEY as string;

export default function MovieDetailPage() {
  const { id, category } = useParams<{ id: string; category: string }>();
  const [detail, setDetail] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    const fetchAll = async () => {
      setIsPending(true);
      setError(null);
      try {
        const headers = { Authorization: `Bearer ${TMDB_TOKEN}` };

        const [dRes, cRes] = await Promise.all([
          axios.get<MovieDetails>(
            `https://api.themoviedb.org/3/movie/${id}?language=ko-KR`,
            { headers, signal: controller.signal } 
          ),
          axios.get<Credits>(
            `https://api.themoviedb.org/3/movie/${id}/credits?language=ko-KR`,
            { headers, signal: controller.signal } 
          ),
        ]);

        setDetail(dRes.data);
        setCredits(cRes.data);
      } catch (e) {
        if (axios.isCancel(e)) return; 
        const ae = e as AxiosError<any>;
        const status = ae.response?.status;
        const msg =
          (ae.response?.data && (ae.response.data.status_message || ae.message)) ||
          ae.message ||
          '에러가 발생했습니다.';
        setError(status ? `HTTP ${status} · ${msg}` : msg); 
      } finally {
        setIsPending(false); 
      }
    };

    fetchAll();
    return () => controller.abort();
  }, [id]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-gray-300 border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500 text-2xl p-6">{isError}</div>;
  }

  if (!detail) return null;

  const directors = (credits?.crew ?? []).filter(p => p.job === 'Director');
  const cast = (credits?.cast ?? []).slice(0, 12);

  const minutesToHMM = (m?: number) => {
    if (!m && m !== 0) return '';
    const h = Math.floor(m / 60);
    const mm = `${m % 60}`.padStart(2, '0');
    return `${h}시간 ${mm}분`;
  };

  return (
    <div className="text-white">
      
      <div className="relative h-[340px] md:h-[420px] lg:h-[520px] overflow-hidden rounded-xl mx-4 md:mx-6 lg:mx-10 mt-4">
        {detail.backdrop_path && (
          <img
            src={IMG.backdrop(detail.backdrop_path)}
            alt={detail.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/40" />
        <div className="relative h-full p-6 md:p-10 flex flex-col justify-end gap-2">
          <h1 className="text-2xl md:text-4xl font-extrabold">{detail.title}</h1>
          <div className="text-sm md:text-base text-gray-200 flex gap-3">
            {detail.vote_average ? <>평균 {detail.vote_average.toFixed(1)}</> : null}
            {detail.release_date ? <>· {detail.release_date.slice(0, 4)}</> : null}
            {detail.runtime ? <>· {minutesToHMM(detail.runtime)}</> : null}
          </div>
          {detail.overview ? (
            <p className="max-w-3xl text-gray-100 mt-2 leading-relaxed">
              {detail.overview}
            </p>
          ) : null}
          {detail.genres && detail.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {detail.genres.map(g => (
                <span key={g.id} className="text-xs bg-white/15 px-2 py-1 rounded-full">
                  {g.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      
      <div className="mx-4 md:mx-6 lg:mx-10 my-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4">감독/출연</h2>

        {directors.length > 0 && (
          <div className="mb-4 flex gap-4 overflow-x-auto pb-2">
            {directors.map(d => (
              <div key={d.id} className="flex-shrink-0 w-28 text-center">
                <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-700 mx-auto">
                  {d.profile_path ? (
                    <img
                      src={IMG.profile(d.profile_path)}
                      alt={d.name}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="mt-2 text-sm font-semibold">{d.name}</div>
                <div className="text-xs text-gray-300">Director</div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {cast.map(p => (
            <div key={p.id} className="text-center">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-700">
                {p.profile_path ? (
                  <img
                    src={IMG.profile(p.profile_path)}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
              <div className="mt-2 text-sm font-semibold line-clamp-2">{p.name}</div>
              {p.character && (
                <div className="text-xs text-gray-300 line-clamp-1">{p.character}</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link to={`/movies/${category}`} className="text-sm text-[#b2dab1] hover:underline">
            ← 목록으로
          </Link>
        </div>
      </div>
    </div>
  );
}
