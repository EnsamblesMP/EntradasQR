// https://vite.dev/config/
import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'

// hostOnLan: elegir dependiendo desde donde probar (pero necesita configuraciones diferentes detalladas abajo de cada opcion)
// - true: para probar en dev desde el celular via LAN (ej. escaneo con camara)
//   * Supabase: Authentication: URL Configuration: Site URL: https://192.168.0.42:5173 Redirect URLs: https://192.168.0.42:5173/**
//   * GitHub: Developer Settings: OAuth Apps: Homepage URL: https://192.168.0.42:5173/EntradasQR/
//   * Usa HTTPS con certificados locales (creados via mkcert y copiados a android)
// - false: para probar desde esta misma PC
//   * Supabase: Authentication: URL Configuration: Site URL: https://localhost:5173 Redirect URLs: https://localhost:5173/**
//   * GitHub: Developer Settings: OAuth Apps: Homepage URL: https://localhost:5173/EntradasQR/
//   * Usa HTTP (sin certificados)
const hostOnLan = true

const keyPath = './secrets/key.pem'
const certPath = './secrets/cert.pem'
const hasCerts = fs.existsSync(keyPath) && fs.existsSync(certPath)
const useCertAndHost = hasCerts && hostOnLan

const server = useCertAndHost ? {
  https: {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  },
  host: '192.168.0.42',
  port: 5173
} : undefined

function printUrls(): Plugin[] {
  if (!useCertAndHost)
    return [];
  return [{
    name: 'hide-localhost-url',
    configureServer(server) {
      server.printUrls = () => {
        const urls = server.resolvedUrls
        const logger = server.config.logger
        if (urls?.network?.length) {
          for (const url of urls.network) {
            logger.info(`  ➜  Network: ${url}`)
          }
        }
      }
    },
  }];
}

export default defineConfig({
  plugins: [react(), tailwindcss(), printUrls()],
  base: '/EntradasQR/',
  server: server,
})