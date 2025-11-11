import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LOCAL_STORAGE_KEY } from '../constants/key';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { accessToken } = useAuth();
    
    // localStorage에서 직접 확인 (AuthContext state가 업데이트 되기 전일 수 있음)
    const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    
    // 디버깅 로그
    console.log('🔐 ProtectedRoute 체크:', {
        accessToken,
        token,
        hasToken: !!token,
        hasAccessToken: !!accessToken
    });
    
    if (!accessToken && !token) {
        console.log('❌ 인증 실패: 로그인 페이지로 이동');
        alert('로그인이 필요한 페이지입니다.');
        return <Navigate to="/login" replace />;
    }
    
    console.log('✅ 인증 성공: 페이지 접근 허용');
    return <>{children}</>;
};


