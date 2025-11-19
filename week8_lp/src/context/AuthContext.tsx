import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { createContext, useContext, useState, type PropsWithChildren } from "react";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
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

    return (
        <AuthContext.Provider value={{accessToken, refreshToken}}>
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