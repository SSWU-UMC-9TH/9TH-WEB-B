export const API_KEYS = {
  BASE_URL: 'http://localhost:3000/api',
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    LP_LIST: '/lps',
    LP_DETAIL: '/lps/:id',
    LP_CREATE: '/lps',
    LP_UPDATE: '/lps/:id',
    LP_DELETE: '/lps/:id',
    COMMENTS: '/lps/:id/comments',
    LIKES: '/lps/:id/likes'
  }
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData'
};

// 기존 코드와의 호환성을 위해 LOCAL_STORAGE_KEY 별칭 추가
export const LOCAL_STORAGE_KEY = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  userData: 'userData'
} as const;

export const QUERY_KEYS = {
  LP_LIST: 'lpList',
  LP_DETAIL: 'lpDetail',
  COMMENTS: 'comments',
  USER: 'user'
};


