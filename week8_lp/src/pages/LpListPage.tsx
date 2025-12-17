import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useThrottle } from '../hooks/useThrottle';
import { useSearchParams } from 'react-router-dom';
import useGetLpList from '../hooks/queries/useGetLpList';
import LpCard from '../components/LpCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';

const LpListPage = () => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'rating'>('latest');
  const searchQuery = searchParams.get('search') || '';
  const { data: lpData, isPending, isError, error, refetch } = useGetLpList({ search: searchQuery, sortBy });
  const [page, setPage] = useState(2);
  const [extraLpList, setExtraLpList] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isErrorMore, setIsErrorMore] = useState(false);
  const [canRequest, setCanRequest] = useState(true);

  // LP 추가 요청 함수
  const fetchMoreLP = async () => {
    // 요청 중이거나, 이전 요청이 아직 끝나지 않았으면 추가 요청 금지
    if (!canRequest || isLoadingMore) return;
    setCanRequest(false); // 요청 시작 시 바로 막음
    setIsLoadingMore(true);
    setIsErrorMore(false);
    try {
      console.log('API 호출', new Date().toISOString());
      console.trace();
      const response = await fetch(`${import.meta.env.VITE_SERVER_API_URL}/v1/lps?search=${searchQuery}&sortBy=${sortBy}&page=${page}&limit=10`);
      const data = await response.json();
      setExtraLpList(prev => [...prev, ...(data.data || [])]);
      setPage(prev => prev + 1);
    } catch (e) {
      setIsErrorMore(true);
    } finally {
      setIsLoadingMore(false);
      // 요청이 완전히 끝난 후에만 다시 요청 허용
      setTimeout(() => {
        setCanRequest(true);
      }, 1000); // 1초간 추가 요청 금지 (원하는 만큼 조정 가능)
    }
  };

  // useThrottle로 throttle 인스턴스 고정
  const throttledFetchMoreLP = useThrottle(fetchMoreLP, 3000);

  useEffect(() => {
    const handleScroll = () => {
      // 요청 중이거나, 이전 요청이 아직 끝나지 않았으면 추가 요청 금지
      if (!canRequest || isLoadingMore) return;
      if (
        (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 300
      ) {
        throttledFetchMoreLP();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [throttledFetchMoreLP, canRequest, isLoadingMore]);

  // 전체 LP 목록 합치기
  const allLpList = [...(lpData || []), ...extraLpList];

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

      {allLpList && allLpList.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {allLpList.map((lp: any) => (
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
      {isLoadingMore && <LoadingSkeleton count={3} />}
      {isErrorMore && (
        <ErrorMessage 
          message="추가 LP를 불러오는 중 오류가 발생했습니다."
          onRetry={fetchMoreLP}
        />
      )}
    </div>
  );
};

export default LpListPage;


