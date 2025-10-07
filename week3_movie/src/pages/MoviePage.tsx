import { Link, useParams } from 'react-router-dom';
import { useCustomFetch } from '../hooks/useCustomFetch';

type Movie = { id: number; title?: string; name?: string; poster_path?: string };
type TMDBList = { results: Movie[] };

const TMDB_TOKEN = import.meta.env.VITE_TMDB_KEY as string;

const normalizeCategory = (c?: string) => {
  if (!c) return 'popular';
  if (c === 'nowplaying') return 'now_playing';
  if (c === 'toprated') return 'top_rated';
  return c; // upcoming, popular 등
};

export default function MovieListPage() {
  const { category } = useParams<{ category: string }>();
  const apiCategory = normalizeCategory(category);

  const { data, loading, error } = useCustomFetch<TMDBList>(
    `https://api.themoviedb.org/3/movie/${apiCategory}?language=ko-KR&page=1`,
    { headers: { Authorization: `Bearer ${TMDB_TOKEN}` } },
    [apiCategory]
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-dvh">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-gray-300 border-t-transparent" />
      </div>
    );

  if (error)
    return <div className="text-red-500 text-2xl p-6">{error}</div>;

  const items = Array.isArray(data?.results) ? data!.results : [];

  return (
    <div className="p-6 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map(m => (
        <Link key={m.id} to={`/movies/${category}/${m.id}`}>
          <div className="rounded shadow p-2 hover:scale-[1.01] transition">
            {m.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                alt={m.title || m.name || 'poster'}
                className="w-full h-[450px] object-cover rounded"
              />
            ) : (
              <div className="h-[450px] bg-gray-200 rounded" />
            )}
            <div className="mt-2 text-sm font-semibold line-clamp-2">
              {m.title ?? m.name ?? '제목 없음'}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
