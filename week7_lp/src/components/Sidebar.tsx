import React, { useEffect, useRef, useState } from 'react'
import Search from '../assets/search.png';
import User from '../assets/user.png';
import { useNavigate } from 'react-router-dom';
import WithdrawalModal from './WithdrawalModal';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({isOpen, onClose}: SidebarProps) => {
    const DESKTOP_BREAKPOINT = 768;
    const sidebarRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    }
    }, [isOpen, onClose])

    const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black opacity-50 z-10 md:hidden ${isOpen ? 'block' : 'hidden'}`} 
                onClick={onClose} 
            />
            <div
                ref={sidebarRef}
                className={`h-full w-[250px] bg-[#161616] text-white p-4 
                    z-20 shadow-xl transition-all duration-300 flex-shrink-0
                    fixed top-[80px] left-0
                    
                    ${isDesktop ? '' : (isOpen ? 'translate-x-0' : '-translate-x-full')}
                    ${isDesktop && isOpen ? 'block' : isDesktop && !isOpen ? 'hidden' : ''}
                    ${!isDesktop && !isOpen ? 'hidden' : 'block'}`}
                    style={{ height: isDesktop ? '100%' : 'calc(100vh - 80px)' }}
            >
                <button className='flex text-white p-[10px] cursor-pointer'>
                    <img 
                        src={Search} 
                        alt="검색 아이콘" 
                        className='w-[25px] mr-[5px]'
                    />
                    <p>찾기</p>
                </button>
                <button 
                    className='flex text-white p-[10px] cursor-pointer'
                    onClick={() => navigate('/my')}
                >
                    <img 
                        src={User} 
                        alt="마이페이지 아이콘" 
                        className='w-[25px] mr-[5px]'
                    />
                    <p>마이페이지</p>
                </button>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className='fixed bottom-[20px] cursor-pointer'
                >
                    탈퇴하기
                </button>
            </div>
            {isModalOpen && (
                <WithdrawalModal
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    )
}

export default Sidebar
