import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import AltaDeEntrada from '../pages/AltaDeEntrada'
import ListaDeEntradas from '../pages/ListaDeEntradas'
import ProtectedRoute from './ProtectedRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/alta-de-entrada" element={<AltaDeEntrada />} />
        <Route path="/lista-de-entradas" element={<ListaDeEntradas />} />
      </Route>
      
      {/* Catch all other routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
