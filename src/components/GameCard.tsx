import { useState } from 'react'
import { ThumbsUp, User, Sparkles } from 'lucide-react'
import { GameDetailData } from '@/data/homeGames'
import { cn } from '@/lib/utils'

interface GameCardProps {
  game: GameDetailData
  aspect?: '16/9' | '1/1'
  className?: string
  onClick?: () => void
}

export function GameCard({ game, aspect, className, onClick }: GameCardProps) {
  const [imageError, setImageError] = useState(false)
  const cardAspect = aspect || game.aspect || '16/9'

  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex flex-col cursor-pointer select-none transition-transform duration-150 active:scale-[0.98]",
        cardAspect === '1/1' ? "w-[125px] md:w-[136px] shrink-0" : "w-full",
        className
      )}
    >
      {/* Thumbnail Aspect Container */}
      <div
        className={cn(
          "relative w-full rounded-xl overflow-hidden bg-[#161616] border border-white/[0.06] group-hover:border-white/20 transition-all duration-200 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.6)]",
          cardAspect === '16/9' ? "aspect-[16/9]" : "aspect-square"
        )}
      >
        {game.thumbnail && !imageError ? (
          <img
            src={game.thumbnail}
            alt={game.name}
            onError={() => setImageError(true)}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          /* Sparkle placeholder */
          <div className="size-full flex items-center justify-center bg-[#151515]">
            <Sparkles className="size-7 text-white/30 group-hover:text-white/50 transition-colors" />
          </div>
        )}

        {/* Hover overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Title & Stats */}
      <div className="mt-1.5 px-0.5 flex flex-col gap-0.5">
        <h4 className="text-[12.5px] md:text-[13px] font-bold text-white truncate leading-snug group-hover:text-white">
          {game.name}
        </h4>

        {/* Stats Row matching Screenshot 1 */}
        <div className="flex items-center gap-2.5 text-[11px] text-white/45 font-medium tabular-numbers">
          <div className="flex items-center gap-1">
            <ThumbsUp className="size-3 text-white/40 shrink-0" />
            <span>{game.likePercent}%</span>
          </div>

          <div className="flex items-center gap-1">
            <User className="size-3 text-white/40 shrink-0" />
            <span>{game.players}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
