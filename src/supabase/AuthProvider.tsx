import { useEffect, useState, ReactNode } from 'react';
import {
  Box,
  Spinner,
  Alert,
  VStack,
  Text
} from '@chakra-ui/react';
import { supabase } from './supabaseClient';
import { AuthContext } from './authUtils';
import type { AuthContextType } from './authUtils';
import type { User } from '@supabase/supabase-js';

// Determinar la URL de redirección según el entorno
const getRedirectUrl = () => {
  if (typeof window !== 'undefined') {
    // En producción (GitHub Pages)
    if (window.location.hostname === 'ensamblesmp.github.io') {
      return 'https://ensamblesmp.github.io/EntradasQR/';
    }
    // En desarrollo
    return window.location.href;
  }
  return 'http://localhost:5173/EntradasQR/';
};

const getTimeoutPromise = () => {
  return new Promise((_, reject) =>
    setTimeout(() => reject(
      new Error('Supabase no responde en el tiempo esperado. Puede que la cuenta esté pausada.')
    ), 10000)
  );
}

type SessionDataResponse = {
  data: { session: { user: User } | null };
  error: Error | null;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | undefined>(undefined);

  // Cargar la sesión del usuario al iniciar
  useEffect(() => {
    let isMounted = true;

    const getSession = async () => {
      try {
        const sessionData = await Promise.race([
          supabase.auth.getSession(),
          getTimeoutPromise(),
        ]) as SessionDataResponse;

        if (!isMounted) return;
        if (!sessionData) throw new Error('Error al cargar sesión');
        if (sessionData.error) throw sessionData.error;
        if (!sessionData.data?.session?.user) throw new Error('Error al cargar user de sesión');

        setCurrentUser(sessionData.data?.session?.user);
        setAuthError(undefined);
      } catch (error: unknown) {
        if (!isMounted) return;
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        setAuthError('Error al cargar sesión: ' + errorMessage);
        setCurrentUser(undefined);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session?.user ?? undefined);
        setAuthError(undefined);
      }
    );

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    currentUser,
    signInWithOAuth: async (provider) => {
      try {
        const result = await Promise.race([
          supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo: getRedirectUrl() }
          }),
          getTimeoutPromise(),
        ]) as SessionDataResponse;

        if (result?.error) throw result.error;
        setAuthError(undefined);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        setAuthError('Error al iniciar sesión: ' + errorMessage);
        throw error;
      }
    },
    signOut: async () => {
      try {
        const result = await supabase.auth.signOut()

        if (result.error) throw result.error;
        setAuthError(undefined);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        setAuthError('Error al cerrar sesión: ' + errorMessage);
        throw error;
      }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <VStack mt={8}>
          <Spinner size="xl" color="blue.500" />
          <Text>Cargando autenticación...</Text>
        </VStack>
      ) : authError ? (
        <Box p={5} maxW="md" mx="auto" mt={8}>
          <Alert.Root status="error" variant="solid">
            <Alert.Indicator />
            <Alert.Content color="fg">
              <Alert.Title fontSize="lg">
                Error de autenticación
              </Alert.Title>
              <Alert.Description>
                {authError}
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        </Box>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
