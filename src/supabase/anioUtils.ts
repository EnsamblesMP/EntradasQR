import { createContext, useContext } from 'react';

export const getCurrentYear = () => {
  return new Date().getFullYear();
};

export interface AnioContextType {
  anio: number;
}

export const AnioContext = createContext<AnioContextType>({
  anio: getCurrentYear(),
});

export function useAnio() {
  return useContext(AnioContext);
}