// 📁 src/pages/SignupPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
  });

  const validateEmail = () => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    setErrors({ ...errors, email: isValid ? '' : '올바른 이메일 형식을 입력해주세요.' });
    return isValid;
  };

  const validatePassword = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
      valid = false;
    } else {
      newErrors.password = '';
    }

    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
      valid = false;
    } else {
      newErrors.passwordConfirm = '';
    }

    setErrors(newErrors);
    return valid;
  };

  const validateNickname = () => {
    const isValid = formData.nickname.trim() !== '';
    setErrors({ ...errors, nickname: isValid ? '' : '닉네임을 입력해주세요.' });
    return isValid;
  };

  const handleNext = () => {
    if (step === 1 && validateEmail()) setStep(2);
    else if (step === 2 && validatePassword()) setStep(3);
  };

  const handleSubmit = () => {
    if (validateNickname()) {
      console.log('회원가입 완료:', formData);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-5">
        <h2 className="text-center text-2xl font-bold">회원가입</h2>

        {step === 1 && (
          <>
            <input
              type="email"
              className="w-full bg-zinc-900 p-3 rounded-md border border-zinc-600 placeholder:text-zinc-400"
              placeholder="이메일을 입력해주세요"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onBlur={validateEmail}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            <button
              onClick={handleNext}
              disabled={!formData.email}
              className="w-full py-3 bg-pink-500 hover:bg-pink-600 rounded-md disabled:bg-zinc-600"
            >
              다음
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-sm text-left text-zinc-300">{formData.email}</p>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력해주세요"
                className="w-full bg-zinc-900 p-3 rounded-md border border-zinc-600 placeholder:text-zinc-400"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400"
              >👁</button>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

            <div className="relative">
              <input
                type={showPasswordConfirm ? 'text' : 'password'}
                placeholder="비밀번호를 다시 한 번 입력해주세요"
                className="w-full bg-zinc-900 p-3 rounded-md border border-zinc-600 placeholder:text-zinc-400"
                value={formData.passwordConfirm}
                onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3 top-3 text-gray-400"
              >👁</button>
            </div>
            {errors.passwordConfirm && <p className="text-red-500 text-sm">{errors.passwordConfirm}</p>}

            <button
              onClick={handleNext}
              disabled={!formData.password || !formData.passwordConfirm}
              className="w-full py-3 bg-pink-500 hover:bg-pink-600 rounded-md disabled:bg-zinc-600"
            >
              다음
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-sm text-left text-zinc-300">{formData.email}</p>

            {/* 프로필 이미지 UI */}
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-zinc-700 rounded-full" />
            </div>

            <input
              type="text"
              placeholder="닉네임을 입력해주세요"
              className="w-full bg-zinc-900 p-3 rounded-md border border-zinc-600 placeholder:text-zinc-400"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
            />
            {errors.nickname && <p className="text-red-500 text-sm">{errors.nickname}</p>}

            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-pink-500 hover:bg-pink-600 rounded-md"
            >
              회원가입 완료
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SignupPage;