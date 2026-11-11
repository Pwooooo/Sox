import { useRef, useState } from 'react'
import { ArrowRight, Info, ChevronLeft, ChevronRight } from 'lucide-react'
import { GameCard, GameItem } from '@/components/GameCard'
import { cn } from '@/lib/utils'

interface GameSectionProps {
  title: string
  infoText?: string
  games: GameItem[]
  onSeeAll?: () => void
  onSelectGame?: (game: GameItem) => void
  className?: string
}

export function GameSection({
  title,
  infoText = 'Experiences ranked by community engagement and play activity.',
  games,
  onSeeAll,
  onSelectGame,
  className,
}: GameSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showInfo, setShowInfo] = useState(false)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const offset = direction === 'left' ? -500 : 500
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  return (
    <section className={cn("relative flex flex-col gap-2 group/section", className)}>
      {/* Header Row */}
      <div className="flex items-center justify-between px-1">
        {/* Title with Arrow */}
        <button
          onClick={onSeeAll}
          className="flex items-center gap-1.5 text-base md:text-lg font-bold text-white tracking-tight hover:text-white/80 transition-colors cursor-pointer border-none bg-transparent group/title"
        >
          <span>{title}</span>
          <ArrowRight className="size-4 text-white/70 group-hover/title:translate-x-0.5 group-hover/title:text-white transition-all" />
        </button>

        {/* Info Icon with Popover */}
        <div className="relative flex items-center">
          <button
            onClick={() => setShowInfo(!showInfo)}
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)}
            aria-label="Sort info"
            className="size-6 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer border-none bg-transparent"
          >
            <Info className="size-3.5" />
          </button>

          {showInfo && (
            <div className="absolute right-0 top-7 z-30 w-64 p-2.5 rounded-xl bg-[#181818] border border-white/[0.1] text-xs text-white/80 shadow-2xl animate-in fade-in">
              {infoText}
            </div>
          )}
        </div>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="relative">
        {/* Scroll Left Button */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="absolute left-0 top-[35%] -translate-y-1/2 z-20 size-9 rounded-full bg-black/80 hover:bg-black border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-opacity shadow-lg backdrop-blur-sm cursor-pointer"
        >
          <ChevronLeft className="size-5" />
        </button>

        {/* Scroll Right Button */}
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="absolute right-0 top-[35%] -translate-y-1/2 z-20 size-9 rounded-full bg-black/80 hover:bg-black border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-opacity shadow-lg backdrop-blur-sm cursor-pointer"
        >
          <ChevronRight className="size-5" />
        </button>

        {/* Cards Row */}
        <div
          ref={scrollRef}
          className="flex items-start gap-3 md:gap-3.5 overflow-x-auto pb-2 scroll-smooth"
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
