import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import AltaDeEntrada from '../pages/AltaDeEntrada'
import ListaDeEntradas from '../pages/ListaDeEntradas'
import ProtectedRoute from './ProtectedRoute'
import EditarEntrada from '../pages/EditarEntrada'
import TemplateEntrada from '../pages/TemplateEntrada'
import Preacreditacion from '../pages/Preacreditacion'
import Acreditar from '../pages/Acreditar'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/alta-de-entrada" element={<AltaDeEntrada />} />
        <Route path="/lista-de-entradas" element={<ListaDeEntradas />} />
        <Route path="/editar-entrada/:id" element={<EditarEntrada />} />
        <Route path="/template-entrada/:id" element={<TemplateEntrada />} />
        <Route path="/preacreditacion" element={<Preacreditacion />} />
        <Route path="/acreditar/:id" element={<Acreditar />} />
      </Route>
      
      {/* Catch all other routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
