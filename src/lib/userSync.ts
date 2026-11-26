import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { FRIENDS_EVENT, loadFriends, type StoredFriend } from '@/lib/friendsStore'
import { NOTIFICATIONS_EVENT, loadNotifications, type AppNotification } from '@/lib/notifications'

export const PROFILE_UPDATED_EVENT = 'novelo-profile-updated'

interface SyncPayload {
  friends?: StoredFriend[]
  notifications?: AppNotification[]
  bio?: string
  banner?: string
  updatedAt?: number
}

let pushTimer: number | null = null
let isHydrating = false

export function hydrateFromUserMetadata(user: User | null, profileId?: number | null) {
  if (!user) return
  const meta = user.user_metadata as Record<string, unknown> | undefined
  const sync = (meta?.novelo_sync as SyncPayload | undefined) || {}

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
    const remoteBio = typeof sync.bio === 'string' ? sync.bio : (typeof meta?.bio === 'string' ? meta.bio : undefined)
    if (typeof remoteBio === 'string' && remoteBio) {
      try {
        localStorage.setItem(`novelo_profile_bio_${pidKey}`, remoteBio)
      } catch {
        // ignore
      }
    }
    const remoteBanner =
      typeof sync.banner === 'string' ? sync.banner : (typeof meta?.banner === 'string' ? meta.banner : undefined)
    if (typeof remoteBanner === 'string' && remoteBanner) {
      try {
        localStorage.setItem(`novelo_profile_banner_${pidKey}`, remoteBanner)
      } catch {
        // ignore
      }
    }
    window.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT))
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
    try {
      bio = localStorage.getItem(`novelo_profile_bio_${pidKey}`) || ''
      const rawBanner = localStorage.getItem(`novelo_profile_banner_${pidKey}`) || ''
      banner = rawBanner.startsWith('data:') ? '' : rawBanner
    } catch {
      // ignore
    }

    const friends = loadFriends(user.id)
    const notifications = loadNotifications().slice(0, 25).map((n) => ({
      ...n,
      // Omit large inline data-URI thumbnails from auth metadata to stay well under JWT size limits
      thumbnail: n.thumbnail && n.thumbnail.startsWith('data:') ? undefined : n.thumbnail,
    }))

    const payload: SyncPayload = {
      friends,
      notifications,
      bio,
      banner,
      updatedAt: Date.now(),
    }

    try {
      await supabase.auth.updateUser({
        data: { novelo_sync: payload },
      })
    } catch {
      // ignore sync errors
    }
  }, 1000)
}
