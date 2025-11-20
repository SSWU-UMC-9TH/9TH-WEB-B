import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import { axiosInstance } from "../../apis/axios";

interface PostCommentParams {
    lpId: number;
    content: string;
    order: "asc" | "desc";
}

const postComment = async ({ lpId, content }: PostCommentParams) => {
    const response = await axiosInstance.post(`/v1/lps/${lpId}/comments`, { content });
    return response.data;
};

const usePostComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postComment,
        onSuccess: (_data, variables) => {
            console.log("댓글 작성 성공 → 쿼리 무효화 실행", variables);

            // comments 관련된 모든 infinite query 무효화
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.comments],
            });
        },
        onError: (error, variables) => {
            console.error("댓글 작성 실패:", error, variables);
        },
    });
};


export default usePostComment;


