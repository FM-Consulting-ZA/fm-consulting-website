import path from "path"
import { fileURLToPath } from "url"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
// inspectAttr stamps every element with its source file path. That is useful
// in the editor, but it must stay out of production HTML, so dev server only.
export default defineConfig(({ command }) => ({
  base: '/',
  // Which kind of Vercel build this is ('production', 'preview', or '' locally).
  // Read by src/data/work.ts when pages are pre-rendered.
  define: {
    __VERCEL_ENV__: JSON.stringify(process.env.VERCEL_ENV ?? ''),
  },
  plugins: [...(command === 'serve' ? [inspectAttr()] : []), react()],
  resolve: {
    alias: {
      "@": path.resolve(fileURLToPath(new URL('.', import.meta.url)), "./src"),
    },
  },
}));
