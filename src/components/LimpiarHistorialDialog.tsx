import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  Input,
  ButtonGroup,
  Flex,
  Text,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { toaster } from '../chakra/toaster';
import { useHistorialCambiosCantidad, useEliminarHistorialAntiguo } from '../queries/useHistorialCambios';

interface LimpiarHistorialDialogProps {
  estaAbierto: boolean;
  alCerrar: () => void;
}

type RangoTiempo = 'personalizado' | '7d' | '48h' | '24h' | 'ahora';

export const LimpiarHistorialDialog = ({ estaAbierto, alCerrar }: LimpiarHistorialDialogProps) => {
  const [ahora, setAhora] = useState<Date>(new Date());
  const [rangoSeleccionado, setRangoSeleccionado] = useState<RangoTiempo>('7d');
  const [fechaPersonalizada, setFechaPersonalizada] = useState<string>('');
  const [horaPersonalizada, setHoraPersonalizada] = useState<string>('00:00');
  const [estaEliminando, setEstaEliminando] = useState(false);
  const { mutate: eliminarHistorial } = useEliminarHistorialAntiguo();

  // Inicializar fecha personalizada
  useEffect(() => {
    if (estaAbierto) {
      setAhora(new Date());
      setFechaPersonalizada(ahora.toISOString().split('T')[0]);
      setHoraPersonalizada('00:00');
      setRangoSeleccionado('7d');
      setEstaEliminando(false);
    }
  }, [estaAbierto]);

  // Obtener la fecha límite según la selección
  const obtenerFechaLimite = (): Date => {
    const resultado = new Date(ahora);
    
    switch (rangoSeleccionado) {
      case 'personalizado':
        if (fechaPersonalizada && horaPersonalizada) {
          const [horas, minutos] = horaPersonalizada.split(':').map(Number);
          const fecha = new Date(fechaPersonalizada);
          fecha.setHours(horas, minutos, 0, 0);
          return fecha;
        }
        break;
      case '7d':
        resultado.setDate(ahora.getDate() - 7);
        break;
      case '48h':
        resultado.setHours(ahora.getHours() - 48);
        break;
      case '24h':
        resultado.setHours(ahora.getHours() - 24);
        break;
      case 'ahora':
        // Usar la fecha y hora actual
        break;
    }
    
    return resultado;
  };

  const fechaLimite = obtenerFechaLimite();

  // Obtener la cantidad de registros que serán eliminados
  const { data: cantidadRegistros, isLoading: cargando } = useHistorialCambiosCantidad(fechaLimite);

  const alConfirmar = async () => {
    try {
      setEstaEliminando(true);
      await new Promise<void>((resolver, rechazar) => {
        eliminarHistorial(
          { fechaLimite },
          {
            onSuccess: () => resolver(),
            onError: (error) => rechazar(error),
          }
        );
      });
      
      alCerrar();
      toaster.create({
        title: 'Limpieza completada',
        description: `Se eliminaron los registros anteriores al ${formatearFecha(fechaLimite)}.`,
        type: 'success',
        duration: 5000,
      });
    } catch (error) {
      toaster.create({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Ocurrió un error al limpiar el historial',
        type: 'error',
        duration: 5000,
      });
    } finally {
      setEstaEliminando(false);
    }
  };

  // Formatear fecha para mostrar en la interfaz
  const formatearFecha = (fecha: Date): string => {
    return fecha.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog.Root open={estaAbierto} onOpenChange={(abierto) => !abierto && alCerrar()} lazyMount>
      <Dialog.Positioner>
        <Dialog.Content maxW="sm">
          <Dialog.CloseTrigger />
          <Dialog.Header>
            <Dialog.Title>Limpiar historial</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body pb={4}>
            <Dialog.Description mb={4}>
              Seleccionar desde cuándo eliminar los registros del historial.
            </Dialog.Description>
            <RadioGroup.Root 
              value={rangoSeleccionado} 
              onValueChange={(details) => setRangoSeleccionado(details.value as RangoTiempo)}
              colorPalette="green"
              variant="outline"
            >
              <Stack gap={3}>
                
                <RadioGroup.Item value="7d">
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>Registros anteriores a 7 días</RadioGroup.ItemText>
                </RadioGroup.Item>

                <RadioGroup.Item value="48h">
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>Registros anteriores a las últimas 48 horas</RadioGroup.ItemText>
                </RadioGroup.Item>

                <RadioGroup.Item value="24h">
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>Registros anteriores a las últimas 24 horas</RadioGroup.ItemText>
                </RadioGroup.Item>

                <RadioGroup.Item value="personalizado">
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>Borrar registros anteriores a fecha y hora exacta...</RadioGroup.ItemText>
                </RadioGroup.Item>
                {rangoSeleccionado === 'personalizado' && (
                  <Stack gap={2} ml={8}>
                    <Flex gap={2} align="center">
                      <Input
                        type="date"
                        value={fechaPersonalizada}
                        onChange={(e) => setFechaPersonalizada(e.target.value)}
                        size="sm"
                        w="auto"
                      />
                      <Input
                        type="time"
                        value={horaPersonalizada}
                        onChange={(e) => setHoraPersonalizada(e.target.value)}
                        size="sm"
                        w="auto"
                      />
                    </Flex>
                  </Stack>
                )}

                <RadioGroup.Item value="ahora">
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>Ahora (borrar todos los registros)</RadioGroup.ItemText>
                </RadioGroup.Item>

              </Stack>
            </RadioGroup.Root>

            <Text mt={6} fontSize="sm" color="fg.muted" fontStyle="italic">
              Solo se eliminarán los registros anteriores a la fecha seleccionada.
            </Text>
            {!cargando && (
              <Text fontSize="sm" color="fg.subtle" mt={2} fontWeight="medium">
                {cantidadRegistros} registros (según selección actual)
              </Text>
            )}
          </Dialog.Body>

          <Dialog.Footer>
            <ButtonGroup gap={3} w="full" justifyContent="flex-end">
              <Button 
                variant="outline" 
                onClick={alCerrar} 
                disabled={estaEliminando}
                size="md"
              >
                Cancelar
              </Button>
              <Button
                colorPalette="red"
                onClick={alConfirmar}
                loading={estaEliminando}
                loadingText="Eliminando..."
                disabled={cargando || (rangoSeleccionado === 'personalizado' && (!fechaPersonalizada || !horaPersonalizada))}
                size="md"
              >
                Borrar registros
              </Button>
            </ButtonGroup>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
