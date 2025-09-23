import { ImagenQr } from '../components/ImagenQr';
import { CampoCopiable } from '../components/CampoCopiable';
import {
  Button,
  Flex,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  useEffect,
  useState,
} from 'react';
import { toaster } from '../chakra/toaster';
import { supabase } from '../supabase/supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';
import { useCampos } from '../components/Campos';
import type { FC } from 'react';

interface EntradaDB {
  id: string;
  nombre_comprador: string;
  email_comprador: string | null;
  cantidad: number;
  id_alumno: number;
  alumno?: { grupo: string } | null; // via FK join
}

export const TemplateEntrada: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);
  const { campos, cambiarCampos } = useCampos();

  useEffect(() => {
    const cargarEntrada = async () => {
      if (!id) return;
      setCargando(true);
      try {
        const { data, error } = await supabase
          .from('entradas')
          .select('id, nombre_comprador, email_comprador, cantidad, id_alumno, alumno:id_alumno(grupo)')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          toaster.create({
            title: 'Error',
            description: 'No se encontró la entrada.',
            type: 'error',
          });
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
      } catch (e) {
        console.error(e);
        const msg = e instanceof Error ? e.message : 'Error desconocido';
        toaster.create({
          title: 'Error',
          description: `Error al cargar: ${msg}`,
          type: 'error',
        });
      } finally {
        setCargando(false);
      }
    };
    cargarEntrada();
  }, [id, cambiarCampos]);

  if (cargando || !id) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <VStack w="full">
      <Text fontSize="lg" fontWeight="medium" textAlign="center">
        Entrada generada correctamente!
      </Text>
      <Text fontSize="md" fontWeight="medium" p="5" textAlign="left">
        Copiar y enviar el QR al comprador
      </Text>

      <Flex gap="4" w="full">
        <Text fontSize="sm" fontWeight="medium" mr={1}>
          Email:
        </Text>
        <CampoCopiable w="full">
          {campos.emailComprador}
        </CampoCopiable>
      </Flex>

      <Flex gap="4" w="full">
        <Text fontSize="sm" fontWeight="medium" mr={1}>
          Asunto:
        </Text>
        <CampoCopiable w="full">
          Entrada para muestra de MP Ensambles
        </CampoCopiable>
      </Flex>

      <Flex w="full" flexDir="column">
        <Text fontSize="sm" fontWeight="medium" mb={1}>
          Contenido del email:
        </Text>
        <CampoCopiable w="full">
          Hola {campos.nombreComprador}<br/>
          <br />
          Para ingresar al recital de MP Ensambles deberás presentar
          el código <b>QR</b> que se ve abajo
          {
            campos.cantidad < 2
              ? <></>
              : (<> <b>(vale por {campos.cantidad} entradas)</b></>)
          }
          .<br /><br />
          Nombre de la Sala: Galpón B<br />
          Dirección: Cochabamba 2536, C1247 CABA<br />
          Fecha: ??/??/????<br />
          Hora: ??:??<br />
          <br />
          <ImagenQr idEntrada={id} />
        </CampoCopiable>
      </Flex>

      <Flex direction="row" gap={3} mt={4} w="full">
        <Button
          variant="solid"
          size="lg"
          flex={1}
          onClick={() => navigate('/alta-de-entrada')}
        >
          Generar otra entrada
        </Button>
        <Button
          variant="subtle"
          size="lg"
          flex={1}
          onClick={() => navigate('/')}
        >
          Cerrar
        </Button>
      </Flex>
    </VStack>
  );
};

export default TemplateEntrada;
