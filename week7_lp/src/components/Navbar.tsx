import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ResponseMyInfoDto } from '../types/auth';
import { getMyInfo } from '../apis/auth';
import Search from '../assets/search.png';
import { usePostLogout } from '../hooks/mutations/usePostLogout';

interface NavbarProps {
    onSidebarClick: () => void;
}

const Navbar = ({onSidebarClick}: NavbarProps) => {
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const [data, setData] = useState<ResponseMyInfoDto>([]);

    const {mutate: postLogoutMutate} = usePostLogout();

    const handleLogout = async () => {
        postLogoutMutate();
    }

    useEffect(() => {
        const getData = async () => {
            const response = await getMyInfo();
            console.log(response);
            setData(response);
        }
        getData();
    }, []);

    return (
        <nav className='bg-[#161616] flex items-center justify-between h-[80px] p-[20px]'>
            <div className='flex'>
                <button 
                    className='cursor-pointer mr-[10px]'
                    onClick={onSidebarClick}
                >
                    <svg width="30" height="30" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/></svg>
                </button>
                <button 
                    className='text-[#ea00b1] font-bold text-[25px] cursor-pointer'
                    onClick={() => navigate('/')}
                >
                    돌려돌려LP판
                </button>
            </div>
            <div className='flex'>
                {!accessToken ? (
                    <>
                        <button 
                            className='text-white bg-black px-[10px] py-[5px] rounded-[5px] font-semibold cursor-pointer'
                            onClick={() => navigate('/login')}
                        >
                            로그인
                        </button>
                        <button 
                            className='text-white bg-[#ea00b1] px-[10px] py-[5px] ml-[10px] rounded-[5px] font-semibold cursor-pointer'
                            onClick={() => navigate('/signup')}
                        >
                            회원가입
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                            className='w-[25px] cursor-pointer'
                        >
                            <img src={Search} alt="검색 아이콘" />
                        </button>
                        <div 
                            className='text-white px-[10px] py-[5px] rounded-[5px] font-semibold ml-[10px]'
                        >
                            {data.data?.name}님 반갑습니다.
                        </div>
                        <button 
                            className='text-white bg-black px-[10px] py-[5px] rounded-[5px] font-semibold cursor-pointer ml-[10px]'
                            onClick={handleLogout}
                        >
                            로그아웃
                        </button>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar
