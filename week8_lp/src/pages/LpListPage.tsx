import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useGetLpList from '../hooks/queries/useGetLpList';
import LpCard from '../components/LpCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';

// 콜백 기반 useThrottle 훅 구현
function useThrottle(callback: () => void, delay: number = 3000) {
  const lastExecRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function throttledHandler() {
      const now = Date.now();
      if (now - lastExecRef.current >= delay) {
        lastExecRef.current = now;
        callback();
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          lastExecRef.current = Date.now();
          callback();
        }, delay - (now - lastExecRef.current));
      }
    }
    window.addEventListener('scroll', throttledHandler);
    return () => {
      window.removeEventListener('scroll', throttledHandler);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [callback, delay]);
}

function useThrottleOnce(callback: () => void, deps: any[] = []) {
  const calledRef = useRef(false);
  useEffect(() => {
    function handler() {
      if (!calledRef.current) {
        calledRef.current = true;
        callback();
      }
    }
    window.addEventListener('scroll', handler);
    return () => {
      window.removeEventListener('scroll', handler);
      calledRef.current = false;
    };
  }, deps);
  return calledRef;
}

const LpListPage = () => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'rating'>('latest');
  const searchQuery = searchParams.get('search') || '';

  // 기본 LP 목록 (react-query)
  const { data: lpData, isPending, isError, error, refetch } = useGetLpList({
    search: searchQuery,
    sortBy
  });

  // 추가 LP 목록 (무한스크롤)
  const [page, setPage] = useState(2); // 첫 페이지는 react-query에서 가져옴
  const [extraLpList, setExtraLpList] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isErrorMore, setIsErrorMore] = useState(false);
  const [canRequest, setCanRequest] = useState(true);

  // LP 추가 요청 함수
  const fetchMoreLP = async () => {
    if (isLoadingMore || !canRequest) return;
    setIsLoadingMore(true);
    setIsErrorMore(false);
    setCanRequest(false);
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_API_URL}/v1/lps?search=${searchQuery}&sortBy=${sortBy}&page=${page}&limit=10`);
      const data = await response.json();
      setExtraLpList(prev => [...prev, ...(data.data || [])]);
      setPage(prev => prev + 1);
    } catch (e) {
      setIsErrorMore(true);
    } finally {
      setIsLoadingMore(false);
      // 데이터가 로드된 후에만 다시 요청 가능
      setTimeout(() => setCanRequest(true), 3000);
    }
  };

  // 3초마다 한 번만 LP 추가 요청 (하단 도달 시)
  useThrottle(() => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 300 && !isLoadingMore && canRequest) {
      fetchMoreLP();
    }
  }, 3000);

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


