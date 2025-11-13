import { axiosInstance } from '../axios';

export const likeLp = async (lpId: string) => {
  const response = await axiosInstance.post(`/v1/lps/${lpId}/like`);
  return response.data;
};
