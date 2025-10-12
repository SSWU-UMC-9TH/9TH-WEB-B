import React from 'react';
import HomeLayout from "./layouts/HomeLayout.tsx"
import HomePage from "./pages/HomePage.tsx"
import NotFoundPage from "./pages/NotFoundPage.tsx"
import LoginPage from "./pages/LoginPage.tsx"
import SignupPage from "./pages/SignupPage.tsx"
import MyPage from "./pages/MyPage.tsx"
import { AuthProvider } from "./contexts/AuthContext.tsx"
// Provider 설정: AuthProvider로 전역 인증 상태 제공
// 라우팅 구조: React Router로 SPA
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<HomeLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="signup" element={<SignupPage />} />
                        <Route path="mypage" element={<MyPage />} />
                    </Route>
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;