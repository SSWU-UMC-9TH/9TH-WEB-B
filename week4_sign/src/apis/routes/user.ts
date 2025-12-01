import { axiosInstance } from '../axios';

export const updateMyInfo = async (data: { name: string; bio?: string; avatar?: string }) => {
  // bio, avatar가 빈 문자열이거나 null이면 필드 제거
  const payload: any = { ...data };
  if (payload.bio === '' || payload.bio == null) delete payload.bio;
  if (!payload.avatar) delete payload.avatar;
  try {
    const response = await axiosInstance.patch('/v1/users', payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    console.error('[updateMyInfo] 서버 요청 실패', error);
    throw error;
  }
};
