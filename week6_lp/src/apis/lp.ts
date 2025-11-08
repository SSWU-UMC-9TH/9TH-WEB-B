import type { PaginationDto } from "../types/common";
import type { ResponseLpListDto } from "../types/lps";
import { axiosInstance } from "./axios";

export const getLpList = async (paginationDto: PaginationDto): Promise<ResponseLpListDto> => {
    const {data} = await axiosInstance.get("/v1/lps", {
        params: paginationDto,
    })

    return data;
}