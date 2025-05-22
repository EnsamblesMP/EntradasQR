import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function Login() {
  const { currentUser, signInWithOAuth } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser) {
      navigate('/alta')
    }
  }, [currentUser, navigate])

  const handleGitHubSignIn = async () => {
    try {
      await signInWithOAuth('github')
    } catch (error) {
      console.error('Error logging in:', error)
    }
  }

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Iniciar Sesión
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <Button
                onClick={handleGitHubSignIn}
                fullWidth={true}
                variant="outline"
              >
                <span>Iniciar sesión con GitHub</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
