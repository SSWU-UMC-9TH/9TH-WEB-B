import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import type { PAGINATION_ORDER } from "../../enums/common";
import { QUERY_KEY } from "../../constants/key";

export function useGetInfiniteLpList(
    limit: number, 
    search: string, 
    order: PAGINATION_ORDER,
) {
    const searchText = search.trim().length > 0;

    return useInfiniteQuery({
        queryFn: ({pageParam}) => 
            getLpList({cursor: pageParam, limit, search, order}),
        queryKey: [QUERY_KEY.lps, search, order],
        initialPageParam: 0,
        getNextPageParam: (lastPage,) => {
            return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
        },
        enabled: searchText,
        staleTime: 1000 * 60 * 5,
        gcTime: 100 * 60 * 10,
    })
}
