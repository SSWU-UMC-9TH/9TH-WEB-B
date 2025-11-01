import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useEffect, useState } from "react";

const ProtectedLayout = () => {
    const {accessToken} = useAuth();
    const [isChecking, setIsChecking] = useState(true);
    
    useEffect(() => {
        // 토큰 체크를 약간 지연시켜 AuthContext가 업데이트될 시간을 줌
        const timer = setTimeout(() => {
            setIsChecking(false);
        }, 100);
        
        return () => clearTimeout(timer);
    }, []);
    
    // localStorage에서도 토큰 확인 (AuthContext state가 업데이트되기 전일 수 있음)
    const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

    console.log('🔒 ProtectedLayout 체크:', { accessToken: accessToken ? 'exists' : 'null', localStorageToken: token ? 'exists' : 'null', isChecking });

    if (isChecking) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl">인증 확인 중...</div>
        </div>;
    }

    if (!accessToken && !token) {
        // 알림 없이 조용히 로그인 페이지로 이동
        return <Navigate to={"/login"} replace />
    }
    return <Outlet />
}

export default ProtectedLayout