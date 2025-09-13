import React, { useCallback, useState } from 'react';
import { useCampos } from '../components/Campos';
import { useNavigate } from 'react-router-dom';
import CamposEntrada from '../components/CamposEntrada';
import EntradaRecienGenerada from '../components/EntradaRecienGenerada';
import {
  Alert,
  Box,
  Button,
  Flex,
  Heading,
} from '@chakra-ui/react';
import { toaster } from '../chakra/toaster';
import { supabase } from '../supabase/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

const AltaDeEntrada: React.FC = () => {
  const navigate = useNavigate();

  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [idEntradaGenerada, setIdEntradaGenerada] = useState<string | null>(null);

  const {
    campos,
    cambiarCampos,
    reiniciarCampos,
    camposValidos,
  } = useCampos();

  const handleCloseQr = useCallback(() => {
    setIdEntradaGenerada(null);
    setMensaje('');
    reiniciarCampos();
  }, [reiniciarCampos]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!camposValidos) {
      setMensaje('❌ Por favor, completa todos los campos obligatorios.');
      return;
    }

    setCargando(true);
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
      setCargando(false);
    }
  }, [campos, camposValidos, reiniciarCampos]);

  if (idEntradaGenerada) {

    return (
      <EntradaRecienGenerada
        idEntrada={idEntradaGenerada}
        campos={campos}
        onClose={handleCloseQr}
      />
    );
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Heading as="h1" mb={6} textAlign="center" minW="sm">
        Alta de entrada
      </Heading>
      <Box gap="6" w="full">

        <CamposEntrada
          campos={campos}
          alCambiarCampos={cambiarCampos}
          disabled={cargando}/>

        <Flex direction="row" gap={3} mt={4} w="full">
          <Button
            type="submit"
            colorPalette="green"
            variant="solid"
            size="lg"
            flex={1}
            loading={cargando}
            disabled={!camposValidos || cargando}
            loadingText="Generando..."
          >
            Generar entrada
          </Button>
          <Button
            variant="subtle"
            size="lg"
            flex={1}
            onClick={() => navigate('/')}
            disabled={cargando}
          >
            Cancelar
          </Button>
        </Flex>

        {mensaje && (
          <Alert.Root rounded="md" w="full">
            <Alert.Indicator />
            <Alert.Title>{mensaje.includes('❌') ? 'Error' : ''}</Alert.Title>
            <Alert.Description>{mensaje}</Alert.Description>
          </Alert.Root>
        )}
      </Box>
    </Box>
  );
};

export default AltaDeEntrada;
