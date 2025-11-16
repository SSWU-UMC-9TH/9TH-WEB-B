import { useEffect } from 'react'
import { axiosInstance } from '../apis/axios';
import { useState } from "react";
import lpimg from "../assets/lpimg.png";
import { useMutation } from "@tanstack/react-query";

const Mypage = () => {
  const [preview] = useState<string>(lpimg);
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axiosInstance.get('/v1/users/me');
        setUser(response.data.data);
      } catch (error) {
        console.error('유저 정보 불러오기 실패:', error);
      }
    };
    getData();
  }, []);

  const updateUserMutation = useMutation({
  mutationFn: async ({ name, bio }: { name: string; bio: string }) => {
    const body = {
      name,
      bio,
      avatar: user?.avatar ?? null   // Swagger 기준 문자열 URL
    };

    const { data } = await axiosInstance.patch("/v1/users", body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data;
  },

  onSuccess: (data) => {
    setUser(data.data);      // 최신 user 갱신
    setEditName(data.data.name);
    setEditBio(data.data.bio);
    setIsEditing(false);
  },

  onError: (error) => {
    console.error("프로필 수정 실패:", error);
    alert("프로필 수정에 실패했습니다. 다시 시도해주세요.");
  },
});
  return (
    <div className="relative flex flex-col items-center justify-center mt-10 px-4 text-white">

      {/* 설정 버튼 */}
      <button
        className="absolute top-6 right-6 text-black hover:text-gray-300 text-2xl"
        onClick={() => {
          if (isEditing) {
            updateUserMutation.mutate({
              name: editName,
              bio: editBio,
            });
          } else {
            setEditName(user?.name || "");
            setEditBio(user?.bio || "");
            setIsEditing(true);
          }
        }}
      >
        {isEditing ? "☑️" : "⚙️"}
      </button>

      {/* 프로필 섹션 */}
      <div className="flex items-center gap-6 mt-10">
        {/* 프로필 이미지 */}
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
          <img
            src={user?.avatar || lpimg}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 이름 / Bio */}
        <div className="flex flex-col">
          {isEditing ? (
            <>
              <input
                className="p-2 border rounded text-black text-lg font-bold"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <input
                className="p-2 border rounded text-black text-md mt-2"
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
              />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-black">{user?.name || "이름 없음"}</h2>
              <p className="text-gray-500 text-lg mt-2">
                {user?.bio || "아직 소개가 없습니다."}
              </p>
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default Mypage;