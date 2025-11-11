import { useInfiniteQuery } from '@tanstack/react-query';
import { getMockComments } from '../../data/mockData';

interface UseGetCommentsProps {
  lpId: string;
  order?: 'asc' | 'desc';
  limit?: number;
}

const useGetComments = ({ lpId, order = 'desc', limit = 10 }: UseGetCommentsProps) => {
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
    queryKey: ['comments', lpId, order],
    queryFn: ({ pageParam = 0 }) => 
      getMockComments(lpId),
    getNextPageParam: (lastPage) => {
      if (lastPage?.data?.hasNext) {
        return lastPage.data.nextCursor;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: !!lpId,
  });

  const flatData = data?.pages?.flatMap(page => page?.data?.data || []) || [];

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

export default useGetComments;


