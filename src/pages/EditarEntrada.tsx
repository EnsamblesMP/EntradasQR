import React, { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Alert,
  Box, 
  Button, 
  Flex, 
  Heading, 
  VStack, 
  Spinner, 
  Text,
  Stack,
} from '@chakra-ui/react';
import { toaster } from '../chakra/toaster';
import { useCampos } from '../components/Campos';
import { useEntradaPorId, useUpdateEntrada, useDeleteEntrada } from '../queries/useEntradas';
import CamposEntrada from '../components/CamposEntrada';
import { ImagenQr } from '../components/ImagenQr';
import CampoCopiable from '../components/CampoCopiable';
import { DeleteConfirmation } from '../components/DeleteConfirmation';

const EditarEntrada: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: entrada, isLoading: cargando, error: errorCarga } = useEntradaPorId(id);
  const { mutateAsync: updateEntrada, isPending: guardando } = useUpdateEntrada();
  const { mutateAsync: deleteEntrada } = useDeleteEntrada();

  const {
    campos,
    cambiarCampos,
    camposValidos,
  } = useCampos();

  // Actualizar los campos cuando se cargue la entrada
  useEffect(() => {
    if (entrada) {
      cambiarCampos({
        nombreComprador: entrada.nombre_comprador || '',
        emailComprador: entrada.email_comprador || '',
        cantidad: entrada.compradas || 1,
        idAlumno: entrada.id_alumno || null,
        idGrupo: entrada.id_grupo || null,
      });
    }
  }, [entrada, cambiarCampos]);

  const handleDelete = useCallback(async (entradaId: string) => {
    try {
      await deleteEntrada(entradaId);
      
      toaster.create({
        title: 'Entrada borrada correctamente',
        type: 'success',
        closable: true,
      });
      
      navigate('/lista-de-entradas');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      toaster.create({
        title: 'Error al borrar entrada',
        description: errorMessage,
        type: 'error',
        duration: 10000,
        closable: true,
      });
    }
  }, [deleteEntrada, navigate]);


  const handleGuardar = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!entrada?.id) {
      toaster.create({
        title: 'Error al guardar',
        description: 'No se pudo identificar la entrada a actualizar.',
        type: 'error',
        duration: 8000,
        closable: true,
      });
      return;
    }
    
    if (!camposValidos) {
      toaster.create({
        title: 'Error al guardar',
        description: 'Por favor, completa todos los campos obligatorios.',
        type: 'error',
        duration: 8000,
        closable: true,
      });
      return;
    }

    try {
      const entradaActualizada = {
        id: entrada.id,
        nombre_comprador: campos.nombreComprador.trim(),
        email_comprador: campos.emailComprador?.trim() || undefined,
        compradas: campos.cantidad,
        id_alumno: campos.idAlumno!,
      };
      
      await updateEntrada(entradaActualizada);
      
      toaster.create({
        title: 'Cambios guardados correctamente',
        type: 'success',
        closable: true,
      });
      
      // Navegar a la lista
      navigate('/lista-de-entradas');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      toaster.create({
        title: 'Error al guardar entrada',
        description: errorMessage,
        type: 'error',
        duration: 10000,
        closable: true,
      });
      
      console.error('Error al guardar la entrada:', error);
    }
  }, [entrada, campos, camposValidos, updateEntrada, navigate]);

  if (cargando) {
    return (
      <Box p={4}>
        <Flex align="center" justify="center" direction="column" gap={4}>
          <Spinner size="xl" />
          <Text>Cargando entrada...</Text>
        </Flex>
      </Box>
    );
  }
  
  if (errorCarga || !entrada) {
    return (
      <Box p={4}>
        <Stack p={4} align="stretch">
          <Box 
            p={4} 
            borderWidth="1px" 
            borderRadius="md" 
            borderColor="red.200" 
            bg="red.50"
          >
            <Text fontWeight="bold" color="red.600">
              Error al cargar la entrada
            </Text>
            <Text color="red.600">
              {errorCarga instanceof Error ? errorCarga.message : 'No se pudo cargar la entrada solicitada.'}
            </Text>
          </Box>
          <Button 
            mt={4} 
            colorScheme="red"
            onClick={() => navigate('/lista-de-entradas')}
          >
            Volver a la lista
          </Button>
        </Stack>
      </Box>
    );
  }

  if (!id) {
    return (
      <VStack>
        <Alert.Root rounded="md" w="full">
          <Alert.Indicator />
          <Alert.Title>Error</Alert.Title>
          <Alert.Description>Falta el parámetro ID en la URL.</Alert.Description>
        </Alert.Root>
        <Button 
          colorPalette="red"
          onClick={() => navigate('/lista-de-entradas')}
        >
          Volver a la lista
        </Button>
      </VStack>
    );
  }

  return (
    <Box p={4}>
      <VStack as="form" onSubmit={handleGuardar} gap={6} align="stretch">
        <Flex w="full" justifyContent="space-between" alignItems="center">
          <Heading as="h1" size="lg">Editar entrada</Heading>
          <DeleteConfirmation
            onConfirm={() => handleDelete(id!)}
            title="Eliminar entrada"
            message="¿Seguro que deseas borrar esta entrada? Esta acción no se puede deshacer."
            confirmText="Eliminar entrada"
            cancelText="Cancelar"
            disabled={cargando || guardando}
          />
        </Flex>

        <Stack gap={6} w="full">
          <CamposEntrada
            campos={campos}
            alCambiarCampos={cambiarCampos}
            disabled={cargando}
          />

          <Flex direction="row" gap={3} mt={4} w="full">
            <Button
              type="submit"
              variant="solid"
              size="lg"
              flex={1}
              loading={guardando}
              loadingText="Guardando..."
              disabled={!camposValidos || guardando || cargando}
            >
              Guardar cambios
            </Button>
            <Button
              variant="subtle"
              colorPalette="green"
              size="lg"
              flex={1}
              onClick={() => navigate('/lista-de-entradas')}
              disabled={cargando || guardando}
            >
              Cancelar
            </Button>
          </Flex>
        </Stack>

        <Button
          variant="surface"
          size="lg"
          onClick={() => navigate(`/template-entrada/${id}`)}
        >
          Ver Email
        </Button>

        <CampoCopiable>
          <ImagenQr idEntrada={id}/>
        </CampoCopiable>

      </VStack>
    </Box>
  );
};

export default EditarEntrada;
