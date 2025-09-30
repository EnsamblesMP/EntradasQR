import { useEmailTemplate, useUpdateEmailTemplate } from '../queries/useEmailTemplate';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import {
  Button,
  Flex,
  Field,
  Input,
  Textarea,
  Spinner,
  Text,
  VStack,
  Box,
  Tabs,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { toaster } from '../chakra/toaster';
import { useNavigate } from 'react-router-dom';
import type { FC } from 'react';

export const EditarEmailEntradaGenerada: FC = () => {
  const [asunto, setAsunto] = useState('');
  const [contenido, setContenido] = useState('');
  const navigate = useNavigate();
  const {
    data: template,
    isLoading: cargando,
    error: errorTemplate,
  } = useEmailTemplate();
  const {
    mutateAsync: actualizarTemplate,
    isPending: actualizandoTemplate,
    error: errorActualizarTemplate,
  } = useUpdateEmailTemplate();
  
  useEffect(() => {
    if (errorActualizarTemplate) {
      toaster.create({
        title: 'Error',
        description: 'No se pudo actualizar la plantilla del email.',
        type: 'error',
      });
    }
  }, [errorActualizarTemplate]);

  useEffect(() => {
    if (template) {
      setAsunto(template.asunto);
      setContenido(template.contenido);
    } else {
      setAsunto('');
      setContenido('');
    }
  }, [template]);

  if (cargando) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (!template || errorTemplate) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Text fontSize="lg" fontWeight="medium" textAlign="center">
          ERROR: No se pudo cargar la plantilla del email.
        </Text>
        <Text fontSize="md" textAlign="center">
          {errorTemplate?.message}
        </Text>
      </Flex>
    );
  }

  const variables = [
    '[nombre_comprador]',
    '[cantidad_comprada]',
    '[nombre_alumno]',
    '[nombre_grupo]',
    '[funcion]',
    '[codigo_qr]',
  ];

  const volverAPaginaAnterior = () => {
    navigate(-1);
  };

  const alGuardar = () => {
    actualizarTemplate({
      contenido,
      asunto,
    });
    volverAPaginaAnterior();
  };

  const fechaUltimaModificacion = template.updated_at ? new Date(template.updated_at) : null;

  return (
    <VStack gap="6" w="full">
      <Text fontSize="lg" fontWeight="medium" textAlign="center">
        Editar plantilla del email de entrada generada
      </Text>
      
      {fechaUltimaModificacion && (
        <Text w="full" fontSize="xs">
          Ultima vez modificado: {fechaUltimaModificacion.toLocaleString()}
        </Text>
      )}

      <Field.Root required>
        <Field.Label>Asunto <Field.RequiredIndicator /></Field.Label>
        <Input
          placeholder="Asunto del email"
          value={asunto}
          onChange={(e) => setAsunto(e.target.value)}
          size="lg"
        />
      </Field.Root>

      <Field.Root required w="full">
        <Field.Label>Contenido <Field.RequiredIndicator /></Field.Label>
        
      <Box w="full" p={3} borderRadius="md">
        <Text fontSize="sm" fontWeight="medium" mb={2}>
          Variables disponibles:
        </Text>
        <Flex gap="2" wrap="wrap">
          {variables.map((variable) => (
            <Text
              key={variable}
              fontSize="xs"
              fontWeight="medium"
              px={2}
              py={1}
              bg="blue.400"
              borderRadius="sm"
            >
              {variable}
            </Text>
          ))}
        </Flex>
        <Text fontSize="xs" mt={2}>
          Se puede usar sintaxis Markdown{' '}
          <a href="https://commonmark.org/help/" target="_blank" rel="noopener noreferrer" style={{
            color: '#3182ce', 
            textDecoration: 'underline'
          }}>
            CommonMark
          </a> (**negrita**, *cursiva*, etc.)
        </Text>
      </Box>

        <Tabs.Root defaultValue="editar" w="full">
          <Tabs.List>
            <Tabs.Trigger value="editar">Editar</Tabs.Trigger>
            <Tabs.Trigger value="preview">Vista previa</Tabs.Trigger>
          </Tabs.List>
          
          <Tabs.Content value="editar" pt={3}>
            <Textarea
              placeholder="Contenido del email en formato Markdown"
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              size="lg"
              minH="300px"
              fontFamily="monospace"
            />
          </Tabs.Content>
          
          <Tabs.Content value="preview" pt={3}>
            <Box
              p={4}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              minH="300px"
              backgroundColor="white"
            >
              <MarkdownRenderer contenido={contenido} />
            </Box>
          </Tabs.Content>
        </Tabs.Root>
      </Field.Root>

      <Flex direction="row" gap={3} mt={4} w="full">
        <Button
          variant="solid"
          size="lg"
          flex={1}
          onClick={alGuardar}
          disabled={actualizandoTemplate}
        >
          Guardar
        </Button>
        <Button
          variant="subtle"
          size="lg"
          flex={1}
          onClick={volverAPaginaAnterior}
        >
          Cancelar
        </Button>
      </Flex>
    </VStack>
  );
};

export default EditarEmailEntradaGenerada;
