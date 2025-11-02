import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zod 스키마 정의
const passwordSchema = z.object({
    password: z
        .string()
        .min(8, "비밀번호는 8자 이상이어야 합니다")
        .max(20, "비밀번호는 20자 이하여야 합니다"),
    confirmPassword: z
        .string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

const SignupPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        mode: 'onChange',
        defaultValues: {
            password: '',
            confirmPassword: '',
        }
    });

    const watchedValues = watch();

    const onSubmit = (data: PasswordFormData) => {
        navigate(`/signup/nickname?email=${encodeURIComponent(email ?? '')}&password=${encodeURIComponent(data.password)}`);
    };

    return (
        <div className="flex flex-col items-center h-full gap-4 mt-20">
            <div className="flex items-center justify-between w-[300px]">
                <button 
                    className="text-lg cursor-pointer text-white"
                    onClick={() => navigate('/signup/email')}
                >
                    &lt;
                </button>
                <div className="text-lg text-white font-semibold cursor-pointer pr-3">
                    비밀번호 설정
                </div>
                <div className="blank"></div>
            </div>
            <div className="text-sm text-gray-300 w-[300px]">
                이메일: <span className="text-white font-base">{email}</span>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
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
                    type="submit"
                    disabled={!!errors.password || !!errors.confirmPassword || !watchedValues.password || !watchedValues.confirmPassword}
                    className={`w-full py-2 rounded-md text-lg font-semibold transition-all duration-200 ${
                        !!errors.password || !!errors.confirmPassword || !watchedValues.password || !watchedValues.confirmPassword
                            ? "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                            : "bg-pink-400 text-white hover:bg-pink-300 active:bg-pink-500 shadow-lg hover:shadow-xl cursor-pointer"
                    }`}
                >
                    다음
                </button>
            </form>
        </div>
    );
};

export default SignupPasswordPage;
