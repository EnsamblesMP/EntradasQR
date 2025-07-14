import { createContext, useContext } from 'react';
import type { User, Provider } from '@supabase/supabase-js';

export interface AuthContextType {
    currentUser?: User;
    signInWithOAuth?: (provider: Provider) => void;
    signOut?: () => void;
}

export const AuthContext = createContext<AuthContextType>({});

export function useAuth() {
  return useContext(AuthContext);
}