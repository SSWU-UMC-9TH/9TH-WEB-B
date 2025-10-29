import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
    headers: {
        Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY.accessToken)}`
    }
})

axiosInstance.interceptors.request.use(
    (config) => {
        const accessTokenTemp = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

        if (accessTokenTemp) {
            const accessToken = accessTokenTemp.replace(/"/g, ''); 
            
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);