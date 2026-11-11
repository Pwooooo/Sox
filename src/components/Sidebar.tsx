import {
  Home,
  Gamepad2,
  Users,
  MessageSquare,
  User,
  Paintbrush,
  Package,
  Store,
  ShoppingBag,
  ArrowLeftRight,
  Hammer,
  ExternalLink,
  MessagesSquare,
  PanelLeftClose,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  collapsed?: boolean
  activeItem?: string
  username?: string
  onSelect?: (item: string) => void
  onToggleCollapse?: () => void
}

interface NavItemDef {
  label: string
  icon: any
  badge?: number
  isExternal?: boolean
}

const SIDEBAR_ITEMS: NavItemDef[] = [
  { label: 'Home', icon: Home },
  { label: 'Games', icon: Gamepad2 },
  { label: 'Friends', icon: Users, badge: 6 },
  { label: 'Messages', icon: MessageSquare },
  { label: 'Profile', icon: User },
  { label: 'Avatar', icon: Paintbrush },
  { label: 'Inventory', icon: Package },
  { label: 'Marketplace', icon: Store },
  { label: 'Store', icon: ShoppingBag },
  { label: 'Trade', icon: ArrowLeftRight },
  { label: 'Create', icon: Hammer, isExternal: true },
  { label: 'Forum', icon: MessagesSquare, isExternal: true },
]

export function Sidebar({
  collapsed = false,
  activeItem = 'Home',
  username = 'Sky',
  onSelect,
  onToggleCollapse,
}: SidebarProps) {
  if (collapsed) {
    return null
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-50 w-[230px] bg-[#0c0c0c] border-r border-white/[0.06] flex flex-col select-none overflow-y-auto">
      {/* Top Header in Sidebar: Novelo Logo + Collapse Icon */}
      <div className="h-14 px-3.5 flex items-center justify-between border-b border-white/[0.04] shrink-0">
        <div className="flex items-center gap-2">
          <img
            src="/novelo-icon.png"
            alt="Novelo"
            className="h-10 w-auto max-h-11 object-contain"
          />
        </div>

        <button
          onClick={onToggleCollapse}
          aria-label="Collapse sidebar"
          className="size-7 rounded-md hover:bg-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
        >
          <PanelLeftClose className="size-4" />
        </button>
      </div>

      {/* User Avatar & Name in Sidebar */}
      <div className="px-2.5 pt-2.5 pb-1">
        <button
          onClick={() => onSelect?.('Profile')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-[10px] hover:bg-[#141414] transition-colors cursor-pointer border-none bg-transparent text-left group"
        >
          {/* Avatar circular headshot */}
          <div className="size-7 rounded-full bg-[#1a1a1a] border border-white/15 flex items-center justify-center overflow-hidden shrink-0 shadow-sm group-hover:border-white/30 transition-colors">
            <div className="relative size-5 flex flex-col items-center justify-center">
              <div className="w-4 h-1.5 bg-emerald-700 rounded-t-sm -mb-0.5 z-10" />
              <div className="size-3 rounded-sm bg-neutral-300 flex items-center justify-center gap-0.5">
                <div className="size-0.5 rounded-full bg-black" />
                <div className="size-0.5 rounded-full bg-black" />
              </div>
            </div>
          </div>

          {/* Username */}
          <span className="text-[13.5px] font-semibold text-white group-hover:text-white truncate">
            {username}
          </span>
        </button>
      </div>

      {/* Navigation list matching Luduvo pill highlight shape */}
      <div className="flex-1 py-1 px-2.5 flex flex-col gap-1">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = activeItem === item.label
          return (
            <button
              key={item.label}
              onClick={() => onSelect?.(item.label)}
              className={cn(
                "w-full flex items-center gap-3.5 px-3 h-10 rounded-[10px] text-[13.5px] font-medium transition-all cursor-pointer border-none text-left",
                isActive
                  ? "bg-[#161616] text-white shadow-sm font-semibold"
                  : "bg-transparent text-white/70 hover:text-white hover:bg-[#141414]"
              )}
            >
              {/* Icon: filled when active, outline when inactive */}
              <item.icon
                className={cn(
                  "size-[18px] shrink-0 transition-transform duration-150",
                  isActive
                    ? "fill-current text-white scale-105"
                    : "fill-none text-white/70"
                )}
              />
              <span className="flex-1 truncate tracking-tight">{item.label}</span>

              {item.badge ? (
                <span className="bg-[#ef4444] text-white text-[11px] font-bold rounded-md px-1.5 py-0.5 min-w-[20px] text-center leading-tight">
                  {item.badge}
                </span>
              ) : null}

              {item.isExternal ? (
                <ExternalLink className="size-3 text-white/40 shrink-0" />
              ) : null}
            </button>
          )
        })}
      </div>
    </aside>
  )
}
