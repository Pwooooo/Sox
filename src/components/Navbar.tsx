import {
  Menu as MenuIcon,
  Search,
  Bell,
  Settings,
} from 'lucide-react'

interface NavbarProps {
  balance?: number
  unreadNotifications?: number
  sidebarCollapsed?: boolean
  onToggleSidebar?: () => void
  onOpenSettings?: () => void
}

export function Navbar({
  balance = 0,
  unreadNotifications = 1,
  sidebarCollapsed = false,
  onToggleSidebar,
  onOpenSettings,
}: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0a0a0a] border-b border-white/[0.08]">
      <div className="h-full px-3 md:px-5 flex items-center justify-between gap-4">
        {/* Left Section: Brand Logo & Sidebar Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle Sidebar"
            className="size-8 rounded-lg hover:bg-white/[0.08] flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
          >
            <MenuIcon className="size-5" />
          </button>

          {/* Novelo Logo */}
          <a href="#" className="flex items-center gap-2 no-underline group select-none">
            <img
              src="/novelo-icon.png"
              alt="Novelo"
              className="h-8 w-auto max-h-9 object-contain group-hover:scale-105 transition-transform"
            />
          </a>
        </div>

        {/* Center: Roblox-Style Search Bar */}
        <div className="flex items-center flex-1 max-w-xl mx-2 md:mx-6">
          <div className="relative w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#8892a0]">
              <Search className="size-4 stroke-[1.75]" />
            </div>

            <input
              type="text"
              placeholder="Search"
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-[#141414] hover:bg-[#181818] border border-white/15 focus:border-white/35 text-sm text-white placeholder:text-[#78849b] focus:outline-none transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Right Section: Roblox Top-Right Bar (Bell with badge, Currency + balance, Settings Gear) */}
        <div className="flex items-center gap-4 md:gap-5 pr-1">
          {/* 1. Notification Bell with Red Badge */}
          <button
            className="relative size-7 flex items-center justify-center text-white/75 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
            title="Notifications"
          >
            <Bell className="size-5 stroke-[1.75]" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 size-4 rounded-full bg-[#e52525] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* 2. Currency Icon & Balance */}
          <div className="flex items-center gap-1.5 cursor-pointer text-white/90 hover:text-white select-none">
            <img
              src="/currency.png"
              alt="Currency"
              className="size-5 object-contain shrink-0"
            />
            <span className="text-sm font-bold tabular-numbers tracking-tight">
              {balance.toLocaleString()}
            </span>
          </div>

          {/* 3. Settings Gear */}
          <button
            onClick={onOpenSettings}
            className="size-7 flex items-center justify-center text-white/75 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
            title="Settings"
          >
            <Settings className="size-5 stroke-[1.75]" />
          </button>
        </div>
      </div>
    </header>
  )
}
