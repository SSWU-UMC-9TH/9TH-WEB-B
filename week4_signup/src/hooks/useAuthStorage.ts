// 토큰 관리 전용 훅 (유틸리티 역할)
// useLocalStorage 기반으로 토큰 CRUD 기능만 담당
// 인증 로직(저장, 삭제, 가져오기)을 “유틸리티”처럼 제공
import { useLocalStorage } from './useLocalStorage';

export const useAuthStorage = () => {
    const accessTokenStorage = useLocalStorage('accessToken');
    const refreshTokenStorage = useLocalStorage('refreshToken');

    // 토큰 저장
    const saveTokens = (accessToken: string, refreshToken: string) => {
        accessTokenStorage.setItem(accessToken);
        refreshTokenStorage.setItem(refreshToken);
        
        // 다른 컴포넌트들에게 변경사항 알림
        window.dispatchEvent(new Event('storage'));
    };

    // 토큰 제거 (로그아웃)
    const clearTokens = () => {
        accessTokenStorage.removeItem();
        refreshTokenStorage.removeItem();
        
        // 다른 컴포넌트들에게 변경사항 알림
        window.dispatchEvent(new Event('storage'));
    };

    return {
        saveTokens,
        getAccessToken: () => accessTokenStorage.getItem(),
        getRefreshToken: () => refreshTokenStorage.getItem(),
        clearTokens,
    };
};
