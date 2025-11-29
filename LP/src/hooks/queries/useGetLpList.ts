import { useInfiniteQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEYS } from "../../constants/key";


type UseGetLpListProps = Omit<PaginationDto, "cursor"> & {
  enabled?: boolean;
};

function useGetLpList({ limit, search, order, enabled }: UseGetLpListProps) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.lps, search, order],

    queryFn: ({ pageParam }) =>
      getLpList({
        cursor: pageParam,
        limit,
        search,
        order,
      }),

    initialPageParam: undefined as number | undefined,

    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },

    staleTime: 1000 * 60 * 5,
    enabled,
    gcTime: 1000 * 60 * 10,
  });
}

export default useGetLpList;