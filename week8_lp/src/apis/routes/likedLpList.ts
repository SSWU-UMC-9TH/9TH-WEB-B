import { axiosInstance } from '../axios';
import type { LpListResponse } from '../../types/lp';

// 내가 좋아요한 LP 목록 조회
export const getLikedLpList = async (): Promise<LpListResponse> => {
  const response = await axiosInstance.get('/v1/lps/likes/me');
  return response.data;
};

// 특정 유저가 좋아요한 LP 목록 조회
export const getUserLikedLpList = async (userId: string): Promise<LpListResponse> => {
  const response = await axiosInstance.get(`/v1/lps/likes/${userId}`);
  return response.data;
};
