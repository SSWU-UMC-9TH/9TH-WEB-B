import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();
  const [userName, setUserName] = useState('');

  // 사용자 정보 가져오기
  useEffect(() => {
    if (accessToken) {
      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.name || '사용자');
        }
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error);
        setUserName('사용자');
      }
    } else {
      setUserName('');
    }
  }, [accessToken]);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      navigate('/');
    },
    onError: (error: any) => {
      alert('로그아웃에 실패했습니다.');
      console.error('❌ 로그아웃 실패:', error);
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header style={{
      height: '60px',
      backgroundColor: '#000000',
      borderBottom: '1px solid #333',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000
    }}>
      {/* Left side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          style={{
            display: 'block',
            padding: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'white'
          }}
        >
          <FiMenu size={20} />
        </button>

        {/* Logo */}
        <Link 
          to="/" 
          style={{
            color: '#ec4899',
            fontSize: '24px',
            fontWeight: 'bold',
            textDecoration: 'none',
            fontFamily: 'Arial, sans-serif'
          }}
        >
          돌려돌려LP판
        </Link>
      </div>

      {/* 검색창 제거됨 */}
      <div style={{ flex: 1 }}></div>

      {/* Right side - Auth buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        {accessToken ? (
          <>
            <span style={{
              color: '#9ca3af',
              fontSize: '14px',
              marginRight: '8px'
            }}>
              {userName}님 반갑습니다.
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #ec4899',
                borderRadius: '20px',
                color: '#ec4899',
                fontSize: '14px',
                cursor: logoutMutation.isPending ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                opacity: logoutMutation.isPending ? 0.6 : 1
              }}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #666',
                borderRadius: '20px',
                color: 'white',
                fontSize: '14px',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              로그인
            </Link>
            <Link
              to="/signup"
              style={{
                padding: '8px 16px',
                backgroundColor: '#ec4899',
                border: 'none',
                borderRadius: '20px',
                color: 'white',
                fontSize: '14px',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;


