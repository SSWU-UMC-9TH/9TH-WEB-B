import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { postSignup } from '../apis/auth';
import { RequestSignupDto } from '../types/auth';

// Zod 스키마 정의
const nicknameSchema = z.object({
    nickname: z
        .string()
        .min(1, "닉네임을 입력해주세요")
        .min(2, "닉네임은 2자 이상이어야 합니다")
        .max(10, "닉네임은 10자 이하여야 합니다")
});

type NicknameFormData = z.infer<typeof nicknameSchema>;

const SignupNicknamePage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const password = searchParams.get('password');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<NicknameFormData>({
        resolver: zodResolver(nicknameSchema),
        mode: 'onChange',
        defaultValues: {
            nickname: ''
        }
    });

    const watchedValues = watch();

    const onSubmit = async (data: NicknameFormData) => {
        setIsLoading(true);
        
        try {
            if (!email || !password) {
                alert('이메일 또는 비밀번호 정보가 없습니다. 다시 시도해주세요.');
                return;
            }

            const signupData: RequestSignupDto = {
                name: data.nickname.trim(),
                email: email,
                password: password,
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
            <div className="flex items-center justify-between w-[300px]">
                <button 
                    className="text-lg cursor-pointer text-white"
                    onClick={() => navigate(`/signup/password?email=${encodeURIComponent(email ?? '')}`)}
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
        </div>
    );
};

export default SignupNicknamePage;
