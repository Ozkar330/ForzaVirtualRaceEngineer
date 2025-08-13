import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Importante para Electron - usa rutas relativas
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Optimizaciones para Electron
    rollupOptions: {
      output: {
        manualChunks: undefined, // Evita chunks separados que pueden causar problemas en Electron
      }
    }
  },
  server: {
    port: 5173,
    host: 'localhost'
  }
})
