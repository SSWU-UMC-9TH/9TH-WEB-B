import { useMutation } from '@tanstack/react-query';
import { postLpComment } from '../../apis/lp';
import { QUERY_KEY } from '../../constants/key';
import { queryClient } from '../../App';
import type { RequestPostCommentDto, ResponseCommentDto } from '../../types/lps';

export function usePostComment() {
    return useMutation<ResponseCommentDto, Error, RequestPostCommentDto>({
        mutationFn: ({ lpId, content }) => postLpComment(lpId, content),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lpComments, variables.lpId],
            })
        },
        onError: (error) => {
            console.log('댓글 작성 실패', error);
        },
    })
}