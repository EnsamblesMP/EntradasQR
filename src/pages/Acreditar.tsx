import { useParams, useNavigate } from 'react-router-dom';
import {
  esGuidValido,
  calcularRestantes,
  darColorEstado,
  darEstado,
} from '../components/EntradaFunc';
import {
  Badge,
  Box,
  Button,
  Card,
  Field,
  Flex,
  GridItem,
  Heading,
  HStack,
  Icon,
  NumberInput,
  SimpleGrid,
  Spacer,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiUsers,
} from 'react-icons/fi';
import { toaster } from '../chakra/toaster';
import { useEntradaPorId, useUsarEntrada } from '../queries/useEntradas';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

interface NumberInputValue {
    value: string;
    valueAsNumber: number;
}

const Acreditar = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: entrada, isLoading: cargando, error: errorCargarEntrada } = useEntradaPorId(id);
  const [cantidadAUsar, setCantidadAUsar] = useState<NumberInputValue | null>(null);
  const { mutateAsync: usarEntrada, isPending: guardando, error: errorUsarEntrada } = useUsarEntrada();

  useEffect(() => {
    if (entrada) {
      const cantidadRestantes = calcularRestantes(entrada.compradas, entrada.usadas);
      const disponibles = Math.max(cantidadRestantes, 0);

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCantidadAUsar({
        value: disponibles.toString(),
        valueAsNumber: disponibles
      });
    }
  }, [entrada]);

  useEffect(() => {
    if (errorCargarEntrada || errorUsarEntrada) {
      console.error(errorUsarEntrada || errorCargarEntrada);
      toaster.create({
        type: 'error',
        title: 'Error',
        description: errorUsarEntrada
          ? 'Error al acreditar la entrada. Por favor, intente nuevamente.'
          : 'Error al cargar la entrada. Por favor, intente nuevamente.'
      });
    }
  }, [errorCargarEntrada, errorUsarEntrada]);

  if (cargando) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (!entrada) {
    return (
      <Box textAlign="center" py={10} px={6}>
        <Heading as="h2" size="lg" color="red.500" mb={4}>
          {!id || !esGuidValido(id) ? 'ID de entrada inválido' : 'Entrada no encontrada'}
        </Heading>
        <Text>Por favor, verifica el enlace o intenta nuevamente.</Text>
      </Box>
    );
  }

  const handleSubmit = async (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!cantidadAUsar || cantidadAUsar.value === '') {
      toaster.create({
        type: 'error',
        title: 'Error',
        description: 'Por favor ingrese una cantidad válida'
      });
      return;
    }

    if (!entrada) return;

    await usarEntrada({
      entradaId: entrada.id,
      cantidad: cantidadAUsar.valueAsNumber,
    });

    toaster.create({
      type: 'success',
      title: 'Éxito',
      description: `Se acreditaron ${cantidadAUsar.valueAsNumber} entrada(s) correctamente`
    });
    
    navigate(-1);
  };

  if (!entrada) return null;
  
  const badgeColor = darColorEstado(entrada.compradas, entrada.usadas);
  const cantidadRestantes = calcularRestantes(entrada.compradas, entrada.usadas);

  return (
    <Card.Root>
      <Card.Header pb={0}>
        <Flex align="base" justify="space-between" flexWrap="wrap" gap={2}>
          <Heading as="h1" size="xl" color="brand.700">
            Acreditar Entrada
          </Heading>
          <Badge
            colorPalette={badgeColor}
            borderRadius="full"
            fontSize="xs"
          >
            {darEstado(entrada.compradas, entrada.usadas)}
          </Badge>
        </Flex>
      </Card.Header>

      <Card.Body>
        <VStack gap={2} alignItems="stretch" mb="3">
          <Box>
            <Text fontSize="xs" color="gray.500" mb={1}>Comprador</Text>
            <HStack>
              <Icon as={FiUser} color="brand.500" />
              <Text fontWeight="medium">{entrada.nombre_comprador}</Text>
            </HStack>
          </Box>

          <Box>
            <Text fontSize="xs" color="gray.500" mb={1}>Alumno</Text>
            <HStack>
              <Icon as={FiUser} color="brand.500" />
              <Text>{entrada.nombre_alumno || 'No especificado'}</Text>
            </HStack>
          </Box>
        </VStack>
        <SimpleGrid columns={8} gap={3} templateColumns="repeat(8, 1fr)">
          <GridItem colSpan={5}>
            <Text fontSize="xs" color="gray.500" mb={1}>Grupo</Text>
            <HStack>
              <Icon as={FiUsers} color="brand.500" />
              <Text>{entrada.nombre_grupo || 'No especificado'}</Text>
            </HStack>
          </GridItem>

          <GridItem colSpan={3}>
            <Text fontSize="xs" color="gray.500" mb={1}>Fecha de compra</Text>
            <HStack>
              <Icon as={FiCalendar} color="brand.500" />
              <Text>{new Date(entrada.creada).toLocaleDateString()}</Text>
            </HStack>
          </GridItem>
          
          <GridItem colSpan={5}>
            <Text fontSize="xs" color="gray.500" mb={1}>Email</Text>
            <HStack>
              <Icon as={FiMail} color="brand.500" />
              <Text fontSize="xs">{entrada.email_comprador}</Text>
            </HStack>
          </GridItem>

          <GridItem colSpan={3} bg={{ base: "gray.100", _dark: "gray.900" }} p={1} borderRadius="md">
            <Flex columns={2} gap={1}>
              <Box>
                <Text fontSize="2xs" color="gray.500">Compradas</Text>
                <Text fontSize="2xl" fontWeight="bold" color="brand.700">
                  {entrada.compradas}
                </Text>
              </Box>
              <Spacer />
              <Box>
                <Text fontSize="2xs" color="gray.500">Usadas</Text>
                <Text fontSize="2xl" fontWeight="bold" color={entrada.usadas > 0 ? 'orange.500' : 'gray.500'}>
                  {entrada.usadas}
                </Text>
              </Box>
            </Flex>
          </GridItem>
        </SimpleGrid>
        
        <VStack
          as="form"
          onSubmit={handleSubmit}
          align="stretch"
          bg={{ base: "brand.50", _dark: "brand.900" }}
          gap={2}
          my="2"
          p={2}
          borderRadius="md"
        >
          <Field.Root>
            <Field.Label w="full">
              <Flex gap={2} w="full" justifyContent="space-between">
                <Text>Entradas a usar ahora: <Field.RequiredIndicator /></Text>
                <Text fontSize="sm" fontWeight="semibold" color={{
                  base: cantidadRestantes > 0 ? 'brand.600' : 'red.500',
                  _dark: cantidadRestantes > 0 ? 'brand.300' : 'red.400'
                }}>
                  ({cantidadRestantes} disponible{cantidadRestantes !== 1 ? 's' : ''})
                </Text>
              </Flex>
            </Field.Label>
            <NumberInput.Root
              value={cantidadAUsar?.value}
              onValueChange={setCantidadAUsar}
              size="lg"
              w="full"
              variant="outline"
              borderWidth="1px"
              borderColor="brand.500"
              borderRadius="sm"
              bg={{ base: "white", _dark: "gray.900" }}
            >
              <NumberInput.Input />
              <NumberInput.Control>
                <NumberInput.IncrementTrigger />
                <NumberInput.DecrementTrigger />
              </NumberInput.Control>
            </NumberInput.Root>
          </Field.Root>

          <Flex gap={2} align="stretch">
            <Button
              type="submit"
              variant="solid"
              colorPalette="green"
              size="md"
              flex="1"
              loading={guardando}
              loadingText="Acreditando..."
            >
              Acreditar
            </Button>
            <Button
              onClick={() => navigate(-1)}
              flex="1"
              variant="subtle"
              size="md"
              loading={guardando}
            >
              Cancelar
            </Button>
          </Flex>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};

export default Acreditar;