import React, { useCallback, useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import FloatingButton from '../components/FloatingButton';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const ProtectedLayout = () => {
    const DESKTOP_BREAKPOINT = 768;
    const {accessToken} = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const handleSidebarToggle = () => {
        setIsSidebarOpen(prev => !prev);
    }

    const isDesktopModeRef = React.useRef(window.innerWidth >= DESKTOP_BREAKPOINT);

    const handleResize = useCallback(() => {
        const currentIsDesktopMode = window.innerWidth >= DESKTOP_BREAKPOINT;

        if (currentIsDesktopMode !== isDesktopModeRef.current) {
            if (currentIsDesktopMode) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
            
            isDesktopModeRef.current = currentIsDesktopMode;
        }
    }, [])

    // useEffect(() => {
    //     if (isDesktopModeRef.current) {
    //         setIsSidebarOpen(true);
    //     } else {
    //         setIsSidebarOpen(false);
    //     }
        
    //     window.addEventListener('resize', handleResize);
        
    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     };
    // }, [handleResize])

    if (!accessToken) {
        alert('로그인이 필요한 서비스입니다. 로그인을 해주세요!');
        return <Navigate to={"/login"} state={{ from: location }} replace />
    }
    
    return (
        <div className='h-dvh flex flex-col'>
            <Navbar onSidebarClick={handleSidebarToggle}/>
            <div className='flex flex-1 '>
                <Sidebar 
                    isOpen={isSidebarOpen} 
                    onClose={() => setIsSidebarOpen(false)} 
                />
                <main className='flex-1 bg-black text-white overflow-y-auto'>
                    <Outlet />
                </main>
            </div>
            <footer className='bg-black'>푸터</footer>
            <FloatingButton />
        </div>
        )
    }

export default ProtectedLayout
