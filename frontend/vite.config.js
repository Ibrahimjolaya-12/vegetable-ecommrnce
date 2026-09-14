import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 100,
    },
    proxy: {
      '/api': {
        target: 'https://sabzi-mandi.vercel.app',
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
})
