import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // 로그인 시 저장한 토큰을 가져옵니다.
  const token = localStorage.getItem("accessToken");
  const location = useLocation();

  // 토큰이 없으면 로그인 페이지로 Redirect
  if (!token) {
    alert("로그인이 필요한 페이지입니다.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 토큰이 있으면 원래 페이지 렌더링
  return <>{children}</>;
};

export default ProtectedRoute;