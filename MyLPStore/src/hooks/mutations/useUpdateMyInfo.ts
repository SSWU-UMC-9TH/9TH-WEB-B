// 마이페이지 프로필 수정
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyInfo } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";

export const useUpdateMyInfo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateMyInfo,

        onSuccess: () => {
            // 마이페이지 최신 정보 다시 불러오도록 무효화
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.me] });
        },

        onError: (error) => {
            console.error("프로필 업데이트 실패:", error);
            alert("업데이트에 실패했습니다.");
        }
    });
};
