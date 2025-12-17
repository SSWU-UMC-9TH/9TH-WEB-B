import { useMutation } from '@tanstack/react-query';
import { postLp } from '../../apis/lp';
import { QUERY_KEY } from '../../constants/key';
import { queryClient } from '../../App';

interface CustomMutationOptions {
    onSuccessCallback: () => void;
}

export function usePostLp(options: CustomMutationOptions) {
    return useMutation({
        mutationFn: postLp,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lps],
                refetchType: 'all',
            })
            options.onSuccessCallback()
        },
        onError: (error) => {
            console.log('lp 생성 실패', error);
        },
    })
}