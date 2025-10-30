import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

export const ProtectedLayout = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
        if (!isLoggedIn) {
            // 현재 경로를 저장해서 로그인 후 돌아올 수 있도록
            const currentPath = window.location.pathname;
            navigate('/login', { 
                replace: true,
                state: { from: currentPath } // 로그인 후 돌아갈 경로 저장
            });
        }
    }, [isLoggedIn, navigate]);

    // 로그인되지 않은 경우 로딩 스피너 또는 빈 화면
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-lg">로그인 페이지로 이동 중...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <main className="pt-16">
                <Outlet /> {/* 보호된 페이지들이 렌더링되는 곳 */}
            </main>
        </div>
    );
};
