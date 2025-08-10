import { ImagenQr } from './ImagenQr';
import { CampoCopiable } from './CampoCopiable';
import { VStack, Text, Button, Flex } from '@chakra-ui/react';
import type { Campos }  from './CamposEntrada';

interface EntradaRecienGeneradaProps {
  idEntrada: string;
  campos: Campos;
  onClose: () => void;
}

export const EntradaRecienGenerada: React.FC<EntradaRecienGeneradaProps> = ({
  idEntrada,
  campos,
  onClose,
}) => {
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
          Entrada para muestra de Ensambles MP
        </CampoCopiable>
      </Flex>

      <Flex w="full" flexDir="column">
        <Text fontSize="sm" fontWeight="medium" mb={1}>
          Contenido del email:
        </Text>
        <CampoCopiable w="full">
          Hola {campos.nombreComprador}<br/>
          <br />
          Para ingresar al recital de Ensambles MP deberás presentar
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

      <VStack gap="4">
        <Button
          colorScheme="gray"
          w="full"
          onClick={onClose}
        >
          Generar otra entrada
        </Button>
      </VStack>
    </VStack>
  );
};

export default EntradaRecienGenerada;
