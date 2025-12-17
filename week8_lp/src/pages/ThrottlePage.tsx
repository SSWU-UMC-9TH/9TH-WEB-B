import React, { useEffect, useRef } from 'react';

// 콜백 기반 useThrottle 훅 구현
function useThrottle(callback: () => void, delay: number = 500) {
  const lastExecRef = useRef<number>(Date.now());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function throttledHandler() {
      const now = Date.now();
      if (now - lastExecRef.current >= delay) {
        lastExecRef.current = now;
        callback();
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          lastExecRef.current = Date.now();
          callback();
        }, delay - (now - lastExecRef.current));
      }
    }
    window.addEventListener('scroll', throttledHandler);
    return () => {
      window.removeEventListener('scroll', throttledHandler);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [callback, delay]);
}
const ThrottlePage = () => {
  // 스크롤 이벤트가 2초마다 한 번만 실행되도록 throttle 적용
  useThrottle(() => {
    // 네트워크 요청 예시 (GET 요청)
    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(res => res.json())
      .then(data => {
        console.log('[THROTTLE] 네트워크 요청 결과:', data, '시간:', new Date().toLocaleTimeString());
      });
    console.log('[THROTTLE] 쓰로틀링된 스크롤 이벤트! scrollY:', window.scrollY, '시간:', new Date().toLocaleTimeString());
  }, 2000);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
      <h1 className="text-2xl font-bold mt-8 mb-6">쓰로틀링이 무엇일까요?</h1>
      <div className="text-xl mb-10">throttle</div>
      {/* 스크롤 테스트용 더미 박스 */}
      <div style={{ height: '2000px', width: '100%' }} />
    </div>
  );
};

export default ThrottlePage;
