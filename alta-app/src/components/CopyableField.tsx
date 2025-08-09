import { Box, IconButton, Flex, BoxProps } from "@chakra-ui/react";
import { FaCopy } from 'react-icons/fa';
import { ReactNode, useRef } from 'react';
import { toaster } from '../chakra/toaster';

interface CopyableFieldProps extends BoxProps {
  children: ReactNode;
}

export const CopyableField = ({ children, ...props }: CopyableFieldProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  const handleCopy = async () => {
    if (!contentRef.current) return;
    
    // Create a temporary div to hold the HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = contentRef.current.innerHTML;
    const htmlContent = tempDiv.innerHTML;
    const textContent = htmlContent
      .replace(/<div[^>]*>/g, '') // Remove divs but keep content
      .replace(/<\/div>/g, '\n')  // Replace div ends with newlines
      .replace(/<p[^>]*>/g, '') // Remove p but keep content
      .replace(/<\/p>/g, '\n')  // Replace p ends with newlines
      .replace(/<br[^>]*>/g, '\n') // Replace <br> with newlines
      .replace(/<[^>]*>/g, '')     // Remove all remaining HTML tags
      .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines to 2
      .trim();
    try {
      const clipboardItemData = {
        ["text/plain"]: textContent,
        ["text/html"]: htmlContent,
      };
      const clipboardItem = new ClipboardItem(clipboardItemData);
      navigator.clipboard.write([clipboardItem]).then(() => {
        toaster.create({
          description: 'Contenido copiado al portapapeles',
          type: 'success',
        });
      }).catch(err => {
        console.error('Error al copiar con HTML: ', err);
        toaster.create({
          description: 'Error al copiar con HTML',
          type: 'error',
        });
      });
    } catch (err) {
      // si falla intentar copiar sin formato nomas
      try {
        await navigator.clipboard.writeText(textContent);
        toaster.create({
          description: 'Texto copiado al portapapeles',
          type: 'success',
        });
      } catch (err) {
        console.error('Error al copiar:', err);
        toaster.create({
          description: 'Error al copiar al portapeles',
          type: 'error',
        });
      }
    }
  };

  const handleBoxClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (!selection) return;
    
    const range = document.createRange();
    range.selectNodeContents(e.currentTarget);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  return (
    <Box w="100%" mb={4} {...props}>
      <Flex align="flex-start" gap="8px">
        <Box
          ref={contentRef}
          flex="1"
          p={3}
          borderWidth="1px"
          borderRadius="md"
          borderColor="gray.200"
          bg="white"
          _hover={{ borderColor: 'blue.300' }}
          transition="border-color 0.2s"
          cursor="text"
          onClick={handleBoxClick}
          whiteSpace="pre-line"
          fontSize="sm"
          userSelect="text"
          color="black"
        >
          {children}
        </Box>
        <IconButton
          size="lg"
          colorScheme="blue"
          variant="outline"
          onClick={handleCopy}
          aria-label="Copiar"
          px={3}
        >
          <FaCopy />
        </IconButton>
      </Flex>
    </Box>
  );
};

export default CopyableField;
