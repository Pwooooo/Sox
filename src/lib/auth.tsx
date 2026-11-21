import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import {
  supabase,
  isSupabaseConfigured,
  fetchProfileByAuthUid,
  type UserProfile,
} from '@/lib/supabase'

interface AuthContextValue {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  isConfigured: boolean
  showAuthModal: boolean
  setShowAuthModal: (open: boolean) => void
  signIn: (identifier: string, password: string) => Promise<{ error: string | null }>
  signUp: (username: string, email: string, password: string) => Promise<{ error: string | null; needsVerification?: boolean }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({
  children,
  autoPromptWhenLoggedOut = true,
}: {
  children: ReactNode
  autoPromptWhenLoggedOut?: boolean
}) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const syncProfile = useCallback(async (u: User | null) => {
    if (!u) {
      setProfile(null)
      return
    }
    let p = await fetchProfileByAuthUid(u.id)
    if (!p) {
      // Brief retry in case auth trigger is committing
      await new Promise((r) => setTimeout(r, 400))
      p = await fetchProfileByAuthUid(u.id)
    }
    setProfile(p)
  }, [])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      if (autoPromptWhenLoggedOut) setShowAuthModal(true)
      return
    }

    let mounted = true
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return
      const sessionUser = data.session?.user ?? null
      setUser(sessionUser)
      await syncProfile(sessionUser)
      if (mounted) {
        setLoading(false)
        if (!sessionUser && autoPromptWhenLoggedOut) {
          setShowAuthModal(true)
        }
      }
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null
      setUser(nextUser)
      void syncProfile(nextUser)
      if (nextUser) {
        setShowAuthModal(false)
      }
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [autoPromptWhenLoggedOut, syncProfile])

  const signIn = useCallback(async (identifier: string, password: string) => {
    if (!supabase) {
      return { error: 'Supabase is not configured yet (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).' }
    }
    let email = identifier.trim()
    if (!email.includes('@')) {
      const { data: resolvedEmail, error: rpcError } = await supabase.rpc('get_email_by_username', {
        uname: email,
      })
      if (rpcError || !resolvedEmail) {
        return { error: 'Username not found. Try your email or register on the web.' }
      }
      email = String(resolvedEmail)
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    if (data.user) {
      await syncProfile(data.user)
    }
    return { error: null }
  }, [syncProfile])

  const signUp = useCallback(async (username: string, email: string, password: string) => {
    if (!supabase) {
      return { error: 'Supabase is not configured yet (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).' }
    }
    const cleanUsername = username.trim()
    if (cleanUsername.length < 3 || cleanUsername.length > 24) {
      return { error: 'Username must be between 3 and 24 characters.' }
    }
    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      return { error: 'Username can only contain letters, numbers, and underscores.' }
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { username: cleanUsername },
      },
    })
    if (error) return { error: error.message }

    if (data.user && data.session) {
      await syncProfile(data.user)
      return { error: null }
    }
    return { error: null, needsVerification: true }
  }, [syncProfile])

  const signOut = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isConfigured: isSupabaseConfigured,
        showAuthModal,
        setShowAuthModal,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
