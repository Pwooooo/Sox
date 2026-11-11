import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Menu as MenuIcon,
  X,
  Search,
  Bell,
  MessageSquare,
  Home,
  Gamepad2,
  Store,
  Coins,
  User,
  Users,
  Paintbrush,
  Package,
  ArrowLeftRight,
  Sparkles,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const MAIN_NAV = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/games', label: 'Games', icon: Gamepad2 },
  { href: '/marketplace', label: 'Marketplace', icon: Store },
]

const MOBILE_MENU_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/games', label: 'Games', icon: Gamepad2 },
  { href: '/marketplace', label: 'Marketplace', icon: Store },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/friends', label: 'Friends', icon: Users },
  { href: '/avatar', label: 'Avatar', icon: Paintbrush },
  { href: '/inventory', label: 'Inventory', icon: Package },
  { href: '/trades', label: 'Trades', icon: ArrowLeftRight },
]

interface MenuProps {
  logoSrc?: string
  balance?: number
  loggedIn?: boolean
  unreadMessages?: number
  unreadNotifications?: number
  headerHidden?: boolean
  onNav?: (href: string) => void
}

export function Menu({
  logoSrc,
  balance = 12450,
  loggedIn = true,
  unreadMessages = 3,
  unreadNotifications = 1,
  headerHidden = false,
  onNav,
}: MenuProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigate = (href: string) => {
    navigate(href)
    onNav?.(href)
    setMobileOpen(false)
    setUserDropdownOpen(false)
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-16 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/[0.08] transition-transform duration-300",
          headerHidden ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <div className="max-w-[1700px] mx-auto h-full px-4 md:px-6 flex items-center justify-between gap-4">
          {/* Left section: Logo & Nav items */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden size-9 rounded-lg bg-card border border-white/[0.08] flex items-center justify-center text-white/80 hover:text-white"
              aria-label="Toggle Navigation"
            >
              {mobileOpen ? <X className="size-5" /> : <MenuIcon className="size-5" />}
            </button>

            {/* Brand Logo */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault()
                handleNavigate('/')
              }}
              className="flex items-center gap-2.5 text-white no-underline group"
            >
              {logoSrc ? (
                <img src={logoSrc} alt="Sox" className="h-7 w-auto" />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-lg bg-white text-black font-extrabold flex items-center justify-center text-lg tracking-tighter">
                    S
                  </div>
                  <span className="text-lg font-bold tracking-tight text-white group-hover:text-white/90">
                    Sox
                  </span>
                </div>
              )}
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {MAIN_NAV.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <button
                    key={item.href}
                    onClick={() => handleNavigate(item.href)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer border-none",
                      isActive
                        ? "bg-white/10 text-white"
                        : "bg-transparent text-white/60 hover:text-white hover:bg-white/[0.05]"
                    )}
                  >
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Center: Search input */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/40" />
              <input
                type="text"
                placeholder="Search games, creators, catalog..."
                className="w-full h-9 pl-9 pr-14 rounded-lg bg-[#141414] border border-white/[0.08] text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-[10px] text-white/50 font-mono">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right section: Balance, Notifications & User */}
          <div className="flex items-center gap-2.5">
            {loggedIn ? (
              <>
                {/* Lune / Currency Balance Pill */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141414] border border-white/[0.08] text-white">
                  <Coins className="size-4 text-amber-400 shrink-0" />
                  <span className="text-sm font-bold tabular-numbers tracking-tight">
                    {balance.toLocaleString()}
                  </span>
                </div>

                {/* Messages button */}
                <button
                  onClick={() => handleNavigate('/messages')}
                  className="relative size-9 rounded-lg bg-[#141414] hover:bg-[#1c1c1c] border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                  title="Messages"
                >
                  <MessageSquare className="size-4" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 size-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#0a0a0a]">
                      {unreadMessages}
                    </span>
                  )}
                </button>

                {/* Notifications button */}
                <button
                  onClick={() => handleNavigate('/notifications')}
                  className="relative size-9 rounded-lg bg-[#141414] hover:bg-[#1c1c1c] border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="size-4" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500" />
                  )}
                </button>

                {/* User Profile Pill / Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-1.5 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer border-none bg-transparent"
                  >
                    <div className="size-7 rounded-full bg-gradient-to-tr from-neutral-700 to-neutral-500 border border-white/20 flex items-center justify-center text-xs font-bold text-white">
                      P
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#111111] border border-white/[0.1] shadow-2xl py-1 z-50">
                      <div className="px-3.5 py-2 border-b border-white/[0.08]">
                        <p className="text-sm font-bold text-white leading-tight">Pwo</p>
                        <p className="text-xs text-white/50">@pwo</p>
                      </div>

                      <button
                        onClick={() => handleNavigate('/profile')}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer border-none bg-transparent"
                      >
                        <User className="size-3.5" />
                        Profile
                      </button>
                      <button
                        onClick={() => handleNavigate('/settings')}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer border-none bg-transparent"
                      >
                        <Settings className="size-3.5" />
                        Settings
                      </button>
                      <div className="my-1 border-t border-white/[0.08]" />
                      <button
                        onClick={() => handleNavigate('/login')}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer border-none bg-transparent"
                      >
                        <LogOut className="size-3.5" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavigate('/login')}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-white/80 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer border-none bg-transparent"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNavigate('/signup')}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-bold bg-white text-black hover:bg-white/90 transition-colors cursor-pointer border-none"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Fullscreen Navigation Dropdown */}
        {mobileOpen && (
          <div className="fixed inset-x-0 top-16 bottom-0 bg-[#0a0a0a] z-50 p-4 overflow-y-auto border-t border-white/[0.08] flex flex-col gap-2">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-10 pl-9 pr-4 rounded-lg bg-[#141414] border border-white/[0.08] text-sm text-white"
              />
            </div>
            {MOBILE_MENU_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigate(item.href)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer border-none bg-transparent"
              >
                <item.icon className="size-4 text-white/50" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </header>
    </>
  )
}
