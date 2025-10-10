import React from 'react';
import HomeLayout from "./layouts/HomeLayout.tsx"
import HomePage from "./pages/HomePage.tsx"
import NotFoundPage from "./pages/NotFoundPage.tsx"
import LoginPage from "./pages/LoginPage.tsx"
import SignupPage from "./pages/SignupPage.tsx"
import MyPage from "./pages/MyPage.tsx"

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
    return (
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
    );
};

export default App;