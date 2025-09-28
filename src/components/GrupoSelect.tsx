import { Grupo, useGruposPorFuncion } from '../queries/useGrupos';
import {
  Field,
  HStack,
  Select,
  Skeleton,
  SelectValueChangeDetails,
  createListCollection,
} from '@chakra-ui/react';
import {
  useEffect,
  useMemo,
} from 'react';
import { useAnio } from '../supabase/anioUtils';

interface GrupoSelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
  funcion?: string;
  required?: boolean;
}

const GrupoSelect = ({
  value,
  onChange,
  funcion = undefined,
  required = false
}: GrupoSelectProps) => {
  const { anio } = useAnio();
  const {
    data: grupos,
    isLoading: loading,
    error: errorCarga,
  } = useGruposPorFuncion(funcion);
  
  useEffect(() => {
    if (!loading && (!grupos || grupos.length === 0)) {
      onChange(null);
    }
  }, [anio, onChange, grupos, loading]);

  const collection = useMemo(() => createListCollection({
    items: grupos || [],
    itemToString: (item) => item.nombre_grupo,
    itemToValue: (item) => item.id_grupo,
  }), [grupos]);

  const handleValueChange = (details: SelectValueChangeDetails<Grupo>) => {
    onChange(details.value.length > 0 ? details.value[0] : null);
  }

  const values = value !== null ? [value] : [];

  return (
    <Field.Root required={required} invalid={!!errorCarga}>
      <Field.Label>Grupo <Field.RequiredIndicator /></Field.Label>
      <Skeleton loading={loading || errorCarga !== null} w="full">
        <Select.Root
          collection={collection}
          onValueChange={handleValueChange}
          value={values}
          size="lg"
          positioning={{ strategy: 'fixed', sameWidth: true, placement: "bottom" }}
        >
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder={
                collection.size === 0
                  ? "No hay grupos disponibles en el año."
                  : "Seleccionar Grupo"
              } />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Select.Positioner>
            <Select.Content width="full">
              {collection.items.map((g) => (
                <Select.Item key={g.id_grupo} item={g}>
                  {g.nombre_grupo}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      </Skeleton>
      {errorCarga && (
        <HStack>
          <Field.ErrorText>{errorCarga?.message || 'Error al cargar grupos'}</Field.ErrorText>
        </HStack>
      )}
    </Field.Root>
  );
};

export default GrupoSelect;
