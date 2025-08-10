import { Box, BoxProps, Button, Clipboard, Flex } from "@chakra-ui/react";
import { ReactNode, useRef } from 'react';
import { copiarHtmlAlPortapapeles } from './Portapapeles';

interface CampoCopiableProps extends BoxProps {
  children: ReactNode;
}

export const CampoCopiable = ({ children, ...props }: CampoCopiableProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    if (!contentRef.current) return;
    copiarHtmlAlPortapapeles(contentRef.current);
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
        <Clipboard.Root onClick={handleCopy}>
          <Clipboard.Trigger>
            <Button variant="outline" size="sm">
              <Clipboard.Indicator />
            </Button>
          </Clipboard.Trigger>
        </Clipboard.Root>
      </Flex>
    </Box>
  );
};

export default CampoCopiable;
