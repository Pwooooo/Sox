import { useRef, ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HorizontalScrollProps {
  title?: string
  subtitle?: string
  actionLabel?: string
  onAction?: () => void
  children: ReactNode
  className?: string
}

export function HorizontalScroll({
  title,
  subtitle,
  actionLabel = 'See All',
  onAction,
  children,
  className,
}: HorizontalScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const offset = direction === 'left' ? -480 : 480
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  return (
    <section className={cn("relative flex flex-col gap-3", className)}>
      {(title || actionLabel) && (
        <div className="flex items-end justify-between px-1">
          <div>
            {title && (
              <h2 className="text-lg md:text-xl font-bold tracking-tight text-white">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {actionLabel && (
              <button
                onClick={onAction}
                className="text-xs md:text-sm font-semibold text-white/70 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
              >
                {actionLabel}
              </button>
            )}

            <div className="hidden sm:flex items-center gap-1 ml-2">
              <button
                onClick={() => scroll('left')}
                aria-label="Scroll left"
                className="size-7 rounded-lg bg-card hover:bg-secondary border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                aria-label="Scroll right"
                className="size-7 rounded-lg bg-card hover:bg-secondary border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Horizontal List */}
      <div
        ref={scrollRef}
        className="flex gap-3 md:gap-4 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </section>
  )
}
