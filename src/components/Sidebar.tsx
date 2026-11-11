import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  Home,
  User,
  MessageSquare,
  Users,
  Paintbrush,
  Package,
  ArrowLeftRight,
  Globe,
  Palette,
  BookOpen,
  Store,
  Sparkles,
  Gamepad2,
  Code2,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Discover', icon: Gamepad2, href: '/games' },
  { label: 'Profile', icon: User, href: '/profile' },
  { label: 'Messages', icon: MessageSquare, href: '/messages', badge: 3 },
  { label: 'Friends', icon: Users, href: '/friends', badge: 12 },
  { label: 'Avatar', icon: Paintbrush, href: '/avatar' },
  { label: 'Inventory', icon: Package, href: '/inventory' },
  { label: 'Trade', icon: ArrowLeftRight, href: '/trades' },
  { label: 'Communities', icon: Globe, href: '/communities' },
  { label: 'Create', icon: Code2, href: '/create' },
]

const BOTTOM_ITEMS = [
  { label: 'Marketplace', icon: Store, href: '/marketplace' },
  { label: 'Themes', icon: Palette, href: '/themes' },
  { label: 'Blog', icon: BookOpen, href: '/blog' },
]

interface SidebarProps {
  className?: string
  headerHidden?: boolean
}

export function Sidebar({ className, headerHidden }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <aside
      className={cn(
        "hidden md:flex fixed left-0 bottom-0 w-[240px] bg-[#0a0a0a] border-r border-white/[0.08] z-40 flex-col transition-all duration-300",
        headerHidden ? "top-0" : "top-16",
        className
      )}
    >
      <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col justify-between">
        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.href
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.href)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer border-none",
                  active
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-white/60 hover:bg-white/[0.05] hover:text-white bg-transparent"
                )}
              >
                <item.icon className="size-4 flex-shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge ? (
                  <span className="bg-white/10 text-white text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 tabular-numbers border border-white/10">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-white/[0.08]">
          <div className="flex flex-col gap-1">
            {BOTTOM_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.href)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer border-none bg-transparent text-white/50 hover:bg-white/[0.05] hover:text-white"
              >
                <item.icon className="size-4 flex-shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
