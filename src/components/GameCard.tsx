import { useState } from 'react'
import { Sparkles, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface GameItem {
  id: string
  name: string
  thumbnail?: string
  likePercent: number | 'N/A'
  players: number | string
}

interface GameCardProps {
  game: GameItem
  className?: string
  onClick?: () => void
}

export function GameCard({ game, className, onClick }: GameCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex flex-col w-[136px] md:w-[144px] shrink-0 cursor-pointer select-none",
        className
      )}
    >
      {/* 1:1 Square Thumbnail matching Screenshot 2 */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#161616] border border-white/[0.06] group-hover:border-white/20 transition-all duration-200">
        {game.thumbnail && !imageError ? (
          <img
            src={game.thumbnail}
            alt={game.name}
            onError={() => setImageError(true)}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          /* Placeholder thumbnail with 4-pointed star / sparkle as seen in Screenshot 2 */
          <div className="size-full flex items-center justify-center bg-[#151515]">
            <Sparkles className="size-8 text-white/30 group-hover:text-white/50 transition-colors" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Title & Stats */}
      <div className="mt-2 flex flex-col gap-0.5 px-0.5">
        <h4 className="text-[12.5px] font-semibold text-white truncate leading-tight group-hover:text-white/90">
          {game.name}
        </h4>

        {/* Stats Row matching screenshot 2: rating icon & player count */}
        <div className="flex items-center gap-2 text-[11px] text-white/45 font-medium tabular-numbers">
          <div className="flex items-center gap-1">
            <span className="text-[10px]">☺</span>
            <span>{typeof game.likePercent === 'number' ? `${game.likePercent}%` : game.likePercent}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px]">👤</span>
            <span>{game.players}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
