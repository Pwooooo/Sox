import { useNavigate } from 'react-router-dom'
import { ITEMS, CREATORS, formatPrice, TYPE_ICONS } from '@/data/items'
import { Home as HomeIcon, Paintbrush, Store, Users, Package, Trophy, Settings, Search, ChevronRight } from 'lucide-react'

const QUICK_NAV = [
  { label: 'Home', icon: HomeIcon, path: '/' },
  { label: 'Customize', icon: Paintbrush, path: '/avatar' },
  { label: 'Marketplace', icon: Store, path: '/marketplace' },
  { label: 'Create', icon: Package, path: '/create' },
  { label: 'Groups', icon: Users, path: '/' },
  { label: 'Friends', icon: Users, path: '/' },
  { label: 'Inventory', icon: Package, path: '/avatar' },
  { label: 'Leaderboard', icon: Trophy, path: '/' },
  { label: 'Settings', icon: Settings, path: '/' },
]

function PlaceCard({ item, onClick }: { item: typeof ITEMS[0]; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="min-w-[160px] max-w-[180px] cursor-pointer group"
    >
      <div className="aspect-square bg-card border border-border rounded-[var(--radius)] overflow-hidden mb-2 transition-all group-hover:border-border group-hover:shadow-md group-hover:-translate-y-0.5">
        <div className="w-full h-full flex items-center justify-center text-4xl bg-secondary/50">
          {TYPE_ICONS[item.type] || '📦'}
        </div>
      </div>
      <div className="text-sm font-medium truncate">{item.name}</div>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span className={`text-xs font-bold ${item.price === 0 ? 'text-green' : 'text-gold'}`}>
          {formatPrice(item.price)}
        </span>
        <span className="text-[11px] text-muted-foreground">• {item.sales.toLocaleString()} sold</span>
      </div>
    </div>
  )
}

export function Home() {
  const navigate = useNavigate()
  const continueCreating = [...ITEMS].sort((a, b) => b.id - a.id).slice(0, 10)
  const communityFavorites = [...ITEMS].sort((a, b) => b.sales - a.sales).slice(0, 10)

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6">
      {/* Quick Nav */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-6 px-6">
        {QUICK_NAV.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-1.5 min-w-[68px] px-2 py-2 rounded-[var(--radius)] hover:bg-accent/50 transition-colors cursor-pointer bg-transparent border-none"
          >
            <div className="size-10 rounded-full bg-card border border-border flex items-center justify-center transition-colors group-hover:border-border">
              <item.icon className="size-4.5 text-muted-foreground" />
            </div>
            <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Daily Reward Banner */}
      <div className="bg-card border border-border rounded-[var(--radius)] p-4 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/15 flex items-center justify-center">
            <Trophy className="size-5 text-primary" />
          </div>
          <div>
            <div className="text-sm font-semibold">Daily Reward Available!</div>
            <div className="text-xs text-muted-foreground">Log in today to claim your daily bonus</div>
          </div>
        </div>
        <button className="px-4 py-1.5 bg-primary text-white rounded-[calc(var(--radius)-4px)] text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer">
          Claim
        </button>
      </div>

      {/* Continue Creating */}
      <Section
        title="Continue Creating"
        onSeeAll={() => navigate('/create')}
      >
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6">
          {continueCreating.map((item) => (
            <PlaceCard
              key={item.id}
              item={item}
              onClick={() => navigate(`/item/${item.id}`)}
            />
          ))}
        </div>
      </Section>

      {/* Community Favorites */}
      <Section
        title="Community Favorites"
        onSeeAll={() => navigate('/marketplace')}
      >
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6">
          {communityFavorites.map((item) => (
            <PlaceCard
              key={item.id}
              item={item}
              onClick={() => navigate(`/item/${item.id}`)}
            />
          ))}
        </div>
      </Section>

      {/* Friends */}
      <Section title="Friends">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {CREATORS.slice(0, 6).map((creator) => (
            <div
              key={creator.name}
              className="bg-card border border-border rounded-[var(--radius)] p-4 flex items-center gap-3 cursor-pointer hover:bg-accent/30 transition-colors"
            >
              <img
                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${creator.name}`}
                alt={creator.name}
                className="size-10 rounded-full flex-shrink-0"
              />
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{creator.name}</div>
                <div className="text-[11px] text-muted-foreground">{creator.items} items</div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

function Section({
  title,
  onSeeAll,
  children,
}: {
  title: string
  onSeeAll?: () => void
  children: React.ReactNode
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold tracking-tight">{title}</h2>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none"
          >
            See All <ChevronRight className="size-3.5" />
          </button>
        )}
      </div>
      {children}
    </div>
  )
}
