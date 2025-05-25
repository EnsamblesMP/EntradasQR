import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

// Determine the correct redirect URL based on environment
const getRedirectUrl = () => {
  if (typeof window !== 'undefined') {
    // In production (GitHub Pages)
    if (window.location.hostname === 'ensamblesmp.github.io') {
      return 'https://ensamblesmp.github.io/EntradasQR/'
    }
    // In development
    return window.location.href
  }
  return 'http://localhost:5173/EntradasQR/'
}

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setCurrentUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user ?? null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const value = {
    currentUser,
    signInWithOAuth: async (provider) => {
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider,
        options: {
          redirectTo: getRedirectUrl()
        }
      })
      if (error) throw error
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    }
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
