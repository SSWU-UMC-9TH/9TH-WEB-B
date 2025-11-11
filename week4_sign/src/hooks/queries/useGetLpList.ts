import { useQuery } from '@tanstack/react-query';
import { getLpList } from '../../apis/routes/lp';
import { getMockLpList } from '../../data/mockData';
import { LpData } from '../../types/lp';

interface UseGetLpListProps {
  search?: string;
  sortBy?: 'latest' | 'popular' | 'rating';
}

const useGetLpList = ({ search, sortBy }: UseGetLpListProps = {}) => {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery<LpData[]>({
    queryKey: ['lps', sortBy, search],
    queryFn: async () => {
      console.log('🚀 백엔드 전체 LP 목록 API 호출 (Sunday Morning 등)...');
      console.log('🔗 Full API URL:', `${import.meta.env.VITE_SERVER_API_URL}/v1/lps`);
      
      // 실제 백엔드 API 강제 호출 - mockData 사용 안 함!
      try {
        const response = await getLpList({
          search,
          sortBy,
          page: 1,
          limit: 100
        });
        
        console.log('✅ 백엔드 API 응답 성공:', response);
        console.log('📊 받아온 LP 데이터 개수:', response.data?.data?.length);
        console.log('📋 첫 번째 LP:', response.data?.data?.[0]);
        
        return response.data.data || [];
      } catch (error) {
        console.error('❌ 백엔드 API 호출 실패:', error);
        console.error('❌ Error details:', error.response?.data || error.message);
        
        // 백엔드 연결 실패시 에러를 throw해서 사용자에게 알림
        throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      }
    },
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });

  return {
    data: data || [],
    isPending,
    isError,
    error,
    refetch,
  };
};

export default useGetLpList;

