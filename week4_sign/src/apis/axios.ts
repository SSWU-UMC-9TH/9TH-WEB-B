import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

// 단일 Axios 인스턴스
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  // 서버가 httpOnly 쿠키를 쓴다면 true, 토큰 헤더를 쓴다면 상관없음. 혼합 케이스 대비 true 유지
  withCredentials: true,
});

// 요청 인터셉터: 매 요청마다 최신 토큰 주입 (불필요 공백 제거)
axiosInstance.interceptors.request.use(
  (config) => {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    const token = raw?.trim();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 시 refresh 토큰 갱신 후 재시도
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  config: any;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      resolve(axiosInstance(config));
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;

    // refresh 시도 대상이 아니면 바로 거절
    if (status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken)?.trim();
    if (!refreshToken) {
      // 리프레시 토큰이 없으면 바로 로그아웃 처리
      localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
      localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
      return Promise.reject(error);
    }

    // 중복 갱신 방지 큐잉
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // 인스턴스 순환참조 방지: 기본 axios 사용
      const baseURL = axiosInstance.defaults.baseURL;

      // 환경변수로 리프레시 엔드포인트를 오버라이드 가능
      const configuredPath = (import.meta as any)?.env?.VITE_REFRESH_TOKEN_PATH as string | undefined;
      const candidates = [
        configuredPath,               // .env가 설정한 경로
        "/v1/auth/token",           // 과제 문서 기본값
        "/v1/auth/refresh",         // 흔한 대안 경로
        "/auth/token/refresh",      // 또 다른 흔한 경로
      ].filter((p): p is string => !!p);

      let data: any | null = null;
      let lastErr: any = null;
      for (const path of candidates) {
        try {
          const res = await axios.post(`${baseURL}${path}`, { refreshToken }, { withCredentials: true });
          data = res.data;
          break;
        } catch (e: any) {
          lastErr = e;
          // 404면 다음 후보로 시도, 그 외 에러는 즉시 중단
          if (e?.response?.status !== 404) {
            throw e;
          }
        }
      }
      if (!data) throw lastErr ?? new Error("Refresh token endpoint not found");

      const newAccessToken: string | undefined = data?.data?.accessToken || data?.accessToken;
      const newRefreshToken: string | undefined = data?.data?.refreshToken || data?.refreshToken;

      if (!newAccessToken) {
        throw new Error("No accessToken in refresh response");
      }

      // 저장 및 헤더 갱신
      localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, newRefreshToken);
      }

      processQueue(null, newAccessToken);
      // 원 요청 재시도
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as any, null);
      // 갱신 실패 -> 토큰 제거 및 로그인 페이지 이동 유도
      localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
      localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
