import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FiSave } from 'react-icons/fi';
import { createLp } from '../apis/routes/lp';
import axios from 'axios'; // 이미지 업로드용
import { useEffect } from 'react';

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
    if (!file) {
      console.log('[썸네일 업로드] 파일 미선택');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      console.log('[썸네일 업로드] 업로드 시작:', file);
      // 인증 필요 없는 public 업로드 엔드포인트 사용
      const res = await axios.post('/v1/uploads/public', formData, {
        baseURL: import.meta.env.VITE_SERVER_API_URL,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const url = res.data.url || res.data.data?.url || '';
      setThumbnail(url);
      console.log('[썸네일 업로드] 업로드 성공, URL:', url, '응답:', res.data);
    } catch (err) {
      alert('이미지 업로드에 실패했습니다.');
      setThumbnail('');
      console.error('[썸네일 업로드] 업로드 실패:', err);
    } finally {
      setUploading(false);
      console.log('[썸네일 업로드] 업로드 종료, 현재 thumbnail 상태:', thumbnail);
    }
  };

  const createMutation = useMutation({
    mutationFn: async (lpData: {
      title: string;
      content: string;
      thumbnail: string;
      tags: string[];
      published: boolean;
    }) => {
      return await createLp(lpData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpList'] });
      alert('LP가 성공적으로 생성되었습니다!');
      navigate('/lps', { replace: true });
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
  // 썸네일 상태 변화 로그
  useEffect(() => {
    console.log('[썸네일 상태 변경] thumbnail:', thumbnail);
  }, [thumbnail]);

  return (
    <div className="p-4" style={{ paddingTop: 80 }}>
      <h1 className="text-2xl font-bold mb-4">LP 생성</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          const fileInput = (e.currentTarget.elements.namedItem('thumbnail') as HTMLInputElement);
          console.log('[LP 생성] 현재 thumbnail 상태:', thumbnail);
          if (!thumbnail) {
            alert('썸네일 이미지를 업로드하고 URL을 입력하세요.');
            console.warn('[LP 생성] 썸네일이 비어있음! thumbnail:', thumbnail);
            return;
          }
          if (fileInput) fileInput.value = '';
          const lpData = {
            title,
            content,
            thumbnail,
            tags: tags.map(t => t.text),
            published: true
          };
          console.log('[LP 생성] 전송 데이터:', lpData);
          createMutation.mutate(lpData);
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
          <div className="flex gap-2">
            <input
              type="file"
              accept="image/*"
              name="thumbnail"
              className="flex-1 p-2 border border-gray-300 rounded-md text-white bg-gray-800"
              disabled={uploading || !!thumbnail}
              onChange={e => {
                const file = e.target.files?.[0];
                // 파일이 실제로 바뀌었고, 업로드된 썸네일이 없는 경우에만 상태를 비움
                if (file && !thumbnail) {
                  setThumbnail('');
                  alert('이미지 파일을 다시 선택하셨으니 반드시 [업로드] 버튼을 눌러주세요!');
                }
              }}
            />
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-500"
              disabled={uploading}
              onClick={async (e) => {
                const fileInput = document.querySelector('input[name="thumbnail"]') as HTMLInputElement;
                const file = fileInput?.files?.[0];
                if (!file) {
                  alert('업로드할 이미지를 먼저 선택하세요.');
                  console.log('[썸네일 업로드] 파일 미선택');
                  return;
                }
                setUploading(true);
                try {
                  const formData = new FormData();
                  formData.append('file', file);
                  console.log('[썸네일 업로드] 업로드 시작:', file);
                  const res = await axios.post('/v1/uploads/public', formData, {
                    baseURL: import.meta.env.VITE_SERVER_API_URL,
                    headers: { 'Content-Type': 'multipart/form-data' }
                  });
                  const url = res.data.url || res.data.data?.url || '';
                  setThumbnail(() => {
                    // setState 콜백으로 최신값 즉시 반영
                    setTimeout(() => {
                      if (fileInput) fileInput.disabled = true;
                    }, 0);
                    return url;
                  });
                  alert('이미지 업로드 성공!');
                  console.log('[썸네일 업로드] 업로드 성공, URL:', url, '응답:', res.data);
                } catch (err) {
                  alert('이미지 업로드에 실패했습니다. (자세한 내용은 콘솔 참고)');
                  setThumbnail('');
                  console.error('[썸네일 업로드] 업로드 실패:', err);
                } finally {
                  setUploading(false);
                  setTimeout(() => {
                    console.log('[썸네일 업로드] 업로드 종료, 최신 thumbnail 상태:', thumbnail);
                  }, 0);
                }
              }}
            >
              {uploading ? '업로드 중...' : '업로드'}
            </button>
          </div>
          {thumbnail && (
            <div className="mt-2 text-white text-sm break-all">
              <div className="mb-1">업로드된 이미지 미리보기:</div>
              <img src={thumbnail} alt="썸네일 미리보기" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8, marginBottom: 8, background: '#222' }} />
              <div>
                URL: <a href={thumbnail} target="_blank" rel="noopener noreferrer" className="underline text-blue-300">{thumbnail}</a>
              </div>
              <input
                type="text"
                value={thumbnail}
                readOnly
                className="w-full mt-1 p-1 bg-gray-900 text-gray-200 text-xs rounded"
                style={{ fontSize: '12px' }}
              />
              <button
                type="button"
                className="ml-2 mt-2 px-2 py-1 bg-gray-700 text-white rounded text-xs"
                onClick={() => {
                  setThumbnail('');
                  // 파일 input 다시 활성화
                  const fileInput = document.querySelector('input[name="thumbnail"]') as HTMLInputElement;
                  if (fileInput) fileInput.disabled = false;
                }}
              >썸네일 다시 선택</button>
            </div>
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
            disabled={createMutation.isPending || !title || !content || !thumbnail}
            className="flex items-center justify-center gap-2 px-4 py-2 w-full"
            style={{
              backgroundColor: createMutation.isPending || !title || !content || !thumbnail ? '#374151' : '#ec4899',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: createMutation.isPending || !title || !content || !thumbnail ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <FiSave size={16} />
            {createMutation.isPending ? '저장 중...' : 'LP 생성'}
          </button>
          {!thumbnail && (
            <div className="text-xs text-pink-400 mt-2">※ 이미지를 업로드하고 "업로드 성공!" 알림을 받은 후에만 LP 생성이 가능합니다.</div>
          )}
        </div>
      </form>
    </div>
  );
};

export default LpCreatePage;


