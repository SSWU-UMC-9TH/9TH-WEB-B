import { useMutation } from '@tanstack/react-query';
import { postLogout } from '../../apis/auth';
import { LOCAL_STORAGE_KEY, QUERY_KEY } from '../../constants/key';
import { queryClient } from '../../App';
import { useLocalStorage } from '../useLocalStorage';

export function usePostLogout() {
    const {removeItem: removeAccessTokenFromStorage} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const {removeItem: removeRefreshTokenFromStorage} = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    return useMutation({
        mutationFn: () => postLogout(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.myInfo],
            })
            alert('로그아웃되었습니다.');
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();
            window.location.href = '/login';
        },
        onError: (error) => {
            console.log('로그아웃 실패', error);
            alert('로그아웃에 실패했습니다.');
        },
    })
}