import type { PaginationDto, CommonCursorBasedResponse } from "../types/common";
import type { Lp } from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async (
  pagination: PaginationDto
): Promise<CommonCursorBasedResponse<Lp[]>> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: {
      ...pagination,
      cursor: pagination.cursor ?? undefined, // undefined면 아예 빠짐
    },
  });
  return data;
};