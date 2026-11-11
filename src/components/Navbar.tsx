import { useState } from 'react'
import {
  Menu as MenuIcon,
  Search,
  MessageSquare,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
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
      <div className="h-full px-3 md:px-4 flex items-center justify-between gap-4">
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

        {/* Center: Search input */}
        <div className="flex items-center flex-1 max-w-md mx-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/40" />
            <input
              type="text"
              placeholder="Search"
              className="w-full h-8 pl-8 pr-12 rounded-lg bg-[#141414] border border-white/[0.08] text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-all"
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] text-white/40 font-mono">
              ⌘K
            </kbd>
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
