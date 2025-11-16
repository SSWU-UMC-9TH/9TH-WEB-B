import { axiosInstance } from "./axios";
import { PAGINATION_ORDER } from "../enums/common";
import { CommentsResponse, CommentsListData } from "../types/comment";
import { PaginationDto } from "../types/commons";

export const getComments = async (
  lpId: string,
  paginationDto: PaginationDto & { order: PAGINATION_ORDER }
): Promise<CommentsListData> => {
  const { data } = await axiosInstance.get<CommentsResponse>(
    `/v1/lps/${lpId}/comments`,
    {
      params: {
        cursor: paginationDto.cursor,
        limit: paginationDto.limit,
        order: paginationDto.order === PAGINATION_ORDER.asc ? 'asc' : 'desc',
      },
    }
  );
  return data.data;
};
 

