import React, { useCallback, useEffect, useState } from 'react';
import CampoCopiable from '../components/CampoCopiable';
import CamposEntrada from '../components/CamposEntrada';
import { ImagenQr } from '../components/ImagenQr';
import {
  Alert,
  Button,
  Heading,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { toaster } from '../chakra/toaster';
import { supabase } from '../supabase/supabaseClient';
import { useCampos } from '../components/Campos';

interface EntradaDB {
  id: string;
  nombre_comprador: string;
  email_comprador: string | null;
  cantidad: number;
  id_alumno: number;
  alumno?: { grupo: string } | null; // via FK join
}

const EditarEntrada: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const {
    campos,
    cambiarCampos,
    camposValidos,
  } = useCampos();

  useEffect(() => {
    const cargarEntrada = async () => {
      if (!id) return;
      setCargando(true);
      setMensaje('Cargando entrada...');
      try {
        const { data, error } = await supabase
          .from('entradas')
          .select('id, nombre_comprador, email_comprador, cantidad, id_alumno, alumno:id_alumno(grupo)')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          setMensaje('❌ No se encontró la entrada.');
          return;
        }

        const entrada = data as unknown as EntradaDB;
        cambiarCampos({
          nombreComprador: entrada.nombre_comprador || '',
          emailComprador: entrada.email_comprador || '',
          cantidad: entrada.cantidad || 1,
          idAlumno: entrada.id_alumno || null,
          idGrupo: entrada.alumno?.grupo || null
        });
        setMensaje('');
      } catch (e) {
        console.error(e);
        const msg = e instanceof Error ? e.message : 'Error desconocido';
        setMensaje(`❌ Error al cargar: ${msg}`);
      } finally {
        setCargando(false);
      }
    };
    cargarEntrada();
  }, [id, cambiarCampos]);

  const handleGuardar = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!camposValidos) {
      setMensaje('❌ Por favor, completa todos los campos obligatorios.');
      return;
    }

    setGuardando(true);
    setMensaje('Guardando cambios...');
    try {
      const { error } = await supabase
        .from('entradas')
        .update({
          nombre_comprador: campos.nombreComprador.trim(),
          email_comprador: campos.emailComprador.trim().toLowerCase(),
          cantidad: campos.cantidad,
          id_alumno: campos.idAlumno,
        })
        .eq('id', id);

      if (error) throw error;

      toaster.create({
        title: 'Cambios guardados',
        description: 'La entrada se actualizó correctamente.',
        type: 'success',
      });
      setMensaje('✅ Cambios guardados.');
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : 'Error desconocido';
      setMensaje(`❌ Error al guardar: ${msg}`);
      toaster.create({ type: 'error', title: 'Error', description: msg });
    } finally {
      setGuardando(false);
    }
  }, [campos, id, camposValidos]);

  if (!id) {
    return (
      <VStack>
        <Alert.Root rounded="md" w="full">
          <Alert.Indicator />
          <Alert.Title>Error</Alert.Title>
          <Alert.Description>Falta el parámetro ID en la URL.</Alert.Description>
        </Alert.Root>
      </VStack>
    );
  }

  return (
    <form onSubmit={handleGuardar}>
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Editar entrada
      </Heading>

      <VStack gap="6" w="full">

        <CamposEntrada
          campos={campos}
          alCambiarCampos={cambiarCampos}
          disabled={cargando}
        />

        <HStack w="full" mt={4}>
          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            w="50%"
            loading={guardando}
            loadingText="Guardando..."
            disabled={!camposValidos || guardando || cargando}
          >
            Guardar cambios
          </Button>
          <Button
            variant="subtle"
            colorScheme="blue"
            size="lg"
            w="50%"
            onClick={() => navigate('/lista-de-entradas')}
          >
            Volver
          </Button>
        </HStack>

        {mensaje && (
          <Alert.Root rounded="md" w="full">
            <Alert.Indicator />
            <Alert.Title>{mensaje.includes('❌') ? 'Error' : ''}</Alert.Title>
            <Alert.Description>{mensaje}</Alert.Description>
          </Alert.Root>
        )}

        <CampoCopiable>
          <ImagenQr idEntrada={id}/>
        </CampoCopiable>

      </VStack>
    </form>
  );
};

export default EditarEntrada;
