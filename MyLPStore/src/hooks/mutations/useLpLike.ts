import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addLpLike, removeLpLike } from '../../apis/lp';
import { QUERY_KEY } from '../../constants/key';
import { Lp } from '../../types/lp';
import { useAuth } from '../../contexts/AuthContext';

export const useLpLike = (lpId: string) => {
    const queryClient = useQueryClient();
    const { userInfo } = useAuth();

    return useMutation({
        mutationFn: async (isCurrentlyLiked: boolean) => {
            if (isCurrentlyLiked) {
                // 좋아요 취소 - DELETE 요청
                await removeLpLike(Number(lpId));
            } else {
                // 좋아요 추가 - POST 요청
                await addLpLike(Number(lpId));
            }
        },

        // 낙관적 업데이트: 서버 응답 전 즉시 UI 업데이트
        onMutate: async (isCurrentlyLiked: boolean) => {
            // 진행 중인 쿼리 취소
            await queryClient.cancelQueries({ queryKey: [QUERY_KEY.lp, lpId] });

            // 이전 데이터 백업
            const previousLpData = queryClient.getQueryData<Lp>([QUERY_KEY.lp, lpId]);

            // 즉시 UI 업데이트
            if (previousLpData && userInfo?.data?.id) {
                const userId = userInfo.data.id;
                const currentLikes = previousLpData.likes || [];

                let updatedLikes;
                if (isCurrentlyLiked) {
                    // 좋아요 취소
                    updatedLikes = currentLikes.filter(like => like.userId !== userId);
                } else {
                    // 좋아요 추가
                    updatedLikes = [
                        ...currentLikes,
                        {
                            id: Date.now(), // 임시 ID
                            userId: userId,
                            lpId: Number(lpId)
                        }
                    ];
                }

                queryClient.setQueryData([QUERY_KEY.lp, lpId], {
                    ...previousLpData,
                    likes: updatedLikes
                });
            }

            return { previousLpData };
        },

        onSuccess: () => {
            // 성공 시 최신 데이터로 동기화
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lp, lpId] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
        },

        onError: (error, _variables, context) => {
            console.error('좋아요 토글 실패:', error);
            
            // 실패 시 이전 데이터로 롤백
            if (context?.previousLpData) {
                queryClient.setQueryData([QUERY_KEY.lp, lpId], context.previousLpData);
            }
            
            alert('좋아요 처리 중 오류가 발생했습니다.');
        }
    });
};
