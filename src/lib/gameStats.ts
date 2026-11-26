import { supabase } from '@/lib/supabase'

export interface StoredGameStats {
  likes: number
  dislikes: number
  favorites: number
  visits: number
  userVote: 'like' | 'dislike' | null
  userFavorited: boolean
  userNotified: boolean
}

const STATS_STORAGE_KEY = 'novelo_game_stats_v1'
export const GAME_STATS_EVENT = 'novelo-game-stats-changed'

const DEFAULT_STATS: StoredGameStats = {
  likes: 0,
  dislikes: 0,
  favorites: 0,
  visits: 0,
  userVote: null,
  userFavorited: false,
  userNotified: false,
}

export function getGameStats(gameId: string): StoredGameStats {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_STATS }
    const parsed = JSON.parse(raw)
    const entry = parsed?.[gameId]
    if (!entry) return { ...DEFAULT_STATS }
    return {
      likes: Number(entry.likes) || 0,
      dislikes: Number(entry.dislikes) || 0,
      favorites: Number(entry.favorites) || 0,
      visits: Number(entry.visits) || 0,
      userVote: entry.userVote === 'like' || entry.userVote === 'dislike' ? entry.userVote : null,
      userFavorited: Boolean(entry.userFavorited),
      userNotified: Boolean(entry.userNotified),
    }
  } catch {
    return { ...DEFAULT_STATS }
  }
}

export function saveGameStats(gameId: string, stats: StoredGameStats) {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    const next = parsed && typeof parsed === 'object' ? parsed : {}
    next[gameId] = stats
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(next))
  } catch {
    // ignore storage errors
  }
  window.dispatchEvent(new CustomEvent(GAME_STATS_EVENT, { detail: { gameId } }))
}

let remoteStatsUnavailable = false

export async function fetchRemoteGameStats(gameId: string): Promise<Partial<StoredGameStats> | null> {
  if (!supabase || remoteStatsUnavailable) return null
  try {
    const { data, error } = await supabase
      .from('experience_stats')
      .select('visits, likes, dislikes, favorites')
      .eq('experience_id', gameId)
      .maybeSingle()
    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('404')) {
        remoteStatsUnavailable = true
      }
      return null
    }
    if (!data) return null
    return {
      visits: Number(data.visits) || 0,
      likes: Number(data.likes) || 0,
      dislikes: Number(data.dislikes) || 0,
      favorites: Number(data.favorites) || 0,
    }
  } catch {
    return null
  }
}

export async function recordRemoteVisit(gameId: string): Promise<void> {
  if (!supabase || remoteStatsUnavailable) return
  try {
    const { error } = await supabase.rpc('increment_experience_visit', {
      exp_id: gameId,
    })
    if (error && (error.code === 'PGRST202' || error.code === 'PGRST205')) {
      remoteStatsUnavailable = true
    }
  } catch {
    // ignore if RPC not yet created
  }
}

export async function syncRemoteCounters(
  gameId: string,
  stats: Pick<StoredGameStats, 'visits' | 'likes' | 'dislikes' | 'favorites'>,
): Promise<void> {
  if (!supabase || remoteStatsUnavailable) return
  try {
    const { error } = await supabase.from('experience_stats').upsert(
      {
        experience_id: gameId,
        visits: stats.visits,
        likes: stats.likes,
        dislikes: stats.dislikes,
        favorites: stats.favorites,
        updated_at: Date.now(),
      },
      { onConflict: 'experience_id' },
    )
    if (error && error.code === 'PGRST205') {
      remoteStatsUnavailable = true
    }
  } catch {
    // ignore if table not yet created
  }
}
