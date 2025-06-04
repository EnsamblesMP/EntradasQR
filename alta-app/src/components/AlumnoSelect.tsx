import React, { useState, useEffect } from 'react';
import {
  Select,
  Skeleton,
  Field,
  ListCollection,
  createListCollection,
} from '@chakra-ui/react';
import { supabase } from '../supabase/supabaseClient';

interface Alumno {
  id: number;
  nombre: string;
}

interface AlumnoSelectProps {
  idGrupo: string | null;
  value: number | null;
  onChange: (value: number | null) => void;
  required?: boolean;
}

const AlumnoSelect = ({ idGrupo, value, onChange, required = false }: AlumnoSelectProps) => {
  const [alumnos, setAlumnos] = useState<ListCollection<Alumno>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (idGrupo === null) {
      onChange(null);
      return;
    }
    const obtenAlumnos = async () => {
      try {
        onChange(null);
        setLoading(true);
        const { data, error } = await supabase
          .from('alumnos')
          .select('id, nombre')
          .eq('grupo', idGrupo)
          .order('nombre', { ascending: true });
        
        if (error) throw error;
        
        const alumnosCollection = createListCollection({
          items: data,
          itemToString: (item) => item.nombre,
          itemToValue: (item) => String(item.id),
        });
        setAlumnos(alumnosCollection);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando alumnos');
        console.error('Error cargando alumnos:', err);
      } finally {
        setLoading(false);
      }
    };
    
    obtenAlumnos();
  }, [idGrupo]);

  return (
    <Field.Root required={required} invalid={!!error}>
      <Field.Label>Alumno <Field.RequiredIndicator /></Field.Label>
      <Skeleton loading={loading || idGrupo === null || error !== null || alumnos === undefined} w="full">
        <Select.Root
          collection={alumnos}
          value={value !== null ? [String(value)] : []}
          onValueChange={o => onChange(o.value.length > 0 ? Number(o.value[0]) : null)}
          size="lg"
        >
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Seleccionar Alumno" />
            </Select.Trigger>
          </Select.Control>
          <Select.Positioner>
            <Select.Content>
              {alumnos?.items.map((alumno) => (
                <Select.Item key={alumno.id} item={alumno}>
                  {alumno.nombre}
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

export default AlumnoSelect;
