import { useMutation } from '@tanstack/react-query';
import { QUERY_KEY } from '../../constants/key';
import { queryClient } from '../../App';
import { updateMyInfo } from '../../apis/auth';
import type { ResponseMyInfoDto } from '../../types/auth';

export function useUpdateMyInfo() {
    return useMutation({
        mutationFn: updateMyInfo,
        onMutate: async (newUserInfo) => {
            await queryClient.cancelQueries({ 
                queryKey: [QUERY_KEY.myInfo] 
            })
            const previousMyInfo = queryClient.getQueryData<ResponseMyInfoDto>([QUERY_KEY.myInfo]);
            if (previousMyInfo) {
                queryClient.setQueryData<ResponseMyInfoDto>([QUERY_KEY.myInfo], {
                    ...previousMyInfo,
                    data: {
                        ...previousMyInfo.data,
                        name: newUserInfo.name || previousMyInfo.data.name,
                        bio: newUserInfo.bio ?? previousMyInfo.data.bio, 
                        avatar: newUserInfo.avatar || previousMyInfo.data.avatar,
                    }
                });
            }
            return { previousMyInfo };
        },
        onSuccess: (data) => {
            queryClient.setQueryData([QUERY_KEY.myInfo], data);
            alert('프로필 수정에 성공했습니다.');
        },
        onError: (error) => {
            console.log('프로필 수정 실패', error);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ 
                queryKey: [QUERY_KEY.myInfo] 
            })
        }
    })
}