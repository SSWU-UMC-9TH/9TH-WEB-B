// 내가 업로드한 LP 상세 페이지 수정
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchLP } from '../../apis/lp';
import { CreateLpDto } from '../../types/lp';
import { QUERY_KEY } from '../../constants/key';

interface UpdateLpParams {
    lpId: number;
    data: CreateLpDto;
}

export const useUpdateLp = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ lpId, data }: UpdateLpParams) => patchLP(lpId, data),
        onSuccess: (updatedLp, variables) => {
            // LP 상세 정보 캐시 업데이트 (문자열 ID 사용)
            queryClient.setQueryData([QUERY_KEY.lp, String(variables.lpId)], updatedLp);
            
            // LP 목록 캐시 무효화 (수정된 LP가 목록에 반영되도록)
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
            
            // LP 상세 정보 캐시도 무효화하여 최신 데이터 보장
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lp, String(variables.lpId)] });
            
            alert('LP가 성공적으로 수정되었습니다!');
        },
        onError: (error) => {
            console.error('LP 수정 실패:', error);
            alert('LP 수정에 실패했습니다.');
        }
    });
};
