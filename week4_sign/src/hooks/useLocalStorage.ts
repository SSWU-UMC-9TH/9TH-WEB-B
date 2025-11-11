export const useLocalStorage = (key: string) => {
    // 문자열 토큰 등은 그대로 저장하고, 객체/배열만 JSON 직렬화
    const setItem = (value: unknown) => {
        try {
            if (typeof value === 'string') {
                window.localStorage.setItem(key, value);
            } else {
                window.localStorage.setItem(key, JSON.stringify(value));
            }
        } catch(error) {
            console.log(error);
        }
    }

    const getItem = () => {
        try {
            const item = window.localStorage.getItem(key);
            if (item == null) return null;
            // JSON 형태면 파싱하고, 아니면 원본문자열 반환
            try {
                const parsed = JSON.parse(item);
                return parsed;
            } catch {
                return item;
            }
        } catch(error) {
            console.log(error);
            return null;
        }
    }

    const removeItem = () => {
        try {
            window.localStorage.removeItem(key);
        } catch(error) {
            console.log(error);
        }
    }

    return {setItem, getItem, removeItem};
}