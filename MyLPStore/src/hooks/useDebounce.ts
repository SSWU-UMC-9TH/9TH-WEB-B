import { useEffect, useState } from "react";

/**
 * value가 변경될 때마다 delay(ms)만큼 대기 후 value를 반환합니다.
 * 입력값이 delay 내에 또 변경되면 타이머를 초기화합니다.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}