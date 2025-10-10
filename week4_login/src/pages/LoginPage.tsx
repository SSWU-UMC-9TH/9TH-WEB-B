import { UserSigninInformation, validateSignin } from "../utils/validate";
import useForm from "../hooks/useForm";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {  
    const navigate = useNavigate(); // useNavigate 훅 사용

    const {values, errors, touched, getInputProps} =
        useForm<UserSigninInformation>( {
        initialValue: {
            email: "",
            password: "",
        },
        validate: validateSignin,
    });

    const handleSubmit = () => {
        console.log(values);
    };

    //오류가 하나라도 있거나, 입력값이 비어 있으면 버튼을 비활성화 / 다 알맞게 오류 없게 채워지면 버튼 활성화

    const isDisabled =
    Object.values( errors || {}).some((error) => error.length > 0) || //오류가 있으면 true
    Object.values(values).some((value) => value === ""); //입력값이 비어있으면 true

    return (
        <div className="flex flex-col items-center h-full gap-4 mt-20">
            <div className="flex items-center justify-between w-[300px]">
                    <button className="text-lg cursor-pointer text-white"
                    onClick={() => navigate("/")}>
                    &lt; </button>
                    <div className="text-xl font-semibold text-white pb-2 pr-3">
                    로그인
                    </div>
                    <div className="blank">
                    </div>
            </div>
            <div className="flex flex-col gap-3">
                <input
                    {...getInputProps("email")}
                    className={`border w-[300px] h-[40px] rounded-md px-3 bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all
                ${errors?.email && touched?.email ? "border-red-500 ring-red-500" : "border-gray-500"}`}
                    type={"email"}
                    placeholder={"이메일을 입력해주세요"} />
                {errors?.email && touched?.email && (<div className="text-red-500 text-sm">{errors.email}</div>)}
                <input
                    {...getInputProps("password")}
                    className={`border w-[300px] h-[40px] rounded-md px-3 bg-gray-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all
                ${errors?.password && touched?.password ? "border-red-500 ring-red-500" : "border-gray-500"}`}
                    type={"password"}
                    placeholder={"비밀번호를 입력해주세요"} />
                {errors?.password && touched?.password && (<div className="text-red-500 text-sm">{errors.password}</div>)}
                <button
                    type='button' onClick={handleSubmit} disabled={isDisabled}
                    className={`w-full py-2 rounded-md text-lg font-semibold transition-all duration-200 ${isDisabled
                            ? "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                            : "bg-pink-400 text-white hover:bg-pink-300 active:bg-pink-500 shadow-lg hover:shadow-xl cursor-pointer"}`}
                >로그인</button>
            </div>
        </div>
    );
};

export default LoginPage;