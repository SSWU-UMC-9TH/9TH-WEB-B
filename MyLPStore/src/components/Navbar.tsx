import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

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

    const handleMyPage = () => {
        navigate('/mypage');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 bg-black/80 backdrop-blur-md px-6">
            <div className="text-lg font-semibold text-white cursor-pointer"
            onClick={handleHome}>
                돌려돌려 LP판
            </div>
            <div className="flex gap-4">
                {isLoggedIn ? (
                    // 로그인된 상태
                    <button 
                        onClick={handleMyPage}
                        className="text-base font-md text-white cursor-pointer hover:text-gray-300 transition-colors"
                    >
                        마이페이지
                    </button>
                ) : (
                    // 로그인되지 않은 상태
                    <>
                        <button 
                            onClick={handleLogin}
                            className="text-base font-md text-white cursor-pointer hover:text-gray-300 transition-colors"
                        >
                            로그인
                        </button>
                        <button 
                            onClick={handleSignup}
                            className="text-sm font-md text-white cursor-pointer bg-pink-400 rounded-md p-1 hover:bg-pink-500 transition-colors"
                        >
                            회원가입
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
