import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // All calls starting with /api will be proxied to your backend
      '/api': {
        target: 'http://localhost:3000',   // ← your backend runs here
        changeOrigin: true,
        secure: false,
      },
    },
  },
   resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})