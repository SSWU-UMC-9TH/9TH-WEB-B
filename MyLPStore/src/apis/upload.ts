// 이미지 업로드 formData => url(Json)
import { axiosInstance } from "./axios";
import { UploadResponse } from "../types/upload";

export const uploadImage = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post<UploadResponse>("/v1/uploads", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    
    return response.data;
};
