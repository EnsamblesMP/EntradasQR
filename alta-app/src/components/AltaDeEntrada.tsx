import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  Heading,
  VStack,
  Input,
  NumberInput,
  Field,
  Alert,
  Image,
} from '@chakra-ui/react';
import { toaster } from '../chakra/toaster';
import { supabase } from '../supabase/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import GrupoSelect from './GrupoSelect';
import AlumnoSelect from './AlumnoSelect';

const AltaDeEntrada: React.FC = () => {
  // State for form fields
  const [nombreComprador, setNombreComprador] = useState('');
  const [emailComprador, setEmailComprador] = useState(''); 
  const [idGrupo, setIdGrupo] = useState<string | null>(null);
  const [idAlumno, setIdAlumno] = useState<number | null>(null);
  const [cantidad, setCantidad] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [idEntradaGenerada, setIdEntradaGenerada] = useState<string | null>(null);

  // Validar si los campos obligatorios están completos
  const isFormValid = Boolean(
    nombreComprador !== '' &&
    idGrupo !== null &&
    idAlumno !== null && 
    cantidad >= 1
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setMensaje('❌ Por favor, completa todos los campos obligatorios.');
      return;
    }

    setIsLoading(true);
    setMensaje('Guardando entrada...');
    
    try {
      // Generar un nuevo UUID para la entrada
      const id = uuidv4();
      
      // Insertar en la tabla 'entradas' de Supabase
      const { data, error } = await supabase
        .from('entradas')
        .insert([{
          id,
          nombre_comprador: nombreComprador.trim(),
          email_comprador: emailComprador.trim().toLowerCase(),
          cantidad: cantidad,
          id_alumno: idAlumno,
        }])
        .select();

      if (error) throw error;
      
      setIdEntradaGenerada(id);
      setMensaje(`✅ Entrada registrada exitosamente con ID: ${id}`);
      
      toaster.create({
        title: 'Entrada generada',
        description: 'La entrada se ha generado correctamente.',
        type: 'success',
      });
      
    } catch (error) {
      console.error('Error al guardar la entrada:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setMensaje(`❌ Error al guardar: ${errorMessage}`);
      toaster.create({
        title: 'Error',
        description: 'Ocurrió un error al generar la entrada.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (idEntradaGenerada) {
    const qrGenerado = `https://freeqr.com/api/v1/?data=${idEntradaGenerada}&size=300x300&color=000&bgcolor=3cc`;
    const subject = encodeURIComponent("Entrada para muestra de Ensables MP");
    const body = encodeURIComponent(
      `Hola ${nombreComprador}<br>Presentar el QR de esta entrada en la entrada del ensable<br>` +
      `(cantidad de entradas adquiridas: ${cantidad})<br><br>` +
      `<img src="${qrGenerado}" alt="QR" />`
    );
    const mailToHref = `mailto:${emailComprador}?subject=${subject}&body=${body}`;

    const handleCloseQr = () => {
      setIdEntradaGenerada(null);
      setMensaje('');
      // Limpiar el formulario
      setNombreComprador('');
      setEmailComprador('');
      setIdGrupo(null);
      setIdAlumno(null);
      setCantidad(1);
    };

    return (
      <VStack>
        <Text mb={4} fontSize="lg" fontWeight="medium" p="5">
          {mensaje}
        </Text>
        <Image
          src={qrGenerado}
          alt="Código QR de la entrada"
          mx="auto"
          borderWidth="1px"
          borderColor="gray.200"
          rounded="md"
          mb="4"
          display="block"
        />
        <VStack gap="4">
          <Button asChild colorPalette="blue" w="full">
            <a href={mailToHref}>Abrir en cliente de correo</a>
          </Button>

          <Button 
            colorPalette="gray" 
            w="full"
            onClick={handleCloseQr}
          >
            Generar otra entrada
          </Button>
        </VStack>
      </VStack>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Alta de entrada
      </Heading>
      
      <VStack gap="6">
        <Field.Root required>
          <Field.Label>Nombre del comprador</Field.Label>
          <Input
            placeholder="Nombre completo"
            value={nombreComprador}
            onChange={(e) => setNombreComprador(e.target.value)}
            size="lg"
          />
        </Field.Root>
        
        <Field.Root>
          <Field.Label>Correo electrónico (opcional)</Field.Label>
          <Input
            type="email"
            placeholder="email@ejemplo.com"
            value={emailComprador}
            onChange={(e) => setEmailComprador(e.target.value)}
            size="lg"
          />
        </Field.Root>
        
        <GrupoSelect value={idGrupo} onChange={setIdGrupo} required/>
        <AlumnoSelect value={idAlumno} onChange={setIdAlumno} idGrupo={idGrupo} required/>
        
        <Field.Root required>
          <Field.Label>Cantidad de entradas</Field.Label>
          <NumberInput.Root
            min={1}
            value={cantidad.toString()}
            onValueChange={({ value }) => setCantidad(Number(value) || 0)}
            size="lg"
            w="100%"
          >
            <NumberInput.Scrubber />
            <NumberInput.Input />
            <NumberInput.Control>
              <NumberInput.IncrementTrigger />
              <NumberInput.DecrementTrigger />
            </NumberInput.Control>
          </NumberInput.Root>
        </Field.Root>
        
        <Button 
          type="submit" 
          colorPalette="blue" 
          size="lg" 
          w="full"
          mt={4}
          loading={isLoading}
          loadingText="Generando..."
          disabled={!isFormValid || isLoading}
        >
          Generar entrada
        </Button>
        
        {mensaje && (
          <Alert.Root rounded="md" w="full">
            <Alert.Indicator />
            <Alert.Title>{mensaje.includes('❌') ? 'Error' : ''}</Alert.Title>
            <Alert.Description>{mensaje}</Alert.Description>
          </Alert.Root>
        )}
      </VStack>
    </form>
  );
};

export default AltaDeEntrada;
