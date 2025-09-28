import { useEntradasDelAnio, VistaEntrada } from '../queries/useEntradas';
import { useEffect, useState, ReactNode } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  IconButton,
  Heading,
  VStack,
  Flex,
  Spinner,
  Box,
  Text,
  Button,
  Menu,
  Separator,
} from '@chakra-ui/react';
import {
  FiPlusSquare,
  FiSettings,
  FiColumns,
} from 'react-icons/fi';
import { useAnio } from '../supabase/anioUtils';
import type { FC } from 'react';

type nombreColumna =
  | 'id'
  | 'comprador'
  | 'email'
  | 'alumno'
  | 'grupo'
  | 'compradas'
  | 'usadas'
  | 'fecha';

type Columna = {
  key: nombreColumna;
  label: string;
  render: (entrada: VistaEntrada) => ReactNode;
};

const formatearFechaYHora = (fecha: string) => {
  const fechaObj = new Date(fecha);
  return fechaObj.toLocaleDateString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });
};

interface EntradasTableProps {
  columnas: Columna[];
  columnasVisibles: nombreColumna[];
  entradas: VistaEntrada[];
}

const TablaEntradas: FC<EntradasTableProps> = ({ columnas, columnasVisibles, entradas }) => {
  const navigate = useNavigate();
  return (
    <VStack gap={2} w="full">
      {entradas.map((entrada) => (
        <Button
          key={entrada.id}
          variant="subtle"
          h="fit"
          w="full"
          borderRadius="xl"
          p={2}
          gapY={1}
          gapX={10}
          onClick={() => navigate(`/editar-entrada/${entrada.id}`)}
        >
          <Flex direction="row" wrap="wrap" gapY={1} gapX={10} w="full" justifyContent="space-between" alignItems="stretch" flex="max-content">
            {columnas.
              filter(col =>
                columnasVisibles.includes(col.key)
                && (col.key !== 'usadas' || entrada.usadas > 0)
              )
              .map((col) => (
                <Flex key={col.key} flexShrink={1} direction="row" wrap="nowrap" gapX="1" flexBasis="auto">
                  <Text fontSize="xs">{col.label}:</Text>
                  <Text
                    whiteSpace="pre-wrap"
                    fontWeight="semibold"
                    textAlign="left"
                    fontSize={col.key === 'grupo'
                      ? "1.2em" : undefined}
                  >
                    {col.render(entrada)}
                  </Text>
                </Flex>
            ))}
          </Flex>
        </Button>
      ))}
    </VStack>
  );
};

type SettingsMenuContentProps = {
  columnas: Columna[];
  columnasVisibles: nombreColumna[];
  toggleColumn: (column: nombreColumna) => void;
};

const SettingsMenuContent: FC<SettingsMenuContentProps> = ({
  columnas,
  columnasVisibles,
  toggleColumn
}) => {
  return (
    <Menu.Content>
      <Menu.ItemGroup>
        <Menu.ItemGroupLabel>
          <Flex direction="row" gap={2} align="center">
            <FiColumns />
            Columnas a mostrar
          </Flex>
        </Menu.ItemGroupLabel>
        <Flex direction="row" flexWrap="wrap" gap={2}>
          {columnas.map((col) => (
            <Menu.CheckboxItem
              key={col.key}
              value={col.key}
              checked={columnasVisibles.includes(col.key)}
              onCheckedChange={() => toggleColumn(col.key)}
              style={{ flexBasis: '1rem', border: '1px solid var(--chakra-colors-gray-200)', borderRadius: '0.5rem' }}
            >
              {col.label}
              <Menu.ItemIndicator />
            </Menu.CheckboxItem>
          ))}
        </Flex>
      </Menu.ItemGroup>
    </Menu.Content>
  );
};

const ListaDeEntradas: FC = () => {
  const { anio } = useAnio();
  const { data: entradas, isLoading: cargandoEntradas, error: errorCargaEntradas } = useEntradasDelAnio();
  const [columnasVisibles, setColumnasVisibles] = useState<nombreColumna[]>([
    'comprador',
    'alumno',
    'grupo',
    'compradas',
    'usadas',
    'fecha'
  ]);

  const columnas: Columna[] = [
    { key: 'id', label: 'ID', render: (entrada: VistaEntrada) => entrada.id },
    { key: 'comprador', label: 'Comprador', render: (entrada: VistaEntrada) => entrada.nombre_comprador },
    { key: 'email', label: 'Email', render: (entrada: VistaEntrada) => entrada.email_comprador },
    { key: 'alumno', label: 'Alumno', render: (entrada: VistaEntrada) => entrada.nombre_alumno },
    { key: 'grupo', label: 'Grupo', render: (entrada: VistaEntrada) => entrada.nombre_grupo },
    { key: 'compradas', label: 'Compradas', render: (entrada: VistaEntrada) => entrada.compradas },
    { key: 'usadas', label: 'Usadas', render: (entrada: VistaEntrada) => entrada.usadas },
    { key: 'fecha', label: 'Fecha', render: (entrada: VistaEntrada) => formatearFechaYHora(entrada.creada) },
  ] as Array<{ key: nombreColumna, label: string, render: (entrada: VistaEntrada) => ReactNode }>;

  const toggleColumn = (column: nombreColumna) => {
    setColumnasVisibles(prev => 
      prev.includes(column)
        ? prev.filter(col => col !== column)
        : [...prev, column]
    );
  };

  useEffect(() => {
    if (errorCargaEntradas) {
      console.error('Error al cargar las entradas:', errorCargaEntradas?.message || errorCargaEntradas.toString());
    }
  }, [errorCargaEntradas]);

  return (
    <Flex direction="column" gap={4}>
      <Flex justify="flex-end">
        <RouterLink to="/alta-de-entrada">
          <Button size="sm" variant="solid" colorPalette="green">
            <FiPlusSquare />
            Agregar entrada
          </Button>
        </RouterLink>
      </Flex>
      <VStack>
        <Menu.Root>
          <Flex justify="space-between" direction="row" w="full">
            <Separator />
            <Heading as="h1" size="lg" flexBasis="auto">
              Lista de Entradas
            </Heading>
            <Menu.Trigger asChild>
              <IconButton size="xs" variant="outline">
                <FiSettings />
              </IconButton>
            </Menu.Trigger>
          </Flex>
          <SettingsMenuContent columnas={columnas} columnasVisibles={columnasVisibles} toggleColumn={toggleColumn} />
        </Menu.Root>
        {cargandoEntradas ? (
            <Spinner size="xl" color="blue.500" />
          ) : errorCargaEntradas ? (
            <Box bg="red.100" color="red.800" p={4} borderRadius="md">
              No se pudieron cargar las entradas. Por favor, intente nuevamente.
            </Box>
          ) : !entradas || entradas.length === 0 ? (
            <Box p={6}><Text>No hay entradas registradas para el año {anio}.</Text></Box>
          ) : (
            <TablaEntradas columnas={columnas} columnasVisibles={columnasVisibles} entradas={entradas} />
          )}
        </VStack>
    </Flex>
  );
};

export default ListaDeEntradas;
