import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../apis/axios";
import { PAGINATION_ORDER } from "../../enums/common";
import { CommentsListData, CommentsResponse } from "../../types/comment";
import { QUERY_KEY } from "../../constants/key";

export const useGetInfiniteComments = (
  lpId: string | undefined,
  limit: number,
  order: PAGINATION_ORDER
) => {
  return useInfiniteQuery<CommentsListData>({
    queryKey: [QUERY_KEY.comments, lpId, order],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const res = await axiosInstance.get<CommentsResponse>(
        `/v1/lps/${lpId}/comments`,
        {
          params: {
            cursor: pageParam,
            limit,
            order: order === PAGINATION_ORDER.asc ? 'asc' : 'desc',
          },
        }
      );
      return res.data.data;
    },
    enabled: !!lpId,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
  });
};
