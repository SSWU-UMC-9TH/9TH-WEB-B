import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { isAuthenticated } = useAuth();

    // 로그인 상태 유지/감지를 위해 useEffect에서 localStorage 값(accessToken)을 주기적으로 확인 => 실시간으로 냅바에 반영

    useEffect(() => {
        // 초기 로그인 상태 확인
        const checkLoginStatus = () => {
            setIsLoggedIn(isAuthenticated());
        };

        checkLoginStatus();

        // localStorage 변경 감지 (다른 탭에서의 변경)
        const handleStorageChange = () => {
            checkLoginStatus();
        };

        // 페이지 포커스 시 상태 확인 (같은 탭에서의 변경)
        const handleFocus = () => {
            checkLoginStatus();
        };
        const interval = setInterval(checkLoginStatus, 1000);

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('focus', handleFocus);
            clearInterval(interval);
        };
    }, [isAuthenticated]);

    const handleLogin = () => {
        navigate('/login');
    };

    const handlehome = () => {
        navigate('/');
    };

    const handleSignup = () => {
        navigate('/signup');
    };

    const handleMypage = () => {
        navigate('/mypage');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 bg-black/80 backdrop-blur-md px-6">
            <div className="text-lg font-semibold text-white cursor-pointer"
            onClick = {handlehome}>
                돌려돌려 LP판
            </div>
            <div className="flex gap-4">
                {isLoggedIn ? (
                    // 로그인된 상태
                    <button 
                        onClick={handleMypage}
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
