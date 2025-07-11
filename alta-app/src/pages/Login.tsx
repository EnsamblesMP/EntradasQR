import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';
import {
  Button,
  VStack,
  Heading,
  Box,
  Container,
} from '@chakra-ui/react';
import { useColorModeValue } from '../chakra/use-color-mode';
import { useAuth } from '../supabase/authUtils';

export default function Login() {
  const { currentUser, signInWithOAuth } = useAuth();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    if (currentUser) {
      navigate('/alta');
    }
  }, [currentUser, navigate]);

  const handleGitHubSignIn = async () => {
    try {
      await signInWithOAuth('github');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <Box minH="50vh" bg={bgColor} py={12} px={{ base: 4, sm: 6, lg: 8 }}>
      <Container maxW="md">
        <VStack gap={8}>
          <VStack textAlign="center" gap={2}>
            <Heading as="h2" size="xl" colorScheme="gray">
              Iniciar Sesión
            </Heading>
          </VStack>

          <Box 
            w="full" 
            bg={cardBg} 
            p={{ base: 4, sm: 8 }} 
            rounded="lg" 
            shadow="md"
          >
            <VStack gap={6}>
              <Button
                onClick={handleGitHubSignIn}
                colorScheme="gray"
                variant="outline"
                width="full"
                size="lg"
              >
                <FaGithub />
                Iniciar sesión con GitHub
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
