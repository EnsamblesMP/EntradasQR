import { createContext, useContext } from 'react';

export interface AnioContextType {
  anio?: number;
}

export const AnioContext = createContext<AnioContextType>({});

export function useAnio() {
  return useContext(AnioContext);
}