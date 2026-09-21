/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITEAPIURL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
