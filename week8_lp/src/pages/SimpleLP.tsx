import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMockLpList } from '../data/mockData';

const LpListPage = () => {
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [lpData, setLpData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const response = getMockLpList({ order: sortOrder, limit: 12 });
        setLpData(response?.data?.data || []);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [sortOrder]);

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = getMockLpList({ order: sortOrder, limit: 12 });
      setLpData(response?.data?.data || []);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
        <h1>LP 목록</h1>
        <div>로딩 중...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
        <h1>LP 목록</h1>
        <div>오류가 발생했습니다.</div>
        <button onClick={handleRefresh}>다시 시도</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>LP 목록</h1>
        <button 
          onClick={handleSortToggle}
          style={{ 
            backgroundColor: '#374151', 
            color: '#fff', 
            border: 'none', 
            padding: '8px 16px', 
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          {sortOrder === 'desc' ? '최신순' : '오래된순'}
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        {lpData.map((lp) => (
          <div 
            key={lp.id}
            onClick={() => navigate(`/lps/${lp.id}`)}
            style={{ 
              backgroundColor: '#1f2937', 
              borderRadius: '8px', 
              padding: '16px',
              cursor: 'pointer',
              border: '1px solid #374151'
            }}
          >
            <img 
              src={lp.thumbnail} 
              alt={lp.title}
              style={{ 
                width: '100%', 
                height: '200px', 
                objectFit: 'cover', 
                borderRadius: '8px',
                marginBottom: '12px'
              }}
            />
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{lp.title}</h3>
            <p style={{ margin: '0 0 8px 0', color: '#9ca3af', fontSize: '14px' }}>
              {lp.author.nickname}
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {lp.tags.map(tag => (
                <span 
                  key={tag.id}
                  style={{ 
                    backgroundColor: '#ec4899', 
                    color: '#fff', 
                    padding: '4px 8px', 
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button
          onClick={handleRefresh}
          style={{
            backgroundColor: '#ec4899',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          새로고침
        </button>
      </div>
    </div>
  );
};

export default LpListPage;

