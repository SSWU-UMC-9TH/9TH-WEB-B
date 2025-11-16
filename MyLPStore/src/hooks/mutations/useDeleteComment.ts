import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../apis/axios";
import { QUERY_KEY } from "../../constants/key";
import { PAGINATION_ORDER } from "../../enums/common";

interface DeleteCommentParams {
  commentId: number;
  lpId: number;
  order?: PAGINATION_ORDER;
}

const deleteComment = async ({ commentId, lpId }: DeleteCommentParams) => {
  await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
};

export default function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.comments, variables.lpId, variables.order],
      });
    },
  });
}