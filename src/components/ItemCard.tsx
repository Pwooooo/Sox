import { Item, TYPE_ICONS, formatPrice } from '@/data/items'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function ItemCard({ item, onClick }: { item: Item; onClick: () => void }) {
  return (
    <Card
      className="cursor-pointer transition-all duration-150 hover:-translate-y-1 hover:shadow-md overflow-hidden"
      onClick={onClick}
    >
      <div className="aspect-square bg-secondary/50 flex items-center justify-center text-5xl text-muted-foreground relative">
        <Badge variant="secondary" className="absolute top-2 left-2 text-[10px] px-1.5 py-0.5 uppercase tracking-wider">
          {item.type}
        </Badge>
        {TYPE_ICONS[item.type] || '📦'}
      </div>
      <div className="p-3.5">
        <div className="text-sm font-semibold truncate mb-1">{item.name}</div>
        <div className="text-xs text-muted-foreground mb-2">by {item.creator}</div>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-bold ${item.price === 0 ? 'text-green' : 'text-gold'}`}>
            {formatPrice(item.price)}
          </span>
          <span className="text-xs text-muted-foreground">{item.sales.toLocaleString()} sold</span>
        </div>
      </div>
    </Card>
  )
}
