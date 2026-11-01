# 🎟️ Entradas QR

Aplicación web para la gestión de entradas con códigos QR para eventos de Ensambles MP.

## 🚀 Características

- Escaneo de códigos QR para validación de entradas
- Panel de administración para gestión de entradas
- Gestión de eventos por año
- Autenticación con Supabase (OAuth via GitHub)
- Interfaz con diseño para móvil (y responsiva en pantalla de impresión)
- Diseño moderno con Chakra UI
- Auto-refresco y cache de datos con React Query

## 🛠️ Tecnologías

- 🔳 [React-Qr-Scanner](https://github.com/yudiel/react-qr-scanner)
- 🔐 [Supabase](https://supabase.com/)
- 🎨 [Chakra UI v3](https://chakra-ui.com/)
- 🌴 [React Query](https://tanstack.com/query/v5)
- ⚛️ [React 19](https://reactjs.org/)
- ⸆⸉ [TypeScript](https://www.typescriptlang.org/)
- ⚡ [Vite](https://vitejs.dev/)
- 🛣 [React Router](https://reactrouter.com/)

## 📋 Requisitos previos

- Node.js 20.19+
- Cuenta de Supabase

## 🚀 Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/EnsamblesMP/EntradasQR.git
   cd EntradasQR
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Actualiza tu instancia de Supabase (https://supabase.com/) para que tenga toda la estructura necesaria usando los archivos SQL de la carpeta `docs/supabase-first-setup`.

4. Configurar autenticacion entre Supabase y GitHub.

   1. En GitHub > Developer Settings (https://github.com/settings/developers) crear una nueva "OAuth Apps" y generale un "Client secret".

   2. Copia el Client ID y Client secret de la pantalla anterior (desde GitHub) a Supabase > Authentication > Sign In / Providers > GitHub.

   3. Copia el "Callback URL (for OAuth)" de la pantalla anterior (desde Supabase) y agregalo como un nuevo "Redirect URI" en tu OAuth App en GitHub.
   Puede que tambien necesites agregar: http://localhost:5173/auth/v1/callback

   4. Crea un archivo `.env` en esta misma carpeta con las siguientes variables:
   ```
   VITE_SUPABASE_URL=tu_project_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_anon_public_key_de_supabase
   ```
   La url del projecto puede copiarse desde el Project Overview de Supabase (e.g. https://abcdefghijklmnopqrst.supabase.co). Y la `anon public` key esta en Project Settings > API Keys dentro el tab "Legacy anon, service_role API keys".

5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

6. Abre tu navegador en [http://localhost:5173/EntradasQR](http://localhost:5173/EntradasQR)

## 🏗️ Estructura del proyecto

```
src/
├── pages/         # Páginas que tienen su propia ruta
├── queries/       # Para lo relacionado a React Query
├── router/        # Para lo relacionado a React Router
├── supabase/      # Para lo relacionado a Supabase
├── chakra/        # Para lo relacionado a Chakra UI
└── components/    # Componentes reutilizables
public/            # Archivos servidos directamente
```

## 🚀 Despliegue

GitHub Actions se encarga de que al pushear al branch `main`, la aplicación se despliega automáticamente en GitHub Pages: https://ensamblesmp.github.io/EntradasQR/.

---

Desarrollado con ❤️ por [Mariano Desanze](https://github.com/protron) para [Ensambles MP](https://www.ensambles.musica.ar/)
