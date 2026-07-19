import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ITEMS, CATEGORIES, Item } from '@/data/items'
import { ItemCard } from '@/components/ItemCard'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

export function Marketplace() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || ''
  const initialSearch = searchParams.get('q') || ''

  const [category, setCategory] = useState(initialCategory)
  const [sort, setSort] = useState('popular')
  const [search] = useState(initialSearch)

  const items = useMemo(() => {
    let result = [...ITEMS] as Item[]

    if (category) {
      result = result.filter((i) => i.type === category)
    }

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.creator.toLowerCase().includes(q) ||
          i.desc.toLowerCase().includes(q)
      )
    }

    switch (sort) {
      case 'popular':
        result.sort((a, b) => b.sales - a.sales)
        break
      case 'newest':
        result.sort((a, b) => b.id - a.id)
        break
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'sales':
        result.sort((a, b) => b.sales - a.sales)
        break
    }

    return result
  }, [category, sort, search])

  return (
    <div>
      <div className="bg-secondary/30 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Marketplace</h1>
          <p className="text-muted-foreground">Discover millions of UGC items created by the community.</p>
        </div>
      </div>

      <div className="sticky top-16 z-40 bg-background/92 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-1 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-[calc(var(--radius)-4px)] text-xs font-medium transition-colors cursor-pointer ${
                  category === cat.key
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <Select value={sort} onChange={(e) => setSort(e.target.value)} className="w-auto text-xs">
            <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="sales">Top Sales</option>
          </Select>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {items.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            No items found. Try a different search or category.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} onClick={() => navigate(`/item/${item.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
