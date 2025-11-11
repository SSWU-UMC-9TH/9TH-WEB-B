import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  return (
    <div 
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        padding: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 15px 30px rgba(236, 72, 153, 0.2)' 
          : '0 4px 12px rgba(0, 0, 0, 0.3)',
        border: isHovered 
          ? '1px solid rgba(236, 72, 153, 0.3)' 
          : '1px solid transparent',
        width: '100%',
        aspectRatio: '3/4'
      }}
    >
      {/* LP 이미지 */}
      <div style={{
        width: '100%',
        height: '150px',
        backgroundColor: '#333333',
        borderRadius: '8px',
        marginBottom: '12px',
        backgroundImage: lp.thumbnail ? `url(${lp.thumbnail})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {!lp.thumbnail && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#666',
            fontSize: '40px'
          }}>
            🎵
          </div>
        )}
        
        {/* 호버시 플레이 버튼 오버레이 */}
        {isHovered && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#ec4899',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px'
            }}>
              ▶
            </div>
          </div>
        )}
      </div>
      
      {/* LP 정보 */}
      <h3 style={{
        color: 'white',
        fontSize: '18px',
        fontWeight: '600',
        margin: '0 0 8px 0',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {lp.title}
      </h3>
      
      <p style={{
        color: '#999',
        fontSize: '14px',
        margin: '0 0 12px 0',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {lp.author?.nickname || '알 수 없음'}
      </p>
      
      {/* 작성일 및 좋아요 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{
          color: '#ec4899',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {new Date(lp.createdAt).toLocaleDateString()}
        </span>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ color: '#ec4899', fontSize: '16px' }}>❤️</span>
          <span style={{ color: '#ccc', fontSize: '14px' }}>
            {lp.likes?.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LpCard;


