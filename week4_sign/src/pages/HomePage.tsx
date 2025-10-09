// src/pages/HomePage.tsx

import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-12 text-pink-400">돌려돌려 LP판</h1>

      <div className="flex flex-col gap-4 w-[240px]">
        <button
          onClick={() => navigate("/login")}
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg"
        >
          로그인
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg"
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default HomePage;
