import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiX, FiImage } from 'react-icons/fi';

const LpCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 여기서는 mock으로 처리
    setTimeout(() => {
      alert('LP가 성공적으로 생성되었습니다!');
      navigate('/lps');
    }, 1000);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '24px 16px',
      color: 'white'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700'
        }}>
          새 LP 만들기
        </h1>
        
        <button
          onClick={handleCancel}
          style={{
            padding: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#9ca3af',
            borderRadius: '4px'
          }}
        >
          <FiX size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px',
            color: '#e5e7eb'
          }}>
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="LP 제목을 입력하세요"
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px'
            }}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px',
            color: '#e5e7eb'
          }}>
            썸네일 URL
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="url"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://example.com/image.jpg"
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px'
              }}
            />
            <FiImage style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }} size={20} />
          </div>
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px',
            color: '#e5e7eb'
          }}>
            내용
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="LP에 대한 설명을 작성하세요..."
            required
            rows={6}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              resize: 'vertical' as const
            }}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px',
            color: '#e5e7eb'
          }}>
            태그 (쉼표로 구분)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="예: Jazz, Chill, Night"
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          marginTop: '24px'
        }}>
          <button
            type="button"
            onClick={handleCancel}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#9ca3af',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            취소
          </button>
          
          <button
            type="submit"
            disabled={isLoading || !title || !content}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: isLoading || !title || !content ? '#374151' : '#ec4899',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: isLoading || !title || !content ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <FiSave size={16} />
            {isLoading ? '저장 중...' : 'LP 생성'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LpCreatePage;


