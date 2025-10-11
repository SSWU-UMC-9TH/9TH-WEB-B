import z from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSignup } from "../apis/auth";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useState } from "react";

const schema = z
  .object({
    email: z
      .string()
      .trim()
      .email({ message: "이메일 형식이 올바르지 않습니다." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 최대 20자 이하여야 합니다." }),
    passwordCheck: z
      .string()
      .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
      .max(20, { message: "비밀번호는 최대 20자 이하여야 합니다." }),
    name: z.string().min(1, { message: "이름을 입력해주세요." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  // watch() 한 번만 호출해서 모든 값 관리
  const values = watch();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { passwordCheck, ...rest } = data;
    try {
      const response = await postSignup(rest);
      console.log(response);
      alert("🎉 회원가입이 성공적으로 완료되었습니다!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 단계별 유효성 검사
  const emailValid = z.string().email().safeParse(values.email).success;
  const passwordValid =
    values.password.length >= 8 && values.password === values.passwordCheck;
  const nameValid = values.name.trim().length > 0;

  // 버튼 비활성화 조건
  const isNextDisabled =
    (currentStep === 1 && !emailValid) ||
    (currentStep === 2 && !passwordValid) ||
    (currentStep === 3 && !nameValid);

  // 단계 이동 함수
  const handleNextStep = () => {
    if (isNextDisabled) return;
    setCurrentStep((prev) => (prev < 3 ? (prev + 1) as 1 | 2 | 3 : prev));
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    else navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex flex-col gap-3 w-[300px]">
        <div className="flex items-center font-bold mb-10">
          <button onClick={handlePrevStep}>
            <IoArrowBack className="text-2xl text-black mr-22 cursor-pointer" />
          </button>
          <div className="text-2xl">회원가입</div>
        </div>

        {/*Step 1: 이메일*/}
        {currentStep === 1 && (
          <>
            <button
              type="button"
              className="flex items-center justify-center border border-black rounded-md w-full py-[10px] mb-3 hover:bg-gray-100 transition-colors"
              onClick={() => console.log("구글 로그인 클릭")}
            >
              <FcGoogle className="text-2xl mr-2" />
              <span className="text-black font-medium">구글 로그인</span>
            </button>

            <div className="flex items-center w-full my-4">
              <hr className="flex-grow border-t border-black" />
              <span className="mx-3 text-black text-sm font-semibold">OR</span>
              <hr className="flex-grow border-t border-black" />
            </div>

            <input
              {...register("email")}
              type="email"
              placeholder="이메일"
              className={`border w-full p-[10px] rounded-sm ${
                errors?.email
                  ? "border-red-500 bg-red-200"
                  : "border-gray-300"
              }`}
            />
            {errors.email && (
              <div className="text-red-500 text-sm">{errors.email.message}</div>
            )}
          </>
        )}

        {/*Step 2: 비밀번호 */}
        {currentStep === 2 && (
          <>
            <div className="w-full mb-4 p-[10px] bg-gray-100 rounded-md text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <MdEmail className="text-gray-500 text-xl" />
                <span className="font-semibold">{values.email}</span>
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div className="relative w-full">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호"
                className={`border w-full p-[10px] rounded-sm pr-10 ${
                  errors?.password
                    ? "border-red-500 bg-red-200"
                    : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <IoEye /> : <IoEyeOff />}
              </button>
            </div>
            {errors.password && (
              <div className="text-red-500 text-sm">
                {errors.password.message}
              </div>
            )}

            {/* 비밀번호 확인 입력 */}
            <div className="relative w-full">
              <input
                {...register("passwordCheck")}
                type={showPasswordCheck ? "text" : "password"}
                placeholder="비밀번호 확인"
                className={`border w-full p-[10px] rounded-sm pr-10 ${
                  errors?.passwordCheck
                    ? "border-red-500 bg-red-200"
                    : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPasswordCheck((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPasswordCheck ? <IoEye /> : <IoEyeOff />}
              </button>
            </div>
            {errors.passwordCheck && (
              <div className="text-red-500 text-sm">
                {errors.passwordCheck.message}
              </div>
            )}
          </>
        )}

        {/*Step 3: 이름*/}
        {currentStep === 3 && (
          <>
            <input
              {...register("name")}
              type="text"
              placeholder="이름"
              className={`border w-full p-[10px] rounded-sm ${
                errors?.name
                  ? "border-red-500 bg-red-200"
                  : "border-gray-300"
              }`}
            />
            {errors.name && (
              <div className="text-red-500 text-sm">{errors.name.message}</div>
            )}
          </>
        )}

        {/*버튼 영역*/}
        <div className="mt-4">
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              disabled={isNextDisabled}
              className={`w-full p-[10px] rounded-md text-lg font-medium transition-colors 
                ${
                  isNextDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              다음
            </button>
          ) : (
            <button
              disabled={isNextDisabled || isSubmitting}
              type="button"
              onClick={handleSubmit(onSubmit)}
              className={`w-full p-[10px] rounded-md text-lg font-medium transition-colors 
                ${
                  isNextDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              회원가입 완료
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;