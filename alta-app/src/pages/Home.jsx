import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const { currentUser } = useAuth()

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Bienvenido a EntradasQR</h1>
      <p className="text-xl text-gray-600 mb-8">
        Sistema de gestión de entradas con códigos QR
      </p>
      
      {!currentUser ? (
        <div className="space-x-4">
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Iniciar Sesión
          </Link>
        </div>
      ) : (
        <div className="space-x-4">
          <Link
            to="/alta"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Ir al Panel
          </Link>
        </div>
      )}
    </div>
  )
}
