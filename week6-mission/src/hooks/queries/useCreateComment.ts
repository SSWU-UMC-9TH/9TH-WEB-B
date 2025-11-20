import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../../apis/commentApi";

const useCreateComment = (lpId: number, onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ content }: { content: string }) =>
      createComment({ lpId, content }),

    onSuccess: () => {
      // ✔ 댓글 목록 자동 새로고침
      queryClient.invalidateQueries({
        queryKey: ["lpComments", lpId],
        exact: false,
      });

      // ✔ 외부에서 전달된 onSuccess 실행(입력창 초기화 등)
      if (onSuccessCallback) onSuccessCallback();
    },
  });
};

export default useCreateComment;