import { useMutation } from '@tanstack/react-query';
import { deleteMe } from '../../apis/auth';
import { LOCAL_STORAGE_KEY, QUERY_KEY } from '../../constants/key';
import { queryClient } from '../../App';
import { useLocalStorage } from '../useLocalStorage';

export function useDeleteMe() {
    const {removeItem: removeAccessTokenFromStorage} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const {removeItem: removeRefreshTokenFromStorage} = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    return useMutation({
        mutationFn: () => deleteMe(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.myInfo],
            })
            alert('탈퇴되었습니다.');
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();
            window.location.replace('/login');
        },
        onError: (error) => {
            console.log('탈퇴 실패', error);
            alert('탈퇴에 실패했습니다.');
        },
    })
}