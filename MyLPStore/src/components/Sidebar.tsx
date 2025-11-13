import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => (
  <>
    {isOpen && (
      <div
        className="fixed inset-0 z-20"
        onClick={onClose}
      />
    )}
    
    <div
      className={`
        fixed top-0 left-0 w-50 h-full bg-gray-800/50 text-white z-30
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <nav className="px-1 py-6 space-y-6 mt-10">
        <Link to="/mypage" className="flex mt-5 ml-5 cursor-pointer">
          마이페이지
        </Link>
      </nav>
    </div>
  </>
);

export default Sidebar;