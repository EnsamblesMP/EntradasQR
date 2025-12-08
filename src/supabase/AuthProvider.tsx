import { useEffect, useState, ReactNode } from 'react';
import {
  Box,
  Button,
  Spinner,
  Alert,
  HStack,
  VStack,
  Text,
  List,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { AuthContext } from './authUtils';
import { getRouterBaseUrl } from '../router/AppBaseUrl'
import type { AuthContextType } from './authUtils';
import type { User } from '@supabase/supabase-js';

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
  const navigate = useNavigate();

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

  const alCerrarSesionLocal = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Si falla, igualmente intentamos recargar para forzar un nuevo estado
    } finally {
      navigate('/login');
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const alLimpiarDatosDelSitio = async (): Promise<void> => {
    const ignoraErrores = (fn: Function) => { try { fn(); } catch { } }
    ignoraErrores(window.localStorage.clear);
    ignoraErrores(window.sessionStorage.clear);
    window.location.href = getRouterBaseUrl();
  };

  const value: AuthContextType = {
    currentUser,
    signInWithOAuth: async (provider) => {
      try {
        const result = await Promise.race([
          supabase.auth.signInWithOAuth({
            provider,
            options: {
              redirectTo: getRouterBaseUrl()
            }
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
                <VStack align="start" gap={3}>
                  <Text>{authError}</Text>
                </VStack>
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
          <VStack align="start" gap={3} mt={4}>
            <Text>
              Podés probar alguna de estas opciones para intentar
              recuperar el sitio:
            </Text>
            <HStack gap={2} wrap="wrap">
              <Button
                size="sm"
                variant="solid"
                onClick={alCerrarSesionLocal}
              >
                Cerrar sesión
              </Button>
              <Button
                size="sm"
                variant="solid"
                onClick={alLimpiarDatosDelSitio}
              >
                Borrar datos del sitio
              </Button>
            </HStack>
            <Text>
              Si nada funciona, podés intentar:
              <List.Root>
                <List.Item>recargar la página via CTRL + F5</List.Item>
                <List.Item>borrar los datos del sitio via el navegador</List.Item>
              </List.Root>
            </Text>
          </VStack>
        </Box>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
