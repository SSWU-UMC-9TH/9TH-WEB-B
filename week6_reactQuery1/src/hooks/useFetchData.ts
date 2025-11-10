import { useEffect, useMemo, useRef, useState } from 'react';

// 캐시 유효 시간 (0.5분)
const STALE_TIME = 0.5 * 60 * 1000; // 0.5 minutes

// 최대 재시도 횟수
const MAX_RETRIES = 3;

// 초기 재시도 딜레이(ms)
const INITIAL_RETRY_DELAY = 1000;

// 로컬스토리지에 저장할 데이터 구조
interface CacheEntry<T> {
  data: T;
  lastFetched: number; // 마지막으로 데이터를 가져온 시점
}

export const useCustomFetch = <T,>(url: string): {
  data: T | null;
  isPending: boolean;
  isError: boolean;
} => {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const storageKey = useMemo(() => url, [url]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchData = async (currentRetry = 0): Promise<void> => {
      const currentTime = new Date().getTime();
      const cachedItem = localStorage.getItem(storageKey);

      // 캐시된 데이터가 존재한다면 확인
      if (cachedItem) {
        try {
          const cachedData: CacheEntry<T> = JSON.parse(cachedItem);

          // 캐시가 유효한 경우 (신선도 유지)
          if (currentTime - cachedData.lastFetched < STALE_TIME) {
            setData(cachedData.data);
            setIsPending(false);
            console.log('캐시된 데이터 사용:', url);
            return;
          }

          // 캐시가 만료된 경우 (오래됨)
          setData(cachedData.data);
          console.log('만료된 캐시 데이터 사용 (백그라운드 갱신):', url);
        } catch {
          localStorage.removeItem(storageKey);
          console.warn('캐시 파싱 에러 — 캐시 삭제됨:', url);
        }
      }

      setIsPending(true);

      try {
        const response = await fetch(url, {
          signal: abortControllerRef.current?.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const newData = (await response.json()) as T;
        setData(newData);

        // 새 캐시 저장
        const newCacheEntry: CacheEntry<T> = {
          data: newData,
          lastFetched: new Date().getTime(),
        };

        localStorage.setItem(storageKey, JSON.stringify(newCacheEntry));
      } catch (error: any) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('요청 취소됨:', url);
          return;
        }

        // 재시도 로직
        if (currentRetry < MAX_RETRIES) {
          const retryDelay =
            INITIAL_RETRY_DELAY * Math.pow(2, currentRetry); // 1s → 2s → 4s
          console.log(
            `재시도 ${currentRetry + 1}/${MAX_RETRIES}: ${retryDelay}ms 후`,
            url
          );

          retryTimeoutRef.current = window.setTimeout(() => {
            fetchData(currentRetry + 1);
          }, retryDelay);
        } else {
          console.error('최대 재시도 횟수 초과:', url);
          setIsError(true);
        }
      } finally {
        setIsPending(false);
      }
    };

    abortControllerRef.current = new AbortController();
    setIsError(false);

    fetchData();

    return () => {
      abortControllerRef.current?.abort();

      if (retryTimeoutRef.current !== null) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, [url, storageKey]);

  return { data, isPending, isError };
};
