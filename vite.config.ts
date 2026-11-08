import { defineConfig, PluginOption, ServerOptions, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  let https: ServerOptions["https"] = undefined;
  if (env.VITE_USE_HTTPS === 'true') {
    if (!env.VITE_KEY_PATH || !env.VITE_CERT_PATH) {
      throw new Error('VITE_KEY_PATH y VITE_CERT_PATH son requeridos en .env cuando VITE_USE_HTTPS es true');
    }
    if (!fs.existsSync(env.VITE_KEY_PATH)) {
      throw new Error(`certificado VITE_KEY_PATH no encontrado en: ${env.VITE_KEY_PATH}`);
    }
    if (!fs.existsSync(env.VITE_CERT_PATH)) {
      throw new Error(`certificado VITE_CERT_PATH no encontrado en: ${env.VITE_CERT_PATH}`);
    }
    https = {
      key: fs.readFileSync(env.VITE_KEY_PATH),
      cert: fs.readFileSync(env.VITE_CERT_PATH),
    }
  }

  function printUrls(): PluginOption {
    if (!https || !env.VITE_HOST)
      return undefined;
    return {
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
    };
  }

  return {
    plugins: [react(), tailwindcss(), printUrls()],
    base: '/EntradasQR/',
    server: {
      https: https,
      host: env.VITE_HOST || undefined,
      port: env.VITE_PORT ? Number.parseInt(env.VITE_PORT) : undefined,
      strictPort: env.VITE_PORT ? true : false,
    },
  }
})
