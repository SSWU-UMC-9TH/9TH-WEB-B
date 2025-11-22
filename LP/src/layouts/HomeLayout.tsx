import { Link, Outlet, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useSidebar } from "../hooks/useSidebar";
import { FiSearch, FiUser } from "react-icons/fi";
import FloatingButton from '../components/lp/FloatingBtn';
import LpWriteModal from '../components/lp/LpWriteModal';
import Sidebar from '../components/Sidebar';


const HomeLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isSidebarOpen, openSidebar, closeSidebar, toggleSidebar } = useSidebar();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  useEffect(() => {
    const handler = () => {
      setAccessToken(localStorage.getItem("accessToken"));
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken"));
  }, [location.pathname]);

  useEffect(() => {
    const restrictedPaths = [/^\/lp\/[^\/]+$/, /^\/lps\/[^\/]+$/];
    const isRestrictedPath = restrictedPaths.some((pattern) => pattern.test(location.pathname));
    if (isRestrictedPath && !accessToken) {
      const confirmLogin = window.confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동할까요?");
      if (confirmLogin) {
        navigate("/login", { state: { from: location.pathname } });
      }
    }
  }, [location.pathname, accessToken, navigate]);

  // ESC key closes sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSidebarOpen) {
        closeSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarOpen, closeSidebar]);

  // Lock background scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  const handleLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  setAccessToken(null); 
  alert("로그아웃 되었습니다!");
  navigate("/login");

  
  
};

  return (
    <div className='h-dvh flex flex-col'>
        <nav className="flex items-center justify-between p-4 bg-gray-100 text-black">
        {/* 왼쪽: 햄버거 + 로고 */}
        <div className="flex items-center space-x-3">
          <button onClick={toggleSidebar}> <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/></svg></button>
          <div
            onClick={() => navigate("/")}
            className="text-black font-bold text-lg cursor-pointer"
          >
            돌려돌려 LP판
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {accessToken ? (
          
            <>
              <div
                onClick={() => navigate("/search")}
                className="flex items-center space-x-2 cursor-pointer hover:text-blue-400"
              >
                <FiSearch />
              </div>
              <span className="text-black
              ">반갑습니다.</span>
              <button
                onClick={handleLogout}
                className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-600"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-blue-600 px-3 py-1 rounded cursor-pointer"
              >
                로그인
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer"
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </nav>
      <main className='flex-1'>
        <Outlet />
      </main>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onNavigate={(path: string) => {
          navigate(path);
          closeSidebar();
        }}
        openDeleteModal={() => setIsDeleteModalOpen(true)}
      />

    {isDeleteModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-gray-800 text-white p-8 rounded-lg w-80 relative">
          <button
            className="absolute top-3 right-3 text-xl"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            ✕
          </button>
          <p className="text-center mb-6">정말 탈퇴하시겠습니까?</p>
          <div className="flex justify-center gap-4">
            <button
              className="px-4 py-2 bg-gray-300 text-black rounded"
              onClick={() => {
                // Add API call later
                alert("탈퇴되었습니다.");
                setIsDeleteModalOpen(false);
              }}
            >
              예
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              아니오
            </button>
          </div>
        </div>
      </div>
    )}
    <footer className='bg-gray-100 dark:bg-gray-900 py-6 mt-12'>
      <div className='container mx-auto text-center text-gray-600 dark:text-gray-400'>
        <p>&copy;{new Date().getFullYear()} 돌려돌려 LP판 | All rights reserved.</p>
      </div>
      <div className="flex justify-center space-x-4 mt-4">
        <Link to="#">privacy policy</Link>
        <Link to="#">Terms of service</Link>
        <Link to="#">Contact</Link>

      </div>
    </footer>
        <FloatingButton onClick={() => setIsModalOpen(true)} />
        <LpWriteModal
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

    </div>
  );
};

export default HomeLayout
