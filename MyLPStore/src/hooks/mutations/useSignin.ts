import { useMutation } from '@tanstack/react-query';
import { postSignin } from '../../apis/auth';
import { RequestSigninDto } from '../../types/auth';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useSignin = () => {
    const { saveTokens } = useAuth();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (signinData: RequestSigninDto) => postSignin(signinData),
        onSuccess: (response) => {
            if (response.status) {
                saveTokens(response.data.accessToken, response.data.refreshToken);
                alert(`${response.data.name}님, 로그인 성공!`);
                navigate('/');
            } else {
                alert(response.message || '로그인에 실패했습니다.');
            }
        },
        onError: (error) => {
            console.error('로그인 에러:', error);
            alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    });
};
