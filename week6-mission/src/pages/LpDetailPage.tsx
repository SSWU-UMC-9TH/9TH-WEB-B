import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { QUERY_KEYS } from "../constants/key";
import { useNavigate } from "react-router-dom";

const getLpDetail = async (lpid: string) => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_SERVER_API_URL}/v1/lps/${lpid}`
  );
  return data;
};

const LpDetailPage = () => {
  const navigate = useNavigate();   // ⭐ 올바른 위치로 이동

  const { lpid } = useParams<{ lpid: string }>();

  const {
    data,
    isPending,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEYS.lps, lpid],
    queryFn: () => getLpDetail(lpid as string),
    enabled: !!lpid,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    select: (res) => res.data,
  });

  if (isPending)
    return <div className="mt-20 text-center text-white">Loading...</div>;
  if (isError || !data)
    return <div className="mt-20 text-center text-white">Error</div>;

  const lp = data;

  return (
    <div className="mt-20 max-w-4xl mx-auto px-6">
      <div className="bg-gray-900 rounded-lg p-8 shadow-lg text-white">
        {/* 상단: 제목 + 작성자 + 날짜 + 버튼 */}
        <header className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{lp.title}</h1>
            <p className="text-sm text-gray-400">
              업로드일: {new Date(lp.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-4 text-gray-300 flex-row whitespace-nowrap">
            <button className="hover:text-blue-400 transition">수정</button>
            <button className="hover:text-blue-500 transition">삭제</button>

            <button
              onClick={() => navigate(`/lps/${lp.id}/comments`)}
              className="hover:text-blue-400 transition"
            >
              댓글보기
            </button>
          </div>
        </header>

        <div className="mb-6 flex justify-center">
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="w-80 h-80 object-cover rounded-full shadow-md"
          />
        </div>

        <article className="whitespace-pre-wrap text-gray-300 leading-relaxed border-t border-gray-700 pt-6">
          {lp.content}
        </article>

        <div className="flex justify-center mt-6">
          <button className="flex items-center gap-1 hover:text-blue-500 transition">
            <span className="text-3xl">❤️</span> <span>{lp.likes.length}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LpDetailPage;