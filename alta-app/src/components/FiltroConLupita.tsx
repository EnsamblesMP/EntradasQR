import { Icon, InputGroup, Input, CloseButton } from '@chakra-ui/react';
import { useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import { ChangeEvent } from 'react';
import type { FC } from 'react';

interface FiltroConLupitaProps {
  texto: string;
  setTexto: (texto: string) => void;
  placeholder: string;
}

export const FiltroConLupita: FC<FiltroConLupitaProps> = ({
  texto,
  setTexto,
  placeholder,
}) => {
  const entradaRef = useRef<HTMLInputElement | null>(null);
  return (
    <InputGroup
      startOffset="1em"
      startElement={
        <Icon
          as={FiSearch}
          ms="-1"
          color="gray.500"
        />
      }
      endElement={texto && (
        <CloseButton
          onClick={() => {
            setTexto('')
            entradaRef.current?.focus()
          }}
          size="2xs"
          me="-2"
          _hover={{ bg: 'transparent' }}
          _active={{ bg: 'transparent' }}
        />
      )}
    >
      <Input
        ref={entradaRef}
        placeholder={placeholder}
        value={texto}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setTexto(e.target.value)
        }
      />
    </InputGroup>
  );
};