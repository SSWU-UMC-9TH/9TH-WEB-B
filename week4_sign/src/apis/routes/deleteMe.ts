import { axiosInstance } from '../axios';

export const deleteMe = async () => {
  const response = await axiosInstance.delete('/v1/users/me');
  return response.data;
};
