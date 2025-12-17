import type { RequestSignupDto, RequestSigninDto, ResponseSignupDto, ResponseSigninDto, ResponseMyInfoDto } from "../../types/auth";
import { axiosInstance } from "../axios";

export const postSignup = async (body: RequestSignupDto):Promise<ResponseSignupDto> => {
    console.log('✨ 실제 백엔드 회원가입 요청:', body);
    try {
        const response = await axiosInstance.post('/v1/auth/signup', body);
        console.log('✅ 회원가입 API 응답:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ 회원가입 실패:', error);
        throw error;
    }
}

export const postSignin = async (body: RequestSigninDto):Promise<ResponseSigninDto> => {
    console.log('✨ 실제 백엔드 로그인 요청:', body);
    try {
        const response = await axiosInstance.post('/v1/auth/signin', body);
        console.log('✅ 로그인 API 응답:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ 로그인 실패:', error);
        throw error;
    }
}

export const getMyInfo = async ():Promise<ResponseMyInfoDto> => {
    console.log('✨ 실제 백엔드 내 정보 조회');
    try {
        const response = await axiosInstance.get('/v1/auth/me');
        console.log('✅ 내 정보 API 응답:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ 내 정보 조회 실패:', error);
        throw error;
    }
}

export const postLogout = async () => {
    console.log('✨ 실제 백엔드 로그아웃');
    try {
        const response = await axiosInstance.post('/v1/auth/logout');
        console.log('✅ 로그아웃 API 응답:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ 로그아웃 실패:', error);
        // 백엔드 실패해도 로컬 데이터는 정리
        throw error;
    }
}

