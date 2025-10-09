import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const handlehome = () => {
        navigate('/');
    };

    const handleSignup = () => {
        navigate('/signup');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 bg-gray/70 backdrop-blur-md px-6">
            <div className="text-lg font-semibold text-white cursor-pointer"
            onClick = {handlehome}>
                돌려돌려 LP판
            </div>
            <div className="flex gap-4">
                <button 
                    onClick={handleLogin}
                    className="text-base font-md text-white cursor-pointer hover:text-gray-300 transition-colors"
                >
                    로그인
                </button>
                <button 
                    onClick={handleSignup}
                    className="text-base font-md text-white cursor-pointer hover:text-gray-300 transition-colors"
                >
                    회원가입
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
