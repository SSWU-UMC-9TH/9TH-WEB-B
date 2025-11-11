import { useEffect, useState } from 'react'
import { getMyInfo } from '../apis/auth'
import type { ResponseMyInfoDto } from '../types/auth';
import { useAuth } from '../context/AuthContext';

const MyPage = () => {
    const {logout} = useAuth();
    const [data, setData] = useState<ResponseMyInfoDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                setIsLoading(true);
                const response = await getMyInfo();
                console.log('사용자 정보:', response);
                setData(response);
            } catch (error: any) {
                const status = error?.response?.status;
                // 401/404는 인터셉터/보호라우팅이 처리하므로 과도한 에러 출력 방지
                if (status !== 401 && status !== 404) {
                    console.warn('사용자 정보 조회 실패:', error);
                }
            } finally {
                setIsLoading(false);
            }
        }
        getData();
    }, []);

    const handleLogout = async () => {
        await logout();
        // navigate는 AuthContext에서 처리하므로 제거
    }

    // 로딩 중일 때
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
                
                {/* 환영 메시지 */}
                <h1 className='text-2xl font-bold text-center'>
                    {data?.data?.name || '사용자'}님 환영합니다!
                </h1>
                
                {/* 이메일 정보 */}
                <p className='text-gray-600'>{data?.data?.email}</p>
                
                {/* 로그아웃 버튼 */}
                <button 
                    className='cursor-pointer bg-blue-500 text-white rounded-lg px-8 py-3 hover:bg-blue-600 transition-colors mt-4'
                    onClick={handleLogout}
                >
                    로그아웃
                </button>
            </div>
        </div>
    )
}

export default MyPage

