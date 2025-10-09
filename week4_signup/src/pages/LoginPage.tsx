import { useNavigate } from "react-router-dom";
import { postSignin } from '../apis/auth';
import { RequestSigninDto } from '../types/auth';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';

interface LoginFormData {
    email: string;
    password: string;
}

const LoginPage = () => {  
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { saveTokens } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<LoginFormData>({
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const watchedValues = watch();

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        
        try {
            const signinData: RequestSigninDto = {
                email: data.email,
                password: data.password,
            };

            const response = await postSignin(signinData);
            
            if (response.status) {
                saveTokens(response.data.accessToken, response.data.refreshToken);
                
                alert(`${response.data.name}님, 로그인 성공!`);
                navigate('/');
            } else {
                alert(response.message || '로그인에 실패했습니다.');
            }
        } catch (error) {
            console.error('로그인 에러:', error);
            alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    //오류가 하나라도 있거나, 입력값이 비어 있으면 버튼을 비활성화
    const isDisabled =
        Object.keys(errors).length > 0 || //오류가 있으면 true
        !watchedValues.email || !watchedValues.password || //입력값이 비어있으면 true
        isLoading; //로딩 중이면 true

    return (
        <div className="flex flex-col items-center h-full gap-4 mt-20">
            <div className="flex items-center justify-between w-[300px]">
                    <button className="text-lg cursor-pointer text-white"
                    onClick={() => navigate("/")}>
                    &lt; </button>
                    <div className="text-xl font-semibold text-white pb-2 pr-3">
                    로그인
                    </div>
                    <div className="blank">
                    </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <input
                    {...register("email", {
                        required: "이메일을 입력해주세요",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "올바른 이메일 형식이 아닙니다"
                        }
                    })}
                    className={`border w-[300px] h-[40px] rounded-md px-3 bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all
                ${errors?.email ? "border-red-500 ring-red-500" : "border-gray-500"}`}
                    type={"email"}
                    placeholder={"이메일을 입력해주세요"} />
                {errors?.email && (<div className="text-red-500 text-sm">{errors.email.message}</div>)}
                <input
                    {...register("password", {
                        required: "비밀번호를 입력해주세요",
                        minLength: {
                            value: 8,
                            message: "비밀번호는 8자리 이상이어야 합니다"
                        }
                    })}
                    className={`border w-[300px] h-[40px] rounded-md px-3 bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all
                ${errors?.password ? "border-red-500 ring-red-500" : "border-gray-500"}`}
                    type={"password"}
                    placeholder={"비밀번호를 입력해주세요"} />
                {errors?.password && (<div className="text-red-500 text-sm">{errors.password.message}</div>)}
                <button
                    type='submit' disabled={isDisabled}
                    className={`w-full py-2 rounded-md text-lg font-semibold transition-all duration-200 ${isDisabled
                            ? "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                            : "bg-pink-400 text-white hover:bg-pink-300 active:bg-pink-500 shadow-lg hover:shadow-xl cursor-pointer"}`}
                >
                로그인
                </button>
            </form>
        </div>
    );
};

export default LoginPage;