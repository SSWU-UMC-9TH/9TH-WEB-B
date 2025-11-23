import { useCallback, useState } from "react";

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return { isOpen, open, close, toggle };
}

// useCallback으로 함수 참조 고정해서 이벤트 등록 안정성을 높임
// 이거 지금 여기서 사용하지 않음 => 전역 상태 관리를 해야지만 냅바와 사이드바에서 같은 상태를 공유할 수 있는데
// 이렇게 관리해버리면 서로 각각 다른 상태를 바라보게 되고 안 맞아서 사이드바 안 열림
