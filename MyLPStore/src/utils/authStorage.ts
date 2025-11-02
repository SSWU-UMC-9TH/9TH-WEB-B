// 순수 localStorage 기반 토큰 유틸 (useLocalStorage Hook과 호환)
export const authStorage = {
  getAccessToken: () => {
    try {
      const item = localStorage.getItem("accessToken");
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },

  getRefreshToken: () => {
    try {
      const item = localStorage.getItem("refreshToken");
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },

  saveTokens: (access: string, refresh: string) => {
    try {
      localStorage.setItem("accessToken", JSON.stringify(access));
      localStorage.setItem("refreshToken", JSON.stringify(refresh));
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.log(error);
    }
  },

  clearTokens: () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.log(error);
    }
  },

  isLoggedIn: () => {
    try {
      const token = localStorage.getItem("accessToken");
      return token ? !!JSON.parse(token) : false;
    } catch (e) {
      return false;
    }
  },
};
