import { InputGroup, Input, CloseButton } from '@chakra-ui/react';
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
      startElement={<FiSearch color="gray.500" />}
      endElement={texto && (
        <CloseButton
          size="sm"
          onClick={() => {
            setTexto('')
            entradaRef.current?.focus()
          }}
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