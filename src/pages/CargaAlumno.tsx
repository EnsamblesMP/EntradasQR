import { useAlumnoPorId, useCreateAlumno, useDeleteAlumno, useUpdateAlumno } from '../queries/useAlumnos';
import GrupoSelect from '../components/GrupoSelect';
import { DeleteConfirmation } from '../components/DeleteConfirmation';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toaster } from '../chakra/toaster';
import {
  Alert,
  Box,
  Button,
  Dialog,
  Flex,
  Field,
  Input,
  Heading,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';

const CargaAlumno = () => {
  const navigate = useNavigate();
  const { id_alumno } = useParams<{ id_alumno?: string }>();
  const esEdicion = Boolean(id_alumno);
  const idAlumno = id_alumno ? parseInt(id_alumno, 10) : undefined;

  // Cargar datos del alumno si estamos en modo edición
  const { data: alumnoExistente, isLoading: cargandoDatos } = useAlumnoPorId(idAlumno);

  const {
    mutateAsync: crearAlumno,
    isPending: creando,
    error: errorCrear,
    reset: resetCrear,
  } = useCreateAlumno();

  const {
    mutateAsync: actualizarAlumno,
    isPending: actualizando,
    error: errorActualizar,
    reset: resetActualizar,
  } = useUpdateAlumno();

  const { mutateAsync: deleteAlumno } = useDeleteAlumno();

  const guardando = creando || actualizando;
  const errorEnApi = errorCrear || errorActualizar;

  const {
    open: operacionExitosa,
    onOpen: abrirOperacionExitosa,
    onClose: cerrarOperacionExitosa
  } = useDisclosure();

  const [nombreAlumno, setNombreAlumno] = useState<string | null>('');
  const [idGrupo, setIdGrupo] = useState<string | null>(null);
  const [errorOtro, setErrorOtro] = useState<Error | null>(null);

  // Cargar datos del alumno cuando se monta el componente o cambia el alumno existente
  useEffect(() => {
    if (alumnoExistente) {
      setNombreAlumno(alumnoExistente.nombre_alumno);
      setIdGrupo(String(alumnoExistente.id_grupo));
    }
  }, [alumnoExistente]);

  const error = errorEnApi ?? errorOtro;
  const formularioEsValido = idGrupo && nombreAlumno && nombreAlumno.trim() !== '' && !cargandoDatos;

  const alCambiarNombreAlumno = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNombreAlumno(e.target.value);
    setErrorOtro(null);
    resetCrear();
    resetActualizar();
  }, [setNombreAlumno, resetCrear, resetActualizar]);

  const alCambiarGrupo = useCallback((value: string | null) => {
    setIdGrupo(value);
    setErrorOtro(null);
    resetCrear();
    resetActualizar();
  }, [setIdGrupo, resetCrear, resetActualizar]);

  const handleDelete = useCallback(async (alumnoId: number) => {
    try {
      await deleteAlumno(alumnoId);
      
      toaster.create({
        title: 'Alumno borrado correctamente',
        type: 'success',
        closable: true,
      });
      
      navigate('/lista-alumnos');
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
  }, [deleteAlumno, navigate]);

  const resetearFormulario = () => {
    setNombreAlumno('');
    setIdGrupo(null);
    setErrorOtro(null);
    resetCrear();
    resetActualizar();
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formularioEsValido) {
      setErrorOtro(new Error('Por favor completa todos los campos obligatorios'));
      return;
    }

    try {
      if (esEdicion && idAlumno) {
        await actualizarAlumno({
          id_alumno: idAlumno,
          nombre_alumno: nombreAlumno.trim(),
          id_grupo: idGrupo,
        });
      } else {
        await crearAlumno({
          nombre_alumno: nombreAlumno.trim(),
          id_grupo: idGrupo,
        });
      }

      // Mostrar diálogo de éxito
      abrirOperacionExitosa();
    } catch (err) {
      setErrorOtro(err as Error ?? new Error('Error desconocido'));
    }
  }, [nombreAlumno, idGrupo, crearAlumno, actualizarAlumno, esEdicion, idAlumno, abrirOperacionExitosa]);

  const handleNuevoAlumno = () => {
    cerrarOperacionExitosa();
    if (esEdicion) {
      navigate('/carga-alumno/');
    }
    resetearFormulario();
  };

  const handleIrALista = () => {
    navigate('/lista-alumnos');
  };

  if (esEdicion && cargandoDatos) {
    return (
      <Box textAlign="center" py={10}>
        <p>Cargando datos del alumno...</p>
      </Box>
    );
  }

  return (
    <Box>
      <Flex w="full" justifyContent="space-between" alignItems="center" mb={6}>
        <Heading as="h1" size="lg">{esEdicion ? 'Editar Alumno' : 'Cargar Alumno'}</Heading>
        {esEdicion && (
          <DeleteConfirmation
            onConfirm={() => handleDelete(idAlumno!)}
            title="Eliminar Alumno"
            message="¿Seguro que deseas borrar este Alumno? Esta acción no se puede deshacer."
            confirmText="Eliminar Alumno"
            cancelText="Cancelar"
            disabled={actualizando || guardando}
          />
        )}
      </Flex>

      <Box as="form" onSubmit={handleSubmit} gap="6" w="full">
        <VStack padding={4}>
          <Field.Root required invalid={!nombreAlumno?.trim()}>
            <Field.Label>Nombre del Alumno <Field.RequiredIndicator /></Field.Label>
            <Input
              name="nombre_alumno"
              value={nombreAlumno || ''}
              onChange={alCambiarNombreAlumno}
              placeholder="Ingrese el nombre completo"
              autoFocus
            />
            <Field.ErrorText>El nombre es requerido</Field.ErrorText>
          </Field.Root>

          <GrupoSelect
            value={idGrupo}
            onChange={alCambiarGrupo}
            required
          />

          <Flex direction="row" gap={3} mt={4} w="full">
            <Button
              type="submit"
              variant="solid"
              size="lg"
              flex={1}
              loading={guardando}
              disabled={!formularioEsValido || guardando || cargandoDatos}
              loadingText={esEdicion ? 'Actualizando...' : 'Guardando...'}
            >
              {esEdicion ? 'Actualizar' : 'Guardar'}
            </Button>
            <Button
              variant="subtle"
              size="lg"
              flex={1}
              onClick={() => navigate(-1)}
              disabled={guardando}
            >
              Cancelar
            </Button>
          </Flex>
        </VStack>
      </Box>

      {error && (
        <Alert.Root status="error" rounded="md" w="full">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Error al crear el alumno</Alert.Title>
            <Alert.Description>{error instanceof Error ? error.message : 'Error desconocido'}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}

      <Dialog.Root
        open={operacionExitosa}
        initialFocusEl={undefined}
        onOpenChange={(e) => !e.open && cerrarOperacionExitosa()}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header fontSize="lg" fontWeight="bold">
              {esEdicion ? 'Alumno Actualizado' : 'Alumno Creado'}
            </Dialog.Header>

            <Dialog.Body>
              {esEdicion
                ? 'El alumno ha sido actualizado correctamente. ¿Desea cargar otro alumno?'
                : '¿Desea cargar otro alumno?'}
            </Dialog.Body>

            <Dialog.Footer>
              <Button onClick={handleIrALista} variant="outline">
                Volver a lista alumnos
              </Button>
              <Button
                onClick={handleNuevoAlumno}
                ml={3}
                autoFocus
              >
                Crear otro alumno
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
};

export default CargaAlumno;