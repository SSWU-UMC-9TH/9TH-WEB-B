import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig } from "axios";

// 공용 axios 인스턴스 생성
const api = axios.create({
  baseURL: "http://localhost:8000", // 백엔드 서버 주소
  withCredentials: true, // 쿠키에 Refresh Token이 저장된 경우 필요
});

// 요청 인터셉터: Access Token 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("[요청 전] Access Token이 헤더에 추가되었습니다:", token.slice(0, 20) + "...");
    } else {
      console.warn("[요청 전] Access Token이 존재하지 않습니다.");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: Access Token 만료 시 자동 갱신 + 무한 루프 방지
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // 401 에러 + 재시도 이력 없는 경우만 수행
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지를 위한 플래그 설정
      console.warn("[401 감지] Access Token이 만료되었습니다. Refresh Token으로 갱신 시도 중...");

      try {
        // Refresh Token으로 새 Access Token 요청
        const refreshResponse = await axios.post(
          "http://localhost:8000/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        console.log("[토큰 갱신 성공] 새로운 Access Token 발급 완료:", newAccessToken.slice(0, 20) + "...");

        // 새 Access Token 저장
        localStorage.setItem("accessToken", newAccessToken);

        // 실패했던 요청의 Authorization 헤더 갱신 후 재시도
        if (originalRequest.headers)
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        console.log("[재요청 시도] 만료된 요청을 새로운 Access Token으로 재시도합니다.");
        return api(originalRequest); // 요청 재시도
      } catch (refreshError) {
        console.error("[토큰 갱신 실패] Refresh Token도 만료되어 로그인 페이지로 이동합니다.");
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    // _retry 플래그가 true이거나 401이 아닌 경우 → 그대로 에러 반환
    return Promise.reject(error);
  }
);

export default api;