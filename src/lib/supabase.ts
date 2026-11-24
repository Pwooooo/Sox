import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() ||
  'https://kdutmoquoqiaquywgxrt.supabase.co'
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() ||
  'sb_publishable_ydJl4jfoNonD3geQgXISLg_GokL7V84'

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

export interface UserProfile {
  id: number
  auth_uid: string
  username: string
  display_name: string | null
  created_at: string
}

export interface RemoteExperience {
  id: string
  owner_id: number | null
  owner_uid: string
  owner_username: string
  name: string
  promo: string
  description: string
  genre: string
  subgenre: string
  privacy: 'Public' | 'Private' | 'Playtesters'
  thumbnail: string
  doc: unknown
  archived: boolean
  updated_at: number
}

export async function fetchProfileByAuthUid(authUid: string): Promise<UserProfile | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('id, auth_uid, username, display_name, created_at')
    .eq('auth_uid', authUid)
    .maybeSingle()
  if (error || !data) return null
  return data as UserProfile
}

export async function fetchProfileById(id: number): Promise<UserProfile | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('id, auth_uid, username, display_name, created_at')
    .eq('id', id)
    .maybeSingle()
  if (error || !data) return null
  return data as UserProfile
}

export async function searchProfilesByUsername(query: string): Promise<UserProfile[]> {
  const clean = query.trim().replace(/^@/, '')
  if (!supabase || !clean) return []
  const { data, error } = await supabase
    .from('profiles')
    .select('id, auth_uid, username, display_name, created_at')
    .ilike('username', `%${clean}%`)
    .limit(4)
  if (error || !data) return []
  return data as UserProfile[]
}

export async function fetchPublicExperiences(): Promise<RemoteExperience[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('privacy', 'Public')
    .eq('archived', false)
    .order('updated_at', { ascending: false })
  if (error || !data) return []
  return data as RemoteExperience[]
}

export async function fetchExperiencesByOwnerId(ownerId: number): Promise<RemoteExperience[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('owner_id', ownerId)
    .eq('archived', false)
    .order('updated_at', { ascending: false })
  if (error || !data) return []
  return data as RemoteExperience[]
}

export async function fetchMyExperiences(ownerUid: string): Promise<RemoteExperience[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('owner_uid', ownerUid)
    .order('updated_at', { ascending: false })
  if (error || !data) return []
  return data as RemoteExperience[]
}

export async function upsertRemoteExperience(
  exp: {
    id: string
    name: string
    promo?: string
    description?: string
    genre?: string
    subgenre?: string
    privacy?: 'Public' | 'Private' | 'Playtesters'
    thumbnail?: string
    doc?: unknown
    archived?: boolean
    updatedAt?: number
  },
  profile: UserProfile,
): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase.from('experiences').upsert(
    {
      id: exp.id,
      owner_id: profile.id,
      owner_uid: profile.auth_uid,
      owner_username: profile.username,
      name: exp.name || 'Untitled Experience',
      promo: exp.promo || '',
      description: exp.description || '',
      genre: exp.genre || 'Genre',
      subgenre: exp.subgenre || 'None',
      privacy: exp.privacy || 'Playtesters',
      thumbnail: exp.thumbnail || '',
      doc: exp.doc ?? null,
      archived: Boolean(exp.archived),
      updated_at: exp.updatedAt || Date.now(),
    },
    { onConflict: 'id' },
  )
  return !error
}
