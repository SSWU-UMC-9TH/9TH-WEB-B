import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

export const useGetLpDetail = (lpId: string | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEY.lp, lpId],
    queryFn: () => {
      console.log('LP 상세 조회 시작:', lpId);
      return getLpDetail(Number(lpId));
    },
    enabled: !!lpId
  });
};
