import type { CursorBasedResponse } from "./common";

export type Tag = {
    id: number;
    name: string;
}

export type Likes = {
    id: number;
    userId: number;
    lpId: number;
}

export type Author = {
    avatar: string;
    bio: string;
    createdAt: string;
    email: string;
    id: number;
    name: string;
    updatedAt: string;
}

export type Lp = {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published: boolean;
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
    tags: Tag[];
    likes: Likes[];
    author: Author;
}

export type Comment = {
    id: number,
    content: string,
    lpId: number,
    authorId: number,
    createdAt: Date,
    updatedAt: Date,
    author: Author
}

export type ResponseLpListDto = CursorBasedResponse<Lp[]>;