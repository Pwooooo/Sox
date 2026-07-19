import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  Home, User, MessageSquare, Users, Paintbrush, Package,
  ArrowLeftRight, Globe, Palette, BookOpen, Store, Gift,
  Sparkles
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Profile', icon: User, href: '/profile' },
  { label: 'Messages', icon: MessageSquare, href: '/messages', badge: 1 },
  { label: 'Friends', icon: Users, href: '/friends', badge: 16 },
  { label: 'Avatar', icon: Paintbrush, href: '/avatar' },
  { label: 'Inventory', icon: Package, href: '/inventory' },
  { label: 'Trade', icon: ArrowLeftRight, href: '/trades' },
  { label: 'Communities', icon: Globe, href: '/communities' },
  { label: 'Themes', icon: Palette, href: '/themes' },
  { label: 'Blog', icon: BookOpen, href: '/blog' },
]

const BOTTOM_ITEMS = [
  { label: 'Official Store', icon: Store, href: '/store' },
  { label: 'Buy Gift Cards', icon: Gift, href: '/gift-cards' },
]

interface SidebarProps {
  className?: string
  announcementDismissed?: boolean
  headerHidden?: boolean
}

export function Sidebar({ className, announcementDismissed = true, headerHidden }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <aside className={cn(
      "fixed left-0 bottom-0 w-[240px] bg-background border-r border-border z-40 flex flex-col transition-all duration-300",
      announcementDismissed
        ? headerHidden ? "top-0" : "top-16"
        : headerHidden ? "top-0" : "top-[calc(52px+64px)]",
      className
    )}>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.href
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.href)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer border-none bg-transparent",
                  active
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                <item.icon className="size-[18px] flex-shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge ? (
                  <span className="bg-primary text-primary-foreground text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>

        <div className="mt-2 pt-2 border-t border-border">
          <div className="flex flex-col gap-0.5">
            {BOTTOM_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.href)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer border-none bg-transparent text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              >
                <item.icon className="size-[18px] flex-shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 mx-1 p-4 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="size-4 text-primary" />
            <span className="text-sm font-semibold">Brads+</span>
          </div>
          <p className="text-[12px] text-muted-foreground leading-relaxed mb-3">
            Get exclusive items, priority access, and more.
          </p>
          <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer border-none">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  )
}
