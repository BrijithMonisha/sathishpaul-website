import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  // Ensure service worker and manifest are copied to dist
  publicDir: 'public',
  optimizeDeps: {
    exclude: ['particles.js', 'react-snap', 'xmlbuilder2']
  }
})

