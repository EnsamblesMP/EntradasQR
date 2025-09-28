import { useCreateEntrada } from '../queries/useEntradas';
import { useCallback } from 'react';
import { useCampos } from '../components/Campos';
import { useNavigate } from 'react-router-dom';
import CamposEntrada from '../components/CamposEntrada';
import {
  Alert,
  Box,
  Button,
  Flex,
  Heading,
} from '@chakra-ui/react';
import { toaster } from '../chakra/toaster';
import { v4 as uuidv4 } from 'uuid';
import type { FC, FormEvent } from 'react';

const AltaDeEntrada: FC = () => {
  const navigate = useNavigate();
  const {
    mutateAsync: createEntrada,
    isPending: guardandoEntrada,
    error: errorEntrada,
  } = useCreateEntrada();
  const {
    campos,
    cambiarCampos,
    camposValidos,
  } = useCampos();

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!camposValidos) {
      
      toaster.create({
        title: 'Falta información',
        description: 'Por favor, completa todos los campos obligatorios.',
        type: 'error',
        duration: 10000,
        closable: true,
      });
      return;
    }

    try {
      // Generar un nuevo UUID para la entrada
      const id = uuidv4();

      // Insertar en la tabla 'entradas' de Supabase
      const entrada = {
        id,
        nombre_comprador: campos.nombreComprador.trim(),
        email_comprador: campos.emailComprador?.trim().toLowerCase() || undefined,
        compradas: campos.cantidad,
        id_alumno: campos.idAlumno!,
      };
      await createEntrada(entrada);

      toaster.create({
        title: 'Entrada generada correctamente',
        type: 'success',
        closable: true,
      });

      navigate(`/template-entrada/${id}`);

    } catch (error) {
      console.error('Error al generar la entrada:', error);
      toaster.create({
        title: 'Error al generar la entrada',
        description: error instanceof Error ? error.message : 'Error desconocido',
        type: 'error',
        duration: 10000,
        closable: true,
      });
    }
  }, [campos, camposValidos, createEntrada, navigate]);

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Heading as="h1" mb={6} textAlign="center" minW="sm">
        Alta de entrada
      </Heading>
      <Box gap="6" w="full">

        <CamposEntrada
          campos={campos}
          alCambiarCampos={cambiarCampos}
          disabled={guardandoEntrada}/>

        <Flex direction="row" gap={3} mt={4} w="full">
          <Button
            type="submit"
            colorPalette="green"
            variant="solid"
            size="lg"
            flex={1}
            loading={guardandoEntrada}
            disabled={!camposValidos || guardandoEntrada}
            loadingText="Generando..."
          >
            Generar entrada
          </Button>
          <Button
            variant="subtle"
            size="lg"
            flex={1}
            onClick={() => navigate('/')}
            disabled={guardandoEntrada}
          >
            Cancelar
          </Button>
        </Flex>

        {errorEntrada && (
          <Alert.Root rounded="md" w="full">
            <Alert.Indicator />
            <Alert.Title>Error al generar la entrada</Alert.Title>
            <Alert.Description>{errorEntrada instanceof Error ? errorEntrada.message : 'Error desconocido'}</Alert.Description>
          </Alert.Root>
        )}
      </Box>
    </Box>
  );
};

export default AltaDeEntrada;
