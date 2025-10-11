export type userSigninInformation={
    email:string;
    password: string;
};
//폼 유효성 검사
function validateUser(values:userSigninInformation){
    const errors: Record<keyof userSigninInformation, string> = {
        email: '',
        password: '',
    };
    if (!/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i.test(
        values.email
    
    )) {
        errors.email = '유효한 이메일 형식이 아닙니다.';
    }
    // You can add more validation for password here if needed

    //비밀번호 8자 20자 사이
    if(values.password.length <6 || values.password.length >20){
        errors.password='비밀번호는 6자 이상 입력해주세요.';
    }
    return errors;
}

//로그인 유효성 검사
function validateSignin(values:userSigninInformation){
    return validateUser(values);
}

export{validateSignin};