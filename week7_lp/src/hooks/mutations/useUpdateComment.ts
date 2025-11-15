import { useMutation } from '@tanstack/react-query';
import { updateLpComment } from '../../apis/lp';
import { QUERY_KEY } from '../../constants/key';
import { queryClient } from '../../App';

export function useUpdateComment() {
    return useMutation({
        mutationFn: ({ lpId, commentId, content }) => updateLpComment(lpId, commentId, content),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lpComments, variables.lpId],
            })
        },
        onError: (error) => {
            console.log('댓글 수정 실패', error);
        },
    })
}