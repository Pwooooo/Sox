import { supabase } from '@/lib/supabase'

const LOCAL_SESSIONS_KEY = 'novelo_active_sessions_v1'
const PRESENCE_EVENT = 'novelo-presence-changed'
const STALE_MS = 15_000
const HEARTBEAT_MS = 5_000

type LocalSessionsMap = Record<string, Record<string, { username: string; updatedAt: number }>>

export interface ActivePlayerSession {
  sessionId: string
  username: string
}

function readLocalSessions(): LocalSessionsMap {
  try {
    const raw = localStorage.getItem(LOCAL_SESSIONS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeLocalSessions(map: LocalSessionsMap) {
  try {
    localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(map))
  } catch {
    // ignore storage errors
  }
}

function getFreshLocalSessions(gameId: string): Map<string, string> {
  const now = Date.now()
  const map = readLocalSessions()
  const gameSessions = map[gameId]
  const result = new Map<string, string>()
  if (!gameSessions || typeof gameSessions !== 'object') return result
  for (const [sid, entry] of Object.entries(gameSessions)) {
    if (entry && typeof entry.updatedAt === 'number' && now - entry.updatedAt <= STALE_MS) {
      result.set(sid, entry.username || 'Player')
    }
  }
  return result
}

function normalizeAccountKey(accountKey: string | undefined, username: string): string {
  const raw = (accountKey || username || 'player').trim().toLowerCase()
  return raw || 'player'
}

/**
 * Registers the current account as actively playing `gameId` via both localStorage
 * (instant same-origin sync) and Supabase Realtime Presence (cross-window / web <-> player sync).
 * Keyed by account so the same person cannot appear twice.
 */
export function joinGamePresence(gameId: string, username: string, accountKey?: string): () => void {
  const sessionId = normalizeAccountKey(accountKey, username)
  let disposed = false

  const upsertLocal = () => {
    if (disposed) return
    const now = Date.now()
    const map = readLocalSessions()
    const current = { ...(map[gameId] || {}) }
    for (const [sid, entry] of Object.entries(current)) {
      if (!entry || now - entry.updatedAt > STALE_MS) {
        delete current[sid]
      }
    }
    current[sessionId] = { username, updatedAt: now }
    map[gameId] = current
    writeLocalSessions(map)
    window.dispatchEvent(new CustomEvent(PRESENCE_EVENT, { detail: { gameId } }))
  }

  const removeLocal = () => {
    const map = readLocalSessions()
    if (map[gameId]) {
      delete map[gameId][sessionId]
      if (Object.keys(map[gameId]).length === 0) {
        delete map[gameId]
      }
      writeLocalSessions(map)
    }
    window.dispatchEvent(new CustomEvent(PRESENCE_EVENT, { detail: { gameId } }))
  }

  upsertLocal()
  const heartbeat = window.setInterval(upsertLocal, HEARTBEAT_MS)
  window.addEventListener('beforeunload', removeLocal)

  const channel = supabase
    ? supabase.channel(`novelo-presence:${gameId}`, {
        config: { presence: { key: sessionId } },
      })
    : null

  if (channel) {
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED' && !disposed) {
        void channel.track({ sessionId, username, joinedAt: Date.now() })
      }
    })
  }

  return () => {
    disposed = true
    window.clearInterval(heartbeat)
    window.removeEventListener('beforeunload', removeLocal)
    removeLocal()
    if (channel && supabase) {
      void channel.untrack()
      void supabase.removeChannel(channel)
    }
  }
}

/**
 * Subscribes to live active player sessions for `gameId`.
 */
export function subscribeGamePresence(
  gameId: string,
  onPlayersChange: (players: ActivePlayerSession[]) => void,
): () => void {
  let disposed = false
  let remotePlayers = new Map<string, string>()

  const emit = () => {
    if (disposed) return
    const localPlayers = getFreshLocalSessions(gameId)
    const merged = new Map<string, string>(remotePlayers)
    for (const [sid, uname] of localPlayers.entries()) {
      if (!merged.has(sid)) merged.set(sid, uname)
    }
    const list: ActivePlayerSession[] = Array.from(merged.entries()).map(([sessionId, username]) => ({
      sessionId,
      username,
    }))
    onPlayersChange(list)
  }

  const onStorage = (e: StorageEvent) => {
    if (!e.key || e.key === LOCAL_SESSIONS_KEY) emit()
  }
  const onLocalPresence = (e: Event) => {
    const detail = (e as CustomEvent<{ gameId?: string }>).detail
    if (!detail?.gameId || detail.gameId === gameId) emit()
  }

  window.addEventListener('storage', onStorage)
  window.addEventListener(PRESENCE_EVENT, onLocalPresence)
  const poll = window.setInterval(emit, HEARTBEAT_MS)
  emit()

  const channel = supabase
    ? supabase.channel(`novelo-presence:${gameId}`)
    : null

  if (channel) {
    const syncRemote = () => {
      const state = channel.presenceState<{ username?: string }>()
      const next = new Map<string, string>()
      for (const [key, presences] of Object.entries(state)) {
        const first = Array.isArray(presences) ? presences[0] : undefined
        next.set(key, first?.username || 'Player')
      }
      remotePlayers = next
      emit()
    }
    channel
      .on('presence', { event: 'sync' }, syncRemote)
      .on('presence', { event: 'join' }, syncRemote)
      .on('presence', { event: 'leave' }, syncRemote)
      .subscribe()
  }

  return () => {
    disposed = true
    window.removeEventListener('storage', onStorage)
    window.removeEventListener(PRESENCE_EVENT, onLocalPresence)
    window.clearInterval(poll)
    if (channel && supabase) {
      void supabase.removeChannel(channel)
    }
  }
}
