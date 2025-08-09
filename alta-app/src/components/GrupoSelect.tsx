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

interface Grupo {
  id: string;
  nombre_corto: string;
  year: number;
  orden: number;
}

interface GrupoSelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
  required?: boolean;
}

const getCurrentYear = () => {
  return new Date().getFullYear();
};

const GrupoSelect = ({ value, onChange, required = false }: GrupoSelectProps) => {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const obtenGrupos = useCallback(async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('grupos')
          .select('id, nombre_corto, year')
          .eq('year', getCurrentYear())
          .order('orden', { ascending: true });

        if (error) throw error;

        setGrupos(data as Grupo[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando grupos');
        console.error('Error cargando grupos:', err);
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    obtenGrupos();
  }, [obtenGrupos]);

  const collection = useMemo(() => createListCollection({
    items: grupos,
    itemToString: (item) => item.id,
    itemToValue: (item) => item.id,
  }), [grupos]);

  const handleRetry = () => {
    setError(null);
    obtenGrupos();
  };

  const handleValueChange = (details: SelectValueChangeDetails<Grupo>) => {
    onChange(details.value.length > 0 ? details.value[0] : null);
  }

  const values = value !== null ? [value] : [];

  return (
    <Field.Root required={required} invalid={!!error}>
      <Field.Label>Grupo <Field.RequiredIndicator /></Field.Label>
      <Skeleton loading={loading || error !== null} w="full">
        <Select.Root collection={collection} onValueChange={handleValueChange} value={values} size="lg">
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder={
                collection.size === 0
                  ? "No hay grupos disponibles en el año."
                  : "Seleccionar Grupo"
              } />
            </Select.Trigger>
          </Select.Control>
          <Select.Positioner>
            <Select.Content>
              {collection.items.map((grupo) => (
                <Select.Item key={grupo.id} item={grupo}>
                  {grupo.nombre_corto}
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

export default GrupoSelect;
