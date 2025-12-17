import { useState, useEffect } from 'react';

/**
 * useDebounce 훅
 * @param value 디바운싱할 값 (제네릭)
 * @param delay 딜레이(ms)
 * @returns 디바운싱된 값
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounceValue, setDebounceValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debounceValue;
}
