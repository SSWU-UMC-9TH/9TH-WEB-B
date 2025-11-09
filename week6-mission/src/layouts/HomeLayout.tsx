import { Link, Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { FiSearch, FiUser } from "react-icons/fi";


const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div className='h-dvh flex flex-col'>
        <nav className="flex items-center justify-between p-4 bg-black text-white">
        {/* 왼쪽: 햄버거 + 로고 */}
        <div className="flex items-center space-x-3">
          <button onClick={() => setIsSidebarOpen(true)}> <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/></svg></button>
          <div
            onClick={() => navigate("/")}
            className="text-gray-50 font-bold text-lg cursor-pointer"
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
              <span className="text-white">반갑습니다.</span>
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

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#111] text-white transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4 flex items-center justify-between">
          <span className="text-blue-600 font-bold text-xl">DOLIGO</span>
          <button onClick={() => setIsSidebarOpen(false)}>✕</button>
        </div>

        <ul className="mt-8 space-y-6 pl-6">
          <li
            onClick={() => navigate("/search")}
            className="flex items-center space-x-2 cursor-pointer hover:text-blue-400"
          >
            <FiSearch /> <span>찾기</span>
          </li>
          <li
            onClick={() => navigate("/mypage")}
            className="flex items-center space-x-2 cursor-pointer hover:text-blue-400"
          >
            <FiUser /> <span>마이페이지</span>
          </li>
        </ul>

        <div className="absolute bottom-8 left-6 text-gray-400 text-sm cursor-pointer hover:text-blue-400">
          탈퇴하기
        </div>
      </div>

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
        <button
      onClick={() => navigate("/create")}
      className="fixed bottom-20 right-20 z-80 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-blue-700 transition"
    >
      +
    </button>
    </div>
  );
};

export default HomeLayout
