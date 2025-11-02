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
        
        if (storedAccessToken && storedAccessToken !== accessToken) {
            setAccessToken(storedAccessToken);
        }
        if (storedRefreshToken && storedRefreshToken !== refreshToken) {
            setRefreshToken(storedRefreshToken);
        }
    }, [getAccessTokenFromStorage, getRefreshTokenFromStorage, accessToken, refreshToken]);

    const login = async (signinData: RequestSigninDto) => {
        try {
            const response = await postSignin(signinData);
            
            const newAccessToken = response.data.accessToken;
            const newRefreshToken = response.data.refreshToken;

            if (newAccessToken && newRefreshToken) {
                setAccessTokenInStorage(newAccessToken);
                setRefreshTokenInStorage(newRefreshToken);

                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);
                
                // 개발 환경에서만 로그 출력
                if ((import.meta as any).env?.DEV) {
                    console.log('✅ 로그인 성공');
                }
                
                window.location.replace('/my');
            } else {
                console.error('❌ 로그인 응답에 토큰이 없습니다');
            }
        } catch(error) {
            console.error('❌ 로그인 실패:', error);
            alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
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