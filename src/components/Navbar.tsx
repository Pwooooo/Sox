import { useState, useEffect, type MouseEvent } from 'react'
import {
  Menu as MenuIcon,
  Search,
  Bell,
  Settings,
  LogIn,
  Minus,
  Square,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'

interface NavbarProps {
  balance?: number
  unreadNotifications?: number
  sidebarCollapsed?: boolean
  onToggleSidebar?: () => void
  onOpenSettings?: () => void
  onNavigate?: (tab: string) => void
}

export function Navbar({
  balance = 1250,
  unreadNotifications = 1,
  sidebarCollapsed = false,
  onToggleSidebar,
  onOpenSettings,
  onNavigate,
}: NavbarProps) {
  const { user, setShowAuthModal } = useAuth()
  const [isTauri, setIsTauri] = useState(
    typeof window !== 'undefined' && ('__TAURI_INTERNALS__' in window || '__TAURI__' in window)
  )

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
          {/* 1. Notification Bell with Red Badge */}
          <button
            onClick={() => onNavigate?.('Messages')}
            className="relative size-7 flex items-center justify-center text-white/75 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
            title="Notifications & Messages"
          >
            <Bell className="size-5 stroke-[1.75]" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 size-4 rounded-full bg-[#e52525] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {unreadNotifications}
              </span>
            )}
          </button>

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
