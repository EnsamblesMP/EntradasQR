import { useEntradaPorId } from '../queries/useEntradas';
import { useEmailTemplate } from '../queries/useEmailTemplate';
import { ImagenQr } from '../components/ImagenQr';
import { CampoCopiable } from '../components/CampoCopiable';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { ButtonLink } from '../router/ButtonLink';
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

export const EmailEntradaGenerada: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    data: entrada,
    isLoading: cargandoEntrada,
    error: errorEntrada,
  } = useEntradaPorId(id);
  const {
    data: template,
    isLoading: cargandoTemplate,
    error: errorTemplate,
  } = useEmailTemplate();

  const cargando = cargandoEntrada || cargandoTemplate;
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

  if (!template || errorTemplate) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Text fontSize="lg" fontWeight="medium" textAlign="center" color="red">
          ERROR: No se pudo cargar la plantilla del email.
        </Text>
        <Text fontSize="md" textAlign="center" color="red">
          {errorTemplate?.message}
        </Text>
      </Flex>
    );
  }

  const contenido = template.contenido
    .replaceAll('[nombre_comprador]', entrada.nombre_comprador)
    .replaceAll('[cantidad_comprada]', entrada.compradas.toString())
    .replaceAll('[nombre_alumno]', entrada.nombre_alumno)
    .replaceAll('[nombre_grupo]', entrada.nombre_grupo)
    .replaceAll('[funcion]', entrada.funcion)
    .replaceAll('1 entradas', '1 entrada');
  const contenidoSplitByQr = contenido.split('[codigo_qr]', 2);
  const contenidoPreQr = contenidoSplitByQr[0];
  const contenidoPostQr = contenidoSplitByQr[1];

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
          {template.asunto}
        </CampoCopiable>
      </Flex>

      <Flex w="full" flexDir="column">
        <Text fontSize="sm" fontWeight="medium" mb={1}>
          Contenido del email:
        </Text>
        <CampoCopiable w="full">
          <MarkdownRenderer contenido={contenidoPreQr} />
          <ImagenQr idEntrada={id} />
          <MarkdownRenderer contenido={contenidoPostQr} />
        </CampoCopiable>
      </Flex>
      <ButtonLink
        to='/editar-email-entrada-generada'
        variant="outline"
        size="sm"
        mb={3}
      >
        Editar Plantilla de Email
      </ButtonLink>
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

export default EmailEntradaGenerada;
