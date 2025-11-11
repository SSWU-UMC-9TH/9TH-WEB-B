import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FloatingButton from '../components/FloatingButton';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#000000'
    }}>
      <Header onMenuToggle={toggleSidebar} />
      
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        
        <main style={{
          flex: 1,
          padding: '20px',
          backgroundColor: '#111111',
          overflow: 'auto',
          marginLeft: window.innerWidth >= 768 && sidebarOpen ? '240px' : '0',
          transition: 'margin-left 0.3s ease',
          minHeight: 'calc(100vh - 60px)'
        }}>
          <Outlet />
        </main>
      </div>
      
      <FloatingButton />
    </div>
  );
};

export default MainLayout;


