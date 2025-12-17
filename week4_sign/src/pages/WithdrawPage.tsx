import { useMutation } from '@tanstack/react-query';
import { deleteMe } from '../apis/routes/deleteMe';
import { LOCAL_STORAGE_KEY } from '../constants/key';
import { useNavigate } from 'react-router-dom';

const WithdrawPage = () => {
  const navigate = useNavigate();
  const withdrawMutation = useMutation({
    mutationFn: deleteMe,
    onSuccess: () => {
      // 토큰 삭제
      localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
      localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
      localStorage.removeItem(LOCAL_STORAGE_KEY.userData);
      // 홈으로 이동
      navigate('/');
    },
    onError: (error: any) => {
      alert('회원 탈퇴에 실패했습니다. 다시 시도해 주세요.');
      console.error('탈퇴 실패:', error);
    }
  });

  const handleWithdraw = () => {
    if (window.confirm('정말로 회원 탈퇴하시겠습니까?')) {
      withdrawMutation.mutate();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">회원 탈퇴</h2>
      <button
        className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600"
        onClick={handleWithdraw}
        disabled={withdrawMutation.isPending}
      >
        {withdrawMutation.isPending ? '탈퇴 중...' : '회원 탈퇴하기'}
      </button>
    </div>
  );
};

export default WithdrawPage;
