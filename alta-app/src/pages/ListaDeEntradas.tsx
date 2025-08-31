import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useEffect, useState, ReactNode } from 'react';
import {
  IconButton,
  Heading,
  VStack,
  Flex,
  Table,
  Spinner,
  HStack,
  Box,
  Text,
  Button,
  Menu,
  Separator,
  For,
} from '@chakra-ui/react';
import {
  FiPlusSquare,
  FiEdit,
  FiTrash2,
  FiSettings,
  FiColumns,
} from 'react-icons/fi';
import { supabase } from '../supabase/supabaseClient';
import { toaster } from '../chakra/toaster';
import type { FC } from 'react';

interface Entrada {
  id: string;
  nombre_comprador: string;
  alumno: { nombre: string, grupo: string };
  cantidad: number;
  created_at: string;
}

type nombreColumna =
  'id' |
  'comprador' |
  'alumno' |
  'grupo' |
  'cantidad' |
  'fecha' |
  'acciones';

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

const ListaDeEntradas: FC = () => {
  const navigate = useNavigate();
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [columnasVisibles, setColumnasVisibles] = useState({
    id: false,
    comprador: true,
    alumno: true,
    grupo: true,
    cantidad: true,
    fecha: true,
    acciones: true,
  } as Record<nombreColumna, boolean>);

  const columnas = [
    { key: 'id', label: 'ID', render: (entrada: Entrada) => entrada.id },
    { key: 'comprador', label: 'Comprador', render: (entrada: Entrada) => entrada.nombre_comprador },
    { key: 'alumno', label: 'Alumno', render: (entrada: Entrada) => entrada.alumno.nombre },
    { key: 'grupo', label: 'Grupo', render: (entrada: Entrada) => entrada.alumno.grupo },
    { key: 'cantidad', label: 'Cantidad', render: (entrada: Entrada) => entrada.cantidad },
    { key: 'fecha', label: 'Fecha', render: (entrada: Entrada) => formatearFechaYHora(entrada.created_at) },
    { key: 'acciones', label: 'Acciones', render: (entrada: Entrada) => (
      <HStack>
        <IconButton aria-label="Edit" colorPalette="blue" size="xs" onClick={() => handleEdit(entrada.id)}>
          <FiEdit />
        </IconButton>
        <IconButton aria-label="Delete" colorPalette="red" size="xs" onClick={() => handleDelete(entrada.id)}>
          <FiTrash2 />
        </IconButton>
      </HStack>
    ) },
  ] as Array<{ key: nombreColumna, label: string, render: (entrada: Entrada) => ReactNode }>;

  const toggleColumn = (col: nombreColumna) => {
    setColumnasVisibles(prev => ({
      ...prev,
      [col]: !prev[col]
    }));
  };

  const fetchEntradas = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('entradas')
      .select('id, nombre_comprador, alumno:id_alumno(nombre, grupo), cantidad, created_at')
      .order('created_at', { ascending: true });
    if (error) {
      setError('Error al cargar las entradas.');
      setEntradas([]);
    } else {
      setEntradas(data as unknown as Entrada[] || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEntradas();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas borrar esta entrada?')) return;
    const { error } = await supabase.from('entradas').delete().eq('id', id);
    if (error) {
      toaster.create({ type: 'error', title: 'Error al borrar entrada', description: error.message });
    } else {
      toaster.create({ type: 'success', title: 'Entrada borrada', description: 'La entrada se ha borrado correctamente.' });
      setEntradas(entradas.filter((e) => e.id !== id));
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/editar-entrada/${id}`);
  };

  return (
    <Flex direction="column" gap={4}>
      <Flex justify="flex-end">
        <RouterLink to="/alta-de-entrada">
          <Button size="sm" variant="solid" backgroundColor="blue.600" _hover={{ backgroundColor: 'blue.500' }}>
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
          <Menu.Content>
            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>
                <Flex direction="row" gap={2} align="center">
                  <FiColumns />
                  Columnas a mostrar
                </Flex>
              </Menu.ItemGroupLabel>
              <Flex direction="row" flexWrap="wrap" gap={2}>
                {columnas.map((column) => (
                  <Menu.CheckboxItem
                    key={column.key}
                    value={column.key}
                    checked={columnasVisibles[column.key as keyof typeof columnasVisibles]}
                    onCheckedChange={() => toggleColumn(column.key)}
                    style={{flexBasis: '1rem', border: '1px solid var(--global-color-border)', borderRadius: '0.5rem'}}
                  >
                    {column.label}
                    <Menu.ItemIndicator />
                  </Menu.CheckboxItem>
                ))}
              </Flex>
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Root>
        {isLoading ? (
            <Spinner size="xl" color="blue.500" />
          ) : error ? (
            <Box bg="red.100" color="red.800" p={4} borderRadius="md">
              {error}
            </Box>
          ) : entradas.length === 0 ? (
            <Box p={6}><Text>No hay entradas registradas para este año aún.</Text></Box>
          ) : (
            <Box overflowX="auto" width="100%">
              <Table.Root size="sm" variant="outline">
                <Table.Header>
                  <Table.Row>
                    <For each={columnas}>
                      {col => columnasVisibles[col.key] && (
                        <Table.ColumnHeader key={col.key}>{col.label}</Table.ColumnHeader>
                      )}
                    </For>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {entradas.map((entrada) => (
                    <Table.Row key={entrada.id}>
                      <For each={columnas}>
                        {col => columnasVisibles[col.key] && (
                          <Table.Cell>{col.render(entrada)}</Table.Cell>
                        )}
                      </For>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          )}
        </VStack>
    </Flex>
  );
};

export default ListaDeEntradas;
