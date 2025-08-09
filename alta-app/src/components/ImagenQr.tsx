import { Image } from '@chakra-ui/react';

interface ImagenQrProps {
  idEntrada: string;
}

export const ImagenQr: React.FC<ImagenQrProps> = ({ idEntrada }) => {
  const qr = `https://freeqr.com/api/v1/?data=${idEntrada}&size=300x300&color=000&bgcolor=3cc`;
  return (
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
  );
};