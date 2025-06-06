import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '../supabase/AuthContext'
import Layout from '../components/Layout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import AltaDeEntrada from '../components/AltaDeEntrada'
import ProtectedRoute from './ProtectedRoute'
import ErrorBoundary from './ErrorBoundary'

function App() {
  return (
    <AuthProvider>
      <Layout>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/alta" element={<AltaDeEntrada />} />
              {/* Add more protected routes here */}
            </Route>
            
            {/* Catch all other routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </Layout>
    </AuthProvider>
  )
}

export default App
