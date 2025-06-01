import './index.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from "./chakra/provider"
import App from './router/App'

const rootElem = document.getElementById('root');

if (!rootElem) {
  throw new Error("Failed to find the root element");
}

createRoot(rootElem).render(
  <React.StrictMode>
    <BrowserRouter basename="/EntradasQR/">
      <Provider>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
