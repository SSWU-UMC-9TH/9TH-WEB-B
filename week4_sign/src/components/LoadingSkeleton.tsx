import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 1, className = '' }) => {
  const skeletonItems = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`animate-pulse bg-gray-800 rounded-lg ${className}`}
      style={{
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '12px',
        padding: '16px'
      }}
    >
      {/* 이미지 영역 */}
      <div
        style={{
          width: '100%',
          height: '120px',
          backgroundColor: '#374151',
          borderRadius: '8px'
        }}
      />
      
      {/* 제목 영역 */}
      <div
        style={{
          width: '80%',
          height: '16px',
          backgroundColor: '#374151',
          borderRadius: '4px'
        }}
      />
      
      {/* 내용 영역 */}
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
        <div
          style={{
            width: '100%',
            height: '12px',
            backgroundColor: '#374151',
            borderRadius: '4px'
          }}
        />
        <div
          style={{
            width: '60%',
            height: '12px',
            backgroundColor: '#374151',
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

