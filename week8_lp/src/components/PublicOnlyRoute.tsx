import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PublicOnlyRouteProps {
  redirectTo?: string;
}

const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ redirectTo = '/' }) => {
  const { accessToken } = useAuth();

  // 이미 로그인된 사용자는 메인 페이지로 리다이렉트
  if (accessToken) {
    return <Navigate to={redirectTo} replace />;
  }

  // 로그인하지 않은 사용자만 접근 가능
  return <Outlet />;
};

export default PublicOnlyRoute;


