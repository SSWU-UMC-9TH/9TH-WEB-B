import axios from "axios";
import { useAuthStorage } from "../hooks/useAuthStorage";

// useAuth 훅을 사용한 토큰 관리
const auth = useAuthStorage();

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL, 
});

// 요청 인터셉터: 모든 요청 전에 accessToken을 Authorization 헤더에 추가
axiosInstance.interceptors.request.use(
    (config) => {
        // useAuth를 사용해서 토큰을 안전하게 가져옴
        const accessToken = auth.getAccessToken();

        // accessToken이 존재하면 Authorization 헤더에 Bearer 토큰 형식으로 추가
        if (accessToken) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 추후 엑세스 토큰 만료 시 리프레시 토큰으로 재발근 로직 추가해야 됨

// 응답 인터셉터: 토큰 만료 시 자동 로그아웃 처리(api 따로 사용하지 않음)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // 토큰이 만료되었거나 유효하지 않음 - useAuth로 안전하게 제거
            auth.clearTokens();
            
            // 로그인 페이지가 아닌 경우에만 리다이렉트
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);