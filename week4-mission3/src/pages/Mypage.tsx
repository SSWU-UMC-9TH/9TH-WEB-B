import { useEffect } from 'react'
import { getMyInfo } from '../apis/auth.ts';

const Mypage = () => {
    useEffect(() => {
        const getData = async () => {
            const response=await getMyInfo();
            console.log(response);
        };
        getData();
    }, []);
  return (
    <div>
      mypage
    </div>
  )
}

export default Mypage
