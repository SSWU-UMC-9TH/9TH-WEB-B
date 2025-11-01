import { postLogout, postSignin } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { RequestSigninDto } from "../types/auth";
import { createContext, useContext, useState, useEffect, type PropsWithChildren } from "react";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login: (SigninData: RequestSigninDto) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    login: async () => {},
    logout: async () => {},
})

export const AuthProvider = ({children}: PropsWithChildren) => {
    const {
        getItem: getAccessTokenFromStorage, 
        setItem: setAccessTokenInStorage, 
        removeItem: removeAccessTokenFromStorage
    } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const {
        getItem: getRefreshTokenFromStorage, 
        setItem: setRefreshTokenInStorage, 
        removeItem: removeRefreshTokenFromStorage
    } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const [accessToken, setAccessToken] = useState<string | null>(
        getAccessTokenFromStorage(),
    );
    const [refreshToken, setRefreshToken] = useState<string | null>(
        getRefreshTokenFromStorage(),
    );

    // 컴포넌트 마운트 시 localStorage에서 토큰 다시 읽기
    useEffect(() => {
        const storedAccessToken = getAccessTokenFromStorage();
        const storedRefreshToken = getRefreshTokenFromStorage();
        
        console.log('🔄 AuthContext useEffect - localStorage 토큰 확인:', {
            storedAccessToken: storedAccessToken ? `${storedAccessToken.substring(0, 20)}...` : 'null',
            storedRefreshToken: storedRefreshToken ? `${storedRefreshToken.substring(0, 20)}...` : 'null',
            currentAccessToken: accessToken ? `${accessToken.substring(0, 20)}...` : 'null'
        });
        
        if (storedAccessToken && storedAccessToken !== accessToken) {
            console.log('✅ accessToken 업데이트');
            setAccessToken(storedAccessToken);
        }
        if (storedRefreshToken && storedRefreshToken !== refreshToken) {
            console.log('✅ refreshToken 업데이트');
            setRefreshToken(storedRefreshToken);
        }
    }, [getAccessTokenFromStorage, getRefreshTokenFromStorage, accessToken, refreshToken]);

    const login = async (signinData: RequestSigninDto) => {
        try {
            const response = await postSignin(signinData);
            
            console.log('🔐 로그인 응답 전체:', response);
            console.log('🔐 response.data:', response.data);

            // ResponseSigninDto 타입에 따르면 response.data.accessToken이 맞음
            const newAccessToken = response.data.accessToken;
            const newRefreshToken = response.data.refreshToken;

            console.log('✅ AccessToken:', newAccessToken);
            console.log('✅ RefreshToken:', newRefreshToken);

            if (newAccessToken && newRefreshToken) {
                setAccessTokenInStorage(newAccessToken);
                setRefreshTokenInStorage(newRefreshToken);

                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);
                
                // 저장 직후 확인
                console.log('💾 localStorage 저장 확인:', {
                    accessToken: localStorage.getItem(LOCAL_STORAGE_KEY.accessToken),
                    refreshToken: localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken),
                    match: localStorage.getItem(LOCAL_STORAGE_KEY.accessToken) === newAccessToken
                });
                // 팝업 없이 조용히 이동
                window.location.replace('/my');
            } else {
                console.error('❌ 토큰이 없습니다:', { newAccessToken, newRefreshToken });
                // 사용자 알림은 페이지에서 처리하도록 여기서는 로깅만
            }
        } catch(error) {
            console.error('❌ 로그인 오류:', error);
            alert('로그인 실패');
        }
    }

    const logout = async () => {
        try {
            await postLogout();
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();

            setAccessToken(null);
            setRefreshToken(null);
            // 팝업 없이 홈으로 이동 (history 교체)
            window.location.replace('/');
        } catch(error) {
            console.log("로그아웃 오류", error);
            // 에러가 나도 로컬 토큰은 삭제하고 로그인 페이지로 이동
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();
            setAccessToken(null);
            setRefreshToken(null);
            window.location.replace('/');
        }
    }
    return (
        <AuthContext.Provider value={{accessToken, refreshToken, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("AuthContext를 찾을 수 없습니다.");
    }

    return context;
}