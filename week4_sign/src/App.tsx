import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import MyPage from "./pages/MyPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedLayout from "./layouts/ProtectedLayout";
import { AuthProvider } from "./context/AuthContext";
import { useEffect } from "react";
import { LOCAL_STORAGE_KEY } from "./constants/key";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/oauth/callback"
            element={
              <OAuthCallbackInline />
            }
          />
          {/* 백엔드 또는 구글 콘솔 설정에 따라 프런트 도메인의 이 경로로 돌아오는 경우가 있어 404 방지용으로 동일 처리 */}
          <Route
            path="/v1/auth/google/callback"
            element={<OAuthCallbackInline />}
          />

          {/* protected */}
          <Route element={<ProtectedLayout />}> 
            <Route path="/my" element={<MyPage />} />
          </Route>

          {/* not found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// 인라인 OAuth 콜백 처리 (백엔드가 쿼리로 토큰 전달하는 경우 대비)
function OAuthCallbackInline() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      // 다양한 백엔드/프로바이더가 사용하는 파라미터 키 대응
      const accessToken =
        params.get("accessToken") ||
        params.get("access_token");
      const refreshToken =
        params.get("refreshToken") ||
        params.get("refresh_token");
      if (accessToken) localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, accessToken);
      if (refreshToken) localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, refreshToken);
    } catch {
      // ignore
    } finally {
      window.location.replace("/my");
    }
  }, []);
  return null;
}

export default App;
