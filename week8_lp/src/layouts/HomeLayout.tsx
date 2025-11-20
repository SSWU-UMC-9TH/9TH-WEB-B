import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import FloatingButton from '../components/FloatingButton';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import useSidebar from '../hooks/useSidebar';

const HomeLayout = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isSidebarOpen, toggle, close } = useSidebar();

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
            <FloatingButton onClick={() => setIsModalOpen(true)} />
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    )
}

export default HomeLayout
