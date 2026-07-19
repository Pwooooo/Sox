import { useNavigate, useLocation } from 'react-router-dom'
import {
  Home, User, MessageSquare, Users, Paintbrush, Package, Store,
  Palette, BookOpen, Settings, Search, Plus
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Profile', icon: User, path: '/profile' },
  { label: 'Marketplace', icon: Store, path: '/marketplace' },
  { label: 'Create', icon: Plus, path: '/create' },
  { label: 'Avatar', icon: Paintbrush, path: '/avatar' },
  { label: 'Friends', icon: Users, path: '/' },
  { label: 'Messages', icon: MessageSquare, path: '/', badge: 1 },
  { label: 'Inventory', icon: Package, path: '/avatar' },
  { label: 'Themes', icon: Palette, path: '/' },
  { label: 'Blog', icon: BookOpen, path: '/' },
  { label: 'Settings', icon: Settings, path: '/' },
]

export function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <aside className="fixed top-16 left-0 bottom-0 w-[220px] bg-background border-r border-border overflow-y-auto hidden md:block"
      style={{ scrollbarWidth: 'none' }}
    >
      <div className="p-3 pt-4">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer border-none bg-transparent mb-0.5 ${
                active
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              }`}
            >
              <item.icon className="size-[18px] flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {'badge' in item && item.badge ? (
                <span className="bg-primary text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {item.badge}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      <div className="mx-3 mt-4 mb-4 p-4 bg-card border border-border rounded-[var(--radius)]">
        <div className="text-[13px] font-semibold mb-1">Upgrade to Plus</div>
        <div className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
          Get exclusive items, priority support, and more.
        </div>
        <button className="w-full py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer border-none">
          Get Plus
        </button>
      </div>
    </aside>
  )
}
