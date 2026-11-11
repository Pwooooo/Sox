import { useState } from 'react'
import { ThumbsUp, Users, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Game {
  id: string
  name: string
  creator: string
  thumbnail?: string
  players: number
  likes: number
  likeRatio?: number
  isVerified?: boolean
  tags?: string[]
}

interface GameCardProps {
  game: Game
  className?: string
  onClick?: () => void
}

export function GameCard({ game, className, onClick }: GameCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const ratio = game.likeRatio ?? (Math.floor((game.likes / (game.likes + 120)) * 100))

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex flex-col cursor-pointer select-none transition-all duration-200",
        className
      )}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-secondary/80 border border-white/[0.08] group-hover:border-white/20 transition-all duration-200 shadow-sm group-hover:shadow-lg">
        {/* Fallback gradient if image not loaded */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 transition-opacity duration-300",
            imageLoaded ? "opacity-0" : "opacity-100"
          )}
        />

        <img
          src={game.thumbnail || '/placeholder.webp'}
          alt={game.name}
          onLoad={() => setImageLoaded(true)}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            // Replace with fallback SVG placeholder if image missing
            e.currentTarget.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><rect width="320" height="180" fill="%23141414"/><text x="50%" y="50%" fill="%23555555" font-family="sans-serif" font-size="14" dominant-baseline="middle" text-anchor="middle">${encodeURIComponent(game.name)}</text></svg>`
          }}
        />

        {/* Hover overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="size-11 rounded-full bg-white text-black flex items-center justify-center shadow-md transform scale-90 group-hover:scale-100 transition-transform duration-200">
            <Play className="size-5 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-2.5 px-0.5 flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-foreground group-hover:text-white truncate leading-snug tracking-tight">
          {game.name}
        </h3>
        <p className="text-xs text-muted-foreground truncate hover:underline">
          By {game.creator}
        </p>

        {/* Stats Row */}
        <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 font-medium tabular-numbers">
            <ThumbsUp className="size-3 text-muted-foreground" />
            <span>{ratio}%</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium tabular-numbers">
            <Users className="size-3 text-muted-foreground" />
            <span>{game.players.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function GameCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col animate-pulse", className)}>
      <div className="aspect-[16/9] w-full rounded-xl bg-secondary/60 border border-white/[0.04]" />
      <div className="mt-2.5 space-y-1.5">
        <div className="h-4 bg-secondary/60 rounded w-3/4" />
        <div className="h-3 bg-secondary/40 rounded w-1/2" />
        <div className="flex gap-3 pt-1">
          <div className="h-3 bg-secondary/40 rounded w-10" />
          <div className="h-3 bg-secondary/40 rounded w-12" />
        </div>
      </div>
    </div>
  )
}
