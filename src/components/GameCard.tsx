import { useState } from 'react'
import { ThumbsUp, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface GameItem {
  id: string
  name: string
  thumbnail: string
  likePercent: number
  players: string
  creator?: string
}

interface GameCardProps {
  game: GameItem
  className?: string
  onClick?: () => void
}

export function GameCard({ game, className, onClick }: GameCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex flex-col w-[130px] md:w-[145px] shrink-0 cursor-pointer select-none",
        className
      )}
    >
      {/* 1:1 Square Thumbnail */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#161616] border border-white/[0.08] group-hover:border-white/25 transition-all duration-200 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
        {/* Placeholder shimmer while loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#1e1e1e] animate-pulse" />
        )}

        <img
          src={game.thumbnail}
          alt={game.name}
          onLoad={() => setImageLoaded(true)}
          className={cn(
            "size-full object-cover transition-transform duration-300 group-hover:scale-105",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onError={(e) => {
            // High quality fallback SVG badge if image fails to load
            e.currentTarget.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%231a1a1a"/><text x="50%" y="45%" fill="%23555555" font-family="sans-serif" font-weight="bold" font-size="16" dominant-baseline="middle" text-anchor="middle">SOX</text><text x="50%" y="60%" fill="%23777777" font-family="sans-serif" font-size="11" dominant-baseline="middle" text-anchor="middle">GAME</text></svg>`
            setImageLoaded(true)
          }}
        />

        {/* Subtle hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>

      {/* Game Title */}
      <div className="mt-1.5 px-0.5 flex flex-col">
        <h4 className="text-[13px] font-bold text-white group-hover:text-white/90 line-clamp-2 leading-[1.25] tracking-tight min-h-[32px]">
          {game.name}
        </h4>

        {/* Stats Row: Thumbs Up & Active Players */}
        <div className="flex items-center gap-3 mt-1 text-[11px] text-white/50">
          <div className="flex items-center gap-1 font-medium">
            <ThumbsUp className="size-3 text-white/40 shrink-0" />
            <span className="tabular-numbers">{game.likePercent}%</span>
          </div>

          <div className="flex items-center gap-1 font-medium">
            <User className="size-3 text-white/40 shrink-0" />
            <span className="tabular-numbers">{game.players}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
