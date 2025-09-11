import { useState, useEffect, useCallback } from 'react';
import { FiCamera, FiSliders } from 'react-icons/fi';
import AlumnoSelect from '../components/AlumnoSelect';
import GrupoSelect from '../components/GrupoSelect';
import { FiltroConLupita } from '../components/FiltroConLupita';
import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Spacer,
  Text,
  Collapsible,
  Badge,
} from '@chakra-ui/react';
import { supabase } from '../supabase/supabaseClient';
import { useAnio } from '../supabase/anioUtils';
import { toaster } from '../chakra/toaster';

interface Entrada {
  id: string;
  nombre_comprador: string;
  email_comprador: string;
  cantidad: number;
  cantidad_usada: number;
  created_at: string;
  alumno_id: number;
  alumno_nombre: string;
  grupo_id: string;
  grupo: string;
  anio_grupo: number;
}

const calcularRestantes = (compradas: number, usadas: number) => {
  return compradas - usadas;
};

const darEstado = (compradas: number, usadas: number) => {
  if (compradas === usadas) {
    return 'Ya usada';
  }
  if (usadas === 0) {
    return 'Pendiente';
  }
  if (usadas < compradas) {
    return 'Parcialmente usada';
  }
  return 'Usada de más';
};

const darColorEstado = (compradas: number, usadas: number) => {
  if (compradas === usadas) {
    return 'red';
  }
  if (usadas === 0) {
    return 'green';
  }
  if (usadas < compradas) {
    return 'yellow';
  }
  return 'purple';
};

export default function Preacreditacion() {
  const [usarFiltros, setUsarFiltros] = useState(false);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [grupoElegido, setGrupoElegido] = useState<string | null>(null);
  const [alumnoElegido, setAlumnoElegido] = useState<number | null>(null);
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [entradasFiltradas, setEntradasFiltradas] = useState<Entrada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { anio } = useAnio();

  const fetchEntradas = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data, error: queryError } = await supabase
        .from('entradas')
        .select(`
          id,
          nombre_comprador,
          email_comprador,
          cantidad,
          cantidad_usada,
          created_at,
          ...alumnos!inner(
            alumno_id:id,
            alumno_nombre:nombre,
            ...grupos!inner(
              grupo_id:id,
              grupo:nombre_corto,
              anio_grupo:year
            )
          )
        `)
        .eq('alumnos.grupos.year', anio);

      if (queryError) throw queryError;
      
      setEntradas(data || []);
    } catch (err) {
      console.error('Error al cargar las entradas:', err);
      toaster.create({
        title: 'Error',
        description: 'No se pudieron cargar las entradas. Por favor, intente nuevamente.',
        type: 'error',
        duration: 5000,
        closable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [anio]);
  
  // Filter and sort entries based on search term
  useEffect(() => {
    let filtradas = [...entradas];
    
    if (filtroTexto) {
      filtradas = filtradas.filter((entrada) =>
        entrada.nombre_comprador?.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        entrada.alumno_nombre?.toLowerCase().includes(filtroTexto.toLowerCase())
      );
    }
    
    if (usarFiltros && grupoElegido) {
      filtradas = filtradas.filter((entrada) => entrada.grupo_id === grupoElegido);
    }

    if (usarFiltros && alumnoElegido) {
      filtradas = filtradas.filter((entrada) => entrada.alumno_id === alumnoElegido);
    }

    // ordenar por tickets restantes (desc) y luego por nombre del comprador (asc)
    filtradas.sort((a, b) => {
      const aRestantes = calcularRestantes(a.cantidad, a.cantidad_usada);
      const bRestantes = calcularRestantes(b.cantidad, b.cantidad_usada);
      
      if (aRestantes !== bRestantes) {
        return bRestantes - aRestantes;
      }
      
      return a.nombre_comprador.localeCompare(b.nombre_comprador);
    });
    
    setEntradasFiltradas(filtradas);
  }, [filtroTexto, entradas, usarFiltros, grupoElegido, alumnoElegido]);

  useEffect(() => {
    fetchEntradas();
  }, [fetchEntradas]);

  const alEscanear = () => {
    toaster.create({ type: 'warning', description: "Escanear QR no implementado aún", duration: 5000, closable: true });
  };

  const alSeleccionarEntrada = () => {
    toaster.create({ type: 'warning', description: "Seleccionar entrada no implementado aún", duration: 5000, closable: true });
  };

  return (
    <Box p={4}>
      <Flex direction="column" gap={4}>
        <Button colorPalette="teal" size="lg" onClick={alEscanear}>
          <FiCamera />
          Escanear QR
        </Button>

        <Flex gap={2} flex={1}>
          <FiltroConLupita
            texto={filtroTexto}
            setTexto={setFiltroTexto}
            placeholder="Buscar por comprador o alumno"
          />
          <Button onClick={() => setUsarFiltros(!usarFiltros)}>
            <FiSliders />
            Filtros
          </Button>
        </Flex>

        <Collapsible.Root open={usarFiltros}>
          <Collapsible.Content>
            <Flex direction="column" gap={4} p={4} borderWidth={1} borderRadius="md">
              <GrupoSelect
                value={grupoElegido || null}
                onChange={(value) => {setGrupoElegido(value); setAlumnoElegido(null)}}
              />
              <AlumnoSelect
                idGrupo={grupoElegido}
                value={alumnoElegido || null}
                onChange={(value) => setAlumnoElegido(value)}
              />
            </Flex>
          </Collapsible.Content>
        </Collapsible.Root>

        <Flex direction="column" flex="1" overflow="hidden">
          <Heading size="md" mb={3}>Resultados</Heading>
          
          {isLoading ? (
            <Flex flex="1" align="center" justify="center">
              <Spinner />
            </Flex>
          ) : (
            <Flex direction="column" gap={3} overflowY="auto" flex="1">
            {entradasFiltradas.map((entrada) => (
              <Button
                key={entrada.id}
                p={3}
                borderWidth={1}
                borderRadius="md"
                justifyContent="flex-start"
                textAlign="left"
                width="100%"
                height="auto"
                variant="outline"
                onClick={alSeleccionarEntrada}
              >
                <Flex direction="column" gap={1} w="full">
                  <Flex direction="row" wrap="wrap" justify="space-between" gap={1}>
                      <Text fontSize="xs">Comprador:</Text>
                      <Text fontWeight="bold">{entrada.nombre_comprador}</Text>
                      <Spacer />
                      <Badge colorPalette={darColorEstado(entrada.cantidad, entrada.cantidad_usada)}>
                        {darEstado(entrada.cantidad, entrada.cantidad_usada)}
                      </Badge>
                      <Text fontSize="xs" color="gray.500">
                        {entrada.cantidad_usada < 1 ? <></>
                        : <>{entrada.cantidad_usada} usada{entrada.cantidad_usada !== 1 ? 's' : ''} de </>
                        }
                        {entrada.cantidad} comprada{entrada.cantidad !== 1 ? 's' : ''}
                      </Text>
                  </Flex>
                  <Flex direction="row" wrap="wrap" justify="space-between" gap={1}>
                    <Text fontSize="xs">Alumno:</Text>
                    <Text fontSize="sm">{entrada.alumno_nombre}</Text>
                    <Spacer />
                    <Text fontSize="xs">Grupo:</Text>
                    <Text fontSize="xs" fontWeight="bold">{entrada.grupo}</Text>
                  </Flex>
                </Flex>
              </Button>
            ))}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
