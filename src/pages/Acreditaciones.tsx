import { useFuncionesDelAnio } from '../queries/useFunciones';
import { Alert, Box, Heading, Spinner, VStack } from '@chakra-ui/react';
import { ButtonLink } from '../router/ButtonLink';
import { useAnio } from '../supabase/anioUtils';

export default function Home() {
  const { anio } = useAnio();
  const {
    data: funciones,
    isLoading: cargandoFunciones,
    error: funcionesError,
  } = useFuncionesDelAnio(anio);

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
          {cargandoFunciones && (
            <Spinner size="xl" color="blue.500" />
          )}
          {funcionesError && (
            <Alert.Root status="error">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Description>
                  Error cargando funciones: {funcionesError.message ?? funcionesError.toString?.()}
                </Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}
          {!cargandoFunciones && !funcionesError && (
            <VStack gap={3} w="full">
              {funciones?.map((funcion) => (
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
