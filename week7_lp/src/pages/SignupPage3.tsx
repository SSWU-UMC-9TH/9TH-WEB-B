import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import {z} from "zod";
import { useLocation, useNavigate } from 'react-router-dom';
import Left from '../assets/left.png';
import Profile from '../assets/profile.png';
import { postSignup } from "../apis/auth";

const schema = z.object({
    name: z.string().min(1, {message: "이름을 입력해주세요."})
})

type FormFields = z.infer<typeof schema>

const SignupPage3 = () => {
    const navigate = useNavigate();
    const {state} = useLocation();
    console.log(state);
    
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<FormFields>({
        defaultValues: {
            name: "",
        },
        resolver: zodResolver(schema),
        mode: "onChange",
    })

    const onSubmit: SubmitHandler<FormFields> = async(data) => {
        const response = await postSignup({
            email: state.email,
            password: state.password,
            name: data.name
        });
        console.log(response);

        if (response.status) {
            alert('회원가입에 성공했습니다.');
            navigate('/');
        }
    }

    return (
        <div className='flex flex-col items-center h-full gap-4 pt-[100px]'>
            <div className='flex flex-col gap-3 items-center'>
                <header className='flex items-center justify-center relative mb-[20px] w-[300px]'>
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
                <div className="rounded-[100px] bg-gray-400 w-[200px] overflow-hidden">
                    <img 
                        className=""
                        src={Profile} 
                        alt="기본 프로필 이미지" 
                    />
                </div>
                <input 
                    {...register("name")}
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm placeholder:text-[#ccc] text-[#ccc] bg-[#1b1b1b]
                    ${errors?.name ? "border-red-500" : "border-gray-300"}`}
                    type="text" 
                    placeholder='이름을 입력해주세요!'
                />
                {errors.name && (
                    <div className="text-red-500 text-sm">{errors.name.message}</div>
                )}
                <button 
                    type='button' 
                    onClick={handleSubmit(onSubmit)} 
                    disabled={isSubmitting}
                    className='w-full bg-[#ea00b1] text-white py-3 rounded-md text-m font-medium hover:bg-[#a2007a] transition-colors cursor-pointer disabled:bg-[#1b1b1b]'
                >
                    회원가입 완료
                </button>
            </div>
        </div>
    )
}

export default SignupPage3
