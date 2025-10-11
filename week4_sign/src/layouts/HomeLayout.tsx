import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const HomeLayout = () => {
    const navigate = useNavigate();

    return (
        <div className='h-dvh flex flex-col'>
            <nav className='bg-[#161616] flex items-center justify-between h-[80px] p-[20px]'>
                <button 
                    className='text-[#ea00b1] font-bold text-[25px] cursor-pointer'
                    onClick={() => navigate('/')}
                >
                    돌려돌려LP판
                </button>
                <div>
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
                </div>
            </nav>
            <main className='flex-1 bg-black'>
                <Outlet />
            </main>
            <footer className='bg-black'>푸터</footer>
        </div>
    )
}

export default HomeLayout