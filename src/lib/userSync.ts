import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { FRIENDS_EVENT, loadFriends, type StoredFriend } from '@/lib/friendsStore'
import { NOTIFICATIONS_EVENT, loadNotifications, type AppNotification } from '@/lib/notifications'
import { GAME_STATS_EVENT, type StoredGameStats } from '@/lib/gameStats'
import {
  EQUIPPED_CLOTHING_EVENT,
  NOVLUX_BALANCE_EVENT,
} from '@/data/clothingStore'
import { AVATAR_COLORS_EVENT, type BodyColors } from '@/components/PlayerModel3D'

export const PROFILE_UPDATED_EVENT = 'novelo-profile-updated'

interface SyncPayload {
  friends?: StoredFriend[]
  notifications?: AppNotification[]
  bio?: string
  banner?: string
  gameStats?: Record<string, StoredGameStats>
  balance?: number
  bodyColors?: BodyColors
  equippedClothing?: string[]
  updatedAt?: number
}

let pushTimer: number | null = null
let isHydrating = false
let lastHydratedUpdatedAt = 0

export function hydrateFromUserMetadata(user: User | null, profileId?: number | null) {
  if (!user) return
  const meta = user.user_metadata as Record<string, unknown> | undefined
  const sync = (meta?.novelo_sync as SyncPayload | undefined) || {}
  if (typeof sync.updatedAt === 'number' && sync.updatedAt <= lastHydratedUpdatedAt) {
    return
  }
  if (typeof sync.updatedAt === 'number') {
    lastHydratedUpdatedAt = sync.updatedAt
  }

  isHydrating = true
  try {
    // 1. Friends
    if (Array.isArray(sync.friends) && sync.friends.length > 0) {
      try {
        const raw = localStorage.getItem('novelo_friends_v1')
        const map = raw ? JSON.parse(raw) : {}
        const ownerKey = user.id.trim().toLowerCase()
        const existing: StoredFriend[] = Array.isArray(map[ownerKey]) ? map[ownerKey] : []
        const byId = new Map<string, StoredFriend>()
        for (const f of existing) byId.set(f.id, f)
        for (const f of sync.friends) {
          if (f && typeof f.id === 'string' && !byId.has(f.id)) {
            byId.set(f.id, f)
          }
        }
        map[ownerKey] = Array.from(byId.values())
        localStorage.setItem('novelo_friends_v1', JSON.stringify(map))
        window.dispatchEvent(new CustomEvent(FRIENDS_EVENT))
      } catch {
        // ignore
      }
    }

    // 2. Notifications
    if (Array.isArray(sync.notifications) && sync.notifications.length > 0) {
      try {
        const existing = loadNotifications()
        const byId = new Map<string, AppNotification>()
        for (const n of existing) byId.set(n.id, n)
        for (const n of sync.notifications) {
          if (n && typeof n.id === 'string' && !byId.has(n.id)) {
            byId.set(n.id, n)
          }
        }
        const merged = Array.from(byId.values())
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 50)
        localStorage.setItem('novelo_notifications_v1', JSON.stringify(merged))
        window.dispatchEvent(new CustomEvent(NOTIFICATIONS_EVENT))
      } catch {
        // ignore
      }
    }

    // 3. Bio & Banner
    const pidKey = profileId ?? 'guest'
    const remoteBio =
      typeof sync.bio === 'string' ? sync.bio : typeof meta?.bio === 'string' ? meta.bio : undefined
    if (typeof remoteBio === 'string' && remoteBio) {
      try {
        localStorage.setItem(`novelo_profile_bio_${pidKey}`, remoteBio)
      } catch {
        // ignore
      }
    }
    const remoteBanner =
      typeof sync.banner === 'string'
        ? sync.banner
        : typeof meta?.banner === 'string'
          ? meta.banner
          : undefined
    if (typeof remoteBanner === 'string' && remoteBanner) {
      try {
        localStorage.setItem(`novelo_profile_banner_${pidKey}`, remoteBanner)
      } catch {
        // ignore
      }
    }
    window.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT))

    // 4. Game Stats (visits, likes, dislikes, favorites, userVote, userFavorited, userNotified)
    if (sync.gameStats && typeof sync.gameStats === 'object') {
      try {
        const raw = localStorage.getItem('novelo_game_stats_v1')
        const localMap: Record<string, StoredGameStats> = raw ? JSON.parse(raw) : {}
        for (const [gid, rStats] of Object.entries(sync.gameStats)) {
          if (!rStats || typeof rStats !== 'object') continue
          const lStats = localMap[gid]
          localMap[gid] = {
            visits: Math.max(Number(lStats?.visits) || 0, Number(rStats.visits) || 0),
            likes: Math.max(Number(lStats?.likes) || 0, Number(rStats.likes) || 0),
            dislikes: Math.max(Number(lStats?.dislikes) || 0, Number(rStats.dislikes) || 0),
            favorites: Math.max(Number(lStats?.favorites) || 0, Number(rStats.favorites) || 0),
            userVote: lStats?.userVote ?? rStats.userVote ?? null,
            userFavorited: Boolean(lStats?.userFavorited || rStats.userFavorited),
            userNotified: Boolean(lStats?.userNotified || rStats.userNotified),
          }
        }
        localStorage.setItem('novelo_game_stats_v1', JSON.stringify(localMap))
        window.dispatchEvent(new CustomEvent(GAME_STATS_EVENT))
      } catch {
        // ignore
      }
    }

    // 5. Novlux Balance
    if (typeof sync.balance === 'number' && Number.isFinite(sync.balance)) {
      try {
        localStorage.setItem('novelo_novlux_balance_v1', String(Math.max(0, Math.floor(sync.balance))))
        window.dispatchEvent(new CustomEvent(NOVLUX_BALANCE_EVENT))
      } catch {
        // ignore
      }
    }

    // 6. Avatar Body Colors
    if (sync.bodyColors && typeof sync.bodyColors === 'object') {
      try {
        localStorage.setItem('novelo_avatar_body_colors', JSON.stringify(sync.bodyColors))
        window.dispatchEvent(new CustomEvent(AVATAR_COLORS_EVENT))
      } catch {
        // ignore
      }
    }

    // 7. Equipped Clothing
    if (Array.isArray(sync.equippedClothing)) {
      try {
        localStorage.setItem('novelo_equipped_clothing_v1', JSON.stringify(sync.equippedClothing))
        window.dispatchEvent(new CustomEvent(EQUIPPED_CLOTHING_EVENT))
      } catch {
        // ignore
      }
    }
  } finally {
    isHydrating = false
  }
}

