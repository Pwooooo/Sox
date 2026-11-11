import { useRef } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { GameCard, GameItem } from '@/components/GameCard'
import { cn } from '@/lib/utils'

interface GameSectionProps {
  title: string
  hasChevronTitle?: boolean
  games: GameItem[]
  onTitleClick?: () => void
  onSelectGame?: (game: GameItem) => void
  className?: string
}

export function GameSection({
  title,
  hasChevronTitle = false,
  games,
  onTitleClick,
  onSelectGame,
  className,
}: GameSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const offset = direction === 'left' ? -460 : 460
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  return (
    <section className={cn("relative flex flex-col gap-2.5 group/section", className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between px-0.5">
        <button
          onClick={onTitleClick}
          className="flex items-center gap-1.5 text-base md:text-[17px] font-bold text-white tracking-tight hover:text-white/80 transition-colors cursor-pointer border-none bg-transparent"
        >
          <span>{title}</span>
          {hasChevronTitle && (
            <ChevronRight className="size-4 text-white/60 ml-0.5" />
          )}
        </button>
      </div>

      {/* Cards Scroll Container */}
      <div className="relative">
        {/* Left Scroll Chevron Button */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="absolute left-1 top-[42%] -translate-y-1/2 z-20 size-8 rounded-full bg-black/85 hover:bg-black border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-opacity shadow-xl cursor-pointer"
        >
          <ChevronLeft className="size-4" />
        </button>

        {/* Right Scroll Chevron Button matching Screenshot 2 */}
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="absolute right-1 top-[42%] -translate-y-1/2 z-20 size-8 rounded-full bg-black/85 hover:bg-black border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-opacity shadow-xl cursor-pointer"
        >
          <ChevronRight className="size-4" />
        </button>

        {/* Horizontal Game Row */}
        <div
          ref={scrollRef}
          className="flex items-start gap-3 md:gap-3.5 overflow-x-auto pb-1 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onClick={() => onSelectGame?.(game)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
