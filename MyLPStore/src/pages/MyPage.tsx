import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyInfo } from '../apis/auth';
import { uploadImage } from '../apis/upload';
import { ResponseMyInfoDto } from '../types/auth';
import { useAuthStorage } from '../hooks/useAuthStorage';
import { useUpdateMyInfo } from '../hooks/mutations/useUpdateMyInfo';
import { useAuth } from '../contexts/AuthContext';

const MyPage = () => {
    const navigate = useNavigate();
    const { userInfo: contextUserInfo } = useAuth(); // AuthContext에서 사용자 정보 가져오기
    const [userInfo, setUserInfo] = useState<ResponseMyInfoDto['data'] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 수정 모달 상태
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editName, setEditName] = useState("");
    const [editBio, setEditBio] = useState("");
    const [editAvatar, setEditAvatar] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const { getAccessToken } = useAuthStorage();
    const updateMyInfoMutation = useUpdateMyInfo();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                if (!getAccessToken()) {
                    alert('로그인이 필요합니다.');
                    navigate('/login');
                    return;
                }

                // AuthContext에 사용자 정보가 있으면 우선 사용
                if (contextUserInfo?.data) {
                    setUserInfo(contextUserInfo.data);
                } else {
                    const response = await getMyInfo();
                    if (response.status) {
                        setUserInfo(response.data);
                    }
                }
            } catch (error) {
                console.error('사용자 정보 조회 에러:', error);
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserInfo();
    }, [navigate, contextUserInfo]);

    // 저장 버튼 클릭 - updateMyInfo 실행
    const handleSave = async () => {
        try {
            setIsUploading(true);
            
            // JSON 형태로 데이터 준비
            const updateData: { name: string; bio: string; avatar?: string } = {
                name: editName.trim(),
                bio: editBio.trim(),
            };

            // 새로운 프로필 사진이 선택된 경우 먼저 업로드
            if (editAvatar) {
                const uploadResponse = await uploadImage(editAvatar);
                if (uploadResponse.status && uploadResponse.data?.imageUrl) {
                    updateData.avatar = uploadResponse.data.imageUrl;
                    console.log("업로드된 이미지 URL:", uploadResponse.data.imageUrl);
                } else {
                    alert('이미지 업로드에 실패했습니다.');
                    return;
                }
            } else {
                // 새 이미지가 없으면 기존 avatar 유지
                if (userInfo?.avatar) {
                    updateData.avatar = userInfo.avatar;
                }
            }

            console.log("전송할 데이터:", updateData);

            // 프로필 정보 업데이트 (onMutate를 통해 즉시 UI 업데이트됨)
            updateMyInfoMutation.mutate(updateData, {
                onSuccess: (response) => {
                    console.log("수정 성공! 응답:", response);
                    
                    // 서버에서 받은 최신 데이터로 로컬 상태도 업데이트
                    if (response && response.status && response.data) {
                        setUserInfo(response.data);
                        alert('프로필이 수정되었습니다!');
                    }
                    
                    setIsEditOpen(false);
                    setEditAvatar(null);
                },
                onError: (error) => {
                    console.error('프로필 수정 실패:', error);
                    alert('프로필 수정에 실패했습니다.');
                }
            });

        } catch (error) {
            console.error('이미지 업로드 실패:', error);
            alert('이미지 업로드에 실패했습니다.');
        } finally {
            setIsUploading(false);
        }
    };

    if (isLoading) return <div className="text-white text-center mt-20">로딩 중...</div>;
    if (!userInfo) return <div className="text-white text-center mt-20">사용자 정보를 불러올 수 없습니다.</div>;

    return (
        <div className="flex flex-col items-center mt-20 min-h-screen gap-6 px-4">
            <div className="flex items-center justify-between w-[300px]">
                <button className="text-lg text-white" onClick={() => navigate("/")}>
                    &lt;
                </button>
                <div className="text-xl font-semibold text-white">
                    마이페이지
                </div>
                <div className="w-6"></div>
            </div>

            {/* 프로필 UI */}
            <div className="flex flex-col items-center gap-4 w-[300px]">
                <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                    {userInfo.avatar ? (
                        <img src={userInfo.avatar} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-white text-sm">No Img</span>
                    )}
                </div>

                <div className="text-center">
                    <h2 className="text-xl font-bold text-white mb-2">{userInfo.name}님</h2>
                    <p className="text-gray-300 text-sm mb-1">{userInfo.email}</p>
                    {userInfo.bio && (
                        <p className="text-gray-400 text-sm">{userInfo.bio}</p>
                    )}
                </div>

                {/* 설정 버튼 */}
                <button
                    onClick={() => {
                        setIsEditOpen(true);
                        setEditName(userInfo.name);
                        setEditBio(userInfo.bio ?? "");
                        setEditAvatar(null); // 파일 선택 초기화
                    }}
                    className="text-sm font-light text-pink-300 cursor-pointer hover:underline"
                >
                    프로필 수정
                </button>
            </div>
            

            {/* 프로필 수정 모달 */}
            {isEditOpen && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
                    <div className="bg-zinc-900 items-center rounded-lg p-6 w-80">

                        <div className="text-white text-lg font-semibold mb-4 text-center">프로필 수정</div>

                        <div className="mb-4">
                            
                            {/* 현재 프로필 사진 미리보기 */}
                            <div className="mb-2 flex flex-col items-center gap-2">
                                <div 
                                    className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => document.getElementById('profile-image-input')?.click()}
                                >
                                    {editAvatar ? (
                                        <img src={URL.createObjectURL(editAvatar)} className="w-full h-full object-cover" />
                                    ) : userInfo?.avatar ? (
                                        <img src={userInfo.avatar} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-white text-xs">이미지 없음</span>
                                    )}
                                </div>
                            </div>
                            
                            <input
                                id="profile-image-input"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setEditAvatar(e.target.files[0]);
                                    }
                                }}
                            />
                        </div>


                        <input
                            className="w-full p-2 mb-2 rounded bg-zinc-700 text-white"
                            placeholder="이름"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                        />

                        <textarea
                            className="w-full p-2 mb-2 rounded bg-zinc-700 text-white"
                            placeholder="소개"
                            value={editBio}
                            onChange={(e) => setEditBio(e.target.value)}
                        />

                        <div className="flex font-light text-sm justify-center gap-2">
                            <button
                                className="px-2 py-1 rounded bg-gray-600 text-white"
                                onClick={() => setIsEditOpen(false)}
                            >
                                취소
                            </button>

                            <button
                                className="px-2 py-1 rounded bg-pink-400 text-white disabled:bg-gray-500"
                                onClick={handleSave}
                                disabled={updateMyInfoMutation.isPending || isUploading}
                            >
                               저장
                            </button>
                        </div>
                    </div>

                    
                </div>
            )}
        </div>
    );
};

export default MyPage;
