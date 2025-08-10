import './index.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from "./chakra/provider"
import { AuthProvider } from './supabase/AuthProvider'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import AppRoutes from './router/AppRoutes'

const rootElem = document.getElementById('root');
if (!rootElem) {
  throw new Error("Failed to find the root element");
}

const appBase = '/EntradasQR';

createRoot(rootElem).render(
  <React.StrictMode>
    <BrowserRouter basename={appBase}>
      <Provider>
        <ErrorBoundary>
          <AuthProvider>
            <Layout>
              <AppRoutes />
            </Layout>
          </AuthProvider>
        </ErrorBoundary>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

// Para arreglar el problema de los bookmarks y refreshs en github pages (and 404.html is also needed)
const redirect = sessionStorage.getItem('redirect');
if (redirect) {
  sessionStorage.removeItem('redirect');
  const fullPath = appBase + (redirect.startsWith('/') ? redirect : '/' + redirect);
  history.replaceState(null, '', fullPath);
}
