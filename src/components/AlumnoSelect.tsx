import { Alumno, useAlumnosPorGrupo } from '../queries/useAlumnos';
import { useEffect, useCallback } from 'react';
import {
  Select,
  Skeleton,
  Field,
  createListCollection,
} from '@chakra-ui/react';

interface AlumnoSelectProps {
  idGrupo: string | null;
  value: number | null;
  onChange: (value: number | null) => void;
  required?: boolean;
}

const AlumnoSelect = ({
  idGrupo: idGrupo,
  value,
  onChange,
  required = false
}: AlumnoSelectProps) => {
  const {
    data: alumnos,
    isLoading: loading,
    error: errorCarga,
  } = useAlumnosPorGrupo(idGrupo);
  
  const alumnosCollection = createListCollection({
    items: alumnos || [],
    itemToString: (item: Alumno) => item.nombre_alumno,
    itemToValue: (item: Alumno) => String(item.id_alumno),
  });

  const safeOnChange = useCallback((value: number | null) => {
    onChange(value);
  }, [onChange]);

  useEffect(() => {
    if (!idGrupo) {
      if (value !== null) {
        safeOnChange(null);
      }
      return;
    }
  }, [idGrupo, value, safeOnChange]);

  return (
    <Field.Root required={required} invalid={!!errorCarga}>
      <Field.Label>Alumno <Field.RequiredIndicator /></Field.Label>
      {idGrupo === null && (
        <Skeleton loading={idGrupo === null} w="full" variant="none" h="3rem"
          bg={{ base: "blackAlpha.100", _dark: "blackAlpha.400" }}/>)}
      {!errorCarga && !!idGrupo &&
        <Skeleton loading={loading} w="full">
          <Select.Root
            collection={alumnosCollection}
            value={value !== null ? [String(value)] : []}
            onValueChange={o => onChange(o.value.length > 0 ? Number(o.value[0]) : null)}
            size="lg"
            positioning={{ strategy: 'fixed', sameWidth: true, placement: "bottom" }}
          >
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder={
                  alumnosCollection.size === 0
                    ? "No hay alumnos para este grupo."
                    : "Seleccionar Alumno"
                } />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Select.Positioner>
              <Select.Content width="full">
                {alumnosCollection.items.map((alumno) => (
                  <Select.Item key={alumno.id_alumno} item={alumno}>
                    {alumno.nombre_alumno}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
        </Skeleton>
      }
      {errorCarga && <Field.ErrorText>{errorCarga?.message || 'Error cargando alumnos'}</Field.ErrorText>}
    </Field.Root>
  );
};

export default AlumnoSelect;
