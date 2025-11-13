import { axiosInstance } from '../axios';

export const updateMyInfo = async (data: { name: string; bio?: string; avatar?: string }) => {
  // JSON: name, bio, avatar (URL)
  try {
    const response = await axiosInstance.patch('/v1/users', data, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    console.error('[updateMyInfo] 서버 요청 실패', error);
    throw error;
  }
};
