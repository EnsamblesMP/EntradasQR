import { useAlumnosPorGrupo } from '../queries/useAlumnos';
import GrupoSelect from '../components/GrupoSelect';
import { useAnio } from '../supabase/anioUtils';
import { ButtonLink } from '../router/ButtonLink';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Heading,
  Flex,
  Spinner,
  Box,
  Text,
  Menu,
  IconButton,
  Separator,
} from '@chakra-ui/react';
import { FiUserPlus, FiSettings } from 'react-icons/fi';
import type { FC } from 'react';

type SettingsMenuContentProps = {
  grupo: string | null;
  alCambiarGrupo: (value: string | null) => void;
};

const SettingsMenuContent: FC<SettingsMenuContentProps> = ({ grupo: value, alCambiarGrupo: onChange }) => {
  return (
    <Menu.Content>
      <Menu.ItemGroup>
        <Menu.ItemGroupLabel>
          <Flex direction="row" gap={2} align="center">
            Filtrar
          </Flex>
        </Menu.ItemGroupLabel>
        <Box mx="4">
          <Flex direction="row" flexWrap="wrap" gap={2}>
            <GrupoSelect value={value} onChange={onChange} />
          </Flex>
        </Box>
      </Menu.ItemGroup>
    </Menu.Content>
  );
};

const ListaAlumnos: FC = () => {
  const { anio } = useAnio();
  const navigate = useNavigate();
  const [grupo, setGrupo] = useState<string | null>(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const {
    data: alumnos,
    isLoading: cargandoAlumnos,
    error: errorCargaAlumnos
  } = useAlumnosPorGrupo(menuAbierto ? grupo : null);

  useEffect(() => {
    if (errorCargaAlumnos) {
      console.error('Error al cargar los alumnos:', errorCargaAlumnos);
    }
  }, [errorCargaAlumnos]);

  return (
    <Flex direction="column" gap={4}>
      <Flex justify="flex-end">
        <ButtonLink to="/carga-alumno" variant="solid" colorPalette="green">
          <FiUserPlus /> Agregar alumno
        </ButtonLink>
      </Flex>
      <Menu.Root onOpenChange={(details) => setMenuAbierto(details.open)}>
        <Flex justify="space-between" direction="row" w="full">
          <Separator />
          <Heading as="h1" size="lg">
            Lista de Alumnos
          </Heading>
          <Menu.Trigger asChild >
            <IconButton size="xs" variant="outline">
              <FiSettings />
            </IconButton>
          </Menu.Trigger>
        </Flex>
        <SettingsMenuContent grupo={grupo} alCambiarGrupo={setGrupo} />
      </Menu.Root>

      {cargandoAlumnos ? (
        <Flex justify="center" p={8}>
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : errorCargaAlumnos ? (
        <Box bg="red.100" color="red.800" p={4} borderRadius="md">
          No se pudieron cargar los alumnos. Por favor, intente nuevamente.
        </Box>
      ) : !alumnos || alumnos.length === 0 ? (
        <Box p={6}><Text>No hay alumnos registrados para el año {anio}.</Text></Box>
      ) : (
        <Box borderWidth="1px" borderRadius="md" overflow="hidden">
          <Box 
            display="grid" 
            gridTemplateColumns="5fr 1fr"
            bg={{ base: 'gray.200', _dark: 'gray.700' }}
            px={4}
            py={2}
            borderBottomWidth="1px"
            fontWeight="bold"
          >
            <Box>Nombre</Box>
            <Box>Grupo</Box>
          </Box>
          <Box>
            {alumnos.map((alumno) => (
              <Box
                key={alumno.id_alumno}
                display="grid"
                gridTemplateColumns="5fr 1fr"
                p={3}
                borderBottomWidth="1px"
                _hover={{ bg: { base: 'brand.200', _dark: 'brand.700' } }}
                cursor="pointer"
                onClick={() => navigate(`/carga-alumno/${alumno.id_alumno}`)}
              >
                <Box fontWeight="medium">{alumno.nombre_alumno}</Box>
                <Box>{alumno.nombre_grupo}</Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Flex>
  );
};

export default ListaAlumnos;
