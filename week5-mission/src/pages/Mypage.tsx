import { useEffect } from 'react'
import { axiosInstance } from '../apis/axios';

const Mypage = () => {
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axiosInstance.get('/v1/users/me');
        console.log('유저 정보:', response.data);
      } catch (error) {
        console.error('유저 정보 불러오기 실패:', error);
      }
    };
    getData();
  }, []);

  return <div>mypage</div>;
};

export default Mypage;