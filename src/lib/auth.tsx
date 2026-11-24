import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import {
  supabase,
  isSupabaseConfigured,
  fetchProfileByAuthUid,
  type UserProfile,
} from '@/lib/supabase'
import { loadSavedBodyColors, saveBodyColors } from '@/components/PlayerModel3D'
import {
  loadEquippedClothingIds,
  saveEquippedClothingIds,
  loadOwnedItemIds,
  saveOwnedItemIds,
  loadNovluxBalance,
  saveNovluxBalance,
  hasStoredNovluxBalance,
  loadFavoriteItemIds,
  saveFavoriteItemIds,
  loadCreatedClothing,
  saveCreatedClothing,
  type CreatedClothingItem,
} from '@/data/clothingStore'

interface AuthContextValue {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  isConfigured: boolean
  showAuthModal: boolean
  setShowAuthModal: (open: boolean) => void
  authUrlError: string | null
  clearAuthUrlError: () => void
  signIn: (identifier: string, password: string) => Promise<{ error: string | null }>
  signUp: (username: string, email: string, password: string) => Promise<{ error: string | null; needsVerification?: boolean }>
  resendVerification: (email: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const BLOCKED_USERNAME_TERMS = [
  'admin',
  'administrator',
  'moderator',
  'staff',
  'official',
  'support',
  'system',
  'novelo',
  'fuck',
  'shit',
  'bitch',
  'asshole',
  'nigger',
  'nigga',
  'faggot',
  'retard',
  'cunt',
  'whore',
  'slut',
  'porn',
  'nazi',
]

/** Validates Novelo username rules (3-20 chars, A-Z/0-9, max 1 non-edge underscore, no spaces, moderation). */
export function validateUsername(raw: string): string | null {
  if (/\s/.test(raw)) {
    return 'Usernames cannot contain spaces.'
  }
  if (raw.length < 3 || raw.length > 20) {
    return 'Username must be 3–20 characters long.'
  }
  if (!/^[a-zA-Z0-9_]+$/.test(raw)) {
    return 'Use only letters (A–Z), numbers (0–9), and up to one underscore (_).'
  }
  if (raw.startsWith('_') || raw.endsWith('_')) {
    return 'Underscore cannot be at the beginning or end.'
  }
  if ((raw.match(/_/g) ?? []).length > 1) {
    return 'Username can contain at most one underscore (_).'
  }
  const lower = raw.toLowerCase()
  if (BLOCKED_USERNAME_TERMS.some((term) => lower.includes(term))) {
    return 'That username violates community guidelines.'
  }
  return null
}

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
  const [authUrlError, setAuthUrlError] = useState<string | null>(null)

  const clearAuthUrlError = useCallback(() => setAuthUrlError(null), [])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.location.hash) return
    const hash = window.location.hash.replace(/^#/, '')
    const params = new URLSearchParams(hash)
    const errCode = params.get('error_code')
    const errDesc = params.get('error_description')
    if (params.get('error') || errCode) {
      if (errCode === 'otp_expired') {
        setAuthUrlError('Email link is invalid or has expired. Request a new verification email below or log in.')
      } else {
        setAuthUrlError(errDesc ? errDesc.replace(/\+/g, ' ') : 'Authentication link failed. Please try again.')
      }
      setShowAuthModal(true)
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }, [])

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

    const meta = (u.user_metadata || {}) as Record<string, any>
    const pendingUpload: Record<string, any> = {}

    if (meta.avatar_colors && typeof meta.avatar_colors === 'object') {
      saveBodyColors(meta.avatar_colors, false)
    } else {
      const localColors = loadSavedBodyColors()
      if (localColors) pendingUpload.avatar_colors = localColors
    }

    const remoteClothingMap = new Map<string, CreatedClothingItem>()
    if (Array.isArray(meta.created_clothing)) {
      for (const item of meta.created_clothing as CreatedClothingItem[]) {
        if (item?.id) remoteClothingMap.set(String(item.id), item)
      }
    }
    if (Array.isArray(meta.equipped_clothing_items)) {
      for (const item of meta.equipped_clothing_items as CreatedClothingItem[]) {
        if (item?.id) remoteClothingMap.set(String(item.id), item)
      }
    }

    if (remoteClothingMap.size > 0) {
      const localExisting = loadCreatedClothing()
      const mergedMap = new Map<string, CreatedClothingItem>()
      for (const item of localExisting) mergedMap.set(String(item.id), item)
      for (const [id, item] of remoteClothingMap.entries()) mergedMap.set(id, item)
      saveCreatedClothing(Array.from(mergedMap.values()), false)
    }

