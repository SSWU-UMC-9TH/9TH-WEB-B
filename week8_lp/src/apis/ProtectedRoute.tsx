import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = { redirectTo?: string };

export default function ProtectedRoute({ redirectTo = "/login" }: Props) {
  const { accessToken } = useAuth();
  const location = useLocation();

  // ❗ accessToken 없으면 로그인 페이지로 강제 이동
  if (!accessToken) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  // ✅ 토큰이 있으면 실제 내부 페이지 렌더
  return <Outlet />;
}


