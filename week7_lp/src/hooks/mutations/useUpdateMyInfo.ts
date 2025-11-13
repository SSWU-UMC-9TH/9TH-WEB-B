import { useMutation } from '@tanstack/react-query';
import { QUERY_KEY } from '../../constants/key';
import { queryClient } from '../../App';
import { updateMyInfo } from '../../apis/auth';

export function useUpdateMyInfo() {
    return useMutation({
        mutationFn: updateMyInfo,
        onSuccess: (data) => {
            queryClient.setQueryData([QUERY_KEY.myInfo], data);
            alert('프로필 수정에 성공했습니다.');
        },
        onError: (error) => {
            console.log('프로필 수정 실패', error);
        },
    })
}