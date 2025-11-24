import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import AltaDeEntrada from '../pages/AltaDeEntrada'
import Layout from '../components/Layout'
import ListaDeEntradas from '../pages/ListaDeEntradas'
import ListaAlumnos from '../pages/ListaAlumnos'
import ListaImprimibleDeEntradas from '../pages/ListaImprimibleDeEntradas'
import ProtectedRoute from './ProtectedRoute'
import EditarEntrada from '../pages/EditarEntrada'
import EmailEntradaGenerada from '../pages/EmailEntradaGenerada'
import EditarEmailEntradaGenerada from '../pages/EditarEmailEntradaGenerada'
import CargaAlumno from '../pages/CargaAlumno'
import Preacreditacion from '../pages/Preacreditacion'
import Acreditar from '../pages/Acreditar'
import Acreditaciones from '../pages/Acreditaciones'
import UltimosCambios from '../pages/UltimosCambios'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/login" element={<Layout><Login /></Layout>} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/acreditaciones" element={<Layout><Acreditaciones /></Layout>} />
        <Route path="/alta-de-entrada" element={<Layout><AltaDeEntrada /></Layout>} />
        <Route path="/lista-de-entradas" element={<Layout><ListaDeEntradas /></Layout>} />
        <Route path="/lista-imprimible-de-entradas" element={<ListaImprimibleDeEntradas />} />
        <Route path="/ultimos-cambios" element={<Layout><UltimosCambios /></Layout>} />
        <Route path="/editar-entrada/:id" element={<Layout><EditarEntrada /></Layout>} />
        <Route path="/email-entrada-generada/:id" element={<Layout><EmailEntradaGenerada /></Layout>} />
        <Route path="/editar-email-entrada-generada" element={<Layout><EditarEmailEntradaGenerada /></Layout>} />
        <Route path="/preacreditacion/:funcion?" element={<Layout><Preacreditacion /></Layout>} />
        <Route path="/acreditar/:id" element={<Layout><Acreditar /></Layout>} />
        <Route path="/lista-alumnos" element={<Layout><ListaAlumnos /></Layout>} />
        <Route path="/carga-alumno" element={<Layout><CargaAlumno /></Layout>} />
        <Route path="/carga-alumno/:id_alumno" element={<Layout><CargaAlumno /></Layout>} />
      </Route>
      
      {/* Catch all other routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
