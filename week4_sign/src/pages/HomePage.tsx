import React, { useState, useEffect, useCallback } from 'react'
import useInfiniteLpList from '../hooks/queries/useInfiniteLpList';
import LpCard from '../components/LpCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

const HomePage = () => {
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'rating'>('latest');
    const {
        data: lps, 
        isPending, 
        isError, 
        error, 
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteLpList({ search, sortBy });
    
    // 안전한 데이터 처리
    const lpsList = Array.isArray(lps) ? lps : [];

    // 무한스크롤 트리거
    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + document.documentElement.scrollTop 
            >= document.documentElement.offsetHeight - 1000 // 1000px 전에 미리 로드
            && hasNextPage 
            && !isFetchingNextPage
        ) {
            console.log('🔄 무한스크롤 트리거: 다음 페이지 로딩...');
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const handleOrder = (newSortBy: 'latest' | 'popular' | 'rating') => {
        setSortBy(newSortBy);
    }

    // 로딩 상태 처리
    if (isPending) {
        return (
            <div className='container mx-auto px-4 py-6'>
                <LoadingSkeleton count={8} />
            </div>
        );
    }

    // 에러 상태 처리
    if (isError) {
        console.error('HomePage 에러:', error);
        return (
            <div className='container mx-auto px-4 py-6' style={{ marginTop: '80px' }}>
                <div className='text-center text-red-500 bg-red-900/20 p-6 rounded-lg'>
                    <h2 className='text-xl font-bold mb-2'>🚨 백엔드 연결 오류</h2>
                    <p className='mb-2'>백엔드 서버(localhost:8000)에 연결할 수 없습니다.</p>
                    <p className='mb-4'>백엔드 서버가 실행 중인지 확인해주세요.</p>
                    <button 
                        onClick={() => refetch()} 
                        className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
                    >
                        다시 시도
                    </button>
                    <p className='mt-4 text-sm text-gray-400'>
                        에러: {error?.message || '알 수 없는 오류'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='container mx-auto px-4 py-6' style={{ marginTop: '80px' }}>
            {/* 검색 섹션 */}
            <div className='mb-6'>
                <input 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="LP 검색..."
                    className='w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:border-pink-500 focus:outline-none'
                />
            </div>
            
            {/* 정렬 버튼 섹션 */}
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-white text-xl font-semibold'>LP 목록</h2>
                <div>
                    <button
                        onClick={() => handleOrder('latest')}
                        className={`border border-white rounded-l-[7px] px-[10px] py-[5px] cursor-pointer
                            ${sortBy==='latest' ? 'bg-white text-black' : 'bg-black text-white'}`}
                    >
                        최신순
                    </button>
                    <button
                        onClick={() => handleOrder('popular')}
                        className={`border border-white rounded-r-[7px] px-[10px] py-[5px] cursor-pointer
                            ${sortBy==='popular' ? 'bg-white text-black' : 'bg-black text-white'}`}
                    >
                        인기순
                    </button>
                </div>
            </div>
            
            {/* LP 목록 그리드 */}
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8'>
                {/* 초기 로딩 스켈레톤 (상단) */}
                {isPending && (
                    <>
                        {Array.from({ length: 10 }, (_, i) => (
                            <LoadingSkeleton key={`skeleton-${i}`} />
                        ))}
                    </>
                )}
                
                {/* 실제 LP 카드들 */}
                {lpsList.length > 0 && lpsList.map((lp) => (
                    <LpCard key={lp.id} lp={lp} />
                ))}
                
                {/* 추가 로딩 스켈레톤 (하단) */}
                {isFetchingNextPage && (
                    <>
                        {Array.from({ length: 5 }, (_, i) => (
                            <LoadingSkeleton key={`next-skeleton-${i}`} />
                        ))}
                    </>
                )}
                
                {/* 데이터가 없을 때 */}
                {!isPending && lpsList.length === 0 && (
                    <div className='col-span-full text-center text-gray-400 py-8'>
                        <p>표시할 LP가 없습니다.</p>
                    </div>
                )}
            </div>
            
            {/* 무한스크롤 상태 표시 */}
            {!hasNextPage && lpsList.length > 0 && (
                <div className='text-center text-gray-400 py-8'>
                    <p>모든 LP를 불러왔습니다. 🎵</p>
                </div>
            )}
        </div>
    )
}

export default HomePage

