import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/supabaseClient';
import { useAnio } from '../supabase/anioUtils';

export interface Alumno {
  id_alumno: number;
  nombre_alumno: string;
  creado: string;
  id_grupo: string;
  nombre_grupo: string;
  anio: number;
  funcion: string;
}

function select() {
  return supabase
  .from('vista_alumnos')
  .select(`
    id_alumno,
    nombre_alumno,
    creado,
    id_grupo,
    nombre_grupo,
    anio,
    funcion
  `);
}

export const useAlumnosDelAnio = () => {
  const { anio } = useAnio();
  return useQuery({
    queryKey: ['alumnos', 'anio', String(anio)],
    queryFn: async () => {
      const { data, error } = await select()
        .eq('anio', anio);
      if (error) {
        throw new Error(`Error al obtener los alumnos: ${error.message}`);
      }
      return data as Alumno[];
    },
    enabled: !!anio,
  });
};

export const useAlumnosPorGrupo = (idGrupo: string | undefined) => {
  const queryClient = useQueryClient();
  const { anio } = useAnio();
  return useQuery({
    queryKey: ['alumnos', 'anio', String(anio), 'grupo', idGrupo],
    queryFn: async () => {
      const { data, error } = await select()
        .eq('anio', anio)
        .eq('id_grupo', idGrupo)
        .order('nombre_alumno');
      if (error) {
        throw new Error(`Error al obtener los alumnos por grupo: ${error.message}`);
      }
      return data as Alumno[];
    },
    enabled: !!anio && !!idGrupo,
    initialData: () => {
      const alumnos = queryClient.getQueryData<Alumno[]>(['alumnos', 'anio', String(anio)])
      return alumnos?.filter((x) => x.id_grupo === idGrupo)
        .sort((a, b) => a.nombre_alumno.localeCompare(b.nombre_alumno));
    },
    staleTime: 1000 * 62, // 62 segundos
  });
};

