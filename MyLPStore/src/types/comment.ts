import { CommonResponse } from "./commons";

export interface Author {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

export interface CommentsListData {
  data: Comment[];
  nextCursor: number;
  hasNext: boolean;
}

export type CommentsResponse = CommonResponse<CommentsListData>;
