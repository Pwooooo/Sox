import {
  Search,
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
  Shield,
  Download,
  PanelLeftClose,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  collapsed?: boolean
  activeItem?: string
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
  { label: 'Search', icon: Search },
  { label: 'Home', icon: Home },
  { label: 'Games', icon: Gamepad2 },
  { label: 'Friends', icon: Users, badge: 6 },
  { label: 'Messages', icon: MessageSquare },
  { label: 'Groups', icon: Users },
  { label: 'Profile', icon: User },
  { label: 'Avatar', icon: Paintbrush },
  { label: 'Inventory', icon: Package },
  { label: 'Marketplace', icon: Store },
  { label: 'Store', icon: ShoppingBag },
  { label: 'Trade', icon: ArrowLeftRight },
  { label: 'Create', icon: Hammer, isExternal: true },
  { label: 'Forum', icon: MessagesSquare, isExternal: true },
  { label: 'Safety', icon: Shield },
  { label: 'Download', icon: Download },
]

export function Sidebar({
  collapsed = false,
  activeItem = 'Home',
  onSelect,
  onToggleCollapse,
}: SidebarProps) {
  if (collapsed) {
    return null
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-50 w-[230px] bg-[#0c0c0c] border-r border-white/[0.06] flex flex-col select-none overflow-y-auto">
      {/* Top Header in Sidebar: NOVELO + Collapse Icon */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <img
            src="/entropy.png"
            alt="Novelo"
            className="size-6 rounded-md object-contain"
          />
          <span className="text-lg font-black tracking-wider text-white uppercase font-sans">
            Novelo
          </span>
        </div>

        <button
          onClick={onToggleCollapse}
          aria-label="Collapse sidebar"
          className="size-7 rounded-md hover:bg-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
        >
          <PanelLeftClose className="size-4" />
        </button>
      </div>

      {/* Navigation list matching Screenshot 1 */}
      <div className="flex-1 py-2 px-2 flex flex-col gap-0.5">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = activeItem === item.label
          return (
            <button
              key={item.label}
              onClick={() => onSelect?.(item.label)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer border-none text-left",
                isActive
                  ? "bg-[#1e1e1e] text-white shadow-sm font-bold"
                  : "bg-transparent text-white/70 hover:text-white hover:bg-white/[0.05]"
              )}
            >
              {/* Icon: filled like YouTube when active, outline when inactive */}
              <item.icon
                className={cn(
                  "size-4 shrink-0 transition-transform duration-150",
                  isActive
                    ? "fill-current text-white scale-105"
                    : "fill-none text-white/70"
                )}
              />
              <span className="flex-1 truncate">{item.label}</span>

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
