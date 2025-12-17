import { useQuery } from '@tanstack/react-query';
import { getMyInfo } from '../../apis/auth';
import { QUERY_KEY } from '../../constants/key';
import { useAuth } from '../../context/AuthContext';
import type { ResponseMyInfoDto } from '../../types/auth';

export function useGetMyInfo() {
    const { accessToken } = useAuth();
    
    return useQuery<ResponseMyInfoDto, Error>({
        queryKey: [QUERY_KEY.myInfo],
        queryFn: getMyInfo,
        enabled: !!accessToken, 
        staleTime: Infinity,
    })
}