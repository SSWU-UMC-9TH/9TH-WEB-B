import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"

const ProtectedLayout = () => {
    const navigate = useNavigate();
    const {accessToken} = useAuth();

    if (!accessToken) {
        return <Navigate to={"/login"} replace />
    }
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
                                    className='text-white bg-black px-[10px] py-[5px] rounded-[5px] font-semibold cursor-pointer'
                                    onClick={() => navigate('/my')}
                                >
                                    마이페이지
                                </button>
                                <button 
                                    className='text-white bg-black px-[10px] py-[5px] rounded-[5px] font-semibold cursor-pointer ml-[10px]'
                                    onClick={() => navigate('/search')}
                                >
                                    검색
                                </button>
                            </>
                        )}
                    </div>
                </nav>
                <main className='flex-1 bg-black text-white'>
                    <Outlet />
                </main>
                <footer className='bg-black'>푸터</footer>
            </div>
        )
    }

export default ProtectedLayout
