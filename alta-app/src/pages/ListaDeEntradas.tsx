import { useNavigate, Link as RouterLink } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
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
} from '@chakra-ui/react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { supabase } from '../supabase/supabaseClient';
import { toaster } from '../chakra/toaster';

interface Entrada {
  id: string;
  nombre_comprador: string;
  alumno: { nombre: string, grupo: string };
  cantidad: number;
  created_at: string;
}

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

const ListaDeEntradas: React.FC = () => {
  const navigate = useNavigate();
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <Flex direction="column">
      <Flex justify="flex-end">
        <RouterLink to="/alta-de-entrada">
            <Button size="sm" variant="solid" backgroundColor="blue.600" _hover={{ backgroundColor: 'blue.500' }}>
            <FaPlus />
            Alta de Entrada
            </Button>
        </RouterLink>
      </Flex>
      <VStack>
        <Heading as="h1" size="lg">Lista de Entradas</Heading>
        {isLoading ? (
            <Spinner size="xl" color="blue.500" />
        ) : error ? (
            <Box bg="red.100" color="red.800" p={4} borderRadius="md">
            {error}
            </Box>
        ) : entradas.length === 0 ? (
            <Box p={6}><Text>No hay entradas registradas para este año aún.</Text></Box>
        ) : (
            <Box>
            <Table.Root size="sm" variant="outline">
                <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>Comprador</Table.ColumnHeader>
                    <Table.ColumnHeader>Alumno</Table.ColumnHeader>
                    <Table.ColumnHeader>Grupo</Table.ColumnHeader>
                    <Table.ColumnHeader>Cantidad</Table.ColumnHeader>
                    <Table.ColumnHeader>Fecha</Table.ColumnHeader>
                    <Table.ColumnHeader>Acciones</Table.ColumnHeader>
                </Table.Row>
                </Table.Header>
                <Table.Body>
                {entradas.map((entrada) => (
                    <Table.Row key={entrada.id}>
                    <Table.Cell>{entrada.nombre_comprador}</Table.Cell>
                    <Table.Cell>{entrada.alumno.nombre}</Table.Cell>
                    <Table.Cell>{entrada.alumno.grupo}</Table.Cell>
                    <Table.Cell>{entrada.cantidad}</Table.Cell>
                    <Table.Cell>{formatearFechaYHora(entrada.created_at)}</Table.Cell>
                    <Table.Cell>
                        <HStack>
                        <IconButton aria-label="Edit" colorPalette="blue" size="xs" onClick={() => handleEdit(entrada.id)}>
                            <FaEdit />
                        </IconButton>
                        <IconButton aria-label="Delete" colorPalette="red" size="xs" onClick={() => handleDelete(entrada.id)}>
                            <FaTrash />
                        </IconButton>
                        </HStack>
                    </Table.Cell>
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
