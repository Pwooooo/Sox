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
const SYNC_TS_KEY = 'novelo_sync_updated_at_v1'

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

function getLocalUpdatedAt(): number {
  try {
    return Number(localStorage.getItem(SYNC_TS_KEY) || 0) || 0
  } catch {
    return 0
  }
}

function setLocalUpdatedAt(ts: number) {
  try {
    localStorage.setItem(SYNC_TS_KEY, String(ts))
  } catch {
    // ignore
  }
}

export function hydrateFromUserMetadata(user: User | null, profileId?: number | null) {
  if (!user) return
  const meta = user.user_metadata as Record<string, unknown> | undefined
  const sync = (meta?.novelo_sync as SyncPayload | undefined) || {}
  const remoteTs = typeof sync.updatedAt === 'number' ? sync.updatedAt : 0
  const localTs = getLocalUpdatedAt()

  // Only overwrite local state if remote snapshot is strictly newer than local edits
  if (remoteTs > 0 && remoteTs <= localTs) {
    return
  }

  isHydrating = true
  try {
    // 1. Friends
    if (Array.isArray(sync.friends)) {
      try {
        const raw = localStorage.getItem('novelo_friends_v1')
        const map = raw ? JSON.parse(raw) : {}
        const ownerKey = user.id.trim().toLowerCase()
        map[ownerKey] = sync.friends
        localStorage.setItem('novelo_friends_v1', JSON.stringify(map))
        window.dispatchEvent(new CustomEvent(FRIENDS_EVENT))
      } catch {
        // ignore
      }
    }

    // 2. Notifications
    if (Array.isArray(sync.notifications)) {
      try {
        localStorage.setItem('novelo_notifications_v1', JSON.stringify(sync.notifications.slice(0, 50)))
        window.dispatchEvent(new CustomEvent(NOTIFICATIONS_EVENT))
      } catch {
        // ignore
      }
    }

    // 3. Bio & Banner
    const pidKey = profileId ?? 'guest'
    const remoteBio =
      typeof sync.bio === 'string' ? sync.bio : typeof meta?.bio === 'string' ? meta.bio : undefined
    if (typeof remoteBio === 'string') {
      try {
        if (remoteBio) localStorage.setItem(`novelo_profile_bio_${pidKey}`, remoteBio)
        else localStorage.removeItem(`novelo_profile_bio_${pidKey}`)
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

    // 4. Game Stats (preserve exact likes/dislikes/userVote from newer snapshot; visits monotonic)
    if (sync.gameStats && typeof sync.gameStats === 'object') {
      try {
        const raw = localStorage.getItem('novelo_game_stats_v1')
        const localMap: Record<string, StoredGameStats> = raw ? JSON.parse(raw) : {}
        for (const [gid, rStats] of Object.entries(sync.gameStats)) {
          if (!rStats || typeof rStats !== 'object') continue
          const lStats = localMap[gid]
          localMap[gid] = {
            visits: Math.max(Number(lStats?.visits) || 0, Number(rStats.visits) || 0),
            likes: Math.max(0, Number(rStats.likes) || 0),
            dislikes: Math.max(0, Number(rStats.dislikes) || 0),
            favorites: Math.max(0, Number(rStats.favorites) || 0),
            userVote: rStats.userVote === 'like' || rStats.userVote === 'dislike' ? rStats.userVote : null,
            userFavorited: Boolean(rStats.userFavorited),
            userNotified: Boolean(rStats.userNotified),
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

    if (remoteTs > 0) {
      setLocalUpdatedAt(remoteTs)
    }
  } finally {
    isHydrating = false
  }
}

export function schedulePushUserSync(user: User | null, profileId?: number | null) {
  if (!supabase || !user || isHydrating) return
  const changeTs = Date.now()
  setLocalUpdatedAt(changeTs)

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

    const payload: SyncPayload = {
      friends,
      notifications,
      bio,
      banner,
      gameStats,
      balance,
      bodyColors,
      equippedClothing,
      updatedAt: changeTs,
    }

    try {
      await supabase.auth.updateUser({
        data: { novelo_sync: payload },
      })
      const ch = supabase.channel(`novelo-user-sync:${user.id}`)
      await ch.send({
        type: 'broadcast',
        event: 'sync',
        payload: { updatedAt: changeTs },
      })
    } catch {
      // ignore sync errors
    }
  }, 400)
}
