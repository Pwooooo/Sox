import { useState } from 'react'
import { Coins, Tag, Check } from 'lucide-react'
import { Item, formatPrice, TYPE_LABELS } from '@/data/items'
import { cn } from '@/lib/utils'

interface ItemCardProps {
  item: Item
  isOwned?: boolean
  onClick?: () => void
  onBuy?: (item: Item) => void
  className?: string
}

function getItemGradient(id: number) {
  const gradients = [
    'linear-gradient(135deg, #1f1f23 0%, #121214 100%)',
    'linear-gradient(135deg, #27202b 0%, #141217 100%)',
    'linear-gradient(135deg, #1c262b 0%, #101518 100%)',
    'linear-gradient(135deg, #2b251c 0%, #181510 100%)',
    'linear-gradient(135deg, #1c2b22 0%, #101813 100%)',
  ]
  return gradients[id % gradients.length]
}

export function ItemCard({ item, isOwned = false, onClick, onBuy, className }: ItemCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex flex-col rounded-xl bg-[#111111] border border-white/[0.08] hover:border-white/20 p-3 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1",
        className
      )}
    >
      {/* Thumbnail Aspect Container */}
      <div
        className="relative aspect-square w-full rounded-lg overflow-hidden flex items-center justify-center border border-white/[0.04]"
        style={{ background: getItemGradient(item.id) }}
      >
        {/* Item category pill */}
        <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-white/80 uppercase tracking-wider">
          {TYPE_LABELS[item.type] || item.type}
        </span>

        {/* Owned badge */}
        {isOwned && (
          <span className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
            <Check className="size-3" />
            Owned
          </span>
        )}

        {/* Icon / Image representation */}
        <div className="size-20 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
          <Tag className="size-9 text-white/50 group-hover:text-white transition-colors" />
        </div>
      </div>

      {/* Info details */}
      <div className="mt-3 flex flex-col gap-1">
        <h4 className="text-sm font-semibold text-white truncate group-hover:text-white leading-tight">
          {item.name}
        </h4>
        <p className="text-xs text-white/50 truncate">
          By <span className="hover:underline">{item.creator}</span>
        </p>

        {/* Price & Sales */}
        <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5 font-bold text-sm">
            {item.price === 0 ? (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                FREE
              </span>
            ) : (
              <>
                <Coins className="size-3.5 text-amber-400" />
                <span className="tabular-numbers text-white">{formatPrice(item.price)}</span>
              </>
            )}
          </div>

          <span className="text-[11px] text-white/40 tabular-numbers">
            {item.sales.toLocaleString()} sales
          </span>
        </div>
      </div>
    </div>
  )
}
