import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

export const useDeleteLp = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (lpId: number) => deleteLp(lpId),
    onSuccess: (_, lpId) => {
      // LP 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
      // 삭제된 LP 상세 캐시 제거
      queryClient.removeQueries({ queryKey: [QUERY_KEY.lp, lpId.toString()] });
      // 홈페이지로 리다이렉트
      navigate("/");
    },
    onError: (error) => {
      console.error("LP 삭제 실패:", error);
      alert("LP 삭제에 실패했습니다.");
    }
  });
};
