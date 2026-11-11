import { useState } from 'react'
import {
  Menu as MenuIcon,
  X,
  Search,
  Coins,
  MessageSquare,
  Bell,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavbarProps {
  balance?: number
  unreadMessages?: number
  unreadNotifications?: number
  onToggleSidebar?: () => void
}

export function Navbar({
  balance = 12450,
  unreadMessages = 3,
  unreadNotifications = 1,
  onToggleSidebar,
}: NavbarProps) {
  const [activeTab, setActiveTab] = useState<'Discover' | 'Marketplace' | 'Create'>('Discover')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/[0.08]">
      <div className="h-full px-3 md:px-5 flex items-center justify-between gap-4">
        {/* Left Section: Menu Toggle, Brand Logo & Navigation Links */}
        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle Sidebar"
            className="size-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <MenuIcon className="size-4" />
          </button>

          {/* Logo */}
          <a href="#" className="flex items-center gap-2 no-underline group select-none">
            <div className="size-7 rounded-lg bg-white text-black font-extrabold flex items-center justify-center text-base tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
              S
            </div>
            <span className="text-base font-bold tracking-tight text-white">
              Sox
            </span>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 ml-2">
            {(['Discover', 'Marketplace', 'Create'] as const).map((tab) => {
              const active = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer border-none",
                    active
                      ? "bg-white/10 text-white"
                      : "bg-transparent text-white/60 hover:text-white hover:bg-white/[0.05]"
                  )}
                >
                  {tab}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Center: Search input */}
        <div className="hidden sm:flex items-center flex-1 max-w-md mx-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/40" />
            <input
              type="text"
              placeholder="Search experiences..."
              className="w-full h-8 pl-8 pr-12 rounded-lg bg-[#141414] border border-white/[0.08] text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-all"
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] text-white/40 font-mono">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Section: Currency, Messages, Notifications, Avatar */}
        <div className="flex items-center gap-2">
          {/* Currency Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141414] border border-white/[0.08] text-white">
            <Coins className="size-3.5 text-amber-400 shrink-0" />
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
          <div className="size-7 rounded-full bg-gradient-to-tr from-neutral-700 to-neutral-500 border border-white/20 flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:border-white/40 transition-colors ml-1">
            P
          </div>
        </div>
      </div>
    </header>
  )
}
