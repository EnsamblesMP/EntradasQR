import { useAuth } from '../supabase/authUtils';
import { VStack, Heading, Text, Box } from '@chakra-ui/react';
import { ButtonLink } from '../router/ButtonLink';

export default function Home() {
  const { currentUser } = useAuth();
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
            <ButtonLink to="/alta-de-entrada" variant="surface" size="md" w="full">
              Alta de Entrada
            </ButtonLink>
            <ButtonLink to="/lista-de-entradas" variant="surface" size="md" w="full">
              Lista de Entradas
            </ButtonLink>
            <ButtonLink to="/preacreditacion" variant="surface" size="md" w="full">
              Preacreditación
            </ButtonLink>
          </VStack>
        )}
      </Box>
    </VStack>
  );
}
