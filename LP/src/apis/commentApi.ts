import { axiosInstance } from "./axios";

axiosInstance

export const createComment = async ({
  lpId,
  content,
}: {
  lpId: number;
  content: string;
}) => {
  const response = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
    content,
  });
  return response.data;
};