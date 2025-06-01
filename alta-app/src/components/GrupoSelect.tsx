import React, { useState, useEffect } from 'react';
import { 
  Select,
  Skeleton,
  Field,
  ListCollection,
  createListCollection,
} from '@chakra-ui/react';
import { supabase } from '../supabase/supabaseClient';

interface Grupo {
  id: string;
  nombre_corto: string;
  year: number;
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
  const [grupos, setGrupos] = useState<ListCollection<Grupo>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const obtenGrupos = async () => {
      try {
        onChange(null);
        setLoading(true);
        const { data, error } = await supabase
          .from('grupos')
          .select('id, nombre_corto, year')
          .eq('year', getCurrentYear())
          .order('id', { ascending: true });
        
        if (error) throw error;
        
        const gruposCollection = createListCollection({
          items: data,
          itemToString: (item) => item.id,
          itemToValue: (item) => item.id,
        });
        setGrupos(gruposCollection);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando grupos');
        console.error('Error cargando grupos:', err);
      } finally {
        setLoading(false);
      }
    };
    
    obtenGrupos();
  }, []);
  
  return (
    <Field.Root required={required} invalid={!!error}>
      <Field.Label>Grupo</Field.Label>
      <Skeleton loading={loading || error !== null || grupos === undefined} w="full">
        <Select.Root
          collection={grupos}
          value={value !== null ? [value] : []}
          onValueChange={o => onChange(o.value.length > 0 ? o.value[0] : null)}
          size="lg"
        >
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Seleccionar Grupo" />
            </Select.Trigger>
          </Select.Control>
          <Select.Positioner>
            <Select.Content>
              {grupos?.items.map((grupo) => (
                <Select.Item key={grupo.id} item={grupo}>
                  {grupo.id}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      </Skeleton>
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
    </Field.Root>
  );
};

export default GrupoSelect;
