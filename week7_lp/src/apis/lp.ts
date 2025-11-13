import type { PaginationDto, CommonResponse, CursorBasedResponse } from "../types/common";
import type { ResponseLpListDto, Lp, RequestLpDto } from "../types/lps";
import { axiosInstance } from "./axios";

export const getLpList = async (paginationDto: PaginationDto): Promise<ResponseLpListDto> => {
    const {data} = await axiosInstance.get("/v1/lps", {
        params: paginationDto,
    })

    return data;
}

export const getLpDetail = async (lpId: number): Promise<CommonResponse<Lp>> => {
    const {data} = await axiosInstance.get(`/v1/lps/${lpId}`);

    return data;
}

export type ResponseCommentListDto = CursorBasedResponse<Comment[]>;

export const getLpCommentList = async (lpId: number, paginationDto: PaginationDto): Promise<ResponseCommentListDto> => {
    const {data} = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
        params: paginationDto,
    });

    return data;
}

export const postLike = async ({lpId}: RequestLpDto): Promise<ResponseLpListDto> => {
    const {data} = await axiosInstance.post(`v1/lps/${lpId}/likes`);

    return data;
}

export const deleteLike = async ({lpId}: RequestLpDto): Promise<ResponseLpListDto> => {
    const {data} = await axiosInstance.delete(`v1/lps/${lpId}/likes`);

    return data;
}

export const postLp = async (lp: Lp): Promise<CommonResponse<Lp>> => {
    const {data} = await axiosInstance.post("/v1/lps", lp);

    return data;
}