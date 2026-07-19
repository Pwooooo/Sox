import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { formatPrice, TYPE_LABELS } from '@/data/items'

const TYPE_GRADIENTS: Record<string, string> = {
  hat: 'from-amber-900/60 to-amber-950/80',
  hair: 'from-pink-900/60 to-pink-950/80',
  face: 'from-cyan-900/60 to-cyan-950/80',
  clothing: 'from-violet-900/60 to-violet-950/80',
  accessory: 'from-emerald-900/60 to-emerald-950/80',
  tool: 'from-sky-900/60 to-sky-950/80',
}

interface GameCardProps {
  item: {
    id: number
    name: string
    type: string
    price: number
    sales: number
    creator: string
    rating: number
    desc: string
  }
  variant?: 'default' | 'compact'
  onClick?: () => void
  accentEnabled?: boolean
}

export function GameCard({ item, variant = 'default', onClick, accentEnabled }: GameCardProps) {
  const [loaded, setLoaded] = useState(false)
  const gradient = TYPE_GRADIENTS[item.type] || 'from-zinc-800/60 to-zinc-950/80'

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [item.id])

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } } : undefined}
      className={`w-full max-w-sm overflow-hidden gap-0 p-0 transition-all duration-200 text-left hover:border-primary group/card cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 ${
        variant === 'compact' ? 'w-48 shrink-0 max-w-none' : 'min-w-64'
      } ${accentEnabled ? 'bg-[var(--row-item-bg)] border-[var(--row-item-border)]' : 'bg-card border border-border rounded-[var(--radius)]'}`}
    >
      <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${
        variant === 'compact' ? 'h-20 sm:h-24 w-auto aspect-video' : 'h-28 sm:h-40 w-full aspect-video'
      }`}>
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-muted/40" aria-hidden="true" />
        )}
        <div className={`w-full h-full flex items-center justify-center transition-all duration-300 group-hover/card:scale-105 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}>
          <span className="text-white/20 text-7xl sm:text-8xl font-black tracking-widest select-none">
            {TYPE_LABELS[item.type] || '?'}
          </span>
        </div>
        {item.price === 0 && (
          <div className="pointer-events-none absolute bottom-2 left-2 z-10">
            <span className="bg-green/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">FREE</span>
          </div>
        )}
      </div>

      <div className="flex flex-col px-2.5 py-1.5">
        <div className="truncate text-sm sm:text-base font-semibold">{item.name}</div>
        <div className="flex flex-wrap items-center gap-1 text-xs sm:text-sm min-w-0 mt-0.5">
          <Star className="size-3.5 text-gold fill-current" />
          <span className="text-muted-foreground">{item.rating}</span>
          <span className="text-muted-foreground mx-0.5">·</span>
          <span className={`font-bold ${item.price === 0 ? 'text-green' : 'text-gold'}`}>
            {formatPrice(item.price)}
          </span>
        </div>
      </div>
    </div>
  )
}

export function GameCardSkeleton({ variant = 'default', hideText = false }: { variant?: 'default' | 'compact', hideText?: boolean }) {
  return (
    <div className={`overflow-hidden gap-0 p-0 bg-card border border-border rounded-[var(--radius)] ${
      variant === 'compact' ? 'w-48 shrink-0 max-w-none' : 'w-full max-w-sm min-w-64'
    }`} aria-hidden="true">
      <div className={`animate-pulse bg-muted/40 ${
        variant === 'compact' ? 'h-20 sm:h-24 w-auto aspect-video' : 'h-28 sm:h-40 w-full aspect-video'
      }`} />
      {!hideText && (
        <div className="px-2.5 py-1.5">
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted/40" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted/40" />
          </div>
        </div>
      )}
    </div>
  )
}
