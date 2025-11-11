import { axiosInstance } from '../axios';
import type { CreateCommentRequest, CreateCommentResponse } from '../../types/comment';

// 댓글 생성 (실제 백엔드 API)
export const createComment = async (lpId: string, data: CreateCommentRequest): Promise<CreateCommentResponse> => {
  try {
    console.log('💬 댓글 생성 API 요청:', { lpId, data });
    
    const response = await axiosInstance.post(`/v1/lps/${lpId}/comments`, data);
    console.log('✅ 댓글 생성 API 응답:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ 댓글 생성 실패:', error);
    throw error;
  }
};

// 댓글 수정 (실제 백엔드 API)
export const updateComment = async (commentId: string, data: { content: string }): Promise<CreateCommentResponse> => {
  try {
    console.log('✏️ 댓글 수정 API 요청:', { commentId, data });
    
    const response = await axiosInstance.patch(`/v1/comments/${commentId}`, data);
    console.log('✅ 댓글 수정 API 응답:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ 댓글 수정 실패:', error);
    throw error;
  }
};

// 댓글 삭제 (실제 백엔드 API)
export const deleteComment = async (commentId: string): Promise<{ status: boolean; message: string }> => {
  try {
    console.log('🗑️ 댓글 삭제 API 요청:', { commentId });
    
    const response = await axiosInstance.delete(`/v1/comments/${commentId}`);
    console.log('✅ 댓글 삭제 API 응답:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ 댓글 삭제 실패:', error);
    throw error;
  }
};