import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Button,
  Field,
  HStack,
  Select,
  Skeleton,
  SelectValueChangeDetails,
  createListCollection,
} from '@chakra-ui/react';
import { supabase } from '../supabase/supabaseClient';

interface Funcion {
  nombre_funcion: string;
}

interface FuncionSelectProps extends Omit<React.ComponentProps<typeof Select.Root>, 'children' | 'collection' | 'onChange' | 'value'> {
  anio: number;
  value: string | null;
  onChange: (value: string | null) => void;
  required?: boolean;
}

const FuncionSelect = ({
  anio,
  value,
  onChange,
  required = false,
  ...props
}: FuncionSelectProps) => {
  const [funciones, setFunciones] = useState<Funcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const obtenFunciones = useCallback(async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('funciones')
          .select('nombre_funcion')
          .eq('year', anio)
          
          .order('orden', { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
          onChange(null);
        }

        setFunciones(data as Funcion[]);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando funciones');
        console.error('Error cargando funciones:', err);
      } finally {
        setLoading(false);
      }
    }, [anio, onChange]);

  useEffect(() => {
    obtenFunciones();
  }, [obtenFunciones, anio]);

  const collection = useMemo(() => createListCollection({
    items: funciones,
    itemToString: (item) => item.nombre_funcion,
    itemToValue: (item) => item.nombre_funcion,
  }), [funciones]);

  const handleRetry = () => {
    setError(null);
    obtenFunciones();
  };

  const handleValueChange = (details: SelectValueChangeDetails<Funcion>) => {
    onChange(details.value.length > 0 ? details.value[0] : null);
  }

  const values = value !== null ? [value] : [];

  return (
    <Field.Root required={required} invalid={!!error}>
      <Skeleton loading={loading || error !== null}>
        <Select.Root
          collection={collection}
          onValueChange={handleValueChange}
          value={values}
          positioning={{ strategy: 'fixed', sameWidth: true, placement: "bottom" }}
          w="fit-content"
          minW="180px"
          {...props}
        >
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder={
                collection.size === 0
                  ? "No hay funciones"
                  : "Seleccionar funcion"
              } />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.ClearTrigger />
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Select.Positioner>
            <Select.Content>
              {collection.items.map((funcion) => (
                <Select.Item key={funcion.nombre_funcion} item={funcion}>
                  {funcion.nombre_funcion}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      </Skeleton>
      {error && (
        <HStack>
          <Field.ErrorText>{error}</Field.ErrorText>
          <Button size="sm" onClick={handleRetry} variant="ghost">
            Reintentar
          </Button>
        </HStack>
      )}
    </Field.Root>
  );
};

export default FuncionSelect;
