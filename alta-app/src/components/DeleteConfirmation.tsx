import { useRef, useState } from 'react';
import { Button, ButtonProps, Box, Icon, IconButton, Text, Flex, Stack } from '@chakra-ui/react';
import { FiTrash2, FiAlertTriangle } from 'react-icons/fi';

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
        onClick={onOpen}
        loading={isDeleting}
        disabled={disabled}
        aria-label="Eliminar"
        variant="subtle"
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
        bg="blackAlpha.600"
        display={isOpen ? 'flex' : 'none'}
        alignItems="center"
        justifyContent="center"
        zIndex={1400}
        onClick={onClose}
      >
        <Box
          bg="white"
          p={6}
          rounded="md"
          width="90%"
          maxW="md"
          onClick={e => e.stopPropagation()}
          boxShadow="lg"
        >
          <Stack direction="column" gap={4}>
            <Flex align="center" gap={3} color="orange.500">
              <FiAlertTriangle size={24} />
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
              >
                {cancelText}
              </Button>
              <Button 
                colorPalette="red"
                onClick={handleConfirm}
                loading={isDeleting}
                loadingText="Eliminando..."
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
