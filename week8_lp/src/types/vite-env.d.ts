/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_API_URL: string;
  // 필요한 env 더 추가
  // readonly VITE_SOMETHING: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


