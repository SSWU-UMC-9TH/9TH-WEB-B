import { useMutation } from '@tanstack/react-query';
import { deleteLp } from '../../apis/lp';
import { QUERY_KEY } from '../../constants/key';
import { queryClient } from '../../App';
import { useNavigate } from 'react-router-dom';

export function useDeleteLp() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: ({ lpId }) => deleteLp(lpId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lpComments],
            })
            alert('LP가 삭제되었습니다.');
            navigate('/');
            
        },
        onError: (error) => {
            console.log('LP 삭제 실패', error);
            alert('LP 삭제에 실패했습니다.');
        },
    })
}