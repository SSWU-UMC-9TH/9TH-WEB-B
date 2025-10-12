// Context API로 전역 상태 관리 - 상태 중앙화: 앱 전체의 인증 상태를 하나의 소스로 관리
//로그인 여부(isLoggedIn)를 useState로 들고 있음
// useAuthStorage 훅을 내부에서 사용해서 토큰 관리 기능을 함께 제공
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuthStorage } from "../hooks/useAuthStorage";

interface AuthContextType {
  isLoggedIn: boolean;
  saveTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}
// 1. AuthProvider가 상태를 제공 (Publisher)
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { saveTokens, clearTokens, getAccessToken, getRefreshToken } = useAuthStorage(); // 토큰 유틸리티 가져옴
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getAccessToken()); // 전역 로그인 상태

  // storage 이벤트 감지로 실시간 동기화
  useEffect(() => {
    const syncAuth = () => {
      setIsLoggedIn(!!getAccessToken());
    };

    // storage 이벤트 리스너 (다른 탭에서의 변경 감지)
    window.addEventListener("storage", syncAuth);
    
    // 페이지 포커스 시 상태 동기화 (탭 전환 시)
    const handleFocus = () => {
      syncAuth();
    };
    
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("focus", handleFocus);
    };
  }, [getAccessToken]);

  // 토큰 저장 시 상태 변경 + 즉시 업데이트
  const handleSaveTokens = (accessToken: string, refreshToken: string) => {
    saveTokens(accessToken, refreshToken); // 토큰 저장
    setIsLoggedIn(true); // 즉시 UI 업데이트
  };

  // 토큰 제거 시 상태 즉시 업데이트
  const handleClearTokens = () => {
    clearTokens();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        saveTokens: handleSaveTokens, 
        clearTokens: handleClearTokens, 
        getAccessToken, 
        getRefreshToken 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; // 모든 하위 컴포넌트에 상태 제공

// 2. useAuth는 구독을 위한 "창구" 역할
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; // 이런 패턴은 React Context API를 사용할 때 거의 필수적인 모범 사례 - context API의 안전한 사용을 보장하는 커스텀 훅
