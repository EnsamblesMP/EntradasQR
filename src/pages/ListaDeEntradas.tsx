import { useCallback, useEffect, useState, ReactNode } from 'react';
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
import { supabase } from '../supabase/supabaseClient';
import type { FC } from 'react';

interface Entrada {
  id: string;
  nombre_comprador: string;
  email_comprador: string;
  cantidad: number;
  cantidad_usada: number;
  created_at: string;
  alumno_nombre: string;
  grupo: string;
  anio_grupo: number;
}

type nombreColumna =
  | 'id'
  | 'comprador'
  | 'email'
  | 'alumno'
  | 'grupo'
  | 'anio'
  | 'cantidad'
  | 'cantidad_usada'
  | 'fecha';

type Columna = {
  key: nombreColumna;
  label: string;
  render: (entrada: Entrada) => ReactNode;
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
  entradas: Entrada[];
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
                && (col.key !== 'cantidad_usada' || entrada.cantidad_usada > 0)
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
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [columnasVisibles, setColumnasVisibles] = useState<nombreColumna[]>([
    'comprador',
    'alumno',
    'grupo',
    'cantidad',
    'cantidad_usada',
    'fecha'
  ]);

  const columnas: Columna[] = [
    { key: 'id', label: 'ID', render: (entrada: Entrada) => entrada.id },
    { key: 'comprador', label: 'Comprador', render: (entrada: Entrada) => entrada.nombre_comprador },
    { key: 'email', label: 'Email', render: (entrada: Entrada) => entrada.email_comprador },
    { key: 'alumno', label: 'Alumno', render: (entrada: Entrada) => entrada.alumno_nombre },
    { key: 'grupo', label: 'Grupo', render: (entrada: Entrada) => entrada.grupo },
    { key: 'anio', label: 'Año', render: (entrada: Entrada) => entrada.anio_grupo },
    { key: 'cantidad', label: 'Cantidad', render: (entrada: Entrada) => entrada.cantidad },
    { key: 'cantidad_usada', label: 'Usadas', render: (entrada: Entrada) => entrada.cantidad_usada },
    { key: 'fecha', label: 'Fecha', render: (entrada: Entrada) => formatearFechaYHora(entrada.created_at) },
  ] as Array<{ key: nombreColumna, label: string, render: (entrada: Entrada) => ReactNode }>;

  const toggleColumn = (column: nombreColumna) => {
    setColumnasVisibles(prev => 
      prev.includes(column)
        ? prev.filter(col => col !== column)
        : [...prev, column]
    );
  };

  const fetchEntradas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('entradas')
      .select(`
        id,
        nombre_comprador,
        email_comprador,
        cantidad,
        cantidad_usada,
        created_at,
        ...alumnos!inner(
          alumno_nombre:nombre,
          ...grupos!inner(
            grupo:nombre_corto,
            anio_grupo:year
          )
        )
      `)
      .eq('alumnos.grupos.year', anio)
      .order('created_at', { ascending: true });
    if (error) {
      setError(`Error al cargar las entradas del año ${anio}.`);
      setEntradas([]);
    } else {
      setEntradas(data as unknown as Entrada[] || []);
    }
    setIsLoading(false);
  }, [anio]);

  useEffect(() => {
    fetchEntradas();
  }, [fetchEntradas]);

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
        {isLoading ? (
            <Spinner size="xl" color="blue.500" />
          ) : error ? (
            <Box bg="red.100" color="red.800" p={4} borderRadius="md">
              {error}
            </Box>
          ) : entradas.length === 0 ? (
            <Box p={6}><Text>No hay entradas registradas para el año {anio}.</Text></Box>
          ) : (
            <TablaEntradas columnas={columnas} columnasVisibles={columnasVisibles} entradas={entradas} />
          )}
        </VStack>
    </Flex>
  );
};

export default ListaDeEntradas;
