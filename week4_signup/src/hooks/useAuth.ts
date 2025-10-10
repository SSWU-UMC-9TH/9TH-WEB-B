// 인증 관리 전용 훅
// useLocalStorage 기반으로 토큰을 안전하게 관리
import { useLocalStorage } from './useLocalStorage';

export const useAuth = () => {
    const accessTokenStorage = useLocalStorage('accessToken');
    const refreshTokenStorage = useLocalStorage('refreshToken');

    // 토큰 저장
    const saveTokens = (accessToken: string, refreshToken: string) => {
        accessTokenStorage.setItem(accessToken);
        refreshTokenStorage.setItem(refreshToken);
        
        // 다른 컴포넌트들에게 변경사항 알림
        window.dispatchEvent(new Event('storage'));
    };

    // 액세스 토큰 가져오기
    const getAccessToken = () => {
        return accessTokenStorage.getItem();
    };

    // 리프레시 토큰 가져오기
    const getRefreshToken = () => {
        return refreshTokenStorage.getItem();
    };

    // 토큰 제거 (로그아웃)
    const clearTokens = () => {
        accessTokenStorage.removeItem();
        refreshTokenStorage.removeItem();
        
        // 다른 컴포넌트들에게 변경사항 알림
        window.dispatchEvent(new Event('storage'));
    };

    // 로그인 상태
    const isAuthenticated = () => {
        const token = getAccessToken();
        return !!token;
    };

    return {
        saveTokens,         
        getAccessToken,     
        getRefreshToken,               
        clearTokens,        
        isAuthenticated,    
    };
};
