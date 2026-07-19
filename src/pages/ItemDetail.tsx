import { useParams, useNavigate } from 'react-router-dom'
import { ITEMS, TYPE_ICONS, formatPrice } from '@/data/items'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react'

export function ItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const item = ITEMS.find((i) => i.id === Number(id))

  if (!item) {
    return (
      <div className="max-w-[1000px] mx-auto px-6 py-16 text-center">
        <p className="text-muted-foreground">Item not found.</p>
        <Button variant="link" onClick={() => navigate('/marketplace')}>
          Back to Marketplace
        </Button>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => navigate('/marketplace')}
        className="flex items-center gap-1.5 px-6 py-5 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer bg-transparent border-none"
      >
        <ArrowLeft className="size-4" />
        Back to Marketplace
      </button>

      <div className="max-w-[1000px] mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-card border border-border rounded-[calc(var(--radius)+4px)] flex items-center justify-center text-[120px]">
            {TYPE_ICONS[item.type] || '📦'}
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{item.name}</h1>
            <p className="text-primary mb-4">by {item.creator}</p>
            <p className="text-muted-foreground leading-relaxed mb-6">{item.desc}</p>

            <div className={`text-3xl font-bold mb-6 ${item.price === 0 ? 'text-green' : 'text-gold'}`}>
              {formatPrice(item.price)}
            </div>

            <Button size="lg" className="w-full mb-6">
              <ShoppingCart className="size-4" />
              {item.price === 0 ? 'Get Free' : 'Buy Now'}
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 border-border">
                <div className="text-[11px] text-muted-foreground font-medium">Type</div>
                <div className="text-sm font-semibold mt-0.5 capitalize">{item.type}</div>
              </Card>
              <Card className="p-3 border-border">
                <div className="text-[11px] text-muted-foreground font-medium">Sales</div>
                <div className="text-sm font-semibold mt-0.5">{item.sales.toLocaleString()}</div>
              </Card>
              <Card className="p-3 border-border">
                <div className="text-[11px] text-muted-foreground font-medium">Rating</div>
                <div className="text-sm font-semibold mt-0.5 flex items-center gap-1">
                  <Star className="size-3.5 text-gold fill-gold" /> {item.rating}
                </div>
              </Card>
              <Card className="p-3 border-border">
                <div className="text-[11px] text-muted-foreground font-medium">Creator ID</div>
                <div className="text-sm font-semibold mt-0.5">@{item.creator.toLowerCase().replace(/\s/g, '')}</div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
