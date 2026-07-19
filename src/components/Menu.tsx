import { useState } from 'react'
import { Menu as MenuIcon, X, Search, Bell, MessageSquare, Home, Store, Plus, User, Users, Package, Paintbrush, ArrowLeftRight, Gift, Trophy, BookOpen, Shield, Gamepad2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/games', icon: Gamepad2, label: 'Games' },
  { href: '/marketplace', icon: Store, label: 'Marketplace' },
]

const MOBILE_NAV = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/games', icon: Gamepad2, label: 'Games' },
  { href: '/marketplace', icon: Store, label: 'Marketplace' },
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/friends', icon: Users, label: 'Friends' },
  { href: '/customize', icon: Paintbrush, label: 'Customize' },
  { href: '/inventory', icon: Package, label: 'Inventory' },
  { href: '/trades', icon: ArrowLeftRight, label: 'Trades' },
  { href: '/gifts', icon: Gift, label: 'Gifts' },
  { href: '/store', icon: Sparkles, label: 'Store' },
  { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { href: '/groups', icon: Users, label: 'Groups' },
  { href: '/studio', icon: Plus, label: 'Studio' },
  { href: '/forum', icon: BookOpen, label: 'Forum' },
  { href: '/trust-safety', icon: Shield, label: 'Trust & Safety' },
]

interface MenuProps {
  logoSrc?: string
  logoLabel?: string
  balance?: number
  loggedIn?: boolean
  onNav?: (href: string) => void
  unreadMessages?: number
  headerHidden?: boolean
}

export function Menu({
  logoSrc,
  logoLabel = 'N',
  balance = 0,
  loggedIn = false,
  onNav,
  unreadMessages = 0,
  headerHidden,
}: MenuProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header
        className={cn(
          "flex justify-center w-full bg-primary text-navbar-foreground shadow-sm h-16 z-50",
          "fixed top-0 left-0 right-0"
        )}
        style={{
          transition: "transform 0.3s ease-out, background-color 0.2s ease-out",
          transform: headerHidden ? "translateY(-100%)" : "translateY(0)",
        }}
      >
        <nav aria-label="Primary" className="relative flex items-stretch h-full w-full px-3 py-3 max-[420px]:px-2 overflow-hidden">
          <div className="flex items-stretch h-full gap-2 md:gap-4 w-full justify-between">
            <div className="flex flex-row items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                className="text-navbar-foreground hover:bg-white/10 size-10 flex md:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="size-6" /> : <MenuIcon className="size-6" />}
              </Button>

              <a
                href="/"
                onClick={(e) => { e.preventDefault(); onNav?.('/') }}
                className="flex items-center gap-2 no-underline shrink-0"
              >
                {logoSrc ? (
                  <img src={logoSrc} alt="" className="h-8 w-auto" />
                ) : (
                  <img src="/logo.png" alt="Logo" className="h-8 w-auto rounded" />
                )}
              </a>

              <div className="hidden md:flex items-stretch gap-0.5">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); onNav?.(item.href) }}
                    className="flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors no-underline text-navbar-foreground/75 hover:text-navbar-foreground hover:bg-white/10"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {!loggedIn ? (
                <>
                  <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-navbar-foreground hover:bg-white/20 hover:text-navbar-foreground">
                    Log In
                  </Button>
                  <Button variant="secondary" size="sm">
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-navbar-foreground/75 hover:text-navbar-foreground hover:bg-white/10 size-9"
                  >
                    <Search className="size-[19px]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-navbar-foreground/75 hover:text-navbar-foreground hover:bg-white/10 size-9 relative"
                  >
                    <Bell className="size-[19px]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-navbar-foreground/75 hover:text-navbar-foreground hover:bg-white/10 size-9 relative"
                  >
                    <MessageSquare className="size-[19px]" />
                    {unreadMessages > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex size-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                        <span className="relative inline-flex size-2 rounded-full bg-destructive" />
                      </span>
                    )}
                  </Button>

                  <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2.5 py-1.5 text-sm ml-1">
                    <img src="/currency.png" alt="" className="size-4" />
                    <span className="font-medium text-navbar-foreground">{balance.toLocaleString()}</span>
                  </div>

                  <div
                    className="size-8 rounded-full bg-white/20 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors ml-0.5"
                  >
                    <span className="text-xs font-bold text-navbar-foreground">U</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>

        {mobileOpen && (
          <div className="fixed left-0 right-0 bottom-0 bg-background z-50 overflow-y-auto border-t border-border"
            style={{ top: '64px' }}
          >
            <div className="flex flex-col gap-2 px-4 pb-6 pt-4">
              {MOBILE_NAV.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); onNav?.(item.href); setMobileOpen(false) }}
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
    </>
  )
}
