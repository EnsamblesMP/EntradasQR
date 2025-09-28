import { useRef, useState } from 'react';
import { Button, ButtonProps, Box, Icon, IconButton, Text, Flex, Stack } from '@chakra-ui/react';
import { FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import { useColorModeValue } from '../chakra/use-color-mode';

interface DeleteConfirmationProps {
  onConfirm: () => Promise<void> | void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  disabled?: boolean;
  buttonProps?: ButtonProps;
}

export function DeleteConfirmation({
  onConfirm,
  title = 'Confirmar eliminación',
  message = '¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.',
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  disabled = false,
  buttonProps
}: DeleteConfirmationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const iconColor = useColorModeValue('red.500', 'red.300');
  
  const onOpen = () => setIsOpen(true);
  const onClose = () => !isDeleting && setIsOpen(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <IconButton 
        colorPalette="red"
        color={iconColor}
        onClick={onOpen}
        loading={isDeleting}
        disabled={disabled}
        aria-label="Eliminar"
        variant="subtle"
        _hover={{
          bg: useColorModeValue('red.50', 'whiteAlpha.200')
        }}
        {...buttonProps}
      >
        <Icon as={FiTrash2} />
      </IconButton>

      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg={useColorModeValue('blackAlpha.600', 'blackAlpha.800')}
        display={isOpen ? 'flex' : 'none'}
        alignItems="center"
        justifyContent="center"
        zIndex={1400}
        onClick={onClose}
      >
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          p={6}
          rounded="md"
          width="90%"
          maxW="md"
          onClick={e => e.stopPropagation()}
          boxShadow="lg"
          color={useColorModeValue('gray.800', 'whiteAlpha.900')}
        >
          <Stack direction="column" gap={4}>
            <Flex align="center" gap={3} color={iconColor}>
              <Icon as={FiAlertTriangle} boxSize={6} />
              <Text fontSize="xl" fontWeight="bold">
                {title}
              </Text>
            </Flex>
            
            <Text>{message}</Text>
            
            <Flex justify="flex-end" gap={3} mt={4}>
              <Button 
                ref={cancelRef}
                onClick={onClose}
                disabled={isDeleting}
                variant="outline"
                _hover={{
                  bg: useColorModeValue('gray.100', 'whiteAlpha.200')
                }}
              >
                {cancelText}
              </Button>
              <Button 
                colorPalette="red"
                onClick={handleConfirm}
                loading={isDeleting}
                loadingText="Eliminando..."
                _hover={{
                  bg: 'red.500',
                }}
              >
                {confirmText}
              </Button>
            </Flex>
          </Stack>
        </Box>
      </Box>
    </>
  );
}
