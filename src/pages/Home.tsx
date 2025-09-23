import { useAuth } from '../supabase/authUtils';
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { ButtonLink } from '../router/ButtonLink';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();

  const handleLogout = async () => {
    if (!signOut) return;
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Failed to log out', error)
    }
  };

  return (
    <VStack gap={6} textAlign="center" py={12}>
      <VStack gap={3}>
        <Heading as="h1" w="sm" size="3xl" fontWeight="semibold">
          Entradas QR App
        </Heading>
        <Text fontSize="2xl" color="green.700">
          MP Ensambles
        </Text>
      </VStack>
      
      <Box w="full">
        {!currentUser ? (
          <ButtonLink to="/login" variant="solid" colorPalette="green" size="lg" w="full">
            Iniciar Sesión
          </ButtonLink>
        ) : (
          <VStack gap={3}>
            <ButtonLink to="/acreditaciones" variant="surface" size="2xl" w="full">
              Acreditaciones
            </ButtonLink>
            <ButtonLink to="/lista-de-entradas" variant="surface" size="md" w="full">
              Administrar Entradas
            </ButtonLink>
            <ButtonLink to="/lista-imprimible-de-entradas" variant="surface" size="md" w="full">
              Lista Imprimible de Entradas
            </ButtonLink>
            <Box textAlign="right" w="full">
            {currentUser && (
              <Button onClick={handleLogout} size="xs" variant="surface" mt={5}>
                Cerrar Sesión
              </Button>
            )}
            </Box>
          </VStack>
        )}
      </Box>
    </VStack>
  );
}
