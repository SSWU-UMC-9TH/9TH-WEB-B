import { useMutation } from '@tanstack/react-query';
import { postSignout } from '../../apis/auth';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useSignout = () => {
    const { clearTokens } = useAuth();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: () => postSignout(),
        onSuccess: (response) => {
            if (response.status) {
                clearTokens();
                alert('회원탈퇴가 완료되었습니다.');
                navigate('/');
            } else {
                alert(response.message || '회원탈퇴에 실패했습니다.');
            }
        },
        onError: (error) => {
            console.error('회원탈퇴 에러:', error);
            alert('회원탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    });
};
