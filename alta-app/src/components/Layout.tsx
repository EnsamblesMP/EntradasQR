import { ReactNode, useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Button,
  HStack,
  VStack,
  Box,
  Editable,
} from '@chakra-ui/react';
import { FiCalendar } from 'react-icons/fi';
import { ColorModeButton } from '../chakra/color-mode';
import { useColorModeValue } from '../chakra/use-color-mode';
import { useAuth } from '../supabase/authUtils'
import { AnioContext } from '../supabase/anioUtils'

interface LayoutProps {
  children: ReactNode
}

const getCurrentYear = () => {
  return new Date().getFullYear();
};

interface SelectorDeAnioProps {
  anio: number;
  setAnio: (anio: number) => void;
}

const SelectorDeAnio = ({ anio, setAnio }: SelectorDeAnioProps) => {
  return (
    <HStack border="1px" borderColor="gray.200" rounded="md">
      <FiCalendar size="24px" />
      <Editable.Root
        defaultValue={anio.toString()}
        onValueChange={(e) => setAnio(parseInt(e.value))}
      >
        <Editable.Input type="number" min={2020} max={2080} />
        <Editable.Preview />
      </Editable.Root>
    </HStack>
  );
};


export default function Layout({ children }: LayoutProps) {
  const [anio, setAnio] = useState(getCurrentYear());
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    if (!signOut) return;
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Failed to log out', error)
    }
  };

  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <VStack w="lg" mx="auto">
      <nav>
        <HStack>
          <SelectorDeAnio anio={anio} setAnio={setAnio} />
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
        <AnioContext.Provider value={{ anio: anio }}>
          <Box w="lg" bg={bgColor} p={6} rounded="lg" shadow="md" maxW="2xl" mx="auto">
            {children}
          </Box>
        </AnioContext.Provider>
      </main>
    </VStack>
  )
}
