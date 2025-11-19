export interface Comment {
  id: string;
  content: string;
  lpId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    nickname: string;
  };
}

export interface CommentListResponse {
  success: boolean;
  data: {
    data: Comment[];
    hasNext: boolean;
    nextCursor?: number;
    total: number;
  };
  message: string;
}

export interface CreateCommentRequest {
  content: string;
}

export interface CreateCommentResponse {
  success: boolean;
  data: Comment;
  message: string;
}

