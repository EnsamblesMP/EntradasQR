import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'

export default function Home() {
  const { currentUser } = useAuth()

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Bienvenido a la Alta de EntradasQR</h1>
      <p className="text-xl text-gray-600 mb-8">
        Sistema de gestión de entradas con códigos QR
      </p>
      
      <div className="space-x-4">
        {!currentUser ? (
          <Button to="/login" variant="primary">
            Iniciar Sesión
          </Button>
        ) : (
          <Button to="/alta" variant="primary">
            Ir al Panel
          </Button>
        )}
      </div>
    </div>
  )
}
