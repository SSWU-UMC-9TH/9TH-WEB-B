import { Link } from "react-router-dom";
import { useState } from "react";
import { useSignout } from "../hooks/mutations/useSignout";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [showSignoutModal, setShowSignoutModal] = useState(false);
  const signoutMutation = useSignout();

  const handleSignoutClick = () => {
    setShowSignoutModal(true);
  };

  const handleConfirmSignout = () => {
    signoutMutation.mutate();
    setShowSignoutModal(false);
    onClose();
  };

  const handleCancelSignout = () => {
    setShowSignoutModal(false);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={onClose}
        />
      )}
      
      <div
        className={`
          fixed top-0 left-0 w-50 h-full bg-gray-800/70 text-white z-30
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
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