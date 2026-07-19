import { useNavigate } from 'react-router-dom'
import { ITEMS } from '@/data/items'
import { GameCard, GameCardSkeleton } from '@/components/GameCard'
import { HorizontalScroll } from '@/components/HorizontalScroll'
import { Trophy, TrendingUp, Star } from 'lucide-react'

type Item = typeof ITEMS[0]

export function Home() {
  const navigate = useNavigate()

  const recentItems = [...ITEMS].sort((a, b) => b.id - a.id)
  const popular = [...ITEMS].sort((a, b) => b.sales - a.sales)
  const topRated = [...ITEMS].sort((a, b) => b.rating - a.rating)

  return (
    <div className="w-full">
      <GameRow
        title="Recently Added"
        icon={<TrendingUp className="size-5" />}
        items={recentItems}
        onItemClick={(id) => navigate(`/item/${id}`)}
        onSeeAll={() => navigate('/marketplace')}
      />
      <GameRow
        title="Most Popular"
        icon={<Trophy className="size-5" />}
        items={popular}
        onItemClick={(id) => navigate(`/item/${id}`)}
        onSeeAll={() => navigate('/marketplace')}
      />
      <GameRow
        title="Top Rated"
        icon={<Star className="size-5" />}
        items={topRated}
        onItemClick={(id) => navigate(`/item/${id}`)}
        onSeeAll={() => navigate('/marketplace')}
      />
    </div>
  )
}

function GameRow({
  title,
  icon,
  items,
  onItemClick,
  onSeeAll,
}: {
  title: string
  icon?: React.ReactNode
  items: Item[]
  onItemClick: (id: number) => void
  onSeeAll?: () => void
}) {
  return (
    <div className="px-3 sm:px-4 py-3 first:pt-5">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
        </div>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer"
          >
            See All
          </button>
        )}
      </div>
      <HorizontalScroll
        className="flex gap-3 snap-x snap-mandatory px-1"
        scrollStep={300}
      >
        {items.map((item) => (
          <div key={item.id} role="listitem" className="relative shrink-0 snap-start w-[200px] sm:w-[220px]">
            <GameCard
              item={item}
              variant="default"
              onClick={() => onItemClick(item.id)}
            />
          </div>
        ))}
      </HorizontalScroll>
    </div>
  )
}
