import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiSearch, FiUser } from 'react-icons/fi';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const menuItems = [
    { path: '/', icon: FiHome, label: '홈' },
    { path: '/lps', icon: FiSearch, label: 'LP 찾기' },
    { path: '/mypage', icon: FiUser, label: '마이페이지' }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
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
      >
        <nav style={{ flex: 1 }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => window.innerWidth < 768 && onClose()}
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
      </div>
    </>
  );
};

export default Sidebar;


