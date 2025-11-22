import { useMutation } from "@tanstack/react-query";
import { postLogout } from "../../apis/auth";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const { clearTokens } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => postLogout(),
    onSuccess: () => {
      clearTokens();
      alert('로그아웃되었습니다.');
      navigate("/");
    },
    onError: (error) => {
      console.error("로그아웃 실패:", error);
      // 로그아웃 API 실패해도 로컬 토큰은 정리
      clearTokens();
      alert('로그아웃 중 오류가 발생했습니다.');
      navigate("/");
    },
  });
};