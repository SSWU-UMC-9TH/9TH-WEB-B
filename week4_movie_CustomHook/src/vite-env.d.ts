/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_TMDB_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

// 환경 변수 관리