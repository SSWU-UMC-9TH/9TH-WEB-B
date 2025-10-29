
import { validateSignin, type userSigninInformation } from "../utills/validate";
import useForm from "../hooks/useForm";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { postSignin } from "../apis/auth";

const LoginPage = () => {
    const handleGoogleLogin = () => {
        // 서버에서 Google OAuth 인증 시작
        window.location.href = "http://localhost:8000/v1/auth/google/login";
        };
    const navigate = useNavigate();
    const{values, errors, touched, getInputProps} = useForm <userSigninInformation>({
        initialValue: {
            email: '',
            password: '',
        },
        validate: validateSignin
    });

    const handleSumbit = async () => {
        console.log(values);
        try{
            const response= await postSignin(values);
            localStorage.setItem("accessToken", response.data.accessToken);
            console.log(response);
        }catch(error){
            console.log(error);
            
        }
        
    };
    //오류가 하나라도 있거나, 입력창이 비었으면 버튼 활성화
    const isDisabled = 
    Object.values(errors || {}).some((error) => error.length > 0) || //오류가 있으면 true
    Object.values(values).some((value) => value ===""); //입력값이 비어있으면 true
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="flex flex-col gap-3">
                <div className="flex  font-bold mb-10 ">
                    <button onClick={() => navigate(-1)}>
                        <IoArrowBack className="text-2xl text-black mr-24 cursor-pointer" />
                    </button>
                    <div className="text-2xl" >로그인</div>
                </div>
                <button
                type="button"
                className="flex items-center justify-center border border-black rounded-md w-[300px] py-[10px] mb-3 hover:bg-gray-100 transition-colors"
                onClick={handleGoogleLogin} // ✅ 수정된 부분
                >
                <FcGoogle className="text-2xl mr-2" />
                <span className="text-black font-medium">구글 로그인</span>
                </button>

                <div className="flex items-center w-[300px] my-4">
                    <hr className="flex-grow border-t border-black" />
                    <span className="mx-3 text-black text-sm font-semibold">OR</span>
                    <hr className="flex-grow border-t border-black" />
                </div>
                <input 
                {...getInputProps("email")}
                type={"email"} 
                className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm ${errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                placeholder={"이메일 입력해주세요."}
                />
                {errors?.email && touched?.email &&(
                    <div className="text-red-500 text-sm">{errors.email}</div>
                )}
                <input 
                {...getInputProps("password")}
                type={"password"} 
                className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm ${errors?.password && touched?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
                placeholder={"비밀번호 입력해주세요."}
                />
                {errors?.password && touched?.password &&(
                    <div className="text-red-500 text-sm">{errors.password}</div>
                )}
                <button 

                type="button" 
                onClick={handleSumbit}
                disabled={isDisabled}
                className="w-full p-[10px] bg-blue-600 text-white rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
                >
                로그인
                </button>
            </div>
        </div>
    )
    }

export default LoginPage

