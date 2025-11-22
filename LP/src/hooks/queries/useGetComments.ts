import { useInfiniteQuery } from "@tanstack/react-query";
import { getComments } from "../../apis/comment";

export const useGetComments = ({
  lpId,
  order = "desc",
  limit = 10,
}: {
  lpId: number;
  order?: "asc" | "desc";
  limit?: number;
}) => {
  return useInfiniteQuery({
    queryKey: ["lpComments", lpId, order],

    queryFn: ({ pageParam }) =>
      getComments({ lpId, cursor: pageParam, limit, order }),

    initialPageParam: undefined,

    // ⭐ 스웨거 구조 그대로 사용 (data.hasNext / data.nextCursor)
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,

    // ❌ select 제거! (page 구조 유지해야 함)
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    enabled: !!lpId,
  });
};

export default useGetComments;