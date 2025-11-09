import { useNavigate } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";

const Homepage = () => {
  const navigate = useNavigate();
  const { data, isPending } = useGetLpList({});

  if (isPending) return <div className="mt-20 text-center">Loading...</div>;

  return (
    <div className="mt-20 px-10">
      <div
        className="
          grid 
          grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6
          gap-3
        "
      >
        {data?.data.map((lp) => (
          <div
            key={lp.id}
            onClick={() => navigate(`/lp/${lp.id}`)} // ✅ 라우팅 연결
            className="
              relative group cursor-pointer
              overflow-hidden rounded-md
              hover:scale-105 transition-transform duration-300
            "
          >
            {/* 썸네일 이미지 */}
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="w-full h-40 object-cover"
            />

            {/* Hover 오버레이 */}
            <div
              className="
                absolute inset-0 bg-black/60 opacity-0 
                group-hover:opacity-100 transition-opacity duration-300 
                flex flex-col justify-end p-3 text-white
              "
            >
              <p className="text-sm font-semibold line-clamp-2">{lp.title}</p>
              <p className="text-xs text-gray-300">
                {new Date(lp.createdAt).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-300">❤️ {lp.likes.length}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;