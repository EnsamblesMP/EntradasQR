import React, { useState, useEffect } from 'react';
import { 
  Select,
  Skeleton,
  Field,
  createListCollection,
  ListCollection,
} from '@chakra-ui/react';
import { supabase } from '../supabase/supabaseClient';

interface Alumno {
  alumno_id: number;
  alumno_nombre: string;
}

interface AlumnoSelectProps {
  value: number | null;
  onChange: (value: number | null) => void;
  required?: boolean;
}

const getCurrentYear = () => {
  return new Date().getFullYear();
};

const AlumnoSelect = ({ value, onChange, required = false }: AlumnoSelectProps) => {
  const [alumnos, setAlumnos] = useState<ListCollection<Alumno>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const obtenAlumnos = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('alumnos_con_grupo')
          .select('alumno_id, alumno_nombre')
          .eq('grupo_year', getCurrentYear())
          .order('alumno_nombre', { ascending: true });
        
        if (error) throw error;
        
        const alumnosCollection = createListCollection({
          items: data,
          itemToString: (item) => item.alumno_nombre,
          itemToValue: (item) => item.alumno_id,
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
  }, []);
  
  if (loading) {
    return (
      <Field.Root required={required}>
        <Field.Label>Alumno</Field.Label>
        <Skeleton height="40px" borderRadius="md" />
      </Field.Root>
    );
  }

  if (error) {
    return (
      <Field.Root invalid>
        <Field.Label>Alumno</Field.Label>
        <Field.ErrorText>{error}</Field.ErrorText>
      </Field.Root>
    );
  }

  return (
    <Field.Root required={required} invalid={!!error}>
      <Field.Label>Alumno</Field.Label>
      {alumnos && (
        <Select.Root
          collection={alumnos}
          value={value !== null ? [value.toString()] : []}
          onValueChange={({ value: selectedValue }) => 
            onChange(selectedValue.length > 0 ? Number(selectedValue[0]) : null)
          }
          size="lg"
        >
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Seleccionar alumno" />
            </Select.Trigger>
          </Select.Control>
          <Select.Positioner>
            <Select.Content>
              {alumnos?.items.map((alumno) => (
                <Select.Item key={alumno.alumno_id} item={alumno}>
                  {alumno.alumno_nombre}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      )}
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
    </Field.Root>
  );
};

export default AlumnoSelect;
