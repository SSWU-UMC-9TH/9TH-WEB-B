import { useEffect, useMemo, useState } from 'react';
import axios, { type AxiosRequestConfig } from 'axios';

/**
 * URL과 옵션이 바뀌면 자동 재요청
 * - data / loading / error 반환
 * - 요청 취소(AbortController) 내장
 * - 제네릭 T로 응답 타입 지정
 */
export function useCustomFetch<T = unknown>(
  url?: string,
  options?: AxiosRequestConfig,
  deps: any[] = [] // 외부 의존성(예: id, category, page 등)
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // options는 객체라 참조가 자주 바뀔 수 있으므로 메모이즈
  const memoOpts = useMemo(() => options ?? {}, [JSON.stringify(options || {})]);

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<T>(url, {
          ...memoOpts,
          signal: controller.signal,
        });
        setData(res.data);
      } catch (e: any) {
        if (axios.isCancel(e)) return;
        const msg =
          e?.response?.data?.status_message ||
          e?.message ||
          '에러가 발생했습니다.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => controller.abort();
    // URL + options + 외부 deps가 바뀌면 재요청
  }, [url, memoOpts, ...deps]);

  return { data, loading, error };
}
