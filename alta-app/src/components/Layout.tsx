import { ReactNode, useState } from 'react'
import { ButtonLink } from '../router/ButtonLink'
import {
  Box,
  Icon,
  NumberInput,
  Spacer,
  Stack,
} from '@chakra-ui/react';
import { FiCalendar } from 'react-icons/fi';
import { ColorModeButton } from '../chakra/color-mode';
import { useColorModeValue } from '../chakra/use-color-mode';
import { AnioContext } from '../supabase/anioUtils'
import { InputGroup } from '@chakra-ui/react';

interface LayoutProps {
  children: ReactNode
}

const getCurrentYear = () => {
  return new Date().getFullYear();
};

interface SelectorDeAnioProps {
  anio: number;
  setAnio: (anio: number) => void;
}

const SelectorDeAnio = ({ anio, setAnio }: SelectorDeAnioProps) => {
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


export default function Layout({ children }: LayoutProps) {
  const [anio, setAnio] = useState(getCurrentYear());
  const bgTopColor = useColorModeValue('brand.50', 'brand.950');
  const bgOuterColor = useColorModeValue('gray.50', 'gray.950');
  const bgInnerColor = useColorModeValue('white', 'gray.800');

  return (
    <Stack align="left" ml="1em" mt="3px">
      <Stack as="nav" direction="row" bg={bgTopColor} w="sm" justifyContent="space-between" rounded="lg" px="2" py="2">
        <SelectorDeAnio anio={anio} setAnio={setAnio} />
        <Spacer />
        <ButtonLink to="/" size="xs" variant="surface">
          Administrar
        </ButtonLink>
        <ColorModeButton />
      </Stack>
      <Stack as="main">
        <AnioContext.Provider value={{ anio: anio }}>
        <Box bg={bgOuterColor} p="3" rounded="lg" shadow="2xl" w="sm">
          <Box bg={bgInnerColor} p="3" rounded="lg">
            {children}
          </Box>
        </Box>
        </AnioContext.Provider>
      </Stack>
    </Stack>
  )
}
