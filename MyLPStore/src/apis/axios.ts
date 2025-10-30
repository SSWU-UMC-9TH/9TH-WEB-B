import axios from "axios";
import { useAuthStorage } from "../hooks/useAuthStorage";

// useAuth 훅을 사용한 토큰 관리
const auth = useAuthStorage();

// 전역 변수로 refresh 요청의 Promise를 저장해서 중복 요청을 방지
let refreshPromise: Promise<string> | null = null;

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

// 응답 인터셉터: 401 에러 발생 시 refresh token을 통한 토큰 갱신 처리
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 에러이면서, 아직 재시도하지 않은 요청인 경우 처리
        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            console.log('401 에러 감지, refresh token 갱신');
            
            // refresh 엔드포인트에서 401 에러가 발생한 경우 로그아웃 처리
            if (originalRequest.url?.includes("/v1/auth/refresh")) {
                console.log('Refresh token도 만료됨, 로그아웃 처리');
                auth.clearTokens();
                
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }

            // 재시도 플래그 설정
            originalRequest._retry = true;

            // 이미 refresh 요청이 진행 중이면 그 Promise를 재사용
            if (!refreshPromise) {
                refreshPromise = (async () => {
                    console.log('Refresh token 갱신 시작');
                    const refreshToken = auth.getRefreshToken();
                    
                    if (!refreshToken) {
                        console.error('Refresh token이 없습니다');
                        throw new Error('No refresh token available');
                    }

                    console.log('Refresh token 요청 중');
                    
                    // 새로운 axios 인스턴스 사용 (인터셉터 회피) ***중요!!!***
                    const freshAxios = axios.create({
                        baseURL: import.meta.env.VITE_SERVER_API_URL,
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    const response = await freshAxios.post("/v1/auth/refresh", {
                        refresh: refreshToken,
                    });

                    console.log('새 토큰 발급:', response.data);

                    // API 응답 구조에 따라 처리 (any 타입으로 처리)
                    const responseData = response.data as any;
                    const newAccessToken = responseData?.data?.accessToken || responseData?.accessToken;
                    const newRefreshToken = responseData?.data?.refreshToken || responseData?.refreshToken;

                    if (!newAccessToken || !newRefreshToken) {
                        console.error('토큰 구조가 예상과 다름:', response.data);
                        throw new Error('Invalid token response structure');
                    }

                    // 새 토큰들을 저장
                    auth.saveTokens(newAccessToken, newRefreshToken);
                    console.log('새 토큰 저장 완료');

                    return newAccessToken;
                })()
                .catch((error) => {
                    console.error('Refresh token 갱신 실패:', error.response?.data || error.message);
                    
                    // refresh 실패 시 모든 토큰을 제거하고 로그아웃
                    auth.clearTokens();
                    
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                    throw error;
                })
                .finally(() => {
                    refreshPromise = null;
                });
            }

            // refresh가 완료되면 새 토큰으로 원래 요청을 재시도
            return refreshPromise.then((newAccessToken) => {
                console.log('새 토큰으로 원래 요청 재시도');
                if (originalRequest.headers) {
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                }
                return axiosInstance.request(originalRequest);
            });
        }

        return Promise.reject(error);
    }
);