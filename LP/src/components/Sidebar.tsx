interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  openDeleteModal: () => void;
}

import { FiSearch, FiUser } from "react-icons/fi";

const Sidebar = ({ isOpen, onClose, onNavigate, openDeleteModal }: SidebarProps) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white text-black transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="p-4 flex items-center justify-between">
        <span className="text-black font-bold text-xl">DOLIGO</span>
        <button onClick={onClose}>✕</button>
      </div>

      <ul className="mt-8 space-y-6 pl-6">
        <li
          onClick={() => onNavigate("/search")}
          className="flex items-center space-x-2 cursor-pointer hover:text-blue-400"
        >
          <FiSearch /> <span>찾기</span>
        </li>

        <li
          onClick={() => onNavigate("/mypage")}
          className="flex items-center space-x-2 cursor-pointer hover:text-blue-400"
        >
          <FiUser /> <span>마이페이지</span>
        </li>
      </ul>

      <button
        className="absolute bottom-8 left-6 text-gray-400 text-sm cursor-pointer hover:text-blue-400"
        onClick={openDeleteModal}
      >
        탈퇴하기
      </button>
    </div>
  );
};

export default Sidebar;