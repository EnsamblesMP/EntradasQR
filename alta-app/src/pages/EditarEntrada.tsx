import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Text,
  Heading,
  VStack,
  Input,
  NumberInput,
  Field,
  Alert,
  Image,
  HStack,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { toaster } from '../chakra/toaster';
import { supabase } from '../supabase/supabaseClient';
import GrupoSelect from '../components/GrupoSelect';
import AlumnoSelect from '../components/AlumnoSelect';

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

  const [nombreComprador, setNombreComprador] = useState('');
  const [emailComprador, setEmailComprador] = useState('');
  const [idGrupo, setIdGrupo] = useState<string | null>(null);
  const [idAlumno, setIdAlumno] = useState<number | null>(null);
  const [cantidad, setCantidad] = useState(1);

  const isFormValid = useMemo(() => (
    nombreComprador.trim() !== '' &&
    idGrupo !== null &&
    idAlumno !== null &&
    cantidad >= 1
  ), [nombreComprador, idGrupo, idAlumno, cantidad]);

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
        setNombreComprador(entrada.nombre_comprador || '');
        setEmailComprador(entrada.email_comprador || '');
        setCantidad(entrada.cantidad || 1);
        setIdAlumno(entrada.id_alumno || null);
        setIdGrupo(entrada.alumno?.grupo || null);
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
          nombre_comprador: nombreComprador.trim(),
          email_comprador: emailComprador.trim().toLowerCase(),
          cantidad,
          id_alumno: idAlumno,
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

      <VStack gap="6">
        <Field.Root required>
          <Field.Label>Nombre del comprador <Field.RequiredIndicator /></Field.Label>
          <Input
            placeholder="Nombre completo"
            value={nombreComprador}
            onChange={(e) => setNombreComprador(e.target.value)}
            size="lg"
            disabled={cargando}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Correo electrónico (opcional)</Field.Label>
          <Input
            type="email"
            placeholder="email@ejemplo.com"
            value={emailComprador}
            onChange={(e) => setEmailComprador(e.target.value)}
            size="lg"
            disabled={cargando}
          />
        </Field.Root>

        <GrupoSelect value={idGrupo} onChange={setIdGrupo} required />
        <AlumnoSelect value={idAlumno} onChange={setIdAlumno} idGrupo={idGrupo} required />

        <Field.Root required>
          <Field.Label>Cantidad de entradas <Field.RequiredIndicator /></Field.Label>
          <NumberInput.Root
            min={1}
            value={String(cantidad)}
            onValueChange={({ value }) => setCantidad(Number(value) || 0)}
            size="lg"
            w="100%"
          >
            <NumberInput.Scrubber />
            <NumberInput.Input />
            <NumberInput.Control>
              <NumberInput.IncrementTrigger />
              <NumberInput.DecrementTrigger />
            </NumberInput.Control>
          </NumberInput.Root>
        </Field.Root>

        <HStack w="full" mt={4}>
          <Button
            type="submit"
            colorPalette="blue"
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
            colorPalette="blue"
            size="lg"
            w="50%"
            onClick={() => navigate('/lista-de-entradas')}
          >
            Cancelar
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
