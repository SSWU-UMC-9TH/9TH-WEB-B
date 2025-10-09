import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage"; // ✅ 추가
import HomePage from "./pages/HomePage"; // ✅ 없으면 생성 or 임시 컴포넌트

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} /> {/* ✅ 추가 */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
