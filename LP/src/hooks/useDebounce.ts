import { useState, useEffect } from "react";

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // delay 후에 value 설정
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // value 또는 delay가 바뀌면 타이머 정리
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};