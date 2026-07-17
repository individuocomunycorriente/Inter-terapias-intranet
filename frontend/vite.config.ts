import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite que Docker acceda al servidor
    port: 5173,
    watch: {
      usePolling: true, // Necesario en Linux/Docker para detectar cambios de archivos en volúmenes compartidos
    },
  },
})
