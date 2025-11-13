import { useInfiniteQuery } from '@tanstack/react-query';
import { getLpList } from '../../apis/routes/lp';
import { LpData } from '../../types/lp';

interface UseInfiniteLpListProps {
  search?: string;
  sortBy?: 'latest' | 'popular' | 'rating';
}

const useInfiniteLpList = ({ search, sortBy }: UseInfiniteLpListProps = {}) => {
  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['lps', sortBy, search],
    queryFn: async ({ pageParam = 0 }) => {
      console.log('🚀 무한스크롤 LP 목록 API 호출:', { pageParam, search, sortBy });
      
      try {
        const response = await getLpList({
          search,
          sortBy,
          cursor: pageParam,
          limit: 10 // 한 번에 10개씩 로드
        });
        
        console.log('✅ 무한스크롤 API 응답:', response);
        return response;
      } catch (error) {
        console.error('❌ 무한스크롤 API 호출 실패:', error);
        throw new Error('LP 목록을 불러올 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      }
    },
    getNextPageParam: (lastPage) => {
      // 다음 페이지가 있으면 nextCursor 반환, 없으면 undefined
      if (lastPage?.data?.hasNext && lastPage?.data?.nextCursor !== null) {
        return lastPage.data.nextCursor;
      }
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });

  // 모든 페이지의 데이터를 평탄화 (백엔드 응답 구조에 맞게 수정)
  const flatData = data?.pages?.flatMap(page => {
    // 백엔드 응답 구조: { data: { data: LpData[], nextCursor, hasNext } }
    return page?.data?.data || [];
  }) || [];

  return {
    data: flatData,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  };
};

export default useInfiniteLpList;