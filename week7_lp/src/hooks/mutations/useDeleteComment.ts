import { useMutation } from '@tanstack/react-query';
import { deleteLpComment } from '../../apis/lp';
import { QUERY_KEY } from '../../constants/key';
import { queryClient } from '../../App';

export function useDeleteComment() {
    return useMutation({
        mutationFn: ({ lpId, commentId }) => deleteLpComment(lpId, commentId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lpComments],
            })
        },
        onError: (error) => {
            console.log('댓글 삭제 실패', error);
        },
    })
}