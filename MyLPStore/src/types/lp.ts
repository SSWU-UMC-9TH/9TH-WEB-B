import { ReactNode } from "react";
import { CursorBasedResponse } from "./commons";

export type Tag={
    id:number;
    name:string;
}

export type Likes={
    id: number;
    userId: number;
    lpId: number;
}

export type Author = {
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
}

export type Lp= {
    releaseDate?: ReactNode;
    artist?: ReactNode;
    id:number;
    title: string,
    content: string,
    thumbnail: string,
    published: boolean,
    authorId: number,
    createdAt: string,
    updatedAt: string,
    tags: Tag[];
    likes: Likes[];
    author?: Author;
};

export type ResponseLpListDto=CursorBasedResponse<Lp[]>;

export type CreateLpDto = {
    title: string;
    content: string;
    thumbnail: string;
    tags: string[];
    published: boolean;
};