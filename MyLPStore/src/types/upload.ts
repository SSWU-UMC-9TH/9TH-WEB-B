export interface UploadResponse {
    url: string;
    status: boolean;
    message: string;
    statusCode: number;
    data: {
        imageUrl: string;
    };
}
