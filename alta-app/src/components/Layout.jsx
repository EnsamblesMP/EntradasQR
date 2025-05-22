import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/Button'

export default function Layout({ children }) {
  const { currentUser, signOut } = useAuth()
  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Failed to log out', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Button variant="menu" to="/" className="text-xl font-bold text-gray-800 p-0 hover:bg-transparent">
                  Entradas QR Alta App
                </Button>
              </div>
              {currentUser && (
                <div className="hidden sm:ml-6 sm:flex">
                  <Button variant="menu" to="/alta">
                    Alta de Entrada
                  </Button>
                </div>
              )}
            </div>
            {currentUser && (
              <div className="flex items-center">
                <Button onClick={handleLogout} variant="outline" size="md">
                  Cerrar Sesión
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
