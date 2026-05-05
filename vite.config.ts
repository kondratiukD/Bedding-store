import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  root: path.resolve(__dirname),
  base: process.env.GITHUB_PAGES ? '/Bedding-store/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
})
