import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/SitaThaiDanceViewer/', // <-- IMPORTANT for GitHub project page
  plugins: [react()],
  resolve: {
    alias: {
      'three/addons/': 'three/examples/jsm/'
    }
  },
  optimizeDeps: {
    include: ['three']
  }
})
