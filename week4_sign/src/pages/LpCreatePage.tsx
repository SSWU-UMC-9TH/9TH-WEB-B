import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FiSave } from 'react-icons/fi';
import { createLp } from '../apis/routes/lp';
import axios from 'axios'; // 이미지 업로드용

const LpCreatePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [uploading, setUploading] = useState(false);
  const [tags, setTags] = useState<{ id: number; text: string }[]>([]);
  const [tagInput, setTagInput] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 이미지 업로드 핸들러
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      // 인증 필요 없는 public 업로드 엔드포인트 사용
      const res = await axios.post('/v1/uploads/public', formData, {
        baseURL: import.meta.env.VITE_SERVER_API_URL,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setThumbnail(res.data.url || res.data.data?.url || '');
    } catch (err) {
      alert('이미지 업로드에 실패했습니다.');
      setThumbnail('');
      console.error('이미지 업로드 에러:', err);
    } finally {
      setUploading(false);
    }
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      return await createLp({
        title,
        content,
        thumbnail, // 업로드된 이미지 URL
        tags: tags.map(t => t.text),
        published: true
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpList'] });
      alert('LP가 성공적으로 생성되었습니다!');
      navigate('/lps', { replace: true }); // 강제 새로고침 효과
    },
    onError: (err: any) => {
      let msg = 'LP 생성에 실패했습니다.';
      if (err?.response?.data?.message) {
        msg += `\n${err.response.data.message}`;
      }
      alert(msg);
      console.error('❌ LP 생성 실패:', err);
    }
  });

  // 태그 추가
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.some(t => t.text === tagInput.trim())) {
      setTags([...tags, { id: Date.now(), text: tagInput.trim() }]);
      setTagInput('');
    }
  };

  return (
    <div className="p-4" style={{ paddingTop: 80 }}>
      <h1 className="text-2xl font-bold mb-4">LP 생성</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          createMutation.mutate();
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">제목</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-white bg-gray-800"
            placeholder="LP 제목을 입력하세요"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">내용</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-white bg-gray-800"
            placeholder="LP 내용을 입력하세요"
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">썸네일 이미지 업로드</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md text-white bg-gray-800"
            disabled={uploading}
          />
          {uploading && <div className="text-sm text-gray-400 mt-1">업로드 중...</div>}
          {thumbnail && (
            <div className="mt-2 text-white text-sm break-all">업로드된 이미지 URL: {thumbnail}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">태그</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md text-white bg-gray-800"
              placeholder="태그를 입력하세요"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              추가
            </button>
          </div>
          <div className="mt-2">
            {tags.map(tag => (
              <span
                key={tag.id}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-medium mr-2"
              >
                {tag.text}
                <button
                  type="button"
                  onClick={() => setTags(tags.filter(t => t.id !== tag.id))}
                  className="ml-2 text-gray-500"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
        <div>
          <button
            type="submit"
            disabled={createMutation.isPending || !title || !content}
            className="flex items-center justify-center gap-2 px-4 py-2 w-full"
            style={{
              backgroundColor: createMutation.isPending || !title || !content ? '#374151' : '#ec4899',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: createMutation.isPending || !title || !content ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <FiSave size={16} />
            {createMutation.isPending ? '저장 중...' : 'LP 생성'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LpCreatePage;


