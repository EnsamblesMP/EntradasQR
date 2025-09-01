import { ChangeEvent, useCallback } from 'react';
import {
  Field,
  Input,
  NumberInput,
  VStack,
} from '@chakra-ui/react';
import GrupoSelect from './GrupoSelect';
import AlumnoSelect from './AlumnoSelect';
import type { Campos } from './Campos';
import type { FC } from 'react';

export interface CamposEntradaProps {
  campos: Campos;
  alCambiarCampos: (updates: Partial<Campos>) => void;
  disabled?: boolean;
}

const CamposEntrada: FC<CamposEntradaProps> = ({
  campos,
  alCambiarCampos,
  disabled = false,
}) => {

  const alCambiarNombre = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    alCambiarCampos({ nombreComprador: e.target.value });
  }, [alCambiarCampos]);

  const alCambiarEmail = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    alCambiarCampos({ emailComprador: e.target.value });
  }, [alCambiarCampos]);

  const alCambiarCantidad = useCallback((details: {valueAsNumber: number}) => {
    alCambiarCampos({ cantidad: details.valueAsNumber });
  }, [alCambiarCampos]);

  const alCambiarGrupo = useCallback((value: string | null) => {
    alCambiarCampos({ idGrupo: value, idAlumno: null });
  }, [alCambiarCampos]);

  const alCambiarAlumno = useCallback((value: number | null) => {
    alCambiarCampos({ idAlumno: value });
  }, [alCambiarCampos]);

  return (
    <VStack gap="6" w="full">

      <Field.Root required>
        <Field.Label>Nombre del comprador <Field.RequiredIndicator /></Field.Label>
        <Input
          placeholder="Nombre completo"
          value={campos.nombreComprador}
          onChange={alCambiarNombre}
          size="lg"
          disabled={disabled}
        />
      </Field.Root>

      <Field.Root>
        <Field.Label>Correo electrónico (opcional)</Field.Label>
        <Input
          type="email"
          placeholder="email@ejemplo.com"
          value={campos.emailComprador}
          onChange={alCambiarEmail}
          size="lg"
          disabled={disabled}
        />
      </Field.Root>

      <GrupoSelect
        value={campos.idGrupo}
        onChange={alCambiarGrupo}
        required
      />

      <AlumnoSelect
        value={campos.idAlumno}
        onChange={alCambiarAlumno}
        idGrupo={campos.idGrupo}
        required
      />

      <Field.Root required>
        <Field.Label>Cantidad de entradas <Field.RequiredIndicator /></Field.Label>
        <NumberInput.Root
          min={1}
          value={String(campos.cantidad)}
          onValueChange={alCambiarCantidad}
          size="lg"
          w="100%"
          disabled={disabled}
        >
          <NumberInput.Scrubber />
          <NumberInput.Input />
          <NumberInput.Control>
            <NumberInput.IncrementTrigger />
            <NumberInput.DecrementTrigger />
          </NumberInput.Control>
        </NumberInput.Root>
      </Field.Root>

    </VStack>
  );
};

export default CamposEntrada;
