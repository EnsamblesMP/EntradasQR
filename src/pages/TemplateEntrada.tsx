import { useEntradaPorId } from '../queries/useEntradas';
import { ImagenQr } from '../components/ImagenQr';
import { CampoCopiable } from '../components/CampoCopiable';
import {
  Button,
  Flex,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { toaster } from '../chakra/toaster';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { FC } from 'react';

export const TemplateEntrada: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation()
  const {
    data: entrada,
    isLoading: cargando,
    error: errorEntrada,
  } = useEntradaPorId(id);
  const vieneDeAltaDeEntrada = location.state?.from === '/alta-de-entrada';

  useEffect(() => {
    if (errorEntrada) {
      toaster.create({
        title: 'Error',
        description: 'No se encontró la entrada.',
        type: 'error',
      });
    }
  }, [errorEntrada]);
  
  if (cargando || !id) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (!entrada) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Text fontSize="lg" fontWeight="medium" textAlign="center">
          No se encontró la entrada.
        </Text>
        <Text fontSize="md" textAlign="center">
          {errorEntrada?.message}
        </Text>
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
          {entrada.email_comprador}
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
          Hola {entrada.nombre_comprador}<br/>
          <br />
          Para ingresar al recital de MP Ensambles deberás presentar
          el código <b>QR</b> que se ve abajo
          {
            entrada.compradas < 2
              ? <></>
              : (<> <b>(vale por {entrada.compradas} entradas)</b></>)
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
      {vieneDeAltaDeEntrada ?
      (
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
            onClick={() => navigate('/lista-de-entradas')}
          >
            Volver a lista
          </Button>
        </Flex>
      ) : (
        <Button
          variant="subtle"
          size="lg"
          w="full"
          onClick={() => navigate(-1)}
        >
          Cerrar
        </Button>
      )}
    </VStack>
  );
};

export default TemplateEntrada;
