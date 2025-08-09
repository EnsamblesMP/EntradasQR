import React, { useEffect, useMemo, useState } from 'react';
import CamposEntrada from '../components/CamposEntrada';
import {
  Alert,
  Button,
  Heading,
  HStack,
  Image,
  VStack,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { toaster } from '../chakra/toaster';
import { supabase } from '../supabase/supabaseClient';
import type { Campos }  from '../components/CamposEntrada';

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

  // State for form data
  const [campos, setCampos] = useState<Campos>({
    nombreComprador: '',
    emailComprador: '',
    idGrupo: null,
    idAlumno: null,
    cantidad: 1
  });

  const cambiaCampos = (updates: Partial<Campos>) => {
    setCampos(prev => ({ ...prev, ...updates }));
  };

  const isFormValid = useMemo(() => (
    campos.nombreComprador.trim() !== '' &&
    campos.idGrupo !== null &&
    campos.idAlumno !== null &&
    campos.cantidad >= 1
  ), [campos]);

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
        cambiaCampos({
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
  }, [id]);

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!isFormValid) {
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
  };

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

  const qr = `https://freeqr.com/api/v1/?data=${id}&size=300x300&color=000&bgcolor=3cc`;

  return (
    <form onSubmit={handleGuardar}>
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Editar entrada
      </Heading>

      <VStack gap="6" w="full">

        <CamposEntrada
          campos={campos}
          onChangeCampos={cambiaCampos}
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
            disabled={!isFormValid || guardando || cargando}
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

        <Image
          src={qr}
          alt="Código QR de la entrada"
          mx="auto"
          borderWidth="1px"
          borderColor="gray.200"
          rounded="md"
          mb="4"
          display="block"
          />

      </VStack>
    </form>
  );
};

export default EditarEntrada;
