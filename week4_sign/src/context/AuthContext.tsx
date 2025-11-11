import { postLogout, postSignin } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
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

const getStorageItem = (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch {
        return null;
    }
};

const setStorageItem = (key: string, value: string | null): void => {
    if (typeof window === 'undefined') return;
    try {
        if (value) {
            window.localStorage.setItem(key, JSON.stringify(value));
        } else {
            window.localStorage.removeItem(key);
        }
    } catch (error) {
        console.error('Storage error:', error);
    }
};

export const AuthProvider = ({children}: PropsWithChildren) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    // 컴포넌트 마운트 시 localStorage에서 토큰 읽기
    useEffect(() => {
        console.log('🔄 AuthContext 초기화 중...');
        const storedAccessToken = getStorageItem(LOCAL_STORAGE_KEY.accessToken);
        const storedRefreshToken = getStorageItem(LOCAL_STORAGE_KEY.refreshToken);
        
        console.log('📋 저장된 토큰:', {
            accessToken: storedAccessToken,
            refreshToken: storedRefreshToken,
            key: LOCAL_STORAGE_KEY.accessToken
        });
        
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
    }, []);

    const login = async (signinData: RequestSigninDto) => {
        try {
            const response = await postSignin(signinData);

            // 서버 응답 형태를 모두 수용 (data.accessToken | data.data.accessToken)
            const resp = response as any;
            const payload = resp?.data ?? resp;
            const newAccessToken = payload?.accessToken ?? payload?.data?.accessToken;
            const newRefreshToken = payload?.refreshToken ?? payload?.data?.refreshToken;

            if (newAccessToken && newRefreshToken) {
                setStorageItem(LOCAL_STORAGE_KEY.accessToken, newAccessToken);
                setStorageItem(LOCAL_STORAGE_KEY.refreshToken, newRefreshToken);

                // 사용자 정보도 저장 (이름 등)
                const userData = {
                    id: payload?.id ?? payload?.data?.id,
                    name: payload?.name ?? payload?.data?.name,
                    email: signinData.email
                };
                setStorageItem('userData', JSON.stringify(userData));

                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);
                
                window.location.replace('/');
            } else {
                throw new Error('로그인 응답에 토큰이 없습니다');
            }
        } catch(error) {
            throw error;
        }
    }

    const logout = async () => {
        try {
            await postLogout();
        } catch(error) {
            console.log("로그아웃 오류", error);
        } finally {
            // 에러가 나도 로컬 토큰은 삭제하고 홈으로 이동
            setStorageItem(LOCAL_STORAGE_KEY.accessToken, null);
            setStorageItem(LOCAL_STORAGE_KEY.refreshToken, null);
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

