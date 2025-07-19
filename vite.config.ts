import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true, // Enable WebSocket proxy
        timeout: 30000 // Increase timeout to 30 seconds
      }
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunks
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            'framer-motion',
            'lucide-react'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
    assetsInlineLimit: 4096, // Inline small assets
    target: ['es2015'], // Ensure broader browser compatibility
    minify: 'terser' // Use terser for better minification
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lucide-react']
  }
})