export type UserSignupInformation = {
  email: string;
  password: string;
  confirmPassword: string;
};

export function validateUser(values: UserSignupInformation) {
  const errors: { email: string; password: string } = {
    email: '',
    password: '',
  };

  // 이메일 형식 검사 (정규식)
  if (
    !/^[0-9a-zA-Z]([._-]?[0-9a-zA-Z])*@[0-9a-zA-Z]([._-]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/.test(
      values.email
    )
  ) {
    errors.email = '올바른 이메일 형식이 아닙니다!';
  }

  // 비밀번호 8자 이상 20자 이하 검사
  if (!(values.password.length >= 8 && values.password.length < 20)) {
    errors.password = '비밀번호는 8~20자 사이로 입력해주세요.';
  }

  return errors;
}