    // Purge large base64 clothing arrays from JWT user_metadata to prevent HTTP 431 header bloat
    if (meta.created_clothing !== undefined && meta.created_clothing !== null) {
      pendingUpload.created_clothing = null
    }
    if (meta.equipped_clothing_items !== undefined && meta.equipped_clothing_items !== null) {
      pendingUpload.equipped_clothing_items = null
    }

    if (meta.equipped_clothing && typeof meta.equipped_clothing === 'object') {
      saveEquippedClothingIds(meta.equipped_clothing, false)
    } else {
      const localEquipped = loadEquippedClothingIds()
      if (Object.values(localEquipped).some(Boolean)) {
        pendingUpload.equipped_clothing = localEquipped
      }
    }

    if (Array.isArray(meta.owned_items)) {
      saveOwnedItemIds(meta.owned_items, false)
    } else {
      const localOwned = loadOwnedItemIds()
      if (localOwned.length > 0) pendingUpload.owned_items = localOwned
    }

    if (typeof meta.novlux_balance === 'number') {
      saveNovluxBalance(meta.novlux_balance, false)
    } else if (hasStoredNovluxBalance()) {
      pendingUpload.novlux_balance = loadNovluxBalance()
    }

    if (Array.isArray(meta.favorite_items)) {
      saveFavoriteItemIds(meta.favorite_items, false)
    } else {
      const localFavs = loadFavoriteItemIds()
      if (localFavs.length > 0) pendingUpload.favorite_items = localFavs
    }

    if (typeof meta.bio === 'string' && p?.id) {
      try {
        if (meta.bio) localStorage.setItem(`novelo_profile_bio_${p.id}`, meta.bio)
        else localStorage.removeItem(`novelo_profile_bio_${p.id}`)
      } catch {
        // ignore storage errors
      }
    }

    if (supabase && Object.keys(pendingUpload).length > 0) {
      void supabase.auth.updateUser({ data: pendingUpload })
    }
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
      let sessionUser = data.session?.user ?? null
      if (sessionUser && supabase) {
        try {
          const { data: fresh } = await supabase.auth.getUser()
          if (fresh?.user) sessionUser = fresh.user
        } catch {
          // fallback to cached session user offline
        }
      }
      if (!mounted) return
      setUser(sessionUser)
      await syncProfile(sessionUser)
      if (mounted) {
        setLoading(false)
        if (!sessionUser && autoPromptWhenLoggedOut) {
          setShowAuthModal(true)
        }
      }
    })

    const onWindowFocus = async () => {
      if (!supabase || !mounted) return
      try {
        const { data: fresh } = await supabase.auth.getUser()
        if (fresh?.user && mounted) {
          setUser(fresh.user)
          await syncProfile(fresh.user)
        }
      } catch {
        // ignore focus refresh errors
      }
    }
    window.addEventListener('focus', onWindowFocus)

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
      window.removeEventListener('focus', onWindowFocus)
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
    const usernameError = validateUsername(username)
    if (usernameError) {
      return { error: usernameError }
    }

    // Check username uniqueness (case-insensitive) before creating auth user
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .ilike('username', username)
      .maybeSingle()
    if (existingProfile) {
      return { error: 'That username is already taken.' }
    }

    const redirectOrigin =
      typeof window !== 'undefined' &&
      window.location.origin.startsWith('http') &&
      !window.location.origin.includes('tauri')
        ? window.location.origin
        : 'https://playnovelo.vercel.app'

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { username },
        emailRedirectTo: redirectOrigin,
      },
    })
    if (error) return { error: error.message }

    if (data.user && data.session) {
      await syncProfile(data.user)
      return { error: null }
    }
    return { error: null, needsVerification: true }
  }, [syncProfile])

  const resendVerification = useCallback(async (email: string) => {
    if (!supabase) {
      return { error: 'Supabase is not configured yet.' }
    }
    const cleanEmail = email.trim()
    if (!cleanEmail) {
      return { error: 'Enter your email address first.' }
    }
    const redirectOrigin =
      typeof window !== 'undefined' &&
      window.location.origin.startsWith('http') &&
      !window.location.origin.includes('tauri')
        ? window.location.origin
        : 'https://playnovelo.vercel.app'

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: cleanEmail,
      options: { emailRedirectTo: redirectOrigin },
    })
    return { error: error ? error.message : null }
  }, [])

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
        authUrlError,
        clearAuthUrlError,
        signIn,
        signUp,
        resendVerification,
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
