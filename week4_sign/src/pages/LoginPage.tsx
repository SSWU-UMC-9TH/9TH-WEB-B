import useForm from '../hooks/useForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { postLogout } from '../apis/auth';
import { LOCAL_STORAGE_KEY } from '../constants/key';


const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

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

            const emailTrimmed = values.email.trim();
            if (
                !/^[0-9a-zA-Z]([._-]?[0-9a-zA-Z])*@[0-9a-zA-Z]([._-]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/.test(
                    emailTrimmed
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

    const handleSubmit = async () => {
        if (isDisabled || isSubmitting) return;
        setIsSubmitting(true);
        setFormError(null);
        try {
            const email = values.email.trim();
            const password = values.password; // 비밀번호는 공백도 값으로 인정 (서버 정책에 따름)
            await login({ email, password });
        } catch (e: any) {
            const serverMsg = e?.response?.data?.message || e?.message;
            setFormError(serverMsg || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = async () => {
        const base = import.meta.env.VITE_SERVER_API_URL;
        if (!base) {
            alert('서버 주소가 설정되지 않았습니다. .env의 VITE_SERVER_API_URL을 확인해주세요.');
            return;
        }
        // 1) 앱 세션/쿠키 무효화 시도 (백엔드 세션이 있으면 자동 완료를 막기 위해)
        try {
            await postLogout();
        } catch {
            // 이미 로그아웃 상태여도 괜찮음
        }
        // 2) 로컬 토큰 제거 (액세스/리프레시)
        try {
            localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
            localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
        } catch {
            // ignore
        }
        // 3) 구글 계정 선택 강제 + 재인증 유도
        // prompt=select_account: 계정 선택 창 강제
        // prompt=consent: 동의 화면 강제 (원치 않으면 제거 가능)
        // max_age=0: 최근 로그인 이력과 상관없이 재인증 유도
        const url = `${base}/v1/auth/google/login?prompt=select_account%20consent&max_age=0`;
        // 서버로 리디렉션 (백엔드에서 구글 OAuth 진행 후 /oauth/callback으로 반환)
        window.location.href = url;
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

                {/* 구글 소셜 로그인 */}
                <button
                    type='button'
                    onClick={handleGoogleLogin}
                    className='w-full bg-white text-black py-3 rounded-md text-m font-medium hover:bg-gray-200 transition-colors cursor-pointer'
                >
                    Google 계정으로 로그인
                </button>

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
                    disabled={isDisabled || isSubmitting}
                    className='w-full bg-[#ea00b1] text-white py-3 rounded-md text-m font-medium hover:bg-[#a2007a] transition-colors cursor-pointer disabled:bg-[#1b1b1b]'
                >
                    {isSubmitting ? '로그인 중...' : '로그인'}
                </button>
                {formError && (
                    <p className='text-red-500 text-sm mt-2'>{formError}</p>
                )}
            </div>
        </div>
    );
};

export default LoginPage;


