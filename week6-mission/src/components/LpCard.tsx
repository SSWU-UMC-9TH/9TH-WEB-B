import { useState } from "react";
import LpCardSkeleton from "./LpCardSkeleton";

interface LpCardProps {
  lp: {
    id: number;
    title: string;
    thumbnail: string;
    createdAt: string;
    likes: { id: number }[];
  };
  onClick: () => void;
}

const LpCard = ({ lp, onClick }: LpCardProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      onClick={onClick}
      className="
        relative group cursor-pointer
        overflow-hidden rounded-md
        hover:scale-105 transition-transform duration-300
      "
    >
      {/* 🔥 이미지 로딩 전까지 스켈레톤 유지 */}
      {!loaded && <LpCardSkeleton />}

      <div className={`w-full aspect-square overflow-hidden ${!loaded ? "hidden" : ""}`}>
        <img
          src={lp.thumbnail}
          className="w-full h-full object-cover"
          onLoad={() => setLoaded(true)} // ⭐ 이미지 로드 완료 시 스켈레톤 제거
          alt={lp.title}
        />
      </div>

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
  );
};

export default LpCard;