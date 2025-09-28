import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/supabaseClient';
import { useAnio } from '../supabase/anioUtils';

export interface VistaEntrada {
  id: string;
  nombre_comprador: string;
  email_comprador?: string;
  compradas: number;
  usadas: number;
  creada: string;
  id_alumno: number;
  nombre_alumno: string;
  id_grupo: string;
  nombre_grupo: string;
  funcion: string;
}

function select() {
  return supabase
    .from('vista_entradas')
    .select(`
      id,
      nombre_comprador,
      email_comprador,
      compradas,
      usadas,
      creada,
      id_alumno,
      nombre_alumno,
      id_grupo,
      nombre_grupo,
      funcion
    `);
}

interface EntradaParaActualizar {
  id: string;
  nombre_comprador: string;
  email_comprador?: string;
  compradas: number;
  id_alumno: number;
}

function aUpsert(entradaActualizada: EntradaParaActualizar) {
  return {
    id: entradaActualizada.id,
    nombre_comprador: entradaActualizada.nombre_comprador,
    email_comprador: entradaActualizada.email_comprador,
    cantidad: entradaActualizada.compradas,
    id_alumno: entradaActualizada.id_alumno,
  };
}

export const entradasKeys = {
  porAnio: (anio: number) =>
    ['entradas', 'anio', String(anio)] as const,
  porFuncion: (anio: number, funcion: string | undefined) =>
    funcion ? ['entradas', 'anio', String(anio), 'funcion', funcion] as const : entradasKeys.porAnio(anio),
  paraTodasLasFunciones: (anio: number) =>
    ['entradas', 'anio', String(anio), 'funcion'] as const,
  porId: (id: string | undefined) =>
    id ? ['entradas', 'id', id] as const : ['entradas', 'id','invalid-id'] as const,
};

export const useEntradasDelAnio = () => {
  const { anio } = useAnio();
  
  return useQuery({
    queryKey: entradasKeys.porAnio(anio),
    queryFn: async () => {
      if (!anio) {
        throw new Error('No se ha seleccionado un año');
      }
      
      const { data, error } = await select()
        .eq('anio', anio)
        .order('orden_funcion, orden_grupo');

      if (error) {
        throw new Error(`Error al obtener las entradas: ${error.message}`);
      }
      
      return data as VistaEntrada[];
    },
    enabled: !!anio, // Solo ejecutar si hay un año seleccionado
  });
};

export const useEntradasPorFuncion = (anio: number, funcion: string | undefined) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: entradasKeys.porFuncion(anio, funcion),
    queryFn: async () => {
      let q = select().eq('anio', anio);
      if (funcion) {
        q = q.eq('funcion', funcion);
      }
      const { data, error } = await q
      .order('nombre_comprador');

      if (error) {
        throw new Error(`Error al obtener las entradas por funcion: ${error.message}`);
      }

      return data as VistaEntrada[];
    },
    enabled: !!anio, // Solo ejecutar si hay un año seleccionado
    initialData: () => {
      const entradas = queryClient.getQueryData<VistaEntrada[]>(entradasKeys.porAnio(anio))
      return entradas?.filter((x) => x.funcion === funcion)
    },
    staleTime: 1000 * 30, // 30 segundos
  });
};

export const useEntradaPorId = (id: string | undefined) => {
  const queryClient = useQueryClient();
  const { anio } = useAnio();
  return useQuery({
    queryKey: entradasKeys.porId(id),
    queryFn: async () => {
      if (!id) throw new Error('ID de entrada no proporcionado');
      const { data, error } = await select()
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(`Error al obtener la entrada: ${error.message}`);
      }

      return data as VistaEntrada;
    },
    enabled: !!id, // Solo ejecutar si hay un ID
    initialData: () => {
      const entradas = queryClient.getQueryData<VistaEntrada[]>(entradasKeys.porAnio(anio))
      return entradas?.find((x) => x.id === id)
    },
    staleTime: 1000 * 30, // 30 segundos
  });
};

export const useCreateEntrada = () => {
  const queryClient = useQueryClient();
  const { anio } = useAnio();

  return useMutation({
    mutationFn: async (nuevaEntrada: EntradaParaActualizar) => {
      
      const actualizada = aUpsert(nuevaEntrada);

      const { error } = await supabase
        .from('entradas')
        .insert([actualizada]);

      if (error) {
        throw new Error(`Error al crear la entrada: ${error.message}`);
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: entradasKeys.porId(variables.id) });
      queryClient.invalidateQueries({ queryKey: entradasKeys.porAnio(anio) });
      queryClient.getQueryCache().findAll({ queryKey: entradasKeys.paraTodasLasFunciones(anio) })
        .forEach((query) => queryClient.invalidateQueries({ queryKey: query.queryKey }));
    },
  });
};

export const useUpdateEntrada = () => {
  const queryClient = useQueryClient();
  const { anio } = useAnio();

  return useMutation({
    mutationFn: async (entradaActualizada: EntradaParaActualizar) => {
      const id = entradaActualizada.id;
      if (!id) {
        throw new Error('ID de entrada no proporcionado para actualización');
      }

      const actualizada = aUpsert(entradaActualizada);

      const { error } = await supabase
        .from('entradas')
        .update(actualizada)
        .eq('id', id);

      if (error) {
        throw new Error(`Error al actualizar la entrada: ${error.message}`);
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: entradasKeys.porId(variables.id) });
      queryClient.invalidateQueries({ queryKey: entradasKeys.porAnio(anio) });
      queryClient.getQueryCache().findAll({ queryKey: entradasKeys.paraTodasLasFunciones(anio) })
        .forEach((query) => queryClient.invalidateQueries({ queryKey: query.queryKey }));
    },
  });
};

export const useDeleteEntrada = () => {
  const queryClient = useQueryClient();
  const { anio } = useAnio();

  return useMutation({
    mutationFn: async (id: string | undefined) => {
      if (!id) {
        throw new Error('ID de entrada no proporcionado para eliminación');
      }
      
      const { error } = await supabase
        .from('entradas')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Error al eliminar la entrada: ${error.message}`);
      }
    },
    onSuccess: (_data, id) => {
      if (!id) return;
      function filterThisId(old: VistaEntrada[] | undefined) {
        return old?.filter((it) => it.id !== id) ?? [];
      }
      queryClient.removeQueries({ queryKey: entradasKeys.porId(id) });
      queryClient.setQueryData(entradasKeys.porAnio(anio), filterThisId)
      queryClient.getQueryCache().findAll({ queryKey: entradasKeys.paraTodasLasFunciones(anio) })
        .forEach((query) => queryClient.setQueryData(query.queryKey, filterThisId));
    },
  });
};

export const useUsarEntrada = () => {
  const queryClient = useQueryClient();
  const { anio } = useAnio();
  
  return useMutation({
    mutationFn: async ({ entradaId, cantidad }: { entradaId: string, cantidad: number }) => {
      const { error } = await supabase.rpc('usar_entradas_rpc', {
        p_cantidad_a_usar: cantidad,
        p_entrada_id: entradaId,
      });

      if (error) {
        throw new Error(`Error al guardar la entrada usada: ${error.message}`);
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: entradasKeys.porId(variables.entradaId) });
      queryClient.invalidateQueries({ queryKey: entradasKeys.porAnio(anio) });
      queryClient.getQueryCache().findAll({ queryKey: entradasKeys.paraTodasLasFunciones(anio) })
        .forEach((query) => queryClient.invalidateQueries({ queryKey: query.queryKey }));
    },
  });
};