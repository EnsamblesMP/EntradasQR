import { ReactNode } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Button,
  HStack,
  VStack,
  Box,
} from '@chakra-ui/react';
import { ColorModeButton } from '../chakra/color-mode';
import { useColorModeValue } from '../chakra/use-color-mode';
import { useAuth } from '../supabase/authUtils'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
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

  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <VStack w="lg" mx="auto">
      <nav>
        <HStack>
          <RouterLink to="/">
            <Button size="xs" variant="surface">
              Entradas QR Alta App
            </Button>
          </RouterLink>
          {currentUser && (
            <Button onClick={handleLogout} size="xs" variant="surface">
              Cerrar Sesión
            </Button>
          )}
          <ColorModeButton />
        </HStack>
      </nav>
      <main>
        <Box w="lg" bg={bgColor} p={6} rounded="lg" shadow="md" maxW="2xl" mx="auto">
          {children}
        </Box>
      </main>
    </VStack>
  )
}
