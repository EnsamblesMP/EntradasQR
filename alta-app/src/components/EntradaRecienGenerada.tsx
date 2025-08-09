import { ImagenQr } from './ImagenQr';
import { CopyableField } from './CopyableField';
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
        <CopyableField w="full">
          {campos.emailComprador}
        </CopyableField>
      </Flex>

      <Flex gap="4" w="full">
        <Text fontSize="sm" fontWeight="medium" mr={1}>
          Asunto:
        </Text>
        <CopyableField w="full">
          Entrada para muestra de Ensambles MP
        </CopyableField>
      </Flex>

      <Flex w="full" flexDir="column">
        <Text fontSize="sm" fontWeight="medium" mb={1}>
          Contenido del email:
        </Text>
        <CopyableField w="full">
          <p><em>Hola {campos.nombreComprador}</em></p>
          <p>Presentar el <b>QR</b> de esta entrada en la entrada del ensamble</p>
          <p>(cantidad de entradas adquiridas: <b>{campos.cantidad}</b>)</p>
        </CopyableField>
      </Flex>

      <ImagenQr idEntrada={idEntrada} />

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
