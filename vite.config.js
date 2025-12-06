import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  // Optimize specific deps that Vite sometimes fails to pre-bundle automatically
  optimizeDeps: {
    include: [
      'react-pdf',
      '@use-gesture/react',
      'prop-types',
      'pdfjs-dist'
    ]
  },
  server: {
    hmr: {
      // disable the overlay during debugging of optimizeDeps errors
      overlay: false
    }
  }
})
