export type NotificationCategory = 'experience' | 'social' | 'system'

export interface AppNotification {
  id: string
  title: string
  body: string
  category: NotificationCategory
  createdAt: number
  read: boolean
  actionTab?: string
  thumbnail?: string
  avatarUrl?: string
}

const STORAGE_KEY = 'novelo_notifications_v1'
export const NOTIFICATIONS_EVENT = 'novelo-notifications-changed'
const MAX_NOTIFICATIONS = 50

export function loadNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (n): n is AppNotification =>
        Boolean(n && typeof n.id === 'string' && typeof n.title === 'string'),
    )
  } catch {
    return []
  }
}

function saveNotifications(list: AppNotification[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_NOTIFICATIONS)))
  } catch {
    // ignore storage errors
  }
  window.dispatchEvent(new CustomEvent(NOTIFICATIONS_EVENT))
}

export function addNotification(input: {
  title: string
  body: string
  category?: NotificationCategory
  actionTab?: string
  thumbnail?: string
  avatarUrl?: string
}): AppNotification {
  const item: AppNotification = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: input.title,
    body: input.body,
    category: input.category || 'system',
    createdAt: Date.now(),
    read: false,
    actionTab: input.actionTab,
    thumbnail: input.thumbnail,
    avatarUrl: input.avatarUrl,
  }
  const current = loadNotifications()
  saveNotifications([item, ...current])
  return item
}

export function markNotificationRead(id: string) {
  const current = loadNotifications()
  let changed = false
  const next = current.map((n) => {
    if (n.id === id && !n.read) {
      changed = true
      return { ...n, read: true }
    }
    return n
  })
  if (changed) saveNotifications(next)
}

export function markAllNotificationsRead() {
  const current = loadNotifications()
  if (current.every((n) => n.read)) return
  saveNotifications(current.map((n) => ({ ...n, read: true })))
}

export function clearNotifications() {
  saveNotifications([])
}
