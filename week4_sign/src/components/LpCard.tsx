import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiHeart, FiPlay, FiUser } from 'react-icons/fi';
import { LpData } from '../types/lp';

interface LpCardProps {
  lp: LpData;
}

const LpCard: React.FC<LpCardProps> = ({ lp }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    navigate(`/lp/${lp.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div 
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative cursor-pointer transition-all duration-300 ease-out"
      style={{
        backgroundColor: '#0f0f0f',
        borderRadius: '16px',
        padding: '0',
        border: isHovered 
          ? '2px solid #ec4899' 
          : '2px solid transparent',
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered 
          ? '0 25px 50px rgba(236, 72, 153, 0.25), 0 0 0 1px rgba(236, 72, 153, 0.1)' 
          : '0 8px 25px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden'
      }}
    >
      {/* LP 이미지 */}
      <div className="relative aspect-square bg-gray-800 overflow-hidden">
        {lp.thumbnail ? (
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out"
            style={{
              transform: isHovered ? 'scale(1.1)' : 'scale(1)'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <span className="text-gray-500 text-3xl">🎵</span>
          </div>
        )}
        {/* Hover 시 정보 오버레이 */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center px-4 z-10 transition-all duration-300">
            <h3 className="text-white font-bold text-xl md:text-2xl mb-2 line-clamp-2">{lp.title}</h3>
            <div className="flex items-center justify-center gap-2 mb-2">
              <FiCalendar size={16} className="text-pink-500" />
              <span className="text-gray-200 text-base md:text-lg">{formatDate(lp.createdAt)}</span>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <FiUser size={16} className="text-pink-500" />
              <span className="text-gray-300 text-base md:text-lg">{lp.author?.nickname || '알 수 없음'}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <FiHeart size={16} className="text-pink-500" />
              <span className="text-gray-200 text-base md:text-lg">{lp.likes?.length || 0}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* LP 정보 (기본 상태) */}
      <div 
        className="p-4 transition-all duration-300"
        style={{
          opacity: isHovered ? 0.7 : 1,
          transform: isHovered ? 'translateY(-5px)' : 'translateY(0)'
        }}
      >
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 leading-tight">
          {lp.title}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <FiUser size={14} className="text-pink-500 flex-shrink-0" />
          <span className="text-gray-400 text-sm truncate">
            {lp.author?.nickname || '알 수 없음'}
          </span>
        </div>
        
        {/* 작성일 및 좋아요 (간소화된 버전) */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FiCalendar size={12} className="text-pink-500" />
            <span className="text-gray-500 text-xs">
              {formatDate(lp.createdAt)}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <FiHeart size={12} className="text-pink-500" />
            <span className="text-gray-500 text-xs">
              {lp.likes?.length || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LpCard;


