import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Spacer,
  Spinner,
  Table,
  Text,
} from '@chakra-ui/react';
import { supabase } from '../supabase/supabaseClient';
import type { FC } from 'react';
import { SelectorDeAnio } from '../components/SelectorDeAnio';
import FuncionSelect from '../components/FuncionSelect';
import { LightMode } from '../chakra/color-mode';

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

interface EntradasTableProps {
  entradas: Entrada[];
}

const TablaEntradas: FC<EntradasTableProps> = ({ entradas }) => {
  return (
    <Table.Root w="full" color="black" bg="white" size="xs">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader bg="white" color="black">Asistentes</Table.ColumnHeader>
          <Table.ColumnHeader bg="white" color="black">Cantidad</Table.ColumnHeader>
          <Table.ColumnHeader bg="white" color="black">Alumno</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {entradas.map((entrada) => (
          <Table.Row key={entrada.id}>
            <Table.Cell bg="white" >
              <Text whiteSpace="pre-wrap">
                {entrada.nombre_comprador}
              </Text>
            </Table.Cell>
            <Table.Cell bg="white" >
              <Text whiteSpace="pre-wrap">
                {entrada.cantidad}
              </Text>
            </Table.Cell>
            <Table.Cell bg="white" >
              <Text whiteSpace="pre-wrap">
                {entrada.alumno_nombre}
              </Text>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const getCurrentYear = () => {
  return new Date().getFullYear();
};

const ListaImprimibleDeEntradas: FC = () => {
  const [anio, setAnio] = useState(getCurrentYear());
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [funcion, setFuncion] = useState<string | null>(null);

  const fetchEntradas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const query = supabase
      .from('entradas')
      .select(`
        nombre_comprador,
        cantidad,
        ...alumnos!inner(
          alumno_nombre:nombre,
          ...grupos!inner(
            grupo:nombre_corto,
            anio_grupo:year,
            nombre_funcion
          )
        )
      `)
      .eq('alumnos.grupos.year', anio);
    if (funcion) {
      query.eq('alumnos.grupos.nombre_funcion', funcion);
    }
    const { data, error } = await query
      .order('nombre_comprador', { ascending: true });
    if (error) {
      setError(`Error al cargar las entradas del año ${anio}.`);
      setEntradas([]);
    } else {
      setEntradas(data as unknown as Entrada[] || []);
    }
    setIsLoading(false);
  }, [anio, funcion]);

  useEffect(() => {
    fetchEntradas();
  }, [fetchEntradas]);

  const localidades = entradas.reduce((total, entrada) => total + entrada.cantidad, 0);
  return (
    <Flex direction="column" gap={4} bg="white" color="black">
      <LightMode>
        <Box display="flex">
          <Heading as="h1" size="lg">
            Lista Imprimible de Entradas 
            ({entradas.length} items, {localidades} localidades)
          </Heading>
          <Spacer />
          <Box display="flex" gap={2}>
            <FuncionSelect anio={anio} value={funcion} onChange={setFuncion} size="sm" />
            <SelectorDeAnio anio={anio} setAnio={setAnio} />
          </Box>
        </Box>
        {isLoading ? (
            <Spinner size="xl" color="blue.500" />
          ) : error ? (
            <Box bg="red.100" color="red.800" p={4} borderRadius="md">
              {error}
            </Box>
          ) : entradas.length === 0 ? (
            <Box p={6}><Text>No hay entradas registradas para el año {anio}.</Text></Box>
          ) : (
            <TablaEntradas entradas={entradas} />
          )}
        </LightMode>
    </Flex>
  );
};

export default ListaImprimibleDeEntradas;
