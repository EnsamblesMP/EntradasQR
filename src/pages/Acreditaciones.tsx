import { Alert, Box, Heading, Spinner, VStack } from '@chakra-ui/react';
import { ButtonLink } from '../router/ButtonLink';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { useAnio } from '../supabase/anioUtils';

interface Funcion {
  nombre_funcion: string;
}

export default function Home() {
  const { anio } = useAnio();
  const [funciones, setFunciones] = useState<Funcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const obtenFunciones = useCallback(async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('funciones')
          .select('nombre_funcion')
          .eq('year', anio)
          .order('orden', { ascending: true });

        if (error) throw error;

        setFunciones(data as Funcion[]);

      } catch (err: unknown) {
        const errorMessage = err && typeof err === 'object' && 'message' in err 
          ? String(err.message) 
          : 'Error cargando funciones';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }, [anio]);

  useEffect(() => {
    obtenFunciones();
  }, [obtenFunciones, anio]);

  return (
    <VStack gap={6} textAlign="center">
      <VStack gap={3}>
        <Heading as="h1" w="sm" size="3xl" fontWeight="semibold">
          Elegir para que funcion acreditar (año {anio})
        </Heading>
      </VStack>
      
      <Box w="full">
        <VStack gap={3}>
          <ButtonLink key="sin-filtro" to="/preacreditacion/" variant="surface" size="lg" w="full">
            Sin filtro de función
          </ButtonLink>
          {loading && (
            <Spinner size="xl" color="blue.500" />
          )}
          {error && (
            <Alert.Root status="error">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Description>
                  {error}
                </Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}
          {!loading && !error && (
            <VStack gap={3} w="full">
              {funciones.map((funcion) => (
                <ButtonLink
                  key={funcion.nombre_funcion}
                  to={`/preacreditacion/${funcion.nombre_funcion}`}
                  variant="surface"
                  size="md"
                  w="full"
                >
                  {funcion.nombre_funcion}
                </ButtonLink>
              ))}
            </VStack>
          )}
        </VStack>
      </Box>
    </VStack>
  );
}
