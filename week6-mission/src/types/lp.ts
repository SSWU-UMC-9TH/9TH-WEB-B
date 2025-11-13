import type { CommonCursorBasedResponse } from "./common";

export type Tag={
    id:number;
    name:string;
};

export type Likes={
    id:number;
    userId:number;
    lpId:number;
}

export type ResponseLpListDto = CommonCursorBasedResponse<{
    data:{
        id:number;
        title: string;
        content: string;
        thumbnail: string;
        published: boolean;
        authorId: number;
        createdAt: string;
        updatedAt: string;
        tags: Tag[];
        likes: Likes[];
    }[];
}>;
