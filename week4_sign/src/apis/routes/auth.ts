import type { RequestSignupDto, RequestSigninDto, ResponseSignupDto, ResponseSigninDto, ResponseMyInfoDto } from "../../types/auth";
import { getMockSignup, getMockSignin } from "../../data/mockData";

export const postSignup = async (body: RequestSignupDto):Promise<ResponseSignupDto> => {
    console.log('회원가입 요청 (mockData 사용):', body);
    try {
        await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        const response = getMockSignup(body);
        console.log('회원가입 mockData 응답:', response);
        return response;
    } catch (error) {
        console.error('회원가입 실패:', error);
        throw error;
    }
}

export const postSignin = async (body: RequestSigninDto):Promise<ResponseSigninDto> => {
    console.log('로그인 요청 (mockData 사용):', body);
    try {
        await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        const response = getMockSignin(body);
        console.log('로그인 mockData 응답:', response);
        return response;
    } catch (error) {
        console.error('로그인 실패:', error);
        throw error;
    }
}

export const getMyInfo = async ():Promise<ResponseMyInfoDto> => {
    console.log('내 정보 조회 (mockData 사용)');
    try {
        await new Promise(resolve => setTimeout(resolve, 300));
        const userData = localStorage.getItem('userData');
        if (!userData) {
            throw new Error('로그인이 필요합니다.');
        }
        const user = JSON.parse(userData);
        return {
            status: true,
            statusCode: 200,
            message: '내 정보 조회 성공',
            data: user
        };
    } catch (error) {
        console.error('내 정보 조회 실패:', error);
        throw error;
    }
}

export const postLogout = async () => {
    console.log('로그아웃 (mockData 사용)');
    try {
        await new Promise(resolve => setTimeout(resolve, 200));
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        window.dispatchEvent(new CustomEvent('authChange'));
        return {
            status: true,
            statusCode: 200,
            message: '로그아웃 성공'
        };
    } catch (error) {
        console.error('로그아웃 실패:', error);
        throw error;
    }
}

