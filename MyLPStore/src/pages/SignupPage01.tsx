import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zod 스키마 정의
const emailSchema = z.object({
    email: z
        .string()
        .min(1, "이메일을 입력해주세요")
        .email("올바른 이메일 형식을 입력해주세요"),
});

type EmailFormData = z.infer<typeof emailSchema>;

const SignupEmailPage = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<EmailFormData>({
        resolver: zodResolver(emailSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
        }
    });

    const watchedValues = watch();

    const onSubmit = (data: EmailFormData) => {
        navigate(`/signup/password?email=${encodeURIComponent(data.email)}`);
    };

    return (
        <div className="flex flex-col items-center h-full gap-4 mt-20">
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
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
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
                    type="submit"
                    disabled={!watchedValues.email || !!errors.email}
                    className={`w-full py-2 rounded-md text-lg font-semibold transition-all duration-200 ${!watchedValues.email || !!errors.email
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

export default SignupEmailPage;
