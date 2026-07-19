import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Search, Bell, MessageSquare, Menu, X, Home, Store, Plus, User, Users, Package, Paintbrush, ArrowLeftRight, Gift, Trophy, BookOpen, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NAV_ITEMS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/marketplace', icon: Store, label: 'Marketplace' },
  { href: '/create', icon: Plus, label: 'Create' },
]

const MOBILE_NAV = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/marketplace', icon: Store, label: 'Marketplace' },
  { href: '/create', icon: Plus, label: 'Create' },
  { href: '/avatar', icon: Paintbrush, label: 'Customize' },
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/', icon: MessageSquare, label: 'Messages' },
  { href: '/', icon: Users, label: 'Friends' },
  { href: '/avatar', icon: Package, label: 'Inventory' },
  { href: '/', icon: ArrowLeftRight, label: 'Trades' },
  { href: '/', icon: Gift, label: 'Gifts' },
  { href: '/', icon: Trophy, label: 'Leaderboard' },
  { href: '/', icon: BookOpen, label: 'Forum' },
  { href: '/', icon: Shield, label: 'Trust & Safety' },
]

export function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="flex justify-center w-full bg-primary text-navbar-foreground shadow-sm h-16 z-50 fixed top-0 left-0 right-0">
      <nav aria-label="Primary" className="relative flex items-stretch h-full w-full px-3 py-3 max-[420px]:px-2 overflow-hidden">
        <div className="flex items-stretch h-full gap-2 md:gap-4 w-full justify-between">
          <div className="flex flex-row items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="text-navbar-foreground hover:bg-primary/80 size-10 flex md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </Button>
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); navigate('/') }}
              className="flex items-center gap-2 no-underline shrink-0"
            >
              <div className="size-8 bg-white/20 text-white rounded-lg flex items-center justify-center font-extrabold text-sm font-sans backdrop-blur-sm">
                N
              </div>
              <span className="text-base font-bold tracking-tight text-navbar-foreground hidden sm:block">Novelo</span>
            </a>
            <div className="hidden md:flex items-stretch gap-0.5">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); navigate(item.href) }}
                  className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors no-underline ${
                    location.pathname === item.href
                      ? 'text-navbar-foreground bg-white/15'
                      : 'text-navbar-foreground/75 hover:text-navbar-foreground hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="text-navbar-foreground/75 hover:text-navbar-foreground hover:bg-white/10 size-9"
            >
              <Search className="size-[18px]" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-navbar-foreground/75 hover:text-navbar-foreground hover:bg-white/10 size-9 relative"
            >
              <Bell className="size-[18px]" />
              <span className="absolute top-1.5 right-1.5 size-2 bg-white rounded-full" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-navbar-foreground/75 hover:text-navbar-foreground hover:bg-white/10 size-9"
            >
              <MessageSquare className="size-[18px]" />
            </Button>

            <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2.5 py-1.5 text-sm ml-1">
              <span className="text-gold font-bold text-xs">B</span>
              <span className="font-medium text-navbar-foreground text-xs">12,450</span>
            </div>

            <div
              className="size-8 rounded-full bg-white/20 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors ml-0.5"
              onClick={() => navigate('/profile')}
            >
              <span className="text-xs font-bold text-navbar-foreground">U</span>
            </div>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed top-16 left-0 right-0 bottom-0 bg-background z-50 overflow-y-auto md:hidden">
          <div className="flex flex-col gap-2 px-4 pb-6 pt-4">
            {MOBILE_NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => { e.preventDefault(); navigate(item.href); setMobileOpen(false) }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors hover:text-accent-foreground text-foreground no-underline"
              >
                <item.icon className="size-5 text-muted-foreground" />
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
