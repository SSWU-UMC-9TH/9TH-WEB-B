// LP 생성
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '../../constants/key';
import { PostLP } from '../../apis/lp';
import { CreateLpDto } from '../../types/lp';

export const useCreateLP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (createLpDto: CreateLpDto) => PostLP(createLpDto),
    onSuccess: () => {
      // LP 목록 쿼리를 무효화하여 자동 새로고침
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps],
      });
    },
    onError: (error) => {
      console.error('LP 생성 실패:', error);
    },
  });
};