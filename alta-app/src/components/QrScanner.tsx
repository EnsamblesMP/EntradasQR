import { Scanner } from "@yudiel/react-qr-scanner";
import { Box, Button, CloseButton, Flex, Heading, Dialog, VStack } from "@chakra-ui/react";
import { AiOutlineQrcode } from 'react-icons/ai';
import { toaster } from '../chakra/toaster';
import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";

interface QrScannerProps {
  alScanear: (data: string) => void;
  alCerrar: () => void;
  estaAbierto: boolean;
}

export const QrScanner = ({
  alScanear,
  alCerrar,
  estaAbierto,
}: QrScannerProps) => {
  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0) {
      if (detectedCodes[0].format !== 'qr_code') {
        toaster.create({
          type: 'error',
          title: 'Error',
          description: 'Código QR no válido',
          duration: 5000,
          closable: true,
        });
        return;
      }
      const idEntrada = detectedCodes[0].rawValue;
      alScanear(idEntrada);
    }
  };

  const handleError = (err: unknown) => {
    console.error(err);
    toaster.create({
      type: 'error',
      title: 'Error',
      description: 'Error al acceder a la cámara. Asegúrate de haber otorgado los permisos necesarios.',
      duration: 5000,
      closable: true,
    });
  };

  const alReintentar = () => {
    const wasOpen = estaAbierto;
    alCerrar();
    if (wasOpen) {
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  return (
    <Dialog.Root open={estaAbierto} onOpenChange={alCerrar} placement="center">
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger />
          <Dialog.Header>
            <Flex justifyContent="space-between" alignItems="center">
              <Heading size="md">Escanear código QR</Heading>
            <CloseButton
              aria-label="Cerrar escáner"
              variant="ghost"
              onClick={alCerrar}
            />
            </Flex>
          </Dialog.Header>
          <Dialog.Body pb={6}>
            <VStack gap={4}>
              <Box
                width="100%"
                height="350px"
                borderWidth="1px"
                borderRadius="md"
                overflow="hidden"
                position="relative"
              >
                {estaAbierto && (
                  <Scanner
                    formats={[
                      'qr_code',
                    ]}
                    onScan={handleScan}
                    onError={handleError}
                    sound={true}
                    scanDelay={300}
                  />
                )}
                <Button
                  colorPalette="blue"
                  onClick={alReintentar}
                >
                  <AiOutlineQrcode size={20} />
                  Reintentar
                </Button>
              </Box>
            </VStack>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
