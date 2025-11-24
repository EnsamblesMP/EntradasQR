import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { useHistorialCambios, type RegistroCambio } from '../queries/useHistorialCambios';
import {
  Box,
  Flex,
  Heading,
  Spinner,
  Text,
  VStack,
  IconButton,
  Menu,
  Separator,
} from '@chakra-ui/react';
import { FiColumns, FiSettings } from 'react-icons/fi';
import { useColorModeValue } from '../chakra/use-color-mode';

const formatearFechaYHora = (fecha: string): string => {
  const fechaObj: Date = new Date(fecha);
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

const formatearFechaRelativa = (fecha: string): string => {
  const fechaObj: Date = new Date(fecha);
  const fechaActual: Date = new Date();
  const diferenciaEnMinutos: number = Math.floor((fechaActual.getTime() - fechaObj.getTime()) / (1000 * 60));
  if (diferenciaEnMinutos < 60) {
    return `Hace ${diferenciaEnMinutos} minutos`;
  } else if (diferenciaEnMinutos < 60 * 24) {
    return `Hace ${Math.floor(diferenciaEnMinutos / 60)} horas`;
  } else {
    return formatearFechaYHora(fecha);
  }
};

const toTitleCase = (str: string): string => {
  return str
    .split(/[\s_]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const formatearContextoRegistro = (contexto: Record<string, unknown>): ColumnaFinal[] => {
  try {
    return Object.entries(contexto).map(([key, value]) => ({
      etiqueta: toTitleCase(key),
      valor: value !== null && value !== undefined ? String(value) : 'N/A'
    }));
  } catch (error) {
    console.error('Error al formatear contexto:', error);
    return [{
      etiqueta: 'Error',
      valor: 'Error al cargar la información del contexto'
    }];
  }
};

interface CampoCambioProps {
  etiqueta: string;
  valor: ReactNode;
  resaltar?: boolean;
}

const CampoCambio: FC<CampoCambioProps> = ({ etiqueta, valor, resaltar = false }) => {
  if (valor === null || valor === undefined || valor === '') {
    return null;
  }

  return (
    <Flex flexShrink={1} direction="row" wrap="nowrap" gapX="1" flexBasis="auto">
      <Text fontSize="xs">{etiqueta}:</Text>
      <Text
        whiteSpace="pre-wrap"
        fontWeight={resaltar ? 'semibold' : 'normal'}
        textAlign="left"
        fontSize="sm"
      >
        {valor}
      </Text>
    </Flex>
  );
};

type NombreColumnaElegible = 
  | 'ID historial'
  | 'Fecha absoluta'
  | 'Fecha relativa'
  | 'Tabla'
  | 'Contexto del registro'
  | 'Operación'
  | 'Columna'
  | 'Valor anterior'
  | 'Valor nuevo'
  | 'ID registro'
  | 'Usuario';

interface ColumnaFinal {
  etiqueta: string;
  valor: ReactNode;
  resaltar?: boolean;
}

type ColumnaElegible = {
  nombre: NombreColumnaElegible;
  render: (cambio: RegistroCambio) => ColumnaFinal[];
};

interface ListaCambiosProps {
  cambios: RegistroCambio[];
  columnas: ColumnaElegible[];
  columnasVisibles: NombreColumnaElegible[];
}

const ListaCambios: FC<ListaCambiosProps> = ({ cambios, columnas, columnasVisibles }) => {
  return (
    <VStack gap={2} w="full">
      {cambios.map((cambio: RegistroCambio) => (
        <Box
          key={cambio.id_historial}
          borderRadius="xl"
          p={2}
          w="full"
          bg={{ base: 'gray.200', _dark: 'gray.700' }}
        >
          <Flex
            direction="row"
            wrap="wrap"
            gapY={1}
            gapX={6}
            w="full"
            justifyContent="space-between"
            alignItems="stretch"
          >
            {columnas
              .filter((columna: ColumnaElegible) => columnasVisibles.includes(columna.nombre))
              .map((columna: ColumnaElegible) => {
                const campos = columna.render(cambio);
                return campos.map((x: ColumnaFinal) => (
                  <CampoCambio
                    key={x.etiqueta}
                    etiqueta={x.etiqueta}
                    valor={x.valor}
                    resaltar={x.resaltar}
                  />
                ));
              })}
          </Flex>
        </Box>
      ))}
    </VStack>
  );
};

type SettingsMenuContentProps = {
  columnas: ColumnaElegible[];
  columnasVisibles: NombreColumnaElegible[];
  toggleColumn: (column: NombreColumnaElegible) => void;
};

const SettingsMenuContent: FC<SettingsMenuContentProps> = ({
  columnas,
  columnasVisibles,
  toggleColumn,
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
          {columnas.map((columna: ColumnaElegible) => (
            <Menu.CheckboxItem
              key={columna.nombre}
              value={columna.nombre}
              checked={columnasVisibles.includes(columna.nombre)}
              onCheckedChange={() => toggleColumn(columna.nombre)}
              style={{ flexBasis: '1rem', border: `1px solid var(--chakra-colors-${useColorModeValue('gray-100', 'gray-800')})`, borderRadius: '0.5rem' }}
            >
              {columna.nombre}
              <Menu.ItemIndicator />
            </Menu.CheckboxItem>
          ))}
        </Flex>
      </Menu.ItemGroup>
    </Menu.Content>
  );
};

const UltimosCambios: FC = () => {
  const {
    data: cambios,
    isLoading: cargandoCambios,
    error: errorCambios,
  } = useHistorialCambios();

  const [columnasVisibles, setColumnasVisibles] = useState<NombreColumnaElegible[]>([
    'Fecha relativa',
    'Tabla',
    'Contexto del registro',
    'Operación',
    'Columna',
    'Valor nuevo',
    'Valor anterior',
    'Usuario',
  ]);

  const columnas: ColumnaElegible[] = [
    {
      nombre: 'ID historial',
      render: (cambio: RegistroCambio): ColumnaFinal[] =>
        ([{ etiqueta: 'ID historial', valor: cambio.id_historial }]),
    },
    {
      nombre: 'Fecha absoluta',
      render: (cambio: RegistroCambio): ColumnaFinal[] =>
        ([{ etiqueta: 'Fecha', valor: formatearFechaYHora(cambio.created_at) }]),
    },
    {
      nombre: 'Fecha relativa',
      render: (cambio: RegistroCambio): ColumnaFinal[] =>
        ([{ etiqueta: 'Cuando', valor: formatearFechaRelativa(cambio.created_at) }]),
    },
    {
      nombre: 'Tabla',
      render: (cambio: RegistroCambio): ColumnaFinal[] =>
        ([{ etiqueta: 'Tabla', valor: cambio.tabla, resaltar: true }]),
    },
    {
      nombre: 'Contexto del registro',
      render: (cambio: RegistroCambio): ColumnaFinal[] =>
        formatearContextoRegistro(cambio.contexto_registro),
    },
    {
      nombre: 'Operación',
      render: (cambio: RegistroCambio): ColumnaFinal[] =>
        ([{ etiqueta: 'Operación', valor: cambio.operacion }]),
    },
    {
      nombre: 'Columna',
      render: (cambio: RegistroCambio): ColumnaFinal[] =>
        ([{ etiqueta: 'Columna', valor: cambio.campo }]),
    },
    {
      nombre: 'Valor anterior',
      render: (cambio: RegistroCambio): ColumnaFinal[] =>
        ([{ etiqueta: 'Valor anterior', valor: cambio.valor_anterior }]),
    },
    {
      nombre: 'Valor nuevo',
      render: (cambio: RegistroCambio): ColumnaFinal[] =>
        ([{ etiqueta: 'Valor nuevo', valor: cambio.valor_nuevo, resaltar: true }]),
    },
    {
      nombre: 'ID registro',
      render: (cambio: RegistroCambio): ColumnaFinal[] =>
        ([{ etiqueta: 'ID registro', valor: cambio.id_registro }]),
    },
    {
      nombre: 'Usuario',
      render: (cambio: RegistroCambio): ColumnaFinal[] =>
        ([{ etiqueta: 'Usuario', valor: cambio.email_usuario }]),
    },
  ];

  const toggleColumn = (column: NombreColumnaElegible) => {
    setColumnasVisibles((prev: NombreColumnaElegible[]) =>
      prev.includes(column)
        ? prev.filter((columna: NombreColumnaElegible) => columna !== column)
        : [...prev, column]
    );
  };

  return (
    <Flex direction="column" gap={4}>
      <Menu.Root>
        <Flex justify="space-between" direction="row" w="full">
          <Separator />
          <Heading as="h1" size="lg" flexBasis="auto">
            Últimos cambios
          </Heading>
          <Menu.Trigger asChild>
            <IconButton size="xs" variant="outline">
              <FiSettings />
            </IconButton>
          </Menu.Trigger>
        </Flex>
        <SettingsMenuContent columnas={columnas} columnasVisibles={columnasVisibles} toggleColumn={toggleColumn} />
      </Menu.Root>
      {cargandoCambios ? (
        <Spinner size="xl" color="blue.500" />
      ) : errorCambios ? (
        <Box bg="red.100" color="red.800" p={4} borderRadius="md">
          No se pudieron cargar los últimos cambios. Por favor, intente nuevamente.
        </Box>
      ) : !cambios || cambios.length === 0 ? (
        <Box p={6}>
          <Text>No hay cambios registrados.</Text>
        </Box>
      ) : (
        <ListaCambios cambios={cambios} columnas={columnas} columnasVisibles={columnasVisibles} />
      )}
    </Flex>
  );
};

export default UltimosCambios;
