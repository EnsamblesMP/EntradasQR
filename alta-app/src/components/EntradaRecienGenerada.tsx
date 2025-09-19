import { ImagenQr } from './ImagenQr';
import { CampoCopiable } from './CampoCopiable';
import { VStack, Text, Button, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import type { Campos }  from './Campos';
import type { FC } from 'react';

interface EntradaRecienGeneradaProps {
  idEntrada: string;
  campos: Campos;
  onClose: () => void;
}

export const EntradaRecienGenerada: FC<EntradaRecienGeneradaProps> = ({
  idEntrada,
  campos,
  onClose,
}) => {
  const navigate = useNavigate();
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
          <ImagenQr idEntrada={idEntrada} />
        </CampoCopiable>
      </Flex>

      <Flex direction="row" gap={3} mt={4} w="full">
        <Button
          variant="solid"
          size="lg"
          flex={1}
          onClick={onClose}
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

export default EntradaRecienGenerada;
