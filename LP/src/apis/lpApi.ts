import { axiosInstance } from "./axios";

axiosInstance

export const postLp = async (data: {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
}) => {
  const response = await axiosInstance.post("/v1/lps", data);
  return response.data;
};