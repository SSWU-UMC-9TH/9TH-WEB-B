// 마이페이지 프로필 수정
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyInfo } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";
import { useAuth } from "../../contexts/AuthContext";

export const useUpdateMyInfo = () => {
    const queryClient = useQueryClient();
    const { updateUserInfo } = useAuth();

    return useMutation({
        mutationFn: updateMyInfo,

        // 요청 전 즉시 UI 업데이트 (optimistic update)
        onMutate: async (newUserData) => {
            // AuthContext의 전역 상태 즉시 업데이트
            updateUserInfo(newUserData);
            
            // 이전 데이터 백업 (롤백용)
            const previousUserData = queryClient.getQueryData([QUERY_KEY.me]);
            return { previousUserData };
        },

        onSuccess: () => {
            // 마이페이지 최신 정보 다시 불러오도록 무효화
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.me] });
        },

        onError: (error, _variables, context) => {
            console.error("프로필 업데이트 실패:", error);
            alert("업데이트에 실패했습니다.");
            
            // 실패 시 이전 데이터로 롤백
            if (context?.previousUserData) {
                queryClient.setQueryData([QUERY_KEY.me], context.previousUserData);
            }
        }
    });
};
