import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'

export default function Home() {
  const { currentUser } = useAuth()

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Entradas QR Alta App</h1>
      <h2 className="text-xl font-semibold text-gray-600 mb-6">Ensambles MP</h2>
      
      <div className="space-x-4">
        {!currentUser ? (
          <Button to="/login" variant="primary">
            Iniciar Sesión
          </Button>
        ) : (
          <Button to="/alta" variant="primary">
            Alta de Entrada
          </Button>
        )}
      </div>
    </div>
  )
}
