import { getQrImageUrl } from '../supabase/qrUtils';
import { Image } from '@chakra-ui/react';
import type { FC } from 'react';

interface ImagenQrProps {
  idEntrada: string;
}

export const ImagenQr: FC<ImagenQrProps> = ({ idEntrada }) => {
  const qr = getQrImageUrl(idEntrada);
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