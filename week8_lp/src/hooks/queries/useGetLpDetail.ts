import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

export function useGetLpDetail(
    lpId: number,
) {
    return useQuery({
        queryFn: () => getLpDetail(lpId),
        queryKey: [QUERY_KEY.lps, lpId],
    })
}
