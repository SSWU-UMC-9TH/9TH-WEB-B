import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

interface NavBarProps {
  onToggleSidebar?: () => void;
}

const NavBar = ({ onToggleSidebar }: NavBarProps) => {
    const navigate = useNavigate();
    const { accessToken, userInfo, logout } = useAuth();

    // 복잡한 로직 완전 제거, AuthContext에서 모든 상태 관리 처리
    const handleLogin = () => {
        navigate('/login');
    };

    const handleHome = () => {
        navigate('/');
    };

    const handleSignup = () => {
        navigate('/signup');
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="fixed left-0 right-0 bg-black/80 text-white h-16 top-0 w-full z-50 shadow-md backdrop-blur">
            <div className="flex items-center justify-between pr-5 pl-2 py-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onToggleSidebar}
                        className="cursor-pointer p-2 rounded transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
                        </svg>
                    </button>
                    <div 
                        onClick={handleHome}
                        className="text-pink-400 text-lg font-bold cursor-pointer"
                    >
                        돌려돌려LP판
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {!accessToken ? (
                        <>
                            <button 
                                onClick={handleLogin}
                                className="text-white text-base font-md cursor-pointer hover:text-gray-300 transition-colors"
                            >
                                로그인
                            </button>
                            <button 
                                onClick={handleSignup}
                                className="bg-pink-400 text-white font-md text-sm px-3 py-1 cursor-pointer rounded-md hover:bg-pink-500 p-1 transition-colors"
                            >
                                회원가입
                            </button>
                        </>
                    ) : (
                        <>
                            <span className="text-white">
                                {userInfo?.data?.name}님 환영합니다!
                            </span>
                            <button
                                onClick={handleLogout}
                                className="cursor-pointer hover:text-pink-400"
                            >
                                로그아웃
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