export function schedulePushUserSync(user: User | null, profileId?: number | null) {
  if (!supabase || !user || isHydrating) return
  if (pushTimer !== null) {
    window.clearTimeout(pushTimer)
  }
  pushTimer = window.setTimeout(async () => {
    pushTimer = null
    if (!supabase) return
    const pidKey = profileId ?? 'guest'
    let bio = ''
    let banner = ''
    let gameStats: Record<string, StoredGameStats> | undefined
    let balance: number | undefined
    let bodyColors: BodyColors | undefined
    let equippedClothing: string[] | undefined

    try {
      bio = localStorage.getItem(`novelo_profile_bio_${pidKey}`) || ''
      const rawBanner = localStorage.getItem(`novelo_profile_banner_${pidKey}`) || ''
      banner = rawBanner.startsWith('data:') ? '' : rawBanner
      const rawStats = localStorage.getItem('novelo_game_stats_v1')
      if (rawStats) gameStats = JSON.parse(rawStats)
      const rawBal = localStorage.getItem('novelo_novlux_balance_v1')
      if (rawBal !== null && !Number.isNaN(Number(rawBal))) balance = Number(rawBal)
      const rawColors = localStorage.getItem('novelo_avatar_body_colors')
      if (rawColors) bodyColors = JSON.parse(rawColors)
      const rawEq = localStorage.getItem('novelo_equipped_clothing_v1')
      if (rawEq) equippedClothing = JSON.parse(rawEq)
    } catch {
      // ignore
    }

    const friends = loadFriends(user.id)
    const notifications = loadNotifications().slice(0, 20).map((n) => ({
      ...n,
      thumbnail: n.thumbnail && n.thumbnail.startsWith('data:') ? undefined : n.thumbnail,
    }))

    const now = Date.now()
    lastHydratedUpdatedAt = now

    const payload: SyncPayload = {
      friends,
      notifications,
      bio,
      banner,
      gameStats,
      balance,
      bodyColors,
      equippedClothing,
      updatedAt: now,
    }

    try {
      await supabase.auth.updateUser({
        data: { novelo_sync: payload },
      })
      const ch = supabase.channel(`novelo-user-sync:${user.id}`)
      await ch.send({
        type: 'broadcast',
        event: 'sync',
        payload: { updatedAt: now },
      })
    } catch {
      // ignore sync errors
    }
  }, 600)
}
