import { PaginationDto, CommonResponse } from "../types/commons";
import { Lp, ResponseLpListDto, CreateLpDto } from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async (paginationDto: PaginationDto): Promise<ResponseLpListDto> => {
    const { data } = await axiosInstance.get<ResponseLpListDto>("/v1/lps", {
        params: paginationDto
    });
    return data;
};

export const getLpDetail = async (lpId: number): Promise<Lp> => {
    const { data } = await axiosInstance.get<CommonResponse<Lp>>(`/v1/lps/${lpId}`);
    return data.data;
};

export const deleteLp = async (lpId: number): Promise<void> => {
    await axiosInstance.delete(`/v1/lps/${lpId}`);
};

export const PostLP = async (createLpDto: CreateLpDto): Promise<Lp> => {
    const { data } = await axiosInstance.post<CommonResponse<Lp>>('/v1/lps', createLpDto);
    return data.data;
};

export const patchLP = async (lpId: number, updateLpDto: CreateLpDto): Promise<Lp> => {
    const { data } = await axiosInstance.patch<CommonResponse<Lp>>(`/v1/lps/${lpId}`, updateLpDto);
    return data.data;
};

export const addLpLike = async (lpId: number): Promise<void> => {
    await axiosInstance.post(`/v1/lps/${lpId}/likes`);
};

export const removeLpLike = async (lpId: number): Promise<void> => {
    await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
};


