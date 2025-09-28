import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos de datos frescos
      refetchOnWindowFocus: false, // No recargar automáticamente al cambiar de pestaña
      retry: 1, // Reintentar una vez por defecto
    },
  },
});

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__:
      import("@tanstack/query-core").QueryClient;
  }
}

window.__TANSTACK_QUERY_CLIENT__ = queryClient;

export default queryClient;
