import { useAuth } from '../supabase/authUtils';
import { Button, VStack, Heading, Text, Box } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export default function Home() {
  const { currentUser } = useAuth();
  return (
    <VStack gap={6} textAlign="center" py={12}>
      <VStack gap={3}>
        <Heading as="h1" size="3xl" color="brand.fg" fontWeight="semibold">
          Entradas QR Alta App
        </Heading>
        <Text fontSize="2xl" colorPalette="green" color="green.700">
          Ensambles MP
        </Text>
      </VStack>
      
      <Box>
        {!currentUser ? (
          <RouterLink to="/login">
            <Button colorScheme="brand" size="lg">
              Iniciar Sesión
            </Button>
          </RouterLink>
        ) : (
          <RouterLink to="/alta">
            <Button colorScheme="brand" size="lg">
              Alta de Entrada
            </Button>
          </RouterLink>
        )}
      </Box>
    </VStack>
  );
}
