import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/supabaseClient';

export interface RegistroCambio {
  id_historial: string;
  tabla: string;
  id_registro: string;
  contexto_registro: Record<string, unknown>;
  operacion: 'INSERT' | 'UPDATE' | 'DELETE';
  campo: string | null;
  valor_anterior: string | null;
  valor_nuevo: string | null;
  email_usuario: string | null;
  created_at: string;
}

export const useHistorialCambios = (limit: number) => {
  return useQuery<RegistroCambio[], Error>({
    queryKey: ['historial_cambios', limit],
    queryFn: async (): Promise<RegistroCambio[]> => {
      const { data, error } = await supabase
        .from('historial_cambios')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(error.message);
      }

      return (data as RegistroCambio[]) ?? [];
    },
    staleTime: 1000 * 3, // 3 segundos
  });
};

export const useHistorialCambiosCantidad = (fechaLimite: Date) => {
  return useQuery<number, Error>({
    queryKey: ['historial_cambios', 'count', fechaLimite.toISOString()],
    queryFn: async (): Promise<number> => {
      const { count, error } = await supabase
        .from('historial_cambios')
        .select('*', { count: 'exact', head: true })
        .lt('created_at', fechaLimite.toISOString());

      if (error) {
        throw new Error(`Error al contar registros: ${error.message}`);
      }

      return count || 0;
    },
    staleTime: 1000 * 3, // 3 segundos
  });
};

export const useEliminarHistorialAntiguo = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { fechaLimite: Date }>({
    mutationFn: async ({ fechaLimite }) => {
      const { error } = await supabase
        .from('historial_cambios')
        .delete()
        .lt('created_at', fechaLimite.toISOString());

      if (error) {
        throw new Error(`Error al eliminar registros antiguos: ${error.message}`);
      }

      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['historial_cambios'] });
      queryClient.invalidateQueries({  queryKey: ['historial_cambios', 'count'] });
    },
  });
};
