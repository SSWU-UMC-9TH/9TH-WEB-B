import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import { axiosInstance } from "../../apis/axios";
import { PAGINATION_ORDER } from "../../enums/common";

interface EditCommentParams {
  commentId: number;
  content: string;
  lpId: number;
  order?: PAGINATION_ORDER;
}

const editComment = async ({ commentId, content, lpId }: EditCommentParams) => {
  const res = await axiosInstance.patch(`/v1/lps/${lpId}/comments/${commentId}`, { content });
  return res.data;
};

const useEditComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editComment,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.comments, variables.lpId, variables.order ?? PAGINATION_ORDER.desc],
      });
    },
  });
};

export default useEditComment;