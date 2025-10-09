import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyInfo, postLogout } from '../apis/auth';
import { ResponseMyInfoDto } from '../types/auth';
import { useAuth } from '../hooks/useAuth';

const MyPage = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState<ResponseMyInfoDto['data'] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLogoutLoading, setIsLogoutLoading] = useState(false);
    const { isAuthenticated, clearTokens } = useAuth();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                if (!isAuthenticated()) {
                    alert('로그인이 필요합니다.');
                    navigate('/login');
                    return;
                }

                const response = await getMyInfo();
                if (response.status) {
                    setUserInfo(response.data);
                } else {
                    alert('사용자 정보를 불러올 수 없습니다.');
                    navigate('/login');
                }
            } catch (error) {
                console.error('사용자 정보 조회 에러:', error);
                alert('사용자 정보를 불러오는 중 오류가 발생했습니다.');
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserInfo();
    }, [navigate]);

    const handleLogout = async () => {
        setIsLogoutLoading(true);
        try {
            await postLogout();
            clearTokens();
            
            alert('로그아웃되었습니다.');
            navigate('/');
        } catch (error) {
            console.error('로그아웃 에러:', error);
            // 에러가 발생해도 토큰 제거
            clearTokens();
            
            navigate('/');
        } finally {
            setIsLogoutLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="text-white text-lg">로딩 중...</div>
            </div>
        );
    }

    if (!userInfo) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="text-white text-lg">사용자 정보를 불러올 수 없습니다.</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center h-full gap-6 mt-20">
            <div className="flex items-center justify-between w-[300px]">
                <button 
                    className="text-lg cursor-pointer text-white"
                    onClick={() => navigate("/")}
                >
                    &lt;
                </button>
                <div className="text-xl font-semibold text-white pr-3">
                    마이페이지
                </div>
                <div className="blank"></div>
            </div>

            <div className="flex flex-col items-center gap-4 w-[300px]">
                <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center">
                </div>

                <div className="text-center">
                    <h2 className="text-xl font-bold text-white mb-2">
                        {userInfo.name}님
                    </h2>
                    <p className="text-gray-300 text-sm mb-1">
                        {userInfo.email}
                    </p>
                    {userInfo.bio && (
                        <p className="text-gray-400 text-sm">
                            {userInfo.bio}
                        </p>
                    )}
                </div>

                <button
                    onClick={handleLogout}
                    disabled={isLogoutLoading}
                    className={`p-3 py-1 rounded-md text-sm font-semibold transition-all duration-200 ${
                        isLogoutLoading
                            ? "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                            : "bg-pink-300 text-white hover:bg-pink-400 active:bg-pink-500 shadow-lg hover:shadow-xl"
                    }`}
                > 로그아웃
                </button>
            </div>
        </div>
    );
};

export default MyPage;