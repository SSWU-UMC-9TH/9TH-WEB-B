import { axiosInstance } from '../axios';

// LP 좋아요 취소 (unlike)
export const unlikeLp = async (lpId: string) => {
  const response = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
  return response.data;
};
