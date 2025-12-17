import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpCommentList } from "../../apis/lp";
import type { PAGINATION_ORDER } from "../../enums/common";
import { QUERY_KEY } from "../../constants/key";

export function useGetInfiniteLpCommentList(
    lpId: number, 
    limit: number, 
    order: PAGINATION_ORDER,
) {
    return useInfiniteQuery({
        queryFn: ({pageParam}) => 
            getLpCommentList(lpId, {cursor: pageParam, limit, order}),
        queryKey: [QUERY_KEY.lpComments, lpId, order],
        initialPageParam: 0,
        getNextPageParam: (lastPage,) => {
            return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
        }
    })
}