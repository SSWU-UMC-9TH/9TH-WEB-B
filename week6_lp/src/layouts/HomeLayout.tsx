import React, { useCallback, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import FloatingButton from '../components/FloatingButton';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const HomeLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarToggle = () => {
        setIsSidebarOpen(prev => !prev);
    }

    const isDesktopModeRef = React.useRef(window.innerWidth >= 768);

    const handleResize = useCallback(() => {
        const currentIsDesktopMode = window.innerWidth >= 768;

        if (currentIsDesktopMode !== isDesktopModeRef.current) {
            if (currentIsDesktopMode) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
            
            isDesktopModeRef.current = currentIsDesktopMode;
        }
    }, [])

    useEffect(() => {
        if (isDesktopModeRef.current) {
            setIsSidebarOpen(true);
        } else {
            setIsSidebarOpen(false);
        }
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize])
        

    useEffect(() => {
        if (isDesktopModeRef.current) {
            setIsSidebarOpen(true);
        } else {
            setIsSidebarOpen(false);
        }
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize])

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

export default HomeLayout
