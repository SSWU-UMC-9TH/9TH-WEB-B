import useForm from '../hooks/useForm';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
    const navigate = useNavigate();

    const { values, errors, touched, getInputProps } = useForm({
        initialValue: {
            email: "",
            password: "",
        },
        validate: (values) => {
            const errors: { email: string; password: string } = {
                email: '',
                password: '',
            };

            if (
                !/^[0-9a-zA-Z]([._-]?[0-9a-zA-Z])*@[0-9a-zA-Z]([._-]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/.test(
                    values.email
                )
            ) {
                errors.email = '올바른 이메일 형식이 아닙니다!';
            }

            if (!(values.password.length >= 8 && values.password.length < 20)) {
                errors.password = '비밀번호는 8~20자 사이로 입력해주세요.';
            }

            return errors;
        }
    });

    const handleSubmit = () => {
        console.log(values);
    };

    const isDisabled =
        Object.values(errors || {}).some((error) => error.length > 0) ||
        Object.values(values).some((value) => value === "");

    return (
        <div className='flex flex-col items-center h-full gap-4 pt-[100px]'>
            <div className='flex flex-col gap-3'>
                <header className='flex items-center justify-center relative mb-[20px]'>
                    <button
                        className='w-[18px] absolute left-0 cursor-pointer'
                        onClick={() => navigate(-1)}
                    >
                       
                    </button>
                    <h1 className='text-white font-bold text-[20px]'>
                        로그인
                    </h1>
                </header>

                {/* OR 구분선 */}
                <div className='flex items-center justify-between'>
                    <div className='bg-[#ccc] w-[100px] h-[1px]'></div>
                    <p className='text-[#ccc] font-bold text-[18px]'>OR</p>
                    <div className='bg-[#ccc] w-[100px] h-[1px]'></div>
                </div>

                {/* 이메일 */}
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

                {/* 비밀번호 */}
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

                {/* 로그인 버튼 */}
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
    );
};

export default LoginPage;
