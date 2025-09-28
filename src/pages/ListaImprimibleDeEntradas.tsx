import { useEntradasPorFuncion, VistaEntrada } from '../queries/useEntradas';
import { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Spacer,
  Spinner,
  Table,
  Text,
} from '@chakra-ui/react';
import type { FC } from 'react';
import { SelectorDeAnio } from '../components/SelectorDeAnio';
import FuncionSelect from '../components/FuncionSelect';

interface EntradasTableProps {
  entradas: VistaEntrada[];
}

const TablaEntradas: FC<EntradasTableProps> = ({ entradas }) => {
  return (
    <Table.Root
      w="full"
      color="black"
      bg="white"
      size="md"
      css={{
        '& th, & td': {
          padding: '0.1rem 0.3rem',
        }
      }}
    >
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
                {entrada.compradas}
              </Text>
            </Table.Cell>
            <Table.Cell bg="white" >
              <Text whiteSpace="pre-wrap">
                {entrada.nombre_alumno}
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
  const [funcion, setFuncion] = useState<string | null>(null);
  const {
    data: entradas,
    isLoading: cargandoEntradas,
    error: errorEntradas
  } = useEntradasPorFuncion(anio, funcion || undefined);

  const cantidadDeEntradas = entradas?.length || 0;
  const localidades = entradas?.reduce((total, entrada) => total + entrada.compradas, 0) || 0;
  return (
    <Flex direction="column" gap={4} bg="white" color="black" className="light">
      <Box display="flex">
        <Heading as="h1" size="lg">
          Lista Imprimible de Entradas 
          ({cantidadDeEntradas} items, {localidades} localidades)
        </Heading>
        <Spacer />
        <Box display="flex" gap={2}>
          <FuncionSelect anio={anio} value={funcion} onChange={setFuncion} size="sm" />
          <SelectorDeAnio anio={anio} setAnio={setAnio} />
        </Box>
      </Box>
      {cargandoEntradas ? (
          <Spinner size="xl" color="blue.500" />
        ) : errorEntradas ? (
          <Box bg="red.100" color="red.800" p={4} borderRadius="md">
            Error al cargar las entradas: {errorEntradas.message}
          </Box>
        ) : !entradas || entradas.length === 0 ? (
          <Box p={6}><Text>No hay entradas registradas para el año {anio}.</Text></Box>
        ) : (
          <Box pl={5}>
            <TablaEntradas entradas={entradas} />
          </Box>
        )}
    </Flex>
  );
};

export default ListaImprimibleDeEntradas;
