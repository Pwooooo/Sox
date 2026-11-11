import {
  Home,
  Compass,
  User,
  Users,
  Paintbrush,
  Package,
  ArrowLeftRight,
  Globe,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  collapsed?: boolean
  activeItem?: string
  onSelect?: (item: string) => void
}

const SIDEBAR_NAV = [
  { label: 'Home', icon: Home },
  { label: 'Discover', icon: Compass },
  { label: 'Avatar', icon: Paintbrush },
  { label: 'Inventory', icon: Package },
  { label: 'Trade', icon: ArrowLeftRight },
  { label: 'Friends', icon: Users, badge: 12 },
  { label: 'Communities', icon: Globe },
  { label: 'Settings', icon: Settings },
]

export function Sidebar({
  collapsed = false,
  activeItem = 'Home',
  onSelect,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-14 bottom-0 z-40 bg-[#0a0a0a] border-r border-white/[0.08] transition-all duration-300 flex flex-col justify-between py-3",
        collapsed ? "w-[60px] px-2" : "w-[210px] px-3"
      )}
    >
      <div className="flex flex-col gap-1">
        {SIDEBAR_NAV.map((item) => {
          const isActive = activeItem === item.label
          return (
            <button
              key={item.label}
              onClick={() => onSelect?.(item.label)}
              title={collapsed ? item.label : undefined}
              className={cn(
                "w-full flex items-center rounded-xl text-xs font-semibold transition-all cursor-pointer border-none",
                collapsed ? "justify-center h-10 px-0" : "gap-3 px-3 py-2.5",
                isActive
                  ? "bg-white/10 text-white shadow-sm"
                  : "bg-transparent text-white/60 hover:text-white hover:bg-white/[0.05]"
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {item.badge ? (
                    <span className="bg-white/10 text-white text-[10px] font-bold rounded-full min-w-[18px] h-4 flex items-center justify-center px-1 tabular-numbers border border-white/10">
                      {item.badge}
                    </span>
                  ) : null}
                </>
              )}
            </button>
          )
        })}
      </div>
    </aside>
  )
}
