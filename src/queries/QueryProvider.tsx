import queryClient from './queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

type QueryProviderProps = {
  children: ReactNode;
};

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};