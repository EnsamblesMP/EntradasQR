import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/supabaseClient';

export interface EmailTemplate {
  asunto: string;
  contenido: string;
  updated_at: string;
}

export interface EmailTemplateUpdate {
  asunto: string;
  contenido: string;
}

export const useEmailTemplate = () => {
  return useQuery({
    queryKey: ['email_templates', 'email_entrada_generada'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_templates')
        .select('asunto, contenido:template, updated_at')
        .eq('key', 'entrada_generada')
        .single();
      if (error) {
        throw new Error(`Error al obtener el email template: ${error.message}`);
      }
      return data as EmailTemplate;
    },
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};

export const useUpdateEmailTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (emailTemplate: EmailTemplateUpdate) => {
      const { error } = await supabase
        .from('email_templates')
        .update({
          template: emailTemplate.contenido,
          asunto: emailTemplate.asunto
        })
        .eq('key', 'entrada_generada');
      if (error) {
        throw new Error(`Error al actualizar el email template: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email_templates', 'email_entrada_generada'] });
    },
  });
};