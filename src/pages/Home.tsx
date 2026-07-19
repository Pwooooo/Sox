import { useNavigate } from 'react-router-dom'
import { ITEMS, CREATORS, formatPrice, TYPE_ICONS } from '@/data/items'
import { Trophy, ChevronRight, Star, Users, TrendingUp } from 'lucide-react'

const TYPE_GRADIENTS: Record<string, string> = {
  hat: 'from-amber-900/60 to-amber-950/80',
  hair: 'from-pink-900/60 to-pink-950/80',
  face: 'from-cyan-900/60 to-cyan-950/80',
  clothing: 'from-violet-900/60 to-violet-950/80',
  accessory: 'from-emerald-900/60 to-emerald-950/80',
  tool: 'from-sky-900/60 to-sky-950/80',
}

function PlaceCard({ item, onClick }: { item: typeof ITEMS[0]; onClick: () => void }) {
  const gradient = TYPE_GRADIENTS[item.type] || 'from-zinc-800/60 to-zinc-950/80'
  return (
    <div
      onClick={onClick}
      className="min-w-[170px] max-w-[190px] cursor-pointer group flex-shrink-0"
    >
      <div className={`aspect-square bg-gradient-to-br ${gradient} rounded-[var(--radius)] overflow-hidden mb-2.5 relative transition-all group-hover:shadow-lg group-hover:-translate-y-1`}>
        <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-80 group-hover:opacity-100 transition-opacity">
          {TYPE_ICONS[item.type] || '📦'}
        </div>
        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex items-center gap-1 text-[11px] text-white/80">
            <Star className="size-3 fill-current" />
            <span className="font-medium">{item.rating}</span>
          </div>
        </div>
        {item.price === 0 && (
          <div className="absolute top-2 right-2 bg-green/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
            FREE
          </div>
        )}
      </div>
      <div className="text-[13px] font-semibold truncate group-hover:text-primary transition-colors">{item.name}</div>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span className={`text-xs font-bold ${item.price === 0 ? 'text-green' : 'text-gold'}`}>
          {formatPrice(item.price)}
        </span>
        <span className="text-[11px] text-muted-foreground">· {item.sales.toLocaleString()} sold</span>
      </div>
    </div>
  )
}

function FriendAvatar({ creator }: { creator: typeof CREATORS[0] }) {
  return (
    <div className="flex flex-col items-center gap-1.5 min-w-[72px] flex-shrink-0 cursor-pointer group">
      <div className="w-[60px] h-[60px] rounded-full bg-card border-2 border-border overflow-hidden transition-all group-hover:border-primary group-hover:scale-105">
        <img
          src={`https://api.dicebear.com/7.x/bottts/svg?seed=${creator.name}`}
          alt={creator.name}
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[72px]">{creator.name}</span>
    </div>
  )
}

export function Home() {
  const navigate = useNavigate()
  const recentItems = [...ITEMS].sort((a, b) => b.id - a.id).slice(0, 12)
  const popular = [...ITEMS].sort((a, b) => b.sales - a.sales).slice(0, 12)
  const topRated = [...ITEMS].sort((a, b) => b.rating - a.rating).slice(0, 12)

  return (
    <div className="px-5 py-5">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-xl font-bold">Home</h1>
      </div>

      <Section title="Friends" icon={<Users className="size-4" />} onSeeAll={() => navigate('/')}>
        <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
          <div className="flex flex-col items-center gap-1.5 min-w-[72px] flex-shrink-0 cursor-pointer group">
            <div className="w-[60px] h-[60px] rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center transition-all group-hover:border-primary group-hover:scale-105">
              <span className="text-primary text-2xl font-bold">+</span>
            </div>
            <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">Add</span>
          </div>
          {CREATORS.slice(0, 8).map((c) => (
            <FriendAvatar key={c.name} creator={c} />
          ))}
        </div>
      </Section>

      <Section title="Recently Added" icon={<TrendingUp className="size-4" />} onSeeAll={() => navigate('/marketplace')}>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {recentItems.map((item) => (
            <PlaceCard key={item.id} item={item} onClick={() => navigate(`/item/${item.id}`)} />
          ))}
        </div>
      </Section>

      <Section title="Most Popular" icon={<Trophy className="size-4" />} onSeeAll={() => navigate('/marketplace')}>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {popular.map((item) => (
            <PlaceCard key={item.id} item={item} onClick={() => navigate(`/item/${item.id}`)} />
          ))}
        </div>
      </Section>

      <Section title="Top Rated" icon={<Star className="size-4" />} onSeeAll={() => navigate('/marketplace')}>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {topRated.map((item) => (
            <PlaceCard key={item.id} item={item} onClick={() => navigate(`/item/${item.id}`)} />
          ))}
        </div>
      </Section>
    </div>
  )
}

function Section({
  title,
  icon,
  onSeeAll,
  children,
}: {
  title: string
  icon?: React.ReactNode
  onSeeAll?: () => void
  children: React.ReactNode
}) {
  return (
    <div className="mb-7">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <h2 className="text-[15px] font-bold tracking-tight">{title}</h2>
        </div>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none"
          >
            See All <ChevronRight className="size-3.5" />
          </button>
        )}
      </div>
      {children}
    </div>
  )
}
