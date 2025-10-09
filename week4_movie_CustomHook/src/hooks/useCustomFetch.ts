import axios from "axios";
import { useEffect, useState } from "react";

interface ApiResponse<T> {
  data: T | null;
  isPending: boolean;
  isError: boolean;
  error: string | null;
}

interface FetchOptions {
  enabled?: boolean;
  dependencies?: any[];
}

function useCustomFetch<T>(
  urls: string | string[], 
  options: FetchOptions = {}
): ApiResponse<T | T[]> {
  const [data, setData] = useState<T | T[] | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { enabled = true, dependencies = [] } = options;

  useEffect(() => {
    // enabled가 false이면 fetch하지 않음
    if (!enabled) return;

    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);
      setError(null);

      try {
        if (typeof urls === "string") {
          // 단일 URL 처리
          const response = await axios.get<T>(urls, {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          });
          setData(response.data);
        } else {
          // 다중 URL 처리
          const responses = await Promise.all(
            urls.map((url) =>
              axios.get<T>(url, {
                headers: {
                  Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                },
              })
            )
          );
          setData(responses.map((response) => response.data));
        }
      } catch (error) {
        console.error("API 요청 실패:", error);
        setIsError(true);
        setError(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.");
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
  }, [JSON.stringify(urls), enabled, ...dependencies]); // JSON.stringify(urls)를 통해 URL이 변경되면 자동으로 재호출

  return { data, isPending, isError, error };
}

export default useCustomFetch;