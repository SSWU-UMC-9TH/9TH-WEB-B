import { useEffect, useState } from "react";
import axios from "axios";

interface MovieFetchResponse<T> {
    data: T | null,
    isPending: boolean,
    isError: boolean,
}

function useCustomFetch<T>(url: string): MovieFetchResponse<T> {
    const [data, setData] = useState<T | null>(null);
    const [isPending, setIsPending] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const FetchData = async () => {
            setIsPending(true);
            try {
                const response = await axios.get<T>(
                    url,
                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
                        }
                    }
                );
                setData(response.data);
            } catch {
                setIsError(true);
            } finally{
                setIsPending(false);
            }
        }
        FetchData();
    }, [url])
    return {data, isPending, isError};
}

export default useCustomFetch;