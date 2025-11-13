import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useGetLpList from '../hooks/queries/useGetLpList';
import LpCard from '../components/LpCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

import ErrorMessage from '../components/ErrorMessage';

const LpListPage = () => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'rating'>('latest');
  const searchQuery = searchParams.get('search') || '';

  const { data: lpData, isPending, isError, error, refetch } = useGetLpList({
    search: searchQuery,
    sortBy
  });

  // 디버깅을 위한 콘솔 로그
  console.log('LpListPage - 현재 상태:', {
    lpData,
    isPending,
    isError,
    error,
    searchQuery,
    sortBy,
    dataLength: lpData?.length
  });

  if (isPending) {
    return (
      <div style={{ padding: '20px' }}>
        <LoadingSkeleton count={12} />
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: '20px' }}>
        <ErrorMessage 
          message="LP 목록을 불러오는 중 오류가 발생했습니다."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 80 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', margin: 0 }}>
          {searchQuery ? `"${searchQuery}" 검색결과` : 'LP 목록'}
        </h1>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setSortBy('latest')}
            style={{
              padding: '8px 16px',
              backgroundColor: sortBy === 'latest' ? '#ec4899' : 'transparent',
              border: '1px solid #ec4899',
              borderRadius: '6px',
              color: sortBy === 'latest' ? 'white' : '#ec4899',
              cursor: 'pointer'
            }}
          >
            최신순
          </button>
          <button
            onClick={() => setSortBy('popular')}
            style={{
              padding: '8px 16px',
              backgroundColor: sortBy === 'popular' ? '#ec4899' : 'transparent',
              border: '1px solid #ec4899',
              borderRadius: '6px',
              color: sortBy === 'popular' ? 'white' : '#ec4899',
              cursor: 'pointer'
            }}
          >
            오래된순
          </button>
        </div>
      </div>

      {lpData && lpData.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {lpData.map((lp: any) => (
            <LpCard key={lp.id} lp={lp} />
          ))}
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '40px',
          color: 'white'
        }}>
          <p style={{ fontSize: '18px', marginBottom: '16px' }}>
            {searchQuery ? '검색 결과가 없습니다.' : 'LP가 없습니다.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default LpListPage;


