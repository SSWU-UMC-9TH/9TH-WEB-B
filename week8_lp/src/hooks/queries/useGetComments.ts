import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../apis/axios"; // ✅ 올바른 axios 인스턴스 import

interface UseGetCommentsProps {
  lpId: string;
  order?: "asc" | "desc";
  limit?: number;
}

const useGetComments = ({
  lpId,
  order = "desc",
  limit = 10,
}: UseGetCommentsProps) => {
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
      console.log("🚀 실제 댓글 API 호출:", { lpId, order, pageParam });

      try {
        // ✅ Swagger 문서 기준 실제 백엔드 API 호출
        const response = await axiosInstance.get(
          `/v1/lps/${lpId}/comments`,
          {
            params: {
              cursor: pageParam,
              limit: limit,
              order: order
            }
          }
        );

        console.log("✅ 댓글 API 응답:", response.data);
        return response.data; // 👉 전체 응답 반환
      } catch (err) {
        console.error("❌ 댓글 API 호출 실패:", err);
        console.error("⚠️ 백엔드 서버 확인 필요 (localhost:8000)");
        
        // mockData 사용하지 않고 에러 throw
        throw err;
      }
    },
    getNextPageParam: (lastPage) => {
      // 백엔드 응답 구조에 따라 수정
      if (lastPage?.data?.hasNext && lastPage?.data?.nextCursor !== null) {
        return lastPage.data.nextCursor;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: !!lpId, // lpId 있을 때만 요청
  });

  // ✅ 전체 댓글 평탄화 (무한스크롤용)
  const flatData = data?.pages?.flatMap((page) => {
    // 백엔드 응답 구조에 맞게 데이터 접근
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

export default useGetComments;
