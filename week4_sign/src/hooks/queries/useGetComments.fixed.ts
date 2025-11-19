import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../apis/axios";

interface UseGetCommentsProps {
  lpId: string;
  order?: "asc" | "desc";
  limit?: number;
}

const useGetComments = ({ lpId, order = "desc", limit = 10 }: UseGetCommentsProps) => {
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
    queryKey: ["lpComments", lpId, order],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        const response = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
          params: {
            cursor: pageParam,
            limit,
            order,
          },
        });
        return response.data;
      } catch (err) {
        throw err;
      }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage?.data?.hasNext && lastPage?.data?.nextCursor !== null) {
        return lastPage.data.nextCursor;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: !!lpId,
  });

  // 전체 댓글 평탄화 (무한스크롤용)
  const comments = data?.pages?.flatMap((page) => page?.data?.data || []) || [];

  return {
    comments,
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
