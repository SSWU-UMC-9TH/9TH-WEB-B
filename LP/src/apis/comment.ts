
import { axiosInstance } from "./axios";

export const getComments = async ({
  lpId,
  cursor,
  limit,
  order,
}: {
  lpId: number;
  cursor?: number;
  limit: number;
  order: "asc" | "desc";
}) => {
  const { data } = await axiosInstance.get(
    `/v1/lps/${lpId}/comments`,
    {
      params: { cursor, limit, order },
    }
  );

  return data;
};

export const postComment = async ({
  lpId,
  content,
}: {
  lpId: number;
  content: string;
}) => {
  const { data } = await axiosInstance.post(
    `/v1/lps/${lpId}/comments`,
    { content }
  );

  return data;
};