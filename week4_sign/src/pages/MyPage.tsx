import { getMyInfo } from '../apis/auth'
import { updateMyInfo } from '../apis/routes/user'
import { getUserLpList } from '../apis/routes/lp'
import type { LpListResponse } from '../types/lp';
import { getLikedLpList } from '../apis/routes/likedLpList';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react';
import MyInfoEditModal from '../components/MyInfoEditModal'
import LpCard from '../components/LpCard';
import type { ResponseMyInfoDto } from '../types/auth';
import type { LpData } from '../types/lp';
import { useAuth } from '../context/AuthContext';

const MyPage = () => {
    const {logout} = useAuth();
    const [editOpen, setEditOpen] = useState(false);
    const [tab, setTab] = useState<'liked' | 'mine'>('liked');

    // React Query로 내 정보 조회
    const { data, isLoading, refetch } = useQuery<ResponseMyInfoDto>({
        queryKey: ['myInfo'],
        queryFn: getMyInfo
    });
    const myId = data?.data?.id ? String(data.data.id) : '';

    // 내가 작성한 LP
    const { data: myLpList } = useQuery<LpListResponse>({
        queryKey: ['myLpList', myId],
        queryFn: () => getUserLpList(myId!),
        enabled: !!myId
    });
    // 내가 좋아요한 LP (API 사용)
    const { data: likedLpList } = useQuery<LpListResponse>({
        queryKey: ['likedLpList', myId],
        queryFn: getLikedLpList,
        enabled: !!myId
    });

    // React Query QueryClient 사용
    const queryClient = useQueryClient();
    // 좋아요/좋아요 취소 후 목록 최신화용 invalidate 함수
    const invalidateLikedLpList = () => queryClient.invalidateQueries({ queryKey: ['likedLpList', myId] });
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
        <div className='flex flex-col items-center min-h-screen gap-6 bg-black'>
            <div className='flex flex-col items-center gap-4 pt-10'>
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
                {/* 이름(닉네임) - 인풋 스타일 */}
                <input
                    className='text-2xl font-bold text-center text-white bg-transparent border border-blue-400 rounded px-2 py-1 w-48 focus:outline-none focus:ring-2 focus:ring-blue-400'
                    value={data?.data?.name || ''}
                    readOnly
                />
                {/* bio(설명) - 인풋 스타일 */}
                <input
                    className='text-center text-white bg-transparent border border-gray-400 rounded px-2 py-1 w-48 focus:outline-none focus:ring-2 focus:ring-gray-400'
                    value={data?.data?.bio || ''}
                    readOnly
                />
                {/* 이메일 정보 */}
                <p className='text-gray-300'>{data?.data?.email}</p>
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
            {/* 탭 */}
            <div className='flex justify-center gap-8 mt-8 border-b border-gray-700 w-full max-w-2xl'>
                <button
                    className={`px-4 py-2 text-lg font-semibold ${tab === 'liked' ? 'text-white border-b-2 border-pink-400' : 'text-gray-500'}`}
                    onClick={() => setTab('liked')}
                >
                    내가 좋아요 한 LP
                </button>
                <button
                    className={`px-4 py-2 text-lg font-semibold ${tab === 'mine' ? 'text-white border-b-2 border-pink-400' : 'text-gray-500'}`}
                    onClick={() => setTab('mine')}
                >
                    내가 작성한 LP
                </button>
            </div>
            {/* LP 목록 */}
            <div className='w-full max-w-2xl grid grid-cols-2 md:grid-cols-3 gap-6 py-8'>
                {tab === 'liked'
                    ? (likedLpList?.data?.data && likedLpList.data.data.length > 0
                        ? likedLpList.data.data.map((lp: LpData) => <LpCard key={lp.id} lp={lp} />)
                        : <div className='col-span-2 text-gray-400 text-center'>좋아요한 LP가 없습니다.</div>
                    )
                    : (myLpList?.data?.data && myLpList.data.data.length > 0
                        ? myLpList.data.data.map((lp: LpData) => <LpCard key={lp.id} lp={lp} />)
                        : <div className='col-span-2 text-gray-400 text-center'>작성한 LP가 없습니다.</div>
                    )
                }
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

