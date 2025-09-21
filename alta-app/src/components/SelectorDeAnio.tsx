import { NumberInput, InputGroup, Icon, Stack } from '@chakra-ui/react';
import { FiCalendar } from 'react-icons/fi';

interface SelectorDeAnioProps {
  anio: number;
  setAnio: (anio: number) => void;
}

export const SelectorDeAnio = ({ anio, setAnio }: SelectorDeAnioProps) => {
  return (
    <Stack direction="row" align="center">
      <NumberInput.Root
        defaultValue={anio.toString()}
        onValueChange={(e) => setAnio(parseInt(e.value))}
        variant="flushed"
        size="xs"
        w="80px"
      >
        <InputGroup
          startElement={<Icon as={FiCalendar} size="lg" ml={-3} />}
        >
          <NumberInput.Input min={2020} max={2080} />
        </InputGroup>
        <NumberInput.Control>
          <NumberInput.IncrementTrigger />
          <NumberInput.DecrementTrigger />
        </NumberInput.Control>
      </NumberInput.Root>
    </Stack>
  );
};
