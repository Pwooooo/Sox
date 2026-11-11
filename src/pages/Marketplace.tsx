import { useState } from 'react'
import { Search, ShoppingBag, Sparkles, Check, ChevronDown, Tag, Star } from 'lucide-react'
import { ITEMS, CATEGORIES, Item } from '@/data/items'

export function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'featured' | 'low' | 'high' | 'rating'>('featured')
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [userBalance, setUserBalance] = useState(1250)
  const [boughtItems, setBoughtItems] = useState<number[]>([])
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)

  const handleBuy = (item: Item) => {
    if (userBalance < item.price) {
      alert('Insufficient Novelo currency balance! Visit the Store to top up.')
      return
    }
    setUserBalance((prev) => prev - item.price)
    setBoughtItems((prev) => [...prev, item.id])
    setPurchaseSuccess(true)
    setTimeout(() => {
      setPurchaseSuccess(false)
      setSelectedItem(null)
    }, 1500)
  }

  const sortedItems = [...ITEMS]
    .filter((item) => {
      const matchesCat = !selectedCategory || item.type === selectedCategory
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.creator.toLowerCase().includes(search.toLowerCase())
      return matchesCat && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'low') return a.price - b.price
      if (sortBy === 'high') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      return b.sales - a.sales
    })

  return (
    <div className="p-4 md:p-6 lg:p-7 flex flex-col gap-6 max-w-[1700px]">
      {/* Header & Balance */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Marketplace
          </h1>
          <p className="text-xs md:text-sm text-white/50 mt-0.5">
            Discover community-created clothing, accessories, and collectible gear
          </p>
        </div>

        {/* Balance Display */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141414] border border-white/10 w-fit">
          <img src="/novelo-currency.png" alt="Currency" className="size-4 object-contain" />
          <span className="text-xs text-white/50">Balance:</span>
          <span className="text-xs font-bold text-white tabular-numbers">{userBalance.toLocaleString()}</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.key
            return (
              <button
                key={cat.key || 'all'}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-white text-black border-white shadow-md'
                    : 'bg-[#141414]/80 text-white/70 hover:text-white hover:bg-white/[0.08] border-white/10'
                }`}
              >
                {cat.name}
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/40" />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-8 pr-3 rounded-xl bg-[#141414] border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-white/30"
          />
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 md:gap-4">
        {sortedItems.map((item) => {
          const isOwned = boughtItems.includes(item.id)
          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="p-3.5 rounded-xl bg-[#141414]/80 hover:bg-[#181818] border border-white/10 hover:border-white/20 transition-all flex flex-col gap-2.5 cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="aspect-square w-full rounded-lg bg-neutral-900 border border-white/5 flex items-center justify-center relative overflow-hidden">
                <Sparkles className="size-8 text-white/20 group-hover:scale-110 group-hover:text-white/40 transition-all" />
                {isOwned && (
                  <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">
                    OWNED
                  </span>
                )}
              </div>

              {/* Title & Creator */}
              <div className="flex flex-col">
                <h4 className="text-xs font-bold text-white truncate group-hover:text-white">
                  {item.name}
                </h4>
                <span className="text-[10px] text-white/50 truncate">By {item.creator}</span>
              </div>

              {/* Price & Rating */}
              <div className="flex items-center justify-between pt-1 border-t border-white/[0.06] text-xs">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <img src="/novelo-currency.png" alt="Currency" className="size-3.5 object-contain" />
                  <span>{item.price === 0 ? 'FREE' : item.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-0.5 text-[10px] text-white/50">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  <span>{item.rating}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Item Purchase Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-[#141414] border border-white/10 p-6 flex flex-col gap-5 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-square w-full rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center">
              <Sparkles className="size-16 text-white/30" />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{selectedItem.name}</h3>
                <span className="text-xs text-white/50 capitalize px-2 py-0.5 bg-white/5 rounded-md">
                  {selectedItem.type}
                </span>
              </div>
              <p className="text-xs text-white/50">Creator: {selectedItem.creator}</p>
              <p className="text-xs text-white/70 mt-2 leading-relaxed">{selectedItem.desc}</p>
            </div>

            {/* Price Row */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-xs text-white/70">Price:</span>
              <div className="flex items-center gap-1.5 text-base font-bold text-white">
                <img src="/novelo-currency.png" alt="Currency" className="size-4 object-contain" />
                <span>{selectedItem.price === 0 ? 'FREE' : selectedItem.price.toLocaleString()}</span>
              </div>
            </div>

            {/* Purchase / Owned Button */}
            <button
              onClick={() => handleBuy(selectedItem)}
              disabled={boughtItems.includes(selectedItem.id) || purchaseSuccess}
              className={`w-full h-11 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border-none shadow-lg ${
                purchaseSuccess || boughtItems.includes(selectedItem.id)
                  ? 'bg-emerald-500 text-white cursor-default'
                  : 'bg-white text-black hover:bg-neutral-200 active:scale-[0.98]'
              }`}
            >
              {purchaseSuccess || boughtItems.includes(selectedItem.id) ? (
                <>
                  <Check className="size-4" />
                  <span>Item in Inventory!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="size-4" />
                  <span>Buy Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
