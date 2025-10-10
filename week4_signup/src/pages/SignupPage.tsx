import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { postSignup } from '../apis/auth';
import { RequestSignupDto } from '../types/auth';

// Zod 스키마 정의
const signupSchema = z.object({
    email: z
        .string()
        .min(1, "이메일을 입력해주세요")
        .email("올바른 이메일 형식을 입력해주세요"),
    password: z
        .string()
        .min(8, "비밀번호는 8자 이상이어야 합니다")
        .max(20, "비밀번호는 20자 이하여야 합니다"),
    confirmPassword: z
        .string(),
    nickname: z
        .string()
        .min(1, "닉네임을 입력해주세요")
        .min(2, "닉네임은 2자 이상이어야 합니다")
        .max(10, "닉네임은 10자 이하여야 합니다")
}).refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignupPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        trigger,
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            nickname: ''
        }
    });

    const watchedValues = watch();
    
    const handleNext = async () => {
        if (step === 1) {
            const isEmailValid = await trigger('email');
            if (isEmailValid) {
                setStep(2);
            }
        } else if (step === 2) {
            const isPasswordValid = await trigger(['password', 'confirmPassword']);
            if (isPasswordValid) {
                setStep(3);
            }
        }
    };

    const onSubmit = async (data: SignupFormData) => {
        setIsLoading(true);
        
        try {
            const signupData: RequestSignupDto = {
                name: data.nickname.trim(),
                email: data.email,
                password: data.password,
            };

            const response = await postSignup(signupData);
            
            if (response.status) {
                alert('회원가입이 완료되었습니다!');
                navigate('/login');
            } else {
                alert(response.message || '회원가입에 실패했습니다.');
            }
        } catch (error) {
            console.error('회원가입 에러:', error);
            alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center h-full gap-4 mt-20">
            {step === 1 && (
                <>
                    <div className="flex items-center justify-between w-[300px]">
                        <button 
                            className="text-lg cursor-pointer text-white"
                            onClick={() => navigate("/")}
                        >
                            &lt;
                        </button>
                        <div className="text-lg text-white font-semibold pr-3">
                            회원가입
                        </div>
                        <div className="blank"></div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="이메일을 입력해주세요"
                            className={`border w-[300px] h-[40px] rounded-md px-3 bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all
                            ${errors.email ? "border-red-500 ring-red-500" : "border-gray-500"}`}
                        />
                        {errors.email && (
                            <div className="text-red-500 text-sm">{errors.email.message}</div>
                        )}
                        <button
                            onClick={handleNext}
                            disabled={!watchedValues.email || !!errors.email}
                            className={`w-full py-2 rounded-md text-lg font-semibold transition-all duration-200 ${!watchedValues.email || !!errors.email
                                ? "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                                : "bg-pink-400 text-white hover:bg-pink-300 active:bg-pink-500 shadow-lg hover:shadow-x; cursor-pointer"
                            }`}
                        >
                            다음
                        </button>
                    </div>
                </>
            )}
            {step === 2 && (
                <>
                    <div className="flex items-center justify-between w-[300px]">
                        <button 
                            className="text-lg cursor-pointer text-white"
                            onClick={() => setStep(1)}
                        >
                            &lt;
                        </button>
                        <div className="text-lg text-white font-semibold cursor-pointer pr-3">
                            비밀번호 설정
                        </div>
                        <div className="blank"></div>
                    </div>
                    <div className="text-sm text-gray-300 w-[300px]">
                        이메일: <span className="text-white font-base">{watchedValues.email}</span>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="relative">
                            <input
                                {...register("password")}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="비밀번호를 입력해주세요"
                                className={`border w-[300px] h-[40px] rounded-md px-3 pr-10 bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all
                                ${errors.password ? "border-red-500 ring-red-500" : "border-gray-500"}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {errors.password && (
                            <div className="text-red-500 text-sm">{errors.password.message}</div>
                        )}
                        <div className="relative">
                            <input
                                {...register("confirmPassword")}
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="비밀번호를 다시 한 번 입력해주세요"
                                className={`border w-[300px] h-[40px] rounded-md px-3 pr-10 bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all
                                ${errors.confirmPassword ? "border-red-500 ring-red-500" : "border-gray-500"}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
                            >
                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <div className="text-red-500 text-sm">{errors.confirmPassword.message}</div>
                        )}
                        <button
                            onClick={handleNext}
                            disabled={!!errors.password || !!errors.confirmPassword || !watchedValues.password || !watchedValues.confirmPassword}
                            className={`w-full py-2 rounded-md text-lg font-semibold transition-all duration-200 ${
                                !!errors.password || !!errors.confirmPassword || !watchedValues.password || !watchedValues.confirmPassword
                                    ? "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                                    : "bg-pink-400 text-white hover:bg-pink-300 active:bg-pink-500 shadow-lg hover:shadow-xl cursor-pointer"
                            }`}
                        >
                            다음
                        </button>
                    </div>
                </>
            )}
            {step === 3 && (
                <>
                    <div className="flex items-center justify-between w-[300px]">
                        <button 
                            className="text-lg cursor-pointer text-white"
                            onClick={() => setStep(2)}
                        >
                            &lt;
                        </button>
                        <div className="text-lg text-white font-semibold pr-3">
                            닉네임 설정
                        </div>
                        <div className="blank"></div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                        <div className="flex justify-center m-auto mb-3 mt-3 bg-white rounded-full w-30 h-30"></div>
                        <input
                            {...register("nickname")}
                            type="text"
                            placeholder="닉네임을 입력해주세요"
                            className={`border w-[300px] h-[40px] rounded-md px-3 bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all
                            ${errors.nickname ? "border-red-500 ring-red-500" : "border-gray-500"}`}
                        />
                        {errors.nickname && (
                            <div className="text-red-500 text-sm">{errors.nickname.message}</div>
                        )}
                        <button
                            type="submit"
                            disabled={!watchedValues.nickname?.trim() || isLoading}
                            className={`w-full py-2 rounded-md text-lg font-semibold transition-all duration-200 ${
                                !watchedValues.nickname?.trim() || isLoading
                                    ? "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                                    : "bg-pink-400 text-white hover:bg-pink-300 active:bg-pink-500 shadow-lg hover:shadow-xl cursor-pointer"
                            }`}
                        >
                        회원가입
                        </button>
                    </form>
                </>
            )}
            
        </div>
    );
};

export default SignupPage;