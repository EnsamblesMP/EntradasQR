import { useReducer, useCallback } from 'react';

export type Campos = {
  nombreComprador: string;
  emailComprador: string;
  idGrupo: string | null;
  idAlumno: number | null;
  cantidad: number;
};

type FormAction =
  | { type: 'SET_CAMPOS'; payload: Partial<Campos> }
  | { type: 'RESET_CAMPOS' };

const initialFormState: Campos = {
  nombreComprador: '',
  emailComprador: '',
  idGrupo: null,
  idAlumno: null,
  cantidad: 1,
};

function reducer(state: Campos, action: FormAction): Campos {
  switch (action.type) {
    case 'SET_CAMPOS':
      return { ...state, ...action.payload };
    case 'RESET_CAMPOS':
      return { ...initialFormState };
    default:
      return state;
  }
}

function sonValidos(campos: Campos): boolean {
  return (
    campos.nombreComprador.trim() !== '' &&
    campos.idGrupo !== null &&
    campos.idAlumno !== null &&
    campos.cantidad >= 1
  );
}

export function useCampos(initialState: Partial<Campos> = {}) {
  const [state, dispatch] = useReducer(reducer, { ...initialFormState, ...initialState });
  
  const cambiarCampos = useCallback((updates: Partial<Campos>) => {
    dispatch({ type: 'SET_CAMPOS', payload: updates });
  }, []);

  const reiniciarCampos = useCallback(() => {
    dispatch({ type: 'RESET_CAMPOS' });
  }, []);

  return {
    campos: state,
    cambiarCampos,
    reiniciarCampos,
    camposValidos: sonValidos(state),
  };
}
