import { useParams, useNavigate } from 'react-router-dom';
import { ButtonLink } from '../router/ButtonLink';
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
import { supabase } from '../supabase/supabaseClient';
import { toaster } from '../chakra/toaster';
import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';

interface NumberInputValue {
    value: string;
    valueAsNumber: number;
}

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

const Acreditar = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [entrada, setEntrada] = useState<Entrada | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cantidadAUsar, setCantidadAUsar] = useState<NumberInputValue | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEntrada = useCallback(async () => {
    try {
      if (!id || !esGuidValido(id)) {
        return;
      }

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
            alumno_nombre:nombre,
            ...grupos!inner(
              grupo:nombre_corto,
              anio_grupo:year
            )
          )
        `)
        .eq('id', id)
        .single();

      if (queryError) throw queryError;

      setEntrada(data);

      const cantidadRestantes = calcularRestantes(data.cantidad, data.cantidad_usada);
      const disponibles = Math.max(cantidadRestantes, 0);

      setCantidadAUsar({
        value: disponibles.toString(),
        valueAsNumber: disponibles
      });

    } catch (err) {
      console.error('Error al cargar la entrada:', err);
      toaster.create({
        type: 'error',
        title: 'Error',
        description: 'No se pudo cargar la entrada. Por favor, intente nuevamente.',
        duration: 5000,
        closable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEntrada();
  }, [fetchEntrada]);

  if (isLoading) {
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

  const cantidadRestantes = calcularRestantes(entrada.cantidad, entrada.cantidad_usada);

  const handleSubmit = async (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!cantidadAUsar || cantidadAUsar.value === '') {
      toaster.create({
        title: 'Error',
        description: 'Por favor ingrese una cantidad válida',
        type: 'error',
        duration: 5000,
        closable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.rpc('usar_entradas_rpc', {
        p_cantidad_a_usar: cantidadAUsar.valueAsNumber,
        p_entrada_id: entrada.id,
      });

      if (error) throw error;

      toaster.create({
        title: 'Éxito',
        description: `Se acreditaron ${cantidadAUsar.valueAsNumber} entrada(s) correctamente`,
        type: 'success',
        duration: 5000,
        closable: true,
      });
      
      navigate('/preacreditacion/')

    } catch (err) {
      console.error('Error al acreditar entradas:', err);
      toaster.create({
        title: 'Error',
        description: 'No se pudieron acreditar las entradas. Por favor, intente nuevamente.',
        type: 'error',
        duration: 5000,
        closable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const badgeColor = darColorEstado(entrada.cantidad, entrada.cantidad_usada);

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
            {darEstado(entrada.cantidad, entrada.cantidad_usada)}
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
              <Text>{entrada.alumno_nombre}</Text>
            </HStack>
          </Box>
        </VStack>
        <SimpleGrid columns={8} gap={3} templateColumns="repeat(8, 1fr)">
          <GridItem colSpan={5}>
            <Text fontSize="xs" color="gray.500" mb={1}>Grupo</Text>
            <HStack>
              <Icon as={FiUsers} color="brand.500" />
              <Text>{entrada.grupo} (Año {entrada.anio_grupo})</Text>
            </HStack>
          </GridItem>

          <GridItem colSpan={3}>
            <Text fontSize="xs" color="gray.500" mb={1}>Fecha de compra</Text>
            <HStack>
              <Icon as={FiCalendar} color="brand.500" />
              <Text>{new Date(entrada.created_at).toLocaleDateString('es-AR')}</Text>
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
                  {entrada.cantidad}
                </Text>
              </Box>
              <Spacer />
              <Box>
                <Text fontSize="2xs" color="gray.500">Usadas</Text>
                <Text fontSize="2xl" fontWeight="bold" color={entrada.cantidad_usada > 0 ? 'orange.500' : 'gray.500'}>
                  {entrada.cantidad_usada}
                </Text>
              </Box>
            </Flex>
          </GridItem>
        </SimpleGrid>
        
        <VStack
          as="form"
          onSubmit={handleSubmit}
          align="stretch"
          bg="brand.50"
          gap={2}
          my="2"
          p={2}
          borderRadius="md"
        >
          <Field.Root>
            <Field.Label>Entradas a usar ahora <Field.RequiredIndicator /></Field.Label>
            <NumberInput.Root
              value={cantidadAUsar?.value}
              onValueChange={setCantidadAUsar}
              size="lg"
              w="full"
              variant="outline"
              borderWidth="1px"
              borderColor="brand.500"
              borderRadius="sm"
              bg="white"
            >
              <NumberInput.Input />
              <NumberInput.Control>
                <NumberInput.IncrementTrigger />
                <NumberInput.DecrementTrigger />
              </NumberInput.Control>
            </NumberInput.Root>
            <Text fontSize="sm" color={cantidadRestantes > 0 ? 'green.600' : 'red.500'}>
              {cantidadRestantes} disponible{cantidadRestantes !== 1 ? 's' : ''}
            </Text>
          </Field.Root>

          <Flex gap={2} align="stretch">
            <Button
              type="submit"
              variant="solid"
              colorPalette="green"
              size="md"
              flex="1"
              loading={isSubmitting}
              loadingText="Acreditando..."
            >
              Acreditar
            </Button>
            
            <ButtonLink
              to="/preacreditacion"
              flex="1"
              variant="subtle"
              size="md"
              loading={isSubmitting}
            >
              Cancelar
            </ButtonLink>
          </Flex>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};

export default Acreditar;