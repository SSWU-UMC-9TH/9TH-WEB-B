import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSignout } from "../hooks/mutations/useSignout";
import { useSidebar } from "../contexts/SidebarContext";

const Sidebar = () => { // 기존의 props가 아니라 커스텀 훅의 함수를 사용
  const { isOpen, close } = useSidebar(); 
  const [showSignoutModal, setShowSignoutModal] = useState(false);
  const signoutMutation = useSignout();

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    // 클린업 함수로 이벤트 해제
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  // 사이드바 열렸을 때 배경 스크롤 방지 - 따로 css에 "overflow: hidden"을 설정하지 않아도 tailwind에서 유틸리티 크래스에 전역으로 자동으로 추가해줌
  useEffect(() => {
  if (isOpen) {
    document.body.classList.add("overflow-hidden");
  } else {
    document.body.classList.remove("overflow-hidden");
  }
  return () => {
    document.body.classList.remove("overflow-hidden");
  };
}, [isOpen]);

  const handleSignoutClick = () => {
    setShowSignoutModal(true);
  };

  const handleConfirmSignout = () => {
    signoutMutation.mutate();
    setShowSignoutModal(false);
    close();
  };

  const handleCancelSignout = () => {
    setShowSignoutModal(false);
  };

  return (
    <>
      {isOpen && (
        <div
          className={`
            fixed inset-0 z-20 bg-black/50
            transition-opacity duration-300
            ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
          onClick={close}
        />
      )}
      
      <div
        className={`
          fixed top-0 left-0 h-full w-60
          bg-gray-800 text-white z-30
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        onClick={(e) => e.stopPropagation()} 
      >
        <nav className="px-1 py-6 space-y-6 mt-10">
          <Link to="/mypage" className="flex mt-5 ml-5 cursor-pointer">
            마이페이지
          </Link>
        </nav>

        <div className="px-1">
          <button 
            onClick={handleSignoutClick}
            className="flex ml-5 text-sm text-pink-500 cursor-pointer hover:text-pink-400"
          >
            탈퇴하기
          </button>
        </div>
      </div>

      {/* 탈퇴 확인 모달 */}
      {showSignoutModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-80">
            <h3 className="text-white text-lg font-semibold mb-4 text-center">회원탈퇴</h3>
            <p className="text-gray-300 text-sm mb-6 text-center">
              정말로 탈퇴하시겠습니까?<br/>
            </p>
            
            <div className="flex justify-center text-sm font-light gap-2">
              <button
                onClick={handleCancelSignout}
                className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-500"
              >
                아니오
              </button>
              <button
                onClick={handleConfirmSignout}
                disabled={signoutMutation.isPending}
                className="px-4 py-2 rounded bg-pink-500 text-white cursor-pointer disabled:bg-gray-500"
              >
                예
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;