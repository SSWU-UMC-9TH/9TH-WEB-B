// 엔드포인트 관리
import { RequestSigninDto, RequestSignupDto, RequestUpdateMyInfoDto, ResponseMyInfoDto, ResponseSigninDto, ResponseSignupDto } from "../types/auth";
import { CommonResponse } from "../types/commons";
import { axiosInstance } from "./axios";

export const postSignup = async (body: RequestSignupDto) :Promise<ResponseSignupDto> => {
    const {data} = await axiosInstance.post<ResponseSignupDto>("/v1/auth/signup", body);
    return data;
};

export const postSignin = async (body: RequestSigninDto): Promise<ResponseSigninDto> => {
    const {data} = await axiosInstance.post<ResponseSigninDto>("/v1/auth/signin", body);
    return data;
};

export const postSignout = async(): Promise<CommonResponse<null>> => {
    const {data} = await axiosInstance.delete<CommonResponse<null>>("/v1/users");
    return data;
};

export const getMyInfo = async() : Promise<ResponseMyInfoDto> => {
    const {data} = await axiosInstance.get<ResponseMyInfoDto>("/v1/users/me");
    return data;
};

export const updateMyInfo = async (body: RequestUpdateMyInfoDto): Promise<ResponseMyInfoDto> => {
    const { data } = await axiosInstance.patch<ResponseMyInfoDto>("/v1/users", body);
    return data;
};

export const postLogout=async()=>{
    const {data}=await axiosInstance.post('/v1/auth/signout')
    return data;
}

