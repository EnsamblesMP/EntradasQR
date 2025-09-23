# 🎟️ Entradas QR

Aplicación web para la gestión de entradas con códigos QR para eventos de Ensambles MP.

## 🚀 Características

- Escaneo de códigos QR para validación de entradas
- Panel de administración para gestión de entradas
- Gestión de eventos por año
- Autenticación con Supabase (OAuth via GitHub)
- Interfaz con diseño para móvil (y responsiva en pantalla de impresión)
- Diseño moderno con Chakra UI

## 🛠️ Tecnologías

- 🔳 [React-Qr-Scanner](https://github.com/yudiel/react-qr-scanner)
- 🔐 [Supabase](https://supabase.com/)
- 🎨 [Chakra UI v3](https://chakra-ui.com/)
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

3. Actualiza tu instancia de Supabase para que tenga toda la estructura necesaria. Ver carpeta `docs/supabase-first-setup`.

4. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
   ```

5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

6. Abre tu navegador en [http://localhost:5173/EntradasQR](http://localhost:5173/EntradasQR)

## 🏗️ Estructura del proyecto

```
src/
├── pages/         # Páginas que tienen su propia ruta
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
