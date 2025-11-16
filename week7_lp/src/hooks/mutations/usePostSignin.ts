import { useMutation } from '@tanstack/react-query';
import { LOCAL_STORAGE_KEY, QUERY_KEY } from '../../constants/key';
import { queryClient } from '../../App';
import { postSignin } from '../../apis/auth';
import { useLocalStorage } from '../useLocalStorage';

export function usePostSignin() {
    const {setItem: setAccessToken} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const {setItem: setRefreshToken} = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    return useMutation({
        mutationFn: postSignin,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.myInfo],
            });
            alert('로그인 성공');
            console.log('로그인 성공', data);
            setAccessToken(data.data.accessToken);
            setRefreshToken(data.data.refreshToken);
            window.location.href = variables.redirectPath;
        },
        onError: (error) => {
            console.log('로그인 실패', error);
        },
    })
}