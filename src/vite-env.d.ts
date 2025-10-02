/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Add any future VITE_ environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
