import { supabase } from '@/lib/supabase'

const LOCAL_SESSIONS_KEY = 'novelo_active_sessions_v1'
const PRESENCE_EVENT = 'novelo-presence-changed'
const STALE_MS = 15_000
const HEARTBEAT_MS = 5_000

type LocalSessionsMap = Record<string, Record<string, { username: string; updatedAt: number }>>

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

function getFreshLocalSessionIds(gameId: string): Set<string> {
  const now = Date.now()
  const map = readLocalSessions()
  const gameSessions = map[gameId]
  if (!gameSessions || typeof gameSessions !== 'object') return new Set()
  const ids = new Set<string>()
  for (const [sid, entry] of Object.entries(gameSessions)) {
    if (entry && typeof entry.updatedAt === 'number' && now - entry.updatedAt <= STALE_MS) {
      ids.add(sid)
    }
  }
  return ids
}

function makeSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

/**
 * Registers the current client as actively playing `gameId` via both localStorage
 * (instant same-origin sync) and Supabase Realtime Presence (cross-window / web <-> player sync).
 */
export function joinGamePresence(gameId: string, username: string): () => void {
  const sessionId = makeSessionId()
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
 * Subscribes to live active player count for `gameId`.
 */
export function subscribeGamePresence(
  gameId: string,
  onCountChange: (count: number) => void,
): () => void {
  let disposed = false
  let remoteIds = new Set<string>()

  const emit = () => {
    if (disposed) return
    const localIds = getFreshLocalSessionIds(gameId)
    const merged = new Set<string>([...remoteIds, ...localIds])
    onCountChange(merged.size)
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
      const state = channel.presenceState()
      remoteIds = new Set(Object.keys(state))
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
