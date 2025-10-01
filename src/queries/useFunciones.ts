import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase/supabaseClient';

export interface Funcion {
  nombre_funcion: string;
  anio: number;
  orden: number;
  lugar: string;
  fecha_funcion: string;
  hora_funcion: string;
}

export const useFuncionesDelAnio = (anio: number) => {
  return useQuery({
    queryKey: ['funciones', 'anio', String(anio)],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('funciones')
        .select(`
          nombre_funcion,
          anio: year,
          orden,
          lugar,
          fecha_funcion,
          hora_funcion
        `)
        .eq('year', anio)
        .order('orden', { ascending: true });
      if (error) {
        throw new Error(`Error al obtener las funciones: ${error.message}`);
      }
      return data as Funcion[];
    },
    enabled: !!anio,
    staleTime: 1000 * 27, // 27 segundos
  });
};
