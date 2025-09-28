import { useFuncionesDelAnio } from '../queries/useFunciones';
import { useEffect, useMemo } from 'react';
import {
  Field,
  Select,
  Skeleton,
  SelectValueChangeDetails,
  createListCollection,
} from '@chakra-ui/react';
import type { ComponentProps } from 'react';

interface Funcion {
  nombre_funcion: string;
}

type FuncionSelectProps = Omit<ComponentProps<typeof Select.Root>, 'children' | 'collection' | 'onChange' | 'value'> & {
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
  const {
    data: funciones,
    isLoading: cargandoFunciones,
    error: funcionesError,
  } = useFuncionesDelAnio(anio);
  
    useEffect(() => {
      if (!cargandoFunciones && (!funciones || funciones.length === 0)) {
        onChange(null);
      }
    }, [anio, onChange, funciones, cargandoFunciones]);
  
  const collection = useMemo(() => createListCollection({
    items: funciones || [],
    itemToString: (item) => item.nombre_funcion,
    itemToValue: (item) => item.nombre_funcion,
  }), [funciones]);

  const handleValueChange = (details: SelectValueChangeDetails<Funcion>) => {
    onChange(details.value.length > 0 ? details.value[0] : null);
  }

  const values = value !== null ? [value] : [];

  return (
    <Field.Root required={required} invalid={!!funcionesError}>
      {!funcionesError && (
      <Skeleton loading={cargandoFunciones}>
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
      )}
      {funcionesError && (
        <Field.ErrorText>
          Error cargando funciones: {funcionesError.message ?? funcionesError.toString?.()}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
};

export default FuncionSelect;
