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
    // 기존에 JSON.stringify로 저장된 값("token")을 대비해 파싱 시도
    let token: string | undefined = raw || undefined;
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed === 'string') token = parsed;
      } catch {
        // raw 그대로 사용
        token = raw;
      }
      token = token?.trim();
    }
    if (token) {
      if (!config.headers) {
        // 타입 호환을 위해 any 캐스팅
        (config as any).headers = {};
      }
      (config.headers as any).Authorization = `Bearer ${token}`;
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
        if (!config.headers) {
          (config as any).headers = {};
        }
        (config.headers as any).Authorization = `Bearer ${token}`;
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
    const url: string = String(originalRequest?.url || "");

    // 로그인/리프레시 요청 자체에 대한 401은 리프레시 시도하지 않음 (중복 호출/노이즈 방지)
    const configuredRefreshPath = (import.meta.env?.VITE_REFRESH_TOKEN_PATH as string | undefined) || "/v1/auth/refresh";
    const isSigninRequest = url.includes("/auth/signin");
    const isRefreshRequest = url.includes("/auth/refresh") || (configuredRefreshPath && url.includes(configuredRefreshPath));
    if (isSigninRequest || isRefreshRequest) {
      return Promise.reject(error);
    }

    // refresh 시도 대상이 아니면 바로 거절
    if (status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

  const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken)?.trim();
    // 리프레시 토큰이 로컬에 없어도, 서버가 httpOnly 쿠키로 보관하는 경우가 있어
    // 우선 갱신 시도를 진행한다 (withCredentials: true)

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
  const configuredPath = import.meta.env?.VITE_REFRESH_TOKEN_PATH as string | undefined;
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
          const payload = refreshToken ? { refreshToken } : {};
          const res = await axios.post(`${baseURL}${path}`, payload, { withCredentials: true });
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
      if (!originalRequest.headers) {
        originalRequest.headers = {} as any;
      }
      (originalRequest.headers as any).Authorization = `Bearer ${newAccessToken}`;
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
