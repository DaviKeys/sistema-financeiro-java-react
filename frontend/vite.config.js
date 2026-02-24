import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,      // Força a porta 5173
    strictPort: true // Se estiver ocupada, ele AVISA em vez de mudar sozinho
  }
})