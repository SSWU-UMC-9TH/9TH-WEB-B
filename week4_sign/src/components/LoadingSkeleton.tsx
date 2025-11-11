import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 1, className = '' }) => {
  const skeletonItems = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`${className} overflow-hidden`}
      style={{
        backgroundColor: '#0f0f0f',
        borderRadius: '16px',
        border: '2px solid transparent',
        width: '100%',
        display: 'flex',
        flexDirection: 'column' as const
      }}
    >
      {/* 이미지 영역 */}
      <div
        className="animate-pulse aspect-square"
        style={{
          width: '100%',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px'
        }}
      />
      
      {/* 제목 영역 */}
      <div
        className="animate-pulse"
        style={{
          width: '80%',
          height: '18px',
          backgroundColor: '#444444',
          borderRadius: '4px'
        }}
      />
      
      {/* 작성자 영역 */}
      <div
        className="animate-pulse"
        style={{
          width: '60%',
          height: '14px',
          backgroundColor: '#444444',
          borderRadius: '4px'
        }}
      />
      
      {/* 하단 정보 영역 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: 'auto' 
      }}>
        <div
          className="animate-pulse"
          style={{
            width: '40%',
            height: '12px',
            backgroundColor: '#444444',
            borderRadius: '4px'
          }}
        />
        <div
          className="animate-pulse"
          style={{
            width: '30%',
            height: '12px',
            backgroundColor: '#444444',
            borderRadius: '4px'
          }}
        />
      </div>
      
      {/* 메타 정보 영역 */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div
          style={{
            width: '24px',
            height: '24px',
            backgroundColor: '#374151',
            borderRadius: '50%'
          }}
        />
        <div
          style={{
            width: '60px',
            height: '12px',
            backgroundColor: '#374151',
            borderRadius: '4px'
          }}
        />
      </div>
    </div>
  ));

  if (count === 1) {
    return skeletonItems[0];
  }

  return <>{skeletonItems}</>;
};

export default LoadingSkeleton;

