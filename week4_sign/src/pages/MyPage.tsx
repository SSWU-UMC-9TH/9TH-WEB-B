import { getMyInfo } from '../apis/auth'
import { updateMyInfo } from '../apis/routes/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react';
import MyInfoEditModal from '../components/MyInfoEditModal'
import type { ResponseMyInfoDto } from '../types/auth';
import { useAuth } from '../context/AuthContext';

const MyPage = () => {
    const {logout} = useAuth();
    const [editOpen, setEditOpen] = useState(false);

    // React Query로 내 정보 조회
    const { data, isLoading, refetch } = useQuery<ResponseMyInfoDto>({
        queryKey: ['myInfo'],
        queryFn: getMyInfo
    });

    // React Query QueryClient 사용
    const queryClient = useQueryClient();
    // 내 정보 수정 useMutation
    const updateMutation = useMutation({
        mutationFn: async (form: { name: string; bio?: string; avatar?: string }) => {
            try {
                return await updateMyInfo(form);
            } catch (err) {
                console.error('[mutationFn] updateMyInfo 에러 발생', err);
                throw err;
            }
        },
        onSuccess: () => {
            setEditOpen(false);
            // React Query 캐시 무효화로 최신 정보 강제 갱신
            queryClient.invalidateQueries({ queryKey: ['myInfo'] });
            refetch(); // 정보 즉시 갱신
        },
        onError: (error: any) => {
            console.log('[onError] 회원정보 수정 onError 진입');
            alert('정보 수정에 실패했습니다.');
            // 에러 전체를 항상 콘솔에 출력
            console.error('❌ 내 정보 수정 실패:', error);
            if (error && error.response) {
                console.error('서버 응답:', error.response);
            }
        },
    });



    const handleLogout = async () => {
        await logout();
    }

    if (isLoading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='text-xl text-gray-400'>로딩 중...</div>
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen gap-6'>
            <div className='flex flex-col items-center gap-4'>
                {/* 프로필 이미지 */}
                <div className='w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center'>
                    {data?.data?.avatar ? (
                        <img
                            src={data.data.avatar}
                            alt="프로필 이미지"
                            className='w-full h-full object-cover'
                        />
                    ) : (
                        <div className='text-4xl text-gray-400'>👤</div>
                    )}
                </div>
                                {/* 이름(닉네임) */}
                                                <h1 className='text-2xl font-bold text-center text-white'>
                                                        {data?.data?.name || '사용자'}님 환영합니다!
                                                </h1>
                                                {/* 이메일 정보 */}
                                                <p className='text-gray-300'>{data?.data?.email}</p>
                                                {/* bio(설명) - 항상 표시, 없으면 빈 칸 */}
                                                <p className='text-white min-h-[1.5em]'>
                                                    {data?.data?.bio ?? ''}
                                                </p>
                {/* 설정(정보수정) 버튼 */}
                <button
                    className='bg-gray-500 text-white rounded-lg px-6 py-2 hover:bg-gray-600 transition-colors mt-2'
                    onClick={() => setEditOpen(true)}
                >
                    설정
                </button>
                {/* 로그아웃 버튼 */}
                <button
                    className='cursor-pointer bg-blue-500 text-white rounded-lg px-8 py-3 hover:bg-blue-600 transition-colors mt-2'
                    onClick={handleLogout}
                >
                    로그아웃
                </button>
            </div>
            {/* 내 정보 수정 모달 */}
            <MyInfoEditModal
                isOpen={editOpen}
                onClose={() => setEditOpen(false)}
                initialName={data?.data?.name || ''}
                initialBio={data?.data?.bio || ''}
                initialAvatar={data?.data?.avatar || ''}
                onSubmit={form => updateMutation.mutate(form)}
                isPending={updateMutation.isPending}
            />
        </div>
    );
};

export default MyPage;

