
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

const HomeLayout = () => {
  const navigate = useNavigate();
  return (
    <div className='h-dvh flex flex-col'>
      <nav className="flex items-center justify-between p-4 bg-black text-white">
        <button>
          <div 
          onClick={() => navigate("/")}
          className="text-white font-bold text-lg cursor-pointer">week5 삼이 과제</div>
        </button>
        <div className="flex items-center space-x-2">
          <button 
          onClick={() => navigate("/mypage")}
          className="bg-black text-white px-3 py-1 rounded cursor-pointer">마이페이지</button>
          <button 
          onClick={() => navigate("/login")}
          className="bg-black text-white px-3 py-1 rounded cursor-pointer">로그인</button>
          <button 
          onClick={() => navigate("/signup")}
          className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer">회원가입</button>
        </div>
      </nav>
      <main className='flex-1'>
        <Outlet />
      </main>
    <footer></footer>
    </div>
  );
};

export default HomeLayout
