import { useInfiniteQuery } from "@tanstack/react-query";
import { PAGINATION_ORDER } from "../../enums/common";
import { QUERY_KEY } from "../../constants/key";
import { axiosInstance } from "../../apis/axios";
import { ResponseLpListDto } from "../../types/lp";

export function useGetInfiniteTagLpList(
  tagName: string,
  limit: number,
  order: PAGINATION_ORDER,
  enabled: boolean,
  search: string = ""
) {
  return useInfiniteQuery<
    ResponseLpListDto,
    Error,               
    ResponseLpListDto,      
    [string, object], 
    number 
  >({
    queryKey: [QUERY_KEY.lpsTag, { tagName, order, search }],
    enabled: enabled && tagName.length > 0,
    initialPageParam: 0,

    queryFn: async ({ pageParam }) => {
      const res = await axiosInstance.get<ResponseLpListDto>(
        `/v1/lps/tag/${tagName}`,
        {
          params: { cursor: pageParam, limit, order, search },
        }
      );
      return res.data;
    },

    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
  });
}









