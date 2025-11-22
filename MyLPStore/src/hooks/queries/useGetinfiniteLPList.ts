import { useInfiniteQuery } from "@tanstack/react-query";
import { PAGINATION_ORDER } from "../../enums/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { ResponseLpListDto } from "../../types/lp";

export function useGetInfiniteLpList(
  limit: number,
  search: string,
  order: PAGINATION_ORDER,
  enabled: boolean
) {
  return useInfiniteQuery<ResponseLpListDto>({
    queryFn: ({ pageParam = 0 }) =>
      getLpList({ cursor: pageParam as number, limit, search, order }),
    queryKey: [QUERY_KEY.lps, { search, order, limit }],
    enabled,
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext
        ? (lastPage.data.nextCursor ?? undefined)
        : undefined,
    staleTime: 1000 * 10, // 10초: 재조회 너무 잦지 않게
    gcTime: 1000 * 60 * 5, // 5분 캐시 보관
  });
}