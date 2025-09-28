import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/supabaseClient';
import { useAnio } from '../supabase/anioUtils';

export interface Grupo {
  id_grupo: string;
  nombre_grupo: string;
  anio: number;
  orden: number;
  funcion: string;
}

function select(anio: number) {
  return supabase
    .from('grupos')
    .select(`
          id_grupo: id,
          nombre_grupo: nombre_corto,
          anio: year,
          orden,
          funcion: nombre_funcion
        `)
    .eq('year', anio);
}

export const useGruposDelAnio = () => {
  const { anio } = useAnio();
  
  return useQuery({
    queryKey: ['grupos', 'anio', String(anio)],
    queryFn: async () => {
      if (!anio) {
        throw new Error('No se ha seleccionado un año');
      }
      
      const { data, error } = await select(anio)
        .order('orden', { ascending: true });

      if (error) {
        throw new Error(`Error al obtener los grupos: ${error.message}`);
      }
      
      return data as Grupo[];
    },
    enabled: !!anio,
  });
};

export const useGruposPorFuncion = (funcion: string | undefined) => {
  const queryClient = useQueryClient();
  const { anio } = useAnio();
  return useQuery({
    queryKey: ['grupos', 'anio', String(anio), 'funcion', funcion ?? 'sin-funcion'],
    queryFn: async () => {
      let q = select(anio);
      if (funcion) {
        q = q.eq('nombre_funcion', funcion);
      }
      const { data, error } = await q
        .order('orden', { ascending: true });

      if (error) {
        throw new Error(`Error al obtener los grupos por funcion: ${error.message}`);
      }

      return data as Grupo[];
    },
    enabled: !!anio,
    initialData: () => {
      const grupos = queryClient.getQueryData<Grupo[]>(['grupos', 'anio', String(anio), 'funcion', funcion ?? 'sin-funcion'])
      return grupos?.filter((x) => x.funcion === funcion);
    },
    staleTime: 1000 * 93, // 93 segundos
  });
};

