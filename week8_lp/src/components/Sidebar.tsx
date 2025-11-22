import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { deleteMe } from '../apis/routes/deleteMe';
import { NavLink } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';
import { FiHome, FiSearch, FiUser } from 'react-icons/fi';

interface SidebarProps {
  isOpen: boolean;
  close: () => void;
  children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, close, children }) => {
  const menuItems = [
    { path: '/', icon: FiHome, label: '홈' },
    { path: '/search', icon: FiSearch, label: '찾기' },
    { path: '/mypage', icon: FiUser, label: '마이페이지' }
  ];

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const navigate = useNavigate();
  const withdrawMutation = useMutation({
    mutationFn: deleteMe,
    onSuccess: () => {
      // 탈퇴 성공 시 로그인 페이지로 이동
      navigate('/login');
    },
    onError: (error: any) => {
      let msg = '탈퇴에 실패했습니다.';
      if (error && error.response) {
        msg += '\n서버 응답: ' + JSON.stringify(error.response.data || error.response, null, 2);
        console.error('서버 응답:', error.response);
      } else if (error && error.request) {
        msg += '\n요청 자체 실패: ' + JSON.stringify(error.request, null, 2);
        console.error('요청 자체 실패:', error.request);
      } else {
        msg += '\n기타 에러: ' + String(error);
        console.error('기타 에러:', error);
      }
      alert(msg);
      console.error('❌ 탈퇴 실패:', error);
    },
  });

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={close}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
            display: window.innerWidth < 768 ? 'block' : 'none'
          }}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: '60px', // Header height
          left: isOpen ? '0' : '-240px',
          width: '240px',
          height: 'calc(100vh - 60px)',
          backgroundColor: '#000000',
          transition: 'left 0.3s ease',
          zIndex: 999,
          borderRight: '1px solid #333',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 0'
        }}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        <button
          className="absolute top-4 right-4"
          onClick={close}
          aria-label="사이드바 닫기"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          &times;
        </button>
        <nav style={{ flex: 1 }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => window.innerWidth < 768 && close()}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 24px',
                color: isActive ? '#ec4899' : '#9ca3af',
                textDecoration: 'none',
                backgroundColor: isActive ? 'rgba(236, 72, 153, 0.1)' : 'transparent',
                borderRight: isActive ? '3px solid #ec4899' : '3px solid transparent',
                transition: 'all 0.3s ease',
                fontSize: '16px',
                fontWeight: '500'
              })}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        {/* 탈퇴하기 버튼 */}
        <button
          style={{
            margin: '24px',
            padding: '12px',
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: 'auto'
          }}
          onClick={() => setShowWithdrawModal(true)}
        >
          탈퇴하기
        </button>
      </div>
      {/* 탈퇴 확인 모달 */}
      <ConfirmModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onConfirm={() => {
          withdrawMutation.mutate();
        }}
        isPending={withdrawMutation.isPending}
        message="정말로 회원 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다."
        confirmText="예"
        cancelText="아니오"
      />
    </>
  );
};

export default Sidebar;

