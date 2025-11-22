import { useInfiniteQuery } from "@tanstack/react-query";
import { PAGINATION_ORDER } from "../../enums/common";
import { CommentsListData } from "../../types/comment";
import { QUERY_KEY } from "../../constants/key";
import { getComments } from "../../apis/comment";

export const useGetInfiniteComments = (
  lpId: string | undefined,
  limit: number,
  order: PAGINATION_ORDER
) => {
  return useInfiniteQuery<CommentsListData>({
    queryKey: [QUERY_KEY.comments, { lpId, order }],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getComments(lpId!, {
        cursor: pageParam as number,
        limit,
        order
      }),
    enabled: !!lpId,
    getNextPageParam: (lastPage) => {
      console.log('getNextPageParam 체크:', {
        hasNext: lastPage.hasNext,
        nextCursor: lastPage.nextCursor,
        dataLength: lastPage.data?.length
      });
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
  });
};
