import React from 'react';
import {
  Field,
  Input,
  NumberInput,
  VStack,
} from '@chakra-ui/react';
import GrupoSelect from './GrupoSelect';
import AlumnoSelect from './AlumnoSelect';
import type { Campos } from './Campos';

export interface CamposEntradaProps {
  campos: Campos;
  onChangeCampos: (updates: Partial<Campos>) => void;
  disabled?: boolean;
}

const CamposEntrada: React.FC<CamposEntradaProps> = ({
  campos,
  onChangeCampos,
  disabled = false,
}) => {
  return (
    <VStack gap="6" w="full">

      <Field.Root required>
        <Field.Label>Nombre del comprador <Field.RequiredIndicator /></Field.Label>
        <Input
          placeholder="Nombre completo"
          value={campos.nombreComprador}
          onChange={(e) => onChangeCampos({ nombreComprador: e.target.value })}
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
          onChange={(e) => onChangeCampos({ emailComprador: e.target.value })}
          size="lg"
          disabled={disabled}
        />
      </Field.Root>

      <GrupoSelect
        value={campos.idGrupo}
        onChange={(value) => onChangeCampos({ idGrupo: value, idAlumno: null })}
        required
      />

      <AlumnoSelect
        value={campos.idAlumno}
        onChange={(value) => onChangeCampos({ idAlumno: value })}
        idGrupo={campos.idGrupo}
        required
      />

      <Field.Root required>
        <Field.Label>Cantidad de entradas <Field.RequiredIndicator /></Field.Label>
        <NumberInput.Root
          min={1}
          value={String(campos.cantidad)}
          onValueChange={({ value }) => onChangeCampos({ cantidad: Number(value) || 0 })}
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
