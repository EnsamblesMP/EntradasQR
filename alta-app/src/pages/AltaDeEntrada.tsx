import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CamposEntrada from '../components/CamposEntrada';
import EntradaRecienGenerada from '../components/EntradaRecienGenerada';
import {
  Alert,
  Button,
  Heading,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { toaster } from '../chakra/toaster';
import { supabase } from '../supabase/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import type { Campos }  from '../components/CamposEntrada';

const AltaDeEntrada: React.FC = () => {
  const navigate = useNavigate();

  const [campos, setCampos] = useState<Campos>({
    nombreComprador: '',
    emailComprador: '',
    idGrupo: null,
    idAlumno: null,
    cantidad: 1
  });

  // UI state
  const [mensaje, setMensaje] = useState('');
  const [cargando, setIsLoading] = useState(false);
  const [idEntradaGenerada, setIdEntradaGenerada] = useState<string | null>(null);

  const cambiaCampos = (updates: Partial<Campos>) => {
    setCampos(prev => ({ ...prev, ...updates }));
  };

  // Validate form
  const isFormValid = useMemo(() => (
    campos.nombreComprador.trim() !== '' &&
    campos.idGrupo !== null &&
    campos.idAlumno !== null &&
    campos.cantidad >= 1
  ), [campos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setMensaje('❌ Por favor, completa todos los campos obligatorios.');
      return;
    }

    setIsLoading(true);
    setMensaje('Guardando entrada...');

    try {
      // Generar un nuevo UUID para la entrada
      const id = uuidv4();

      // Insertar en la tabla 'entradas' de Supabase
      const { data: _data, error } = await supabase
        .from('entradas')
        .insert([{
          id,
          nombre_comprador: campos.nombreComprador.trim(),
          email_comprador: campos.emailComprador.trim().toLowerCase(),
          cantidad: campos.cantidad,
          id_alumno: campos.idAlumno,
        }])
        .select();

      if (error) throw error;

      setIdEntradaGenerada(id);
      setMensaje(`✅ Entrada registrada exitosamente con ID: ${id}`);

      toaster.create({
        title: 'Entrada generada',
        description: 'La entrada se ha generado correctamente.',
        type: 'success',
      });

    } catch (error) {
      console.error('Error al guardar la entrada:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setMensaje(`❌ Error al guardar: ${errorMessage}`);
      toaster.create({
        title: 'Error',
        description: 'Ocurrió un error al generar la entrada.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (idEntradaGenerada) {
    const handleCloseQr = () => {
      setIdEntradaGenerada(null);
      setMensaje('');
      // Limpiar el formulario
      cambiaCampos({
        nombreComprador: '',
        emailComprador: '',
        idGrupo: null,
        idAlumno: null,
        cantidad: 1
      });
    };

    return (
      <EntradaRecienGenerada
        idEntrada={idEntradaGenerada}
        campos={campos}
        onClose={handleCloseQr}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Alta de entrada
      </Heading>

      <VStack gap="6">

        <CamposEntrada
          campos={campos}
          onChangeCampos={cambiaCampos}
          disabled={cargando} />

        <HStack w="full" mt={4}>
          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            w="50%"
            loading={cargando}
            disabled={!isFormValid || cargando}
            loadingText="Generando..."
          >
            Generar entrada
          </Button>
          <Button
            type="button"
            variant="subtle"
            colorScheme="blue"
            size="lg"
            w="50%"
            onClick={() => navigate('/')}
            disabled={cargando}
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
      </VStack>
    </form>
  );
};

export default AltaDeEntrada;
