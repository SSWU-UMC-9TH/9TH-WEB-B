import { axiosInstance } from '../axios';

export const deleteMe = async () => {
  const response = await axiosInstance.delete('/v1/users');
  return response.data;
};
