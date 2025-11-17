import { axiosInstance } from '../axios';
import type { CreateCommentRequest, CreateCommentResponse } from '../../types/comment';

// 댓글 생성
// axios 요청에서 에러 처리는 상위에서 일관되게 처리하는 것이 유지보수에 더 좋음
export const createComment = async (lpId: string, data: CreateCommentRequest): Promise<CreateCommentResponse> => {
  console.log('💬 댓글 생성 API 요청:', { lpId, data });
  const response = await axiosInstance.post(`/v1/lps/${lpId}/comments`, data);
  console.log('✅ 댓글 생성 API 응답:', response.data);
  return response.data;
};

// 댓글 수정
export const updateComment = async (lpId: string, commentId: string, data: { content: string }): Promise<CreateCommentResponse> => {
  try {
    console.log('✏️ 댓글 수정 API 요청:', { lpId, commentId, data });
    const response = await axiosInstance.patch(`/v1/lps/${lpId}/comments/${commentId}`, data);
    console.log('✅ 댓글 수정 API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 댓글 수정 실패:', error);
    throw error;
  }
};

// 댓글 삭제
export const deleteComment = async (lpId: string, commentId: string): Promise<{ status: boolean; message: string }> => {
  try {
    console.log('🗑️ 댓글 삭제 API 요청:', { lpId, commentId });
    const response = await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
    console.log('✅ 댓글 삭제 API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ 댓글 삭제 실패:', error);
    throw error;
  }
};