import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiGithub } from 'react-icons/fi';
import {
  Button,
  VStack,
  Heading,
} from '@chakra-ui/react';
import { useAuth } from '../supabase/authUtils';

export default function Login() {
  const { currentUser, signInWithOAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/home');
    }
  }, [currentUser, navigate]);

  const handleGitHubSignIn = async () => {
    if (!signInWithOAuth) return;
    try {
      await signInWithOAuth('github');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <VStack gap={8} minH="50vh">
      <VStack textAlign="center" gap={2} mt="12">
        <Heading as="h2">
          Iniciar Sesión
        </Heading>
      </VStack>
      <Button
        onClick={handleGitHubSignIn}
        colorPalette="green"
        variant="solid"
        width="full"
        size="xl"
        rounded="lg" 
        shadow="md"
      >
        <FiGithub />
        Iniciar sesión con GitHub
      </Button>
    </VStack>
  );
}
