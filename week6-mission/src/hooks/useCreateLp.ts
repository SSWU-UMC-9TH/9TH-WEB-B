import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLp } from "../apis/lpapi";

export const useCreateLp = (onSuccessCallback: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postLp,
    onSuccess: () => {
      // LP 목록 자동 새로고침
      queryClient.invalidateQueries({ queryKey: ["lpList"] });

      // 모달 닫기
      onSuccessCallback();
    },
  });
};