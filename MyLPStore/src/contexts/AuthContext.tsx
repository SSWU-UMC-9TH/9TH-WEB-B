// Context API로 전역 상태 관리 - 상태 중앙화: 앱 전체의 인증 상태를 하나의 소스로 관리
// 로그인 여부(isLoggedIn)를 useState로 들고 있음
// useAuthStorage 훅을 내부에서 사용해서 토큰 관리 기능을 함께 제공
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuthStorage } from "../hooks/useAuthStorage";
import { getMyInfo } from "../apis/auth";
import { postLogout } from "../apis/auth";
import { ResponseMyInfoDto } from "../types/auth";

interface AuthContextType {
  isLoggedIn: boolean;
  accessToken: string | null;
  userInfo: ResponseMyInfoDto | null;
  saveTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  updateUserInfo: (newUserInfo: Partial<ResponseMyInfoDto['data']>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}
// 1. AuthProvider가 상태를 제공 (Publisher)
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { saveTokens, clearTokens, getAccessToken, getRefreshToken } = useAuthStorage(); // 토큰 유틸리티 가져옴
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getAccessToken()); // 전역 로그인 상태
  const [userInfo, setUserInfo] = useState<ResponseMyInfoDto | null>(null); // 사용자 정보
  const [accessToken, setAccessToken] = useState<string | null>(() => getAccessToken()); // 액세스 토큰 상태

  // storage 이벤트 감지로 실시간 동기화
  useEffect(() => {
    const syncAuth = async () => {
      const token = getAccessToken();
      const hasToken = !!token;
      
      setIsLoggedIn(hasToken);
      setAccessToken(token);
      
      // 토큰이 있고 현재 사용자 정보가 없을 때만 로드
      if (hasToken && !userInfo) {
        try {
          const info = await getMyInfo();
          setUserInfo(info);
        } catch (error) {
          console.error('사용자 정보 로드 실패:', error);
          // 토큰이 유효하지 않으면 클리어
          if (error instanceof Error && error.message.includes('401')) {
            clearTokens();
            setIsLoggedIn(false);
            setAccessToken(null);
            setUserInfo(null);
          }
        }
      } else if (!hasToken) {
        setUserInfo(null);
      }
    };

    syncAuth(); // 초기 로드

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
  }, []); // dependency 배열을 비워서 무한 루프 방지

  // 토큰 저장 시 상태 변경 + 즉시 업데이트
  const handleSaveTokens = async (accessTokenParam: string, refreshToken: string) => {
    saveTokens(accessTokenParam, refreshToken); // 토큰 저장
    setIsLoggedIn(true); // 즉시 UI 업데이트
    setAccessToken(accessTokenParam);
    
    // 사용자 정보도 로드
    try {
      const info = await getMyInfo();
      setUserInfo(info);
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      await postLogout();
    } catch (error) {
      console.error('로그아웃 API 실패:', error);
    } finally {
      clearTokens();
      setIsLoggedIn(false);
      setAccessToken(null);
      setUserInfo(null);
    }
  };

  // 토큰 제거 시 상태 즉시 업데이트
  const handleClearTokens = () => {
    clearTokens();
    setIsLoggedIn(false);
    setAccessToken(null);
    setUserInfo(null);
  };

  // 사용자 정보 즉시 업데이트 (optimistic update)
  const updateUserInfo = (newUserInfo: Partial<ResponseMyInfoDto['data']>) => {
    if (userInfo && userInfo.data) {
      setUserInfo({
        ...userInfo,
        data: {
          ...userInfo.data,
          ...newUserInfo
        }
      });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn,
        accessToken,
        userInfo,
        saveTokens: handleSaveTokens, 
        clearTokens: handleClearTokens,
        logout,
        getAccessToken, 
        getRefreshToken,
        updateUserInfo
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
