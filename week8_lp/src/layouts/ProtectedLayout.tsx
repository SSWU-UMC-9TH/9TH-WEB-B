import React, { useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import useSidebar from '../hooks/useSidebar';

const ProtectedLayout = () => {
    const {accessToken} = useAuth();
    const location = useLocation();
    
    const { isSidebarOpen, toggle, close } = useSidebar();

    if (!accessToken) {
        alert('로그인이 필요한 서비스입니다. 로그인을 해주세요!');
        return <Navigate to={"/login"} state={{ from: location }} replace />
    }
    
    return (
        <div className='h-dvh flex flex-col'>
            <Navbar onSidebarClick={toggle}/>
            <div className='flex flex-1 '>
                <Sidebar 
                    isOpen={isSidebarOpen} 
                    onClose={close} 
                />
                <main className='flex-1 bg-black text-white overflow-y-auto'>
                    <Outlet />
                </main>
            </div>
            <footer className='bg-black'>푸터</footer>
        </div>
        )
    }

export default ProtectedLayout
