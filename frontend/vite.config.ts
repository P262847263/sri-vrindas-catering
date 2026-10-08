import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180,
    // bind to localhost only for safer local development
    // bind explicitly to IPv4 loopback to ensure 127.0.0.1 connections work
    host: '127.0.0.1',
    // automatically open the browser when the dev server starts
    open: true,
    // Proxy API requests to the backend during development so frontend can use '/api/*' paths
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
