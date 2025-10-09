import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {z} from "zod";
import { useNavigate } from 'react-router-dom';
import Left from '../assets/left.png';
import Google from '../assets/google.png';

const schema = z.object({
    email: z.string().email({message: "올바른 이메일 형식이 아닙니다."}),
})

type FormFields = z.infer<typeof schema>

const SignupPage = () => {
    const navigate = useNavigate();
    
    const {register, watch, formState: {errors, isSubmitting, touchedFields}} = useForm<FormFields>({
        defaultValues: {
            email: "",
        },
        resolver: zodResolver(schema),
        mode: "onChange",
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
                <div className='border border-[#ccc] w-[300px] p-[10px] rounded-sm relative flex items-center justify-center cursor-pointer'>
                    <img 
                        className='w-[24px] absolute left-[10px]'
                        src={Google} 
                        alt="구글 이미지" 
                    />
                    <p className='text-[#ccc] font-bold'>
                        구글 로그인
                    </p>
                </div>
                <div className='flex items-center justify-between'>
                    <div className='bg-[#ccc] w-[100px] h-[1px]'></div>
                    <p className='text-[#ccc] font-bold text-[18px]'>OR</p>
                    <div className='bg-[#ccc] w-[100px] h-[1px]'></div>
                </div>
                <input 
                    {...register("email")}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm placeholder:text-[#ccc] text-[#ccc] bg-[#1b1b1b]
                    ${errors?.email ? "border-red-500" : "border-gray-300"}`}
                    type="email" 
                    placeholder='이메일을 입력해주세요!'
                />
                {errors.email && touchedFields.email && (
                    <div className="text-red-500 text-sm">{errors.email.message}</div>
                )}
                <button 
                    type='button' 
                    onClick={() => navigate('/signup2', {state: {email: watch('email')}})} 
                    disabled={errors.email !== undefined || watch('email')==="" || isSubmitting}
                    className='w-full bg-[#ea00b1] text-white py-3 rounded-md text-m font-medium hover:bg-[#a2007a] transition-colors cursor-pointer disabled:bg-[#1b1b1b]'
                >
                    다음
                </button>
            </div>
        </div>
    )
}

export default SignupPage
