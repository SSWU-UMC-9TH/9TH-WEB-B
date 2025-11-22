import { useEffect, useRef, useState } from 'react';

/**
 * useThrottle 훅
 * @param value 스로틀링할 값 (제네릭)
 * @param delay 밀리초 단위 인터벌 (기본값 500ms)
 * @returns 스로틀링된 값
 */
export function useThrottle<T>(value: T, delay: number = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecRef = useRef<number>(Date.now());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastExec = now - lastExecRef.current;
    if (timeSinceLastExec >= delay) {
      setThrottledValue(value);
      lastExecRef.current = now;
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setThrottledValue(value);
        lastExecRef.current = Date.now();
      }, delay - timeSinceLastExec);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, delay]);

  return throttledValue;
}
