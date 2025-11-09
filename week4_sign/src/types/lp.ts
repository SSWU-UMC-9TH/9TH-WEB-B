export interface LpTag {
  id: string;
  name: string;
}

export interface LPLike {
  id: string;
  userId: string;
  lpId: string;
}

export interface LpAuthor {
  id: string;
  nickname: string;
}

export interface LpData {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  tags: LpTag[];
  likes: LPLike[];
  author: LpAuthor;
}

export interface LpListResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    data: LpData[];
    nextCursor: number | null;
    hasNext: boolean;
  };
}

export interface LpDetailResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: LpData;
}

export interface CreateLpRequest {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
}

export interface CreateLpResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: LpData;
}

export interface LpListParams {
  userId?: string;
  cursor?: number;
  limit?: number;
  search?: string;
  order?: 'asc' | 'desc';
}


