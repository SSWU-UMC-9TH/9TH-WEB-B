import { useMutation } from '@tanstack/react-query';
import { updateLp } from '../../apis/lp';
import { QUERY_KEY } from '../../constants/key';
import { queryClient } from '../../App';

export function useUpdateLp() {
    return useMutation({
        mutationFn: ({ lpId, lp }) => updateLp(lpId, lp),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lps],
            })
        },
        onError: (error) => {
            console.log('LP 수정 실패', error);
            alert('LP 수정에 실패했습니다.');
        },
    })
}