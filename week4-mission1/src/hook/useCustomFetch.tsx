import { useEffect, useState } from "react";
import axios from "axios";
import type { AxiosRequestConfig } from "axios";

/**
 * useCustomFetch<T>
 * - 모든 API 요청에 공통으로 쓸 수 있는 커스텀 훅
 * - 데이터 패칭 / 로딩 / 에러를 일원화
 *
 * @param endpoint - baseURL 뒤에 붙을 엔드포인트 문자열 (예: "/movie/popular")
 * @param options - axios 설정 (params, headers 등)
 * @returns { data, loading, error }
 */
export function useCustomFetch<T = unknown>(
  endpoint: string,
  options?: AxiosRequestConfig
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 공통 axios 인스턴스
  const api = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_TMOB_KEY}`,
    },
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api(endpoint, options);
        if (isMounted) setData(response.data);
      } catch (err: any) {
        if (isMounted) setError(err.message || "데이터를 불러오지 못했습니다.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
      return () => {
      isMounted = false;
    };
  }, [endpoint]);

  return { data, loading, error };
}