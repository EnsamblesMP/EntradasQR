import { useQuery } from '@tanstack/react-query';
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
