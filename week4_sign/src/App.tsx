import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import HomePage from "./pages/HomePage";
import LpListPage from "./pages/LpListPage";
import LpDetailPage from "./pages/LpDetailPage";
import LpCreatePage from "./pages/LpCreatePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFoundPage from "./pages/NotFoundPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10, // 10분
      retry: 1, // 재시도 횟수 줄이기
    },
  },
});

// Error Boundary 컴포넌트
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">오류가 발생했습니다</h1>
            <p className="mb-4">페이지를 새로고침해주세요.</p>
            <button 
              className="bg-pink-500 px-4 py-2 rounded"
              onClick={() => window.location.reload()}
            >
              새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
          <Routes>
            {/* Public routes with special layout */}
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>
            
            {/* Main layout routes */}
            <Route path="/" element={<MainLayout />}>
              {/* 홈페이지 */}
              <Route index element={<HomePage />} />
              
              {/* LP 목록 페이지 */}
              <Route path="lps" element={<LpListPage />} />
              
              {/* LP 상세 페이지 */}
              <Route path="lp/:lpId" element={<LpDetailPage />} />
              
              {/* Protected routes */}
              <Route path="lps/create" element={
                <ProtectedRoute>
                  <LpCreatePage />
                </ProtectedRoute>
              } />
            </Route>
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;


