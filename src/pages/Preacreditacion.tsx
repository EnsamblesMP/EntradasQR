import { useEntradasPorFuncion, VistaEntrada } from '../queries/useEntradas';
import { useState, useEffect, useCallback, useRef } from 'react';
import { FiCamera, FiSliders } from 'react-icons/fi';
import AlumnoSelect from '../components/AlumnoSelect';
import GrupoSelect from '../components/GrupoSelect';
import { FiltroConLupita } from '../components/FiltroConLupita';
import { QrScanner } from '../components/QrScanner';
import {
  Button,
  Flex,
  Heading,
  Spinner,
  Spacer,
  Text,
  Collapsible,
  Badge,
  useDisclosure,
} from '@chakra-ui/react';
import { toaster } from '../chakra/toaster';
import { useNavigate, useParams } from 'react-router-dom';
import { useAnio } from '../supabase/anioUtils';
import {
  esGuidValido,
  darColorEstado,
  darEstado
} from '../components/EntradaFunc';

export default function Preacreditacion() {
  const navigate = useNavigate();
  const { anio } = useAnio();
  const { funcion } = useParams<{ funcion: string }>();
  const [usarFiltros, setUsarFiltros] = useState(false);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [grupoElegido, setGrupoElegido] = useState<string | null>(null);
  const [alumnoElegido, setAlumnoElegido] = useState<number | null>(null);
  const [entradasFiltradas, setEntradasFiltradas] = useState<VistaEntrada[]>([]);
  const {
    data: entradas,
    isLoading: cargandoEntradas,
    error: errorCargaEntradas
  } = useEntradasPorFuncion(anio, funcion);

  // Filter and sort entries based on search term
  useEffect(() => {
    let filtradas = [...entradas || []];
    
    if (filtroTexto) {
      filtradas = filtradas.filter((entrada) =>
        entrada.nombre_comprador?.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        entrada.nombre_alumno?.toLowerCase().includes(filtroTexto.toLowerCase())
      );
    }
    
    if (usarFiltros && grupoElegido) {
      filtradas = filtradas.filter((entrada) => entrada.id_grupo === grupoElegido);
    }

    if (usarFiltros && alumnoElegido) {
      filtradas = filtradas.filter((entrada) => entrada.id_alumno === alumnoElegido);
    }

    // ordenar por tickets restantes (desc) y luego por nombre del comprador (asc)
    filtradas.sort((a, b) => {
      const estadoA = darEstado(a.compradas, a.usadas);
      const estadoB = darEstado(b.compradas, b.usadas);
      
      if (estadoA !== estadoB) {
        return estadoA.localeCompare(estadoB);
      }
      
      return a.nombre_comprador.localeCompare(b.nombre_comprador);
    });
    
    setEntradasFiltradas(filtradas);
  }, [filtroTexto, entradas, usarFiltros, grupoElegido, alumnoElegido]);

  useEffect(() => {
    if (errorCargaEntradas) {
      console.error('Error al cargar las entradas:', errorCargaEntradas);
      toaster.create({
        title: 'Error',
        description: 'No se pudieron cargar las entradas. Por favor, intente nuevamente.',
        type: 'error',
        duration: 5000,
        closable: true,
      });
    }
  }, [errorCargaEntradas]);

  const { open: qrAbierto, onOpen: alAbrirQr, onClose: alCerrarQr } = useDisclosure();
  const cuentaScanRef = useRef(0);

  const alEscanear = () => {
    cuentaScanRef.current = 0;
    alAbrirQr();
  };

  const alSeleccionarEntrada = useCallback((entrada: VistaEntrada) => {
    navigate(`/acreditar/${entrada.id}`);
  }, [navigate]);

  const alScanearQr = useCallback((idEntrada: string) => {
    cuentaScanRef.current++;
    if (cuentaScanRef.current > 1) return; // Evitar múltiples escaneos
    try {
      console.log(`idEntrada: ${idEntrada}`);
      if (!esGuidValido(idEntrada)) {
        toaster.create({
          type: 'error',
          title: 'Error',
          description: 'El código QR no es válido (no es un GUID)',
          duration: 5000,
          closable: true,
        });
        cuentaScanRef.current = 0;
        return;
      }
      alCerrarQr();
      // Buscar la entrada en la lista
      const entrada = entradas?.find(e => e.id === idEntrada);
      if (entrada) {
        toaster.create({
          type: 'success',
          title: 'Entrada válida',
          description: `Entrada de ${entrada.nombre_comprador} escaneada correctamente`,
          duration: 5000,
          closable: true,
        });
        alSeleccionarEntrada(entrada);
      } else {
        toaster.create({
          type: 'warning',
          title: 'Entrada no encontrada',
          description: 'La entrada escaneada no está en la base de datos',
          duration: 5000,
          closable: true,
        });
      }
    } catch (error) {
      console.error('Error al procesar el código QR:', error);
      toaster.create({
        type: 'error',
        title: 'Error',
        description: 'El código QR no es válido o está dañado',
        duration: 5000,
        closable: true,
      });
    } finally {
      // Resetear el contador después de un tiempo para permitir nuevos escaneos
      setTimeout(() => {
        cuentaScanRef.current = 0;
      }, 3000);
    }
  }, [entradas, alCerrarQr, alSeleccionarEntrada]);

  return (
    <Flex direction="column" gap={4}>
      <Button size="lg" onClick={alEscanear} variant="solid">
        <FiCamera />
        Escanear QR
      </Button>
      <QrScanner
        estaAbierto={qrAbierto && entradas !== undefined}
        alCerrar={alCerrarQr}
        alScanear={alScanearQr}
      />

      <Flex gap={2} flex={1}>
        <FiltroConLupita
          texto={filtroTexto}
          setTexto={setFiltroTexto}
          placeholder="Buscar comprador o alumno"
        />
        <Button onClick={() => setUsarFiltros(!usarFiltros)} variant="subtle">
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
              funcion={funcion}
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
        <Heading size="md" mb={3}>{entradasFiltradas.length} Resultados</Heading>
        
        {cargandoEntradas ? (
          <Flex flex="1" align="center" justify="center">
            <Spinner size="xl" color="blue.500" />
          </Flex>
        ) : (
          <Flex direction="column" gap={3} overflowY="auto" flex="1">
          {entradasFiltradas.map((entrada) => (
            <Button
              key={entrada.id}
              p={2}
              borderRadius="xl"
              justifyContent="flex-start"
              textAlign="left"
              w="full"
              h="fit"
              variant="subtle"
              onClick={() => alSeleccionarEntrada(entrada)}
            >
              <Flex direction="column" gap={1} w="full" alignItems="stretch" flex="max-content">
                <Flex direction="row" wrap="wrap" justify="space-between" gap={1} flexBasis="1">
                    <Text fontSize="xs">Comprador:</Text>
                    <Text fontWeight="bold">{entrada.nombre_comprador}</Text>
                    <Spacer />
                    <Badge colorPalette={darColorEstado(entrada.compradas, entrada.usadas)}>
                      {darEstado(entrada.compradas, entrada.usadas)}
                    </Badge>
                    <Text fontSize="xs" color={{ base: "gray.500", _dark: "gray.400" }}>
                      {entrada.usadas < 1 ? <></>
                      : <>{entrada.usadas} usada{entrada.usadas !== 1 ? 's' : ''} de </>
                      }
                      {entrada.compradas} comprada{entrada.compradas !== 1 ? 's' : ''}
                    </Text>
                </Flex>
                <Flex direction="row" wrap="wrap" justify="space-between" gap={1} flexBasis="1">
                  <Text fontSize="xs">Alumno:</Text>
                  <Text fontSize="sm">{entrada.nombre_alumno}</Text>
                  <Spacer />
                  <Text fontSize="xs">Grupo:</Text>
                  <Text fontSize="xs" fontWeight="bold">{entrada.nombre_grupo}</Text>
                </Flex>
              </Flex>
            </Button>
          ))}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
