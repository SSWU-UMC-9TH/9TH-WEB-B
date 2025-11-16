import React from 'react'
import useForm from '../hooks/useForm';
import { type UserSigninInformation, validateSignin } from '../utils/validate';
import { useLocation, useNavigate } from 'react-router-dom';
import Left from '../assets/left.png';
import Google from '../assets/google.png';
import { usePostSignin } from '../hooks/mutations/usePostSignin';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const {values, errors, touched, getInputProps} = useForm<UserSigninInformation>({
        initialValue: {
            email: "",
            password: "",
        },
        validate: validateSignin,
    })

    const {mutate: postSigninMutate} = usePostSignin();

    const handleSubmit = async () => {
        postSigninMutate({
            ...values,
            redirectPath: from,
        });
    }

    const handleGoogleLogin = () => {
        window.location.href = import.meta.env.VITE_SERVER_API_URL+"/v1/auth/google/login";
    }

    // 오류가 하나라도 있거나 입력값이 비어있으면 버튼을 비활성화
    const isDisabled = 
        Object.values(errors || {}).some((error) => error.length > 0) || // 오류가 있으면 true
        Object.values(values).some((value) => value === "");

    return (
        <div className='flex flex-col items-center h-full gap-4 pt-[100px]'>
            <div className='flex flex-col gap-3'>
                <header className='flex items-center justify-center relative mb-[20px]'>
                    <button 
                        className='w-[18px] absolute left-0 cursor-pointer'
                        onClick={() => navigate(-1)}
                    >
                        <img 
                            src={Left} 
                            alt="왼쪽 화살표 이미지" 
                        />
                    </button>
                    <h1 className='text-white font-bold text-[20px]'>
                        로그인
                    </h1>
                </header>
                <button 
                    type='button'
                    onClick={handleGoogleLogin}
                    disabled={!isDisabled}
                    className='border border-[#ccc] w-[300px] p-[10px] rounded-sm relative flex items-center justify-center cursor-pointer'
                >
                    <img 
                        className='w-[24px] absolute left-[10px]'
                        src={Google} 
                        alt="구글 이미지" 
                    />
                    <p className='text-[#ccc] font-bold'>
                        구글 로그인
                    </p>
                </button>
                <div className='flex items-center justify-between'>
                    <div className='bg-[#ccc] w-[100px] h-[1px]'></div>
                    <p className='text-[#ccc] font-bold text-[18px]'>OR</p>
                    <div className='bg-[#ccc] w-[100px] h-[1px]'></div>
                </div>
                <input 
                    {...getInputProps("email")}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm placeholder:text-[#ccc] text-[#ccc] bg-[#1b1b1b]
                    ${errors?.email && touched?.email ? "border-red-500" : "border-gray-300"}`}
                    type="email" 
                    placeholder='이메일을 입력해주세요!'
                />
                {errors?.email && touched?.email && (
                    <div className='text-red-500 text-sm'>
                        {errors.email}
                    </div>
                )}
                <input 
                    {...getInputProps("password")}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm placeholder:text-[#ccc] text-[#ccc] bg-[#1b1b1b]
                    ${errors?.password && touched?.password ? "border-red-500" : "border-gray-300"}`}
                    type="password" 
                    placeholder='비밀번호를 입력해주세요!'
                />
                {errors?.password && touched?.password && (
                    <div className='text-red-500 text-sm'>
                        {errors.password}
                    </div>
                )}
                <button 
                    type='button' 
                    onClick={handleSubmit} 
                    disabled={isDisabled}
                    className='w-full bg-[#ea00b1] text-white py-3 rounded-md text-m font-medium hover:bg-[#a2007a] transition-colors cursor-pointer disabled:bg-[#1b1b1b]'
                >
                    로그인
                </button>
            </div>
        </div>
    )
}

export default LoginPage
