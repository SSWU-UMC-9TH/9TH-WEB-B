import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLp } from "../apis/lpApi";

export const useCreateLp = (onSuccessCallback: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postLp,
    onSuccess: () => {
      // LP 목록 전체 새로고침 (search/order 관계없이 최신 목록 불러오기)
      queryClient.invalidateQueries({ queryKey: ["lps"] });

      // 모달 닫기
      onSuccessCallback();
    },
  });
};