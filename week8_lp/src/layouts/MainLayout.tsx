import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FloatingButton from '../components/FloatingButton';
import { useSidebar } from '../hooks/useSidebar';

const MainLayout: React.FC = () => {
  const { isOpen, open, close, toggle } = useSidebar();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#000000'
    }}>
      <Header onMenuToggle={toggle} />
      
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        <Sidebar isOpen={isOpen} close={close} />
        
        <main style={{
          flex: 1,
          padding: '20px',
          backgroundColor: '#111111',
          overflow: 'auto',
          marginLeft: window.innerWidth >= 768 && isOpen ? '240px' : '0',
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


