import { useEffect, useRef, useState } from "react";

export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);

  // 타이머 저장용 ref
  const lastExecuted = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLast = now - lastExecuted.current;

    if (timeSinceLast >= interval) {
      // 즉시 실행
      setThrottledValue(value);
      lastExecuted.current = now;
    } else {
      // 아직 실행하면 안 됨 → 남은 시간 계산해서 예약
      if (timerRef.current) clearTimeout(timerRef.current);

      const remaining = interval - timeSinceLast;
      timerRef.current = setTimeout(() => {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }, remaining);
    }

    return () => {
      // 의존성 변경 및 언마운트시 타이머 정리
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, interval]);

  return throttledValue;
}