import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, SlidersHorizontal, Coins, Check, Sparkles, X } from 'lucide-react'
import { ITEMS, CATEGORIES, Item, formatPrice } from '@/data/items'
import { ItemCard } from '@/components/ItemCard'
import { cn } from '@/lib/utils'

export function Marketplace() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'sales'>('popular')
  const [onlyFree, setOnlyFree] = useState(false)
  const [ownedIds, setOwnedIds] = useState<number[]>([1, 5, 7, 10, 13])
  const [activeItem, setActiveItem] = useState<Item | null>(null)
  const [purchasedMessage, setPurchasedMessage] = useState<string | null>(null)

  const filteredItems = useMemo(() => {
    return ITEMS.filter((item) => {
      if (selectedCategory && item.type !== selectedCategory) return false
      if (onlyFree && item.price > 0) return false
      if (search) {
        const query = search.toLowerCase()
        return item.name.toLowerCase().includes(query) || item.creator.toLowerCase().includes(query)
      }
      return true
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'sales') return b.sales - a.sales
      return b.rating - a.rating // default popular
    })
  }, [selectedCategory, onlyFree, search, sortBy])

  const handleBuy = (item: Item) => {
    if (ownedIds.includes(item.id)) return
    setOwnedIds([...ownedIds, item.id])
    setPurchasedMessage(`Successfully purchased "${item.name}"!`)
    setTimeout(() => setPurchasedMessage(null), 3000)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="size-3.5 text-amber-400" />
            Official Catalog
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Marketplace
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Customize your avatar with thousands of community and official accessories.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search catalog items..."
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-[#141414] border border-white/[0.08] text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-white/40 hover:text-white"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Purchase Feedback Toast */}
      {purchasedMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-500 text-white font-semibold text-sm shadow-2xl flex items-center gap-2 border border-emerald-400/30 animate-in fade-in slide-in-from-bottom-2">
          <Check className="size-4" />
          {purchasedMessage}
        </div>
      )}

      {/* Filter & Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.key
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={cn(
                  "shrink-0 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer border",
                  active
                    ? "bg-white text-black border-white shadow-sm"
                    : "bg-[#141414] text-white/60 hover:text-white hover:bg-[#1a1a1a] border-white/[0.08]"
                )}
              >
                {cat.name}
              </button>
            )
          })}
        </div>

        {/* Sort & Free Checkbox */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-white/70 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyFree}
              onChange={(e) => setOnlyFree(e.target.checked)}
              className="size-3.5 rounded bg-[#141414] border-white/20 text-white accent-white cursor-pointer"
            />
            Free Items Only
          </label>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-9 px-3 rounded-lg bg-[#141414] border border-white/[0.08] text-xs font-semibold text-white cursor-pointer focus:outline-none focus:border-white/30"
          >
            <option value="popular">Most Popular</option>
            <option value="sales">Best Selling</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Item Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <p className="text-base font-semibold text-white">No items found</p>
          <p className="text-xs text-white/50 mt-1">Try clearing your filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 md:gap-4">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              isOwned={ownedIds.includes(item.id)}
              onClick={() => setActiveItem(item)}
            />
          ))}
        </div>
      )}

      {/* Quick View / Buy Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-[#111111] border border-white/[0.1] shadow-2xl p-6 flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 size-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
            >
              <X className="size-4" />
            </button>

            <div className="flex gap-4 items-center">
              <div className="size-24 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                <Sparkles className="size-10 text-white/40" />
              </div>
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider">
                  {activeItem.type}
                </span>
                <h3 className="text-lg font-bold text-white truncate">{activeItem.name}</h3>
                <p className="text-xs text-white/60">
                  By <span className="text-white font-medium">{activeItem.creator}</span>
                </p>
              </div>
            </div>

            <p className="text-sm text-white/70 leading-relaxed bg-[#141414] p-3.5 rounded-xl border border-white/[0.06]">
              {activeItem.desc}
            </p>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50 font-medium">Price:</span>
                <div className="flex items-center gap-1.5 font-bold text-base text-white">
                  {activeItem.price === 0 ? (
                    <span className="text-emerald-400 font-bold">FREE</span>
                  ) : (
                    <>
                      <Coins className="size-4 text-amber-400" />
                      <span className="tabular-numbers">{formatPrice(activeItem.price)}</span>
                    </>
                  )}
                </div>
              </div>

              {ownedIds.includes(activeItem.id) ? (
                <button
                  disabled
                  className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white/60 text-sm font-semibold flex items-center gap-2 cursor-not-allowed"
                >
                  <Check className="size-4 text-emerald-400" />
                  Item Owned
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleBuy(activeItem)
                    setActiveItem(null)
                  }}
                  className="px-6 py-2.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 active:scale-95 transition-all cursor-pointer border-none shadow-lg"
                >
                  {activeItem.price === 0 ? 'Get Free' : 'Buy Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
