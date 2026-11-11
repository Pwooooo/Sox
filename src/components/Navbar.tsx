import {
  Menu as MenuIcon,
  Search,
  MessageSquare,
  Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavbarProps {
  balance?: number
  unreadMessages?: number
  unreadNotifications?: number
  sidebarCollapsed?: boolean
  onToggleSidebar?: () => void
}

export function Navbar({
  balance = 12450,
  unreadMessages = 3,
  unreadNotifications = 1,
  sidebarCollapsed = false,
  onToggleSidebar,
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

          {/* Logo & Brand name */}
          <a href="#" className="flex items-center gap-2.5 no-underline group select-none">
            <img
              src="/entropy.png"
              alt="Novelo"
              className="size-7 rounded-lg object-contain group-hover:scale-105 transition-transform"
            />
            <span className="text-lg font-black tracking-wider text-white uppercase font-sans">
              Novelo
            </span>
          </a>
        </div>

        {/* Center: Roblox-Style Search Bar (matches uploaded screenshot) */}
        <div className="flex items-center flex-1 max-w-xl mx-2 md:mx-6">
          <div className="relative w-full">
            {/* Search Icon */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#8892a0]">
              <Search className="size-4 stroke-[1.75]" />
            </div>

            {/* Roblox search input styling: rounded-md/lg, subtle gray border, bluish-slate placeholder */}
            <input
              type="text"
              placeholder="Search"
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-[#141414] hover:bg-[#181818] border border-white/15 focus:border-white/35 text-sm text-white placeholder:text-[#78849b] focus:outline-none transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Right Section: Currency, Messages, Notifications, Avatar */}
        <div className="flex items-center gap-2">
          {/* Novelo Currency Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141414] border border-white/[0.08] text-white">
            <img
              src="/currency.png"
              alt="Currency"
              className="size-4 object-contain shrink-0"
            />
            <span className="text-xs font-bold tabular-numbers tracking-tight">
              {balance.toLocaleString()}
            </span>
          </div>

          {/* Messages */}
          <button
            className="relative size-8 rounded-lg bg-[#141414] hover:bg-[#1a1a1a] border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
            title="Messages"
          >
            <MessageSquare className="size-3.5" />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 size-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-[#0a0a0a]">
                {unreadMessages}
              </span>
            )}
          </button>

          {/* Notifications */}
          <button
            className="relative size-8 rounded-lg bg-[#141414] hover:bg-[#1a1a1a] border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="size-3.5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-red-500" />
            )}
          </button>

          {/* User Avatar */}
          <div className="size-7 rounded-full bg-neutral-800 border border-white/20 flex items-center justify-center overflow-hidden cursor-pointer hover:border-white/40 transition-colors ml-0.5">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
              alt="User"
              className="size-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <span className="text-xs font-bold text-white">S</span>
          </div>
        </div>
      </div>
    </header>
  )
}
