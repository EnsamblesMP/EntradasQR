import { Box, BoxProps, IconButton, Clipboard, Flex } from "@chakra-ui/react";
import { ReactNode, useRef, MouseEvent } from 'react';
import { copiarHtmlAlPortapapeles } from './Portapapeles';
import type { FC } from 'react';

interface CampoCopiableProps extends BoxProps {
  children: ReactNode;
}

export const CampoCopiable: FC<CampoCopiableProps> = ({ children, ...props }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    if (!contentRef.current) return;
    copiarHtmlAlPortapapeles(contentRef.current);
  };

  const handleBoxClick = (e: MouseEvent<HTMLDivElement>) => {
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
          fontSize="sm"
          userSelect="text"
          color="black"
        >
          {children}
        </Box>
        <Clipboard.Root onClick={handleCopy}>
          <Clipboard.Trigger asChild>
            <IconButton variant="outline" size="xs">
              <Clipboard.Indicator />
            </IconButton>
          </Clipboard.Trigger>
        </Clipboard.Root>
      </Flex>
    </Box>
  );
};

export default CampoCopiable;
