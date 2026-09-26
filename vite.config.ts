import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The base public path is configurable so one codebase can build for
// /worldready/before/ and /worldready/after/ on GitHub Pages. Defaults to '/'
// for local dev. HashRouter handles in-app routing, so no SPA rewrites needed.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})

// Made with Bob
