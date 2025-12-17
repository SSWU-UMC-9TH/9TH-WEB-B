import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {z} from "zod";
import { useLocation, useNavigate } from 'react-router-dom';
import Left from '../assets/left.png';
import Email from '../assets/email.png';

const schema = z.object({
    password: z
        .string()
        .min(8, {
            message: "비밀번호는 8자 이상이어야 합니다.",
        })
        .max(20, {
            message: "비밀번호는 20자 이하여야 합니다.",
        }),
    passwordCheck: z
        .string()
        .min(8, {
            message: "비밀번호는 8자 이상이어야 합니다.",
        })
        .max(20, {
            message: "비밀번호는 20자 이하여야 합니다.",
        }),
}) .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ['passwordCheck'],
})

type FormFields = z.infer<typeof schema>

const SignupPage2 = () => {
    const navigate = useNavigate();
    const {state} = useLocation();
    
    const {register, watch, formState: {errors}} = useForm<FormFields>({
        defaultValues: {
            password: "",
            passwordCheck: "",
        },
        resolver: zodResolver(schema),
        mode: "onBlur",
    })

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
                        회원가입
                    </h1>
                </header>
                <div className="flex items-center">
                    <img 
                        className="w-[20px] h-[20px] mr-[10px]"
                        src={Email}
                        alt="이메일 이미지"
                    />
                    <p className="text-[#ccc]">{state.email}</p>
                </div>
                <input 
                    {...register("password")}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm placeholder:text-[#ccc] text-[#ccc] bg-[#1b1b1b]
                    ${errors?.password ? "border-red-500" : "border-gray-300"}`}
                    type="password" 
                    placeholder='비밀번호를 입력해주세요!'
                />
                {errors.password && (
                    <div className="text-red-500 text-sm">{errors.password.message}</div>
                )}
                <input 
                    {...register("passwordCheck")}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm placeholder:text-[#ccc] text-[#ccc] bg-[#1b1b1b]
                    ${errors?.passwordCheck ? "border-red-500" : "border-gray-300"}`}
                    type="password" 
                    placeholder='비밀번호를 다시 한 번 입력해주세요!'
                />
                {errors.passwordCheck && (
                    <div className="text-red-500 text-sm">{errors.passwordCheck.message}</div>
                )}
                <button 
                    type='button' 
                    onClick={() => navigate('/signup3', {state: {email: state.email, password: watch('password')}})} 
                    disabled={watch('password') === "" || watch('passwordCheck') === "" || watch('password')!==watch('passwordCheck')}
                    className='w-full bg-[#ea00b1] text-white py-3 rounded-md text-m font-medium hover:bg-[#a2007a] transition-colors cursor-pointer disabled:bg-[#1b1b1b]'
                >
                    다음
                </button>
            </div>
        </div>
    )
}

export default SignupPage2
