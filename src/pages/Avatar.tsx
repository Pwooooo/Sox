import { useState } from 'react'
import { ITEMS, INVENTORY_IDS, TYPE_ICONS, formatPrice } from '@/data/items'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const TABS = [
  { key: 'hat', label: 'Hats' },
  { key: 'hair', label: 'Hair' },
  { key: 'face', label: 'Faces' },
  { key: 'clothing', label: 'Clothing' },
  { key: 'accessory', label: 'Accessories' },
  { key: 'tool', label: 'Tools' },
]

const INITIAL_COLORS = {
  head: '#f5d6b8',
  torso: '#2563eb',
  arms: '#f5d6b8',
  legs: '#1e3a8a',
}

export function Avatar() {
  const [activeTab, setActiveTab] = useState('hat')
  const [colors, setColors] = useState(INITIAL_COLORS)

  const ownedItems = ITEMS.filter((i) => INVENTORY_IDS.includes(i.id) && i.type === activeTab)

  return (
    <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] min-h-[calc(100vh-64px)]">
      <div className="bg-secondary/30 border-r border-border p-8 flex flex-col items-center">
        <div className="w-[280px] h-[360px] bg-card border border-border rounded-[calc(var(--radius)+4px)] flex items-center justify-center mb-6">
          <div className="relative w-[140px] h-[280px]">
            <div
              className="absolute top-0 left-[30px] w-20 h-20 rounded-full z-10"
              style={{ background: colors.head }}
            />
            <div
              className="absolute top-[70px] left-5 w-[100px] h-[90px] rounded-t-xl rounded-b z-5"
              style={{ background: colors.torso }}
            />
            <div
              className="absolute top-[75px] left-0 w-6 h-20 rounded-xl z-4"
              style={{ background: colors.arms }}
            />
            <div
              className="absolute top-[75px] right-0 w-6 h-20 rounded-xl z-4"
              style={{ background: colors.arms }}
            />
            <div
              className="absolute bottom-5 left-7 w-[30px] h-[70px] rounded-lg z-3"
              style={{ background: colors.legs }}
            />
            <div
              className="absolute bottom-5 right-7 w-[30px] h-[70px] rounded-lg z-3"
              style={{ background: colors.legs }}
            />
          </div>
        </div>

        <div className="w-full max-w-[280px] flex flex-col gap-3">
          {[
            { key: 'head', label: 'Head' },
            { key: 'torso', label: 'Torso' },
            { key: 'arms', label: 'Arms' },
            { key: 'legs', label: 'Legs' },
          ].map((part) => (
            <div key={part.key} className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground">{part.label}</label>
              <input
                type="color"
                value={colors[part.key as keyof typeof colors]}
                onChange={(e) => setColors({ ...colors, [part.key]: e.target.value })}
                className="size-12 border-2 border-border rounded-[calc(var(--radius)-4px)] cursor-pointer bg-transparent p-0.5"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 overflow-y-auto">
        <h2 className="text-xl font-bold tracking-tight mb-1">My Inventory</h2>

        <div className="flex gap-1 mb-5 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-1.5 rounded-[calc(var(--radius)-4px)] text-xs font-medium transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {ownedItems.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            No items in this category yet. Visit the marketplace to buy some!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {ownedItems.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="aspect-square bg-secondary/50 flex items-center justify-center text-4xl text-muted-foreground relative">
                  <Badge variant="secondary" className="absolute top-2 left-2 text-[10px] uppercase tracking-wider">
                    {item.type}
                  </Badge>
                  {TYPE_ICONS[item.type] || '📦'}
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold truncate">{item.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatPrice(item.price)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
