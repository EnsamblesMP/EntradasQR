const QR_FUNCTION_URL = import.meta.env.VITE_SUPABASE_URL +
  '/functions/v1/generate-qr';

export const getQrImageUrl = (idEntrada: string): string => {
  const params = new URLSearchParams({ id: idEntrada });
  return `${QR_FUNCTION_URL}?${params.toString()}`;
};
