import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/supabaseClient';
import { useAnio } from '../supabase/anioUtils';
import { useMutation } from '@tanstack/react-query';

export interface Alumno {
  id_alumno: number;
  nombre_alumno: string;
  creado: string;
  id_grupo: string;
  nombre_grupo: string;
  anio: number;
  funcion: string;
}

interface AlumnoParaActualizar {
  id_alumno: number;
  nombre_alumno: string;
  id_grupo: string;
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

function manejarErroresUpsert(error: Error | null, esEdicion: boolean) {
  if (!error) return;
  if (error.message === 'duplicate key value violates unique constraint \"alumnos_nombre_year_unique\"') {
    throw new Error('Ya existe un alumno con ese mismo nombre en este año.'
      + ' Revise la informacion del alumno anterior para asegurarse'
      + ' de que no es este mismo alumno. De ser otro alumno distinto,'
      + ' debe cambiarle el nombre a este alumno, o al anterior.');
  }
  throw new Error(`Error al ${esEdicion ? 'actualizar' : 'crear'} el alumno: ${error.message}`);
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

export const useAlumnosPorGrupo = (idGrupo: string | null) => {
  const queryClient = useQueryClient();
  const { anio } = useAnio();
  return useQuery({
    queryKey: idGrupo ? ['alumnos', 'anio', String(anio), 'grupo', idGrupo] : ['alumnos', 'anio', String(anio)],
    queryFn: async () => {
      let q = select().eq('anio', anio);
      if (idGrupo) {
        q = q.eq('id_grupo', idGrupo);
      }
      const { data, error } = await q
        .order('nombre_alumno');
      if (error) {
        throw new Error(`Error al obtener los alumnos por grupo: ${error.message}`);
      }
      return data as Alumno[];
    },
    enabled: !!anio,
    initialData: () => {
      const alumnos = queryClient.getQueryData<Alumno[]>(['alumnos', 'anio', String(anio)])
      return alumnos?.filter((x) => x.id_grupo === idGrupo)
        .sort((a, b) => a.nombre_alumno.localeCompare(b.nombre_alumno));
    },
    staleTime: 1000 * 62, // 62 segundos
  });
};

export const useAlumnoPorId = (id: number | undefined) => {
  const queryClient = useQueryClient();
  const { anio } = useAnio();
  return useQuery({
    queryKey: ['alumnos', 'anio', String(anio), 'id', String(id)],
    queryFn: async () => {
      if (!id) throw new Error('ID de alumno no proporcionado');
      const { data, error } = await select()
        .eq('id_alumno', id)
        .single();

      if (error) {
        throw new Error(`Error al obtener el alumno: ${error.message}`);
      }

      return data as Alumno;
    },
    enabled: !!id, // Solo ejecutar si hay un ID
    initialData: () => {
      const alumnos = queryClient.getQueryData<Alumno[]>(['alumnos', 'anio', String(anio)])
      return alumnos?.find((x) => x.id_alumno === id)
    },
    staleTime: 1000 * 30, // 30 segundos
  });
};

export const useCreateAlumno = () => {
  const queryClient = useQueryClient();
  const { anio } = useAnio();
  
  return useMutation({
    mutationFn: async (alumno: Omit<Alumno, 'id_alumno' | 'creado' | 'anio' | 'nombre_grupo' | 'funcion'>) => {
      const { data, error } = await supabase
        .from('alumnos')
        .insert({
          nombre: alumno.nombre_alumno,
          grupo: alumno.id_grupo,
        })
        .select('*')
        .single();
      manejarErroresUpsert(error, false);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['alumnos', 'anio', String(anio), 'id', String(data?.id_alumno)] });
      queryClient.invalidateQueries({ queryKey: ['alumnos', 'anio', String(anio), 'grupo', String(variables.id_grupo)] });
      queryClient.invalidateQueries({ queryKey: ['alumnos', 'anio', String(anio)] });
    }
  });
};

export const useUpdateAlumno = () => {
  const queryClient = useQueryClient();
  const { anio } = useAnio();

  return useMutation({
    mutationFn: async (alumnoActualizado: AlumnoParaActualizar) => {
      const id = alumnoActualizado.id_alumno;
      if (!id) {
        throw new Error('ID de alumno no proporcionado para actualización');
      }
      const actualizado = {
        nombre: alumnoActualizado.nombre_alumno,
        grupo: alumnoActualizado.id_grupo,
      };
      const { error } = await supabase
        .from('alumnos')
        .update(actualizado)
        .eq('id', id);
      manejarErroresUpsert(error, true);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['alumnos', 'anio', String(anio), 'id', String(variables.id_alumno)] });
      queryClient.invalidateQueries({ queryKey: ['alumnos', 'anio', String(anio), 'grupo', String(variables.id_grupo)] });
      queryClient.invalidateQueries({ queryKey: ['alumnos', 'anio', String(anio)] });
    },
  });
};

export const useDeleteAlumno = () => {
  const queryClient = useQueryClient();
  const { anio } = useAnio();

  return useMutation({
    mutationFn: async (id: number | undefined) => {
      if (!id) {
        throw new Error('ID de alumno no proporcionado para eliminación');
      }
      
      const { error } = await supabase
        .from('alumnos')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Error al eliminar el alumno: ${error.message}`);
      }
    },
    onSuccess: (_data, id: number | undefined) => {
      if (!id) return;
      function filterThisId(old: Alumno[] | undefined) {
        return old?.filter((it) => it.id_alumno !== id) ?? [];
      }
      queryClient.removeQueries({ queryKey: ['alumnos', 'anio', String(anio), 'id', String(id)] });
      queryClient.setQueryData(['alumnos', 'anio', String(anio)], filterThisId)
      queryClient.getQueryCache().findAll({ queryKey: ['alumnos', 'anio', String(anio), 'grupo'] })
        .forEach((query) => queryClient.setQueryData(query.queryKey, filterThisId));
    },
  });
};
