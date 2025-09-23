---
trigger: always_on
---

# General Code Style
- Use Spanish for all code and documentation.

# Typescript Code Style
- Always declare the type of each variable and function (parameters and return value).
- Avoid using any.

# EntradasQR — AI coding agent guide
What this project is
- A small React + Vite single-page app (folder `./`) deployed under the `EntradasQR` base path.
- Uses Chakra UI for layout, Supabase for authentication and data access, and React Router for routing.

Key files and where to look
- `package.json` — dev scripts: `npm run dev`, `npm run build`, `npm run lint`, `npm run type-check`.
- `src/main.tsx` — app bootstrap; BrowserRouter uses basename `/EntradasQR` and wraps providers: Chakra `Provider`, `AuthProvider`, `Layout`, and `ErrorBoundary`.
- `src/router/AppRoutes.tsx` — route list and which routes are protected by `ProtectedRoute`.
- `src/supabase/supabaseClient.ts` — Supabase client uses Vite env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- `src/supabase/AuthProvider.tsx` and `authUtils.ts` — authentication flow, timeout handling, OAuth redirect behavior and messages shown on auth errors.
- `src/components/Layout.tsx` — top-level navigation and per-year selector (`AnioContext`) used across pages.

Mobile-first layout note
- All pages use `Layout.tsx`, which wraps content in a `<Box w="sm">` for optimal smartphone display. When adding new pages or components, ensure they fit well within this width constraint. Responsive design may be added in the future, but for now, prioritize mobile usability.

Note about language/style
- This repository prefers Spanish for UI strings, comments, and, where practical, identifiers (variables, functions, props). Try to follow existing Spanish names (e.g., `AnioContext`, `SelectorDeAnio`, `AltaDeEntrada`) and keep new code consistent with that choice.

Architecture and important patterns
- Single-page React app served under a non-root base path (`/EntradasQR`). Routes and client-side redirects use `sessionStorage.redirect` handling in `main.tsx` to support GitHub Pages.
- Auth is handled centrally by `AuthProvider` which exposes `useAuth()` context. Many pages assume `currentUser` may be undefined — check for guards before using `currentUser`.
- Protected routes use `ProtectedRoute` (see `src/router/ProtectedRoute.tsx`) to gate pages like `/alta-de-entrada` and `/lista-de-entradas`.
- UI is Chakra-first. Color-mode and theme tokens live under `src/chakra/`. Reuse existing style helpers: `use-color-mode.ts`, `provider.tsx`, `system.tsx`.

Developer workflows (explicit)
- Local dev with Vite:
  - npm install: `npm install` (or use the workspace task "npm: npm: install").
  - run dev server: `npm run dev` (on Windows, default shell is pwsh). The app expects env vars for Supabase in `.env` (see `.env.example`).
  - build for production: `npm run build` (task: "npm: npm: build").
  - preview built site: `npm run preview`.
  - typecheck: `npm run type-check` and lint: `npm run lint`.

Environment and deploy notes
- Supabase credentials come from Vite env vars: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. See `.env.example`.
- The app is intended to be hosted under `/EntradasQR` (for example GitHub Pages). `main.tsx` contains logic to preserve bookmark/refresh behavior on GitHub Pages — avoid removing that unless replacing the hosting strategy.

Deploy / CI note
- The repo uses a GitHub Actions workflow to deploy the built `dist` to GitHub Pages (see `.github/workflows/deploy.yml`). The site is published at `https://ensamblesmp.github.io/EntradasQR/`. You don't usually need to change the workflow; if you add routes or change the base path, update `404.html` in `public/` and the workflow if it changes the build output location.

Project-specific conventions
- Basename: All `Link`/router paths are written as root-relative (e.g., `/alta-de-entrada`) and the Router is configured with `basename='/EntradasQR'` — do not hardcode the base in links.
- Year selector: `Layout` provides an `AnioContext` (see `src/supabase/anioUtils.ts`), components read the current year from that context instead of using global date functions.
- Auth timeouts: `AuthProvider` uses a 10s race timeout when calling Supabase. When adding network calls in auth-related code, reuse `getTimeoutPromise()` pattern to keep consistent UX.

Safety and testing hints for AI agents
- Don't change app base path or routing strategy without checking `main.tsx` redirect code and `404.html` in `public/` (used for GitHub Pages). If you add routes, update `404.html`/deployment config.
- When modifying Supabase calls, preserve the error wrapping and user-friendly Spanish messages found in `AuthProvider.tsx`.
- Keep UI strings in Spanish where existing messages are Spanish (e.g. `Cargando autenticación...`, `Cerrar Sesión`).

Examples to copy-paste
- Create Supabase client usage:
  - import { supabase } from '../supabase/supabaseClient';
  - Use `await supabase.from('entries').select('*')` and preserve error handling.
- Wrap new top-level pages with the existing `Layout` and `AuthProvider` by adding route entries in `src/router/AppRoutes.tsx`.

When unsure, read these files first
- `src/main.tsx`
- `src/supabase/AuthProvider.tsx`
- `src/router/AppRoutes.tsx`
- `package.json` and `.env.example`

Feedback
- After applying changes, ping for feedback and include the altered files and a short rationale.
