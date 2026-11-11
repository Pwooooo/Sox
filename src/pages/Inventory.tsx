import { useState } from 'react'
import { Search, Sparkles, Filter, Check, Eye } from 'lucide-react'
import { ITEMS, CATEGORIES, Item } from '@/data/items'
import { cn } from '@/lib/utils'

export function Inventory() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [search, setSearch] = useState('')
  const [equippedList, setEquippedList] = useState<number[]>([1, 4, 10, 13])
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  const toggleEquip = (id: number) => {
    setEquippedList((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const filteredItems = ITEMS.filter((item) => {
    const matchesCategory = !selectedCategory || item.type === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.creator.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="p-4 md:p-6 lg:p-7 flex flex-col gap-6 max-w-[1700px]">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Inventory
          </h1>
          <p className="text-xs md:text-sm text-white/50 mt-0.5">
            Your collection of accessories, clothing, and gear on Novelo
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3.5 rounded-xl bg-[#141414]/90 border border-white/10 text-xs md:text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30"
          />
        </div>
      </div>

      {/* Category Pills (No outline, matching Luduvo tab animations) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.key
          return (
            <button
              key={cat.key || 'all'}
              onClick={() => setSelectedCategory(cat.key)}
              className={cn(
                "px-3.5 h-9 rounded-[10px] text-xs font-semibold shrink-0 transition-all duration-150 cursor-pointer border-none outline-none select-none active:scale-[0.97]",
                isActive
                  ? "bg-white text-black shadow-md font-bold"
                  : "bg-white/[0.06] text-white/70 hover:text-white hover:bg-white/[0.12]"
              )}
            >
              {cat.name}
            </button>
          )
        })}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 md:gap-4">
        {filteredItems.map((item) => {
          const isEquipped = equippedList.includes(item.id)
          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="p-3.5 rounded-xl bg-[#141414]/80 hover:bg-[#181818] border border-white/10 hover:border-white/20 transition-all flex flex-col gap-2.5 cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="aspect-square w-full rounded-lg bg-neutral-900 border border-white/5 flex items-center justify-center relative overflow-hidden">
                <Sparkles className="size-8 text-white/20 group-hover:scale-110 group-hover:text-white/40 transition-all" />
                {isEquipped && (
                  <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm shadow-md">
                    EQUIPPED
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
            </div>
          )
        })}
      </div>

      {/* Item Detail Modal */}
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
              <p className="text-xs text-white/50">Created by {selectedItem.creator}</p>
              <p className="text-xs text-white/70 mt-2 leading-relaxed">{selectedItem.desc}</p>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  toggleEquip(selectedItem.id)
                  setSelectedItem(null)
                }}
                className={`flex-1 h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border-none shadow-md ${
                  equippedList.includes(selectedItem.id)
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                <Check className="size-4" />
                <span>{equippedList.includes(selectedItem.id) ? 'Unequip Item' : 'Equip to Avatar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
