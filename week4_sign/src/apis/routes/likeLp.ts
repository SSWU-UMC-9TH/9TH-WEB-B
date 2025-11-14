import { axiosInstance } from '../axios';

// LP 좋아요 등록
export const likeLp = async (lpId: string) => {
  const response = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return response.data;
};
