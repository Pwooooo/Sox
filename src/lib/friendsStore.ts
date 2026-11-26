import type { UserProfile } from '@/lib/supabase'

export interface StoredFriend {
  id: string
  profileId?: number
  username: string
  displayName?: string | null
  addedAt: number
}

const STORAGE_KEY = 'novelo_friends_v1'
export const FRIENDS_EVENT = 'novelo-friends-changed'

function getOwnerKey(ownerKey?: string): string {
  return (ownerKey || 'guest').trim().toLowerCase() || 'guest'
}

function readAll(): Record<string, StoredFriend[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeAll(map: Record<string, StoredFriend[]>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // ignore storage errors
  }
  window.dispatchEvent(new CustomEvent(FRIENDS_EVENT))
}

export function loadFriends(ownerKey?: string): StoredFriend[] {
  const map = readAll()
  const list = map[getOwnerKey(ownerKey)]
  return Array.isArray(list) ? list : []
}

export function addFriendFromProfile(profile: UserProfile, ownerKey?: string): StoredFriend[] {
  const key = getOwnerKey(ownerKey)
  const map = readAll()
  const current = Array.isArray(map[key]) ? map[key] : []
  const exists = current.some(
    (f) =>
      f.id === profile.auth_uid ||
      (profile.id && f.profileId === profile.id) ||
      f.username.toLowerCase() === profile.username.toLowerCase(),
  )
  if (exists) return current
  const next: StoredFriend[] = [
    {
      id: profile.auth_uid || String(profile.id),
      profileId: profile.id,
      username: profile.username,
      displayName: profile.display_name,
      addedAt: Date.now(),
    },
    ...current,
  ]
  map[key] = next
  writeAll(map)
  return next
}

export function removeFriend(friendId: string, ownerKey?: string): StoredFriend[] {
  const key = getOwnerKey(ownerKey)
  const map = readAll()
  const current = Array.isArray(map[key]) ? map[key] : []
  const next = current.filter((f) => f.id !== friendId)
  map[key] = next
  writeAll(map)
  return next
}
