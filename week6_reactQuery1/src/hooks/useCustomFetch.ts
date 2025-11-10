// useQuery 훅
import { useQuery } from "@tanstack/react-query";

export const useCustomFetch = <T>(url: string) => {
    return useQuery({
        queryKey: [url],

        queryFn: async ({ signal }): Promise<T> => {
            const response = await fetch(url, {signal}); //비동기

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            return response.json() as Promise<T>;
        },

        retry: 3,

        // 지수 백오프 전략
        retryDelay: (attemptImdex) => {
            return Math.min(1000 * Math.pow(2, attemptImdex), 30_000);
        }, // 30초 이상으로 갈 수 없다

        staleTime: 5 * 60 * 1_000,

        // 쿼리가 사용되지 안은 채로 10분이 지나면 캐시에서 제거됨
        gcTime: 10 * 60 * 1_000,
    })
}
