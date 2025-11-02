import HomeLayout from "./layouts/HomeLayout.tsx"
import HomePage from "./pages/HomePage.tsx"
import NotFoundPage from "./pages/NotFoundPage.tsx"
import LoginPage from "./pages/LoginPage.tsx"
import Signup01 from "./pages/SignupPage01.tsx"
import Signup02 from "./pages/SignupPage02.tsx"
import Signup03 from "./pages/SignupPage03.tsx"
import MyPage from "./pages/MyPage.tsx"
import { ProtectedLayout } from "./layouts/ProtectedLayout.tsx"
import { AuthProvider } from "./contexts/AuthContext.tsx"
import { GoogleLoginRedirectPage } from './pages/GoogleLoginRedirectPage.tsx'
// Provider 설정: AuthProvider로 전역 인증 상태 제공
// 라우팅 구조: React Router로 SPA
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path ="/v1/auth/google/callback" element={<GoogleLoginRedirectPage />} />
                    {/* 공개 라우트 */}
                    <Route path="/" element={<HomeLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="signup" element={<Signup01 />} />
                        <Route path="signup/password" element={<Signup02 />} />
                        <Route path="signup/nickname" element={<Signup03 />} />
                    </Route>
                    
                    {/* 보호된 라우트 */}
                    <Route path="/" element={<ProtectedLayout />}>
                        <Route path="mypage" element={<MyPage />} />
                    </Route>
                    
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;