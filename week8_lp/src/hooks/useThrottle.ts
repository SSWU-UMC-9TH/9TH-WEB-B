import { useCallback, useEffect, useRef } from "react";

export function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const lastCall = useRef(0);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const throttledFn = useCallback(
    ((...args: any[]) => {
      const now = Date.now();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        savedCallback.current(...args);
      }
    }) as T,
    [delay]
  );

  return throttledFn;
}
