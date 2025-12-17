import React, { useState } from 'react';
import Modal from './Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialName: string;
  initialBio: string;
  initialAvatar: string;
  onSubmit: (form: { name: string; bio?: string; avatar?: string }) => void;
  isPending?: boolean;
}


const MyInfoEditModal: React.FC<Props> = ({ isOpen, onClose, initialName, initialBio, initialAvatar, onSubmit, isPending }) => {
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState(initialAvatar);

  // 모달이 열릴 때마다 최신값으로 동기화
  React.useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setBio(initialBio);
      setAvatar(null);
      setPreview(initialAvatar);
    }
  }, [isOpen, initialName, initialBio, initialAvatar]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[MyInfoEditModal] 회원정보 수정 요청 시작', { name, bio, avatar, preview });
    try {
      // bio, avatar가 빈 문자열이어도 undefined로 보내지 않고 ''로 보냄
      onSubmit({
        name,
        bio: bio ?? '',
        avatar: preview ?? ''
      });
      console.log('[MyInfoEditModal] onSubmit 호출 완료');
    } catch (err) {
      console.error('[MyInfoEditModal] onSubmit 중 에러', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full min-w-[320px]">
        <h2 className="text-xl font-bold mb-2">내 정보 수정</h2>
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {preview ? (
              <img src={preview} alt="프로필 미리보기" className="w-full h-full object-cover" />
            ) : (
              <div className="text-3xl text-gray-400">👤</div>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <input
          className="border rounded px-3 py-2"
          placeholder="이름"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <textarea
          className="border rounded px-3 py-2"
          placeholder="소개 (bio, 옵션)"
          value={bio}
          onChange={e => setBio(e.target.value)}
        />
        <button type="submit" className="bg-pink-500 text-white rounded px-4 py-2 mt-2" disabled={isPending}>
          {isPending ? '저장 중...' : '저장'}
        </button>
      </form>
    </Modal>
  );
};

export default MyInfoEditModal;
