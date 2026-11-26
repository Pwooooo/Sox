import { useState, useEffect, useRef, type MouseEvent } from 'react'
import {
  Menu as MenuIcon,
  Search,
  Bell,
  Settings,
  LogIn,
  Minus,
  Square,
  X,
  CheckCheck,
  Trash2,
  Gamepad2,
  Users,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'
import { PlayerModel3D } from '@/components/PlayerModel3D'
import {
  loadNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  clearNotifications,
  NOTIFICATIONS_EVENT,
  type AppNotification,
} from '@/lib/notifications'

function formatRelativeTime(timestamp: number): string {
  const diffSec = Math.max(0, Math.floor((Date.now() - timestamp) / 1000))
  if (diffSec < 60) return 'Just now'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  return `${Math.floor(diffHr / 24)}d ago`
}

interface NavbarProps {
  balance?: number
  unreadNotifications?: number
  sidebarCollapsed?: boolean
  onToggleSidebar?: () => void
  onOpenSettings?: () => void
  onNavigate?: (tab: string) => void
}

export function Navbar({
  balance = 50,
  unreadNotifications = 0,
  sidebarCollapsed = false,
  onToggleSidebar,
  onOpenSettings,
  onNavigate,
}: NavbarProps) {
  const { user, setShowAuthModal } = useAuth()
  const [isTauri, setIsTauri] = useState(
    typeof window !== 'undefined' && ('__TAURI_INTERNALS__' in window || '__TAURI__' in window)
  )
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread'>('all')
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadNotifications())
  const notifContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sync = () => setNotifications(loadNotifications())
    window.addEventListener(NOTIFICATIONS_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(NOTIFICATIONS_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  useEffect(() => {
    if (!notificationsOpen) return
    const onMouseDown = (e: globalThis.MouseEvent) => {
      if (notifContainerRef.current && !notifContainerRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNotificationsOpen(false)
    }
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [notificationsOpen])

  const liveUnreadCount =
    unreadNotifications > 0
      ? unreadNotifications
      : notifications.filter((n) => !n.read).length
  const visibleNotifications =
    notifFilter === 'unread' ? notifications.filter((n) => !n.read) : notifications

  useEffect(() => {
    if (typeof window !== 'undefined' && ('__TAURI_INTERNALS__' in window || '__TAURI__' in window)) {
      setIsTauri(true)
    }
  }, [])

  const handleMinimize = async () => {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window')
      await getCurrentWindow().minimize()
    } catch (e) {
      console.error(e)
    }
  }

  const handleMaximize = async () => {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window')
      await getCurrentWindow().toggleMaximize()
    } catch (e) {
      console.error(e)
    }
  }

  const handleClose = async () => {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window')
      await getCurrentWindow().close()
    } catch (e) {
      console.error(e)
    }
  }

  const handleHeaderMouseDown = async (e: MouseEvent<HTMLElement>) => {
    if (!isTauri || e.button !== 0) return
    const target = e.target as HTMLElement
    if (target.closest('button, input, a, [role="button"]')) return
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window')
      if (e.detail === 2) {
        await getCurrentWindow().toggleMaximize()
      } else {
        await getCurrentWindow().startDragging()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <header
      data-tauri-drag-region
      onMouseDown={handleHeaderMouseDown}
      style={{
        backgroundColor: 'rgba(10, 10, 10, 0.3)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      className={cn(
        "fixed top-0 right-0 z-40 h-14 border-none transition-all duration-300 select-none",
        sidebarCollapsed ? "left-0 px-3 md:px-5" : "left-0 md:left-[230px] px-3 md:px-6"
      )}
    >
      <div data-tauri-drag-region className="h-full flex items-center justify-between gap-4">
        {/* Left Section: Only visible when sidebar is collapsed */}
        {sidebarCollapsed ? (
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onToggleSidebar}
              aria-label="Open Sidebar"
              className="size-8 rounded-lg hover:bg-white/[0.08] flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
            >
              <MenuIcon className="size-5" />
            </button>

            <button
              onClick={() => onNavigate?.('Home')}
              className="flex items-center gap-2 bg-transparent border-none p-0 cursor-pointer group select-none"
            >
              <img
                src="/novelo-icon.png"
                alt="Novelo"
                className="h-10 w-auto max-h-11 object-contain group-hover:scale-105 transition-transform"
              />
            </button>
          </div>
        ) : (
          /* Mobile menu toggle when sidebar is active on desktop but hidden on small screens */
          <div className="flex md:hidden items-center gap-3 shrink-0">
            <button
              onClick={onToggleSidebar}
              aria-label="Toggle Sidebar"
              className="size-8 rounded-lg hover:bg-white/[0.08] flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
            >
              <MenuIcon className="size-5" />
            </button>
          </div>
        )}

        {/* Center: Roblox-Style Search Bar */}
        <div className="flex items-center flex-1 max-w-xl mx-2 md:mx-4">
          <div className="relative w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#8892a0]">
              <Search className="size-4 stroke-[1.75]" />
            </div>

            <input
              type="text"
              placeholder="Search experiences, items, or players"
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-[#141414]/70 hover:bg-[#181818]/80 border border-white/15 focus:border-white/35 text-sm text-white placeholder:text-[#78849b] focus:outline-none transition-all shadow-inner backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Right Section: Roblox Top-Right Bar (Bell with badge, Currency + balance, Settings Gear) */}
        <div className="flex items-center gap-4 md:gap-5 pr-1 shrink-0">
          {/* 1. Notification Bell with Red Badge & Dropdown Tab */}
          <div ref={notifContainerRef} className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen((prev) => !prev)}
              className={cn(
                'relative size-7 flex items-center justify-center rounded-md transition-colors cursor-pointer border-none bg-transparent',
                notificationsOpen ? 'text-white bg-white/10' : 'text-white/75 hover:text-white',
              )}
              title="Notifications"
            >
              <Bell className="size-5 stroke-[1.75]" />
              {liveUnreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#e52525] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {liveUnreadCount > 99 ? '99+' : liveUnreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2.5 w-[340px] max-w-[calc(100vw-24px)] rounded-xl bg-[#141418] border border-white/10 shadow-[0_18px_48px_rgba(0,0,0,0.85)] overflow-hidden z-50">
                {/* Header */}
                <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Notifications</span>
                    {liveUnreadCount > 0 && (
                      <span className="text-xs font-bold text-white tabular-numbers">
                        {liveUnreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {notifications.some((n) => !n.read) && (
                      <button
                        type="button"
                        onClick={() => markAllNotificationsRead()}
                        title="Mark all as read"
                        className="h-7 px-2 rounded-md text-[11px] font-semibold text-white/70 hover:text-white hover:bg-white/[0.08] flex items-center gap-1 cursor-pointer border-none bg-transparent transition-colors"
                      >
                        <CheckCheck className="size-3.5" />
                        <span>Read all</span>
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        type="button"
                        onClick={() => clearNotifications()}
                        title="Clear all notifications"
                        className="size-7 rounded-md text-white/55 hover:text-white hover:bg-white/[0.08] flex items-center justify-center cursor-pointer border-none bg-transparent transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Tabs: All / Unread */}
                <div className="px-3 pt-2 pb-1 flex items-center gap-1.5 border-b border-white/[0.06]">
                  {(['all', 'unread'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setNotifFilter(tab)}
                      className={cn(
                        'px-2.5 py-1 rounded-md text-xs font-semibold capitalize cursor-pointer border-none transition-colors',
                        notifFilter === tab
                          ? 'bg-white/[0.12] text-white'
                          : 'bg-transparent text-white/55 hover:text-white/85',
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Notification List */}
                <div className="max-h-[320px] overflow-y-auto no-scrollbar divide-y divide-white/[0.05]">
                  {visibleNotifications.length > 0 ? (
                    visibleNotifications.map((item) => {
                      const Icon =
                        item.category === 'experience'
                          ? Gamepad2
                          : item.category === 'social'
                            ? Users
                            : Info
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            markNotificationRead(item.id)
                            if (item.actionTab) {
                              onNavigate?.(item.actionTab)
                              setNotificationsOpen(false)
                            }
                          }}
                          className={cn(
                            'w-full px-4 py-3 text-left flex items-start gap-3 hover:bg-white/[0.05] transition-colors cursor-pointer border-none',
                            item.read ? 'bg-transparent' : 'bg-white/[0.03]',
                          )}
                        >
                          {item.category === 'experience' ? (
                            <div className="w-14 aspect-[16/9] rounded-md bg-white/[0.08] overflow-hidden flex items-center justify-center text-white/80 shrink-0 mt-0.5">
                              {item.thumbnail ? (
                                <img
                                  src={item.thumbnail}
                                  alt={item.title}
                                  className="size-full object-cover"
                                />
                              ) : (
                                <Gamepad2 className="size-4" />
                              )}
                            </div>
                          ) : item.category === 'social' ? (
                            <div className="size-9 rounded-full bg-white/[0.08] border border-white/10 overflow-hidden flex items-center justify-center shrink-0 mt-0.5">
                              {item.avatarUrl ? (
                                <img
                                  src={item.avatarUrl}
                                  alt={item.title}
                                  className="size-full object-cover"
                                />
                              ) : (
                                <PlayerModel3D mode="headshot" className="w-full h-full" />
                              )}
                            </div>
                          ) : (
                            <div className="size-8 rounded-lg bg-white/[0.08] flex items-center justify-center text-white/80 shrink-0 mt-0.5">
                              <Icon className="size-4" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-bold text-white truncate m-0">
                                {item.title}
                              </p>
                              <span className="text-[10px] text-white/40 shrink-0">
                                {formatRelativeTime(item.createdAt)}
                              </span>
                            </div>
                            <p className="text-[11px] text-white/60 m-0 mt-0.5 leading-snug">
                              {item.body}
                            </p>
                          </div>
                          {!item.read && (
                            <span className="size-2 rounded-full bg-[#3b82f6] shrink-0 mt-1.5" />
                          )}
                        </button>
                      )
                    })
                  ) : (
                    <div className="py-10 px-4 flex flex-col items-center justify-center gap-2 text-center">
                      <Bell className="size-6 text-white/25" />
                      <p className="text-xs font-medium text-white/50 m-0">
                        {notifFilter === 'unread'
                          ? 'No unread notifications.'
                          : "You're all caught up — no notifications right now."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-3 py-2 border-t border-white/[0.08] bg-black/20 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setNotificationsOpen(false)
                      onOpenSettings?.()
                    }}
                    className="text-[11px] font-semibold text-white/60 hover:text-white cursor-pointer border-none bg-transparent py-1 px-1.5"
                  >
                    Notification Settings
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. Currency Icon & Balance (Opens Store) */}
          <button
            onClick={() => onNavigate?.('Store')}
            className="flex items-center gap-1.5 cursor-pointer text-white/90 hover:text-white select-none bg-transparent border-none p-0"
            title="Novlux Balance (Open Store)"
          >
            <img
              src="/currency.png"
              alt="Currency"
              className="size-5 object-contain shrink-0"
            />
            <span className="text-sm font-bold tabular-numbers tracking-tight">
              {balance.toLocaleString()}
            </span>
          </button>

          {/* 3. Settings Gear */}
          <button
            onClick={onOpenSettings}
            className="size-7 flex items-center justify-center text-white/75 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
            title="Settings"
          >
            <Settings className="size-5 stroke-[1.75]" />
          </button>

          {/* 4. Sign In (Sign Out & Profile live in Settings / Sidebar) */}
          {!user && (
            <button
              onClick={() => setShowAuthModal(true)}
              className="h-7 px-3 rounded-[7px] bg-white hover:bg-white/90 text-[#0c0d10] text-xs font-bold flex items-center gap-1.5 cursor-pointer border-none transition-colors"
            >
              <LogIn className="size-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Desktop App Window Controls (Minimize, Maximize, Close) */}
          {isTauri && (
            <div className="flex items-center ml-1 gap-0.5">
              <button
                onClick={handleMinimize}
                className="size-7 rounded flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border-none bg-transparent"
                title="Minimize"
              >
                <Minus className="size-3.5 stroke-[2]" />
              </button>
              <button
                onClick={handleMaximize}
                className="size-7 rounded flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border-none bg-transparent"
                title="Maximize"
              >
                <Square className="size-3 stroke-[2]" />
              </button>
              <button
                onClick={handleClose}
                className="size-7 rounded flex items-center justify-center text-white/70 hover:text-white hover:bg-[#e81123] transition-colors cursor-pointer border-none bg-transparent"
                title="Close"
              >
                <X className="size-3.5 stroke-[2]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
