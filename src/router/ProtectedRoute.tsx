import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../supabase/authUtils'

export default function ProtectedRoute() {
  const { currentUser } = useAuth()
  
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
