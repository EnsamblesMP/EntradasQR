import { ReactNode, useState } from 'react'
import { ButtonLink } from '../router/ButtonLink'
import {
  Box,
  Spacer,
  Stack,
} from '@chakra-ui/react';
import { ColorModeButton } from '../chakra/color-mode';
import { useColorModeValue } from '../chakra/use-color-mode';
import { AnioContext } from '../supabase/anioUtils'
import { SelectorDeAnio } from './SelectorDeAnio';

interface LayoutProps {
  children: ReactNode
}

const getCurrentYear = () => {
  return new Date().getFullYear();
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
