import axios, { type InternalAxiosRequestConfig } from "axios";

// Token 관리 유틸
const tokenStorage = {
  getAccess: () => localStorage.getItem("accessToken"),
  getRefresh: () => localStorage.getItem("refreshToken"),
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    
    
  },
  clear: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    
  },
};

// SPA 라우팅 고려한 리다이렉트 처리 (현재는 임시)
const redirectToLogin = () => {
  console.warn("Redirecting to login page...");
  window.location.href = "/login"; // 나중에 useNavigate()로 교체 예정
};

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

// refresh 전용 클라이언트 (인터셉터 영향 X)
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = tokenStorage.getAccess();
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    config.headers.Pragma = "no-cache";
    config.headers.Expires = "0";
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: CustomInternalAxiosRequestConfig = error.config;

    if ([401, 403, 419].includes(error.response?.status) && !originalRequest._retry) {
      if (originalRequest.url?.includes("/v1/auth/refresh")) {
        tokenStorage.clear();
        redirectToLogin();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const refreshToken = tokenStorage.getRefresh();
            if (!refreshToken) throw new Error("No refresh token found");

            const { data } = await refreshClient.post("/v1/auth/refresh", {
              refreshToken: refreshToken,
            });

            const { accessToken, refreshToken: newRefreshToken } = data.data;
            tokenStorage.setTokens(accessToken, newRefreshToken);
            axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
            return accessToken;
          } catch (err) {
            console.error("토큰 재발급 실패:", err);
            tokenStorage.clear();
            redirectToLogin();
            throw err;
          } finally {
            refreshPromise = null;
          }
        })();
      }

      return refreshPromise.then((newAccessToken) => {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance.request(originalRequest);
      });
    }

    return Promise.reject(error);
  }
);