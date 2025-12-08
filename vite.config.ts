import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/EntradasQR/',
  server: {
    //host: '0.0.0.0', // habilitar solo en caso de intentar acceder desde LAN (pero via IP igualmente falla en el redirect del login)
  },
})