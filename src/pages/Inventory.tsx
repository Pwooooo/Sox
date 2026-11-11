import { useState } from 'react'
import { Search, Sparkles } from 'lucide-react'

interface InventoryItem {
  id: string
  name: string
  creator: string
  priceDisplay: string
  category: 'Accessories' | 'Shirts' | 'Pants' | 'Faces' | 'Bundles'
  type: 'antlers' | 'face' | 'shirt' | 'accessory'
  faceType?: 'derp' | 'smirk' | 'smile'
  shirtType?: 'cat' | 'white' | 'black'
  isOffSale?: boolean
}

const LUDUVO_ITEMS: InventoryItem[] = [
  {
    id: 'l1',
    name: 'Alpha Antlers',
    creator: 'Luduvo',
    priceDisplay: 'Off Sale',
    category: 'Accessories',
    type: 'antlers',
    isOffSale: true,
  },
  {
    id: 'l2',
    name: 'Single Celled ...',
    creator: 'Luduvo',
    priceDisplay: '1',
    category: 'Faces',
    type: 'face',
    faceType: 'derp',
  },
  {
    id: 'l3',
    name: 'D-Delayed?',
    creator: 'Luduvo',
    priceDisplay: '30',
    category: 'Faces',
    type: 'face',
    faceType: 'smirk',
  },
  {
    id: 'l4',
    name: 'Smile',
    creator: 'Luduvo',
    priceDisplay: 'Free',
    category: 'Faces',
    type: 'face',
    faceType: 'smile',
  },
  {
    id: 'l5',
    name: 'i like cats',
    creator: 'sky',
    priceDisplay: '1,000,000',
    category: 'Shirts',
    type: 'shirt',
    shirtType: 'cat',
  },
  {
    id: 'l6',
    name: 'Pwo',
    creator: 'sky',
    priceDisplay: '10,000',
    category: 'Shirts',
    type: 'shirt',
    shirtType: 'white',
  },
  {
    id: 'l7',
    name: 'Pwo',
    creator: 'sky',
    priceDisplay: '10,000',
    category: 'Shirts',
    type: 'shirt',
    shirtType: 'black',
  },
]

const TABS = ['All', 'Favorites', 'Accessories', 'Shirts', 'Pants', 'Faces', 'Bundles'] as const

export function Inventory() {
  const [activeTab, setActiveTab] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)

  const filteredItems = LUDUVO_ITEMS.filter((item) => {
    const matchesTab = activeTab === 'All' || item.category === activeTab || (activeTab === 'Favorites' && item.creator === 'sky')
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.creator.toLowerCase().includes(search.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div className="p-4 md:p-6 lg:p-7 flex flex-col gap-6 max-w-[1700px]">
      {/* 1. Header Tabs Row with Underline matching Image 2 */}
      <div className="flex items-center gap-6 border-b border-white/[0.08] pb-1 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => {
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-xs font-semibold tracking-tight transition-all cursor-pointer border-none bg-transparent shrink-0 relative ${
                isActive ? 'text-white font-bold' : 'text-white/50 hover:text-white/80'
              }`}
            >
              {tab}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* 2. Search Bar matching Image 2 */}
      <div className="relative w-full max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/40" />
        <input
          type="text"
          placeholder="Search inventory by item or creator"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#121214] border border-white/5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-white/20 transition-all"
        />
      </div>

      {/* 3. Cards Grid matching Luduvo style from Image 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="rounded-xl bg-[#101012] hover:bg-[#161618] border border-white/[0.04] hover:border-white/10 transition-all p-3 flex flex-col gap-2.5 cursor-pointer group"
          >
            {/* Mannequin Preview Container */}
            <div className="aspect-[4/5] w-full rounded-lg bg-[#141416] flex items-center justify-center relative overflow-hidden">
              {/* Mannequin Model wearing item */}
              <div className="relative flex flex-col items-center justify-center transition-transform group-hover:scale-105 duration-200">
                {/* Antlers accessory */}
                {item.type === 'antlers' && (
                  <div className="flex flex-col items-center">
                    <div className="text-purple-400 -mb-1 animate-pulse">
                      <Sparkles className="size-6 text-purple-400" />
                    </div>
                    {/* Head */}
                    <div className="size-6 bg-neutral-300 rounded-xs mb-0.5" />
                    {/* Torso & Arms */}
                    <div className="flex gap-0.5">
                      <div className="w-2 h-7 bg-neutral-300 rounded-xs" />
                      <div className="w-5 h-7 bg-neutral-300 rounded-xs" />
                      <div className="w-2 h-7 bg-neutral-300 rounded-xs" />
                    </div>
                  </div>
                )}

                {/* Face expressions on blocky head */}
                {item.type === 'face' && (
                  <div className="flex flex-col items-center">
                    <div className="size-16 rounded-md bg-neutral-200 flex flex-col items-center justify-center shadow-sm">
                      {item.faceType === 'derp' && (
                        <>
                          <div className="flex gap-3 mb-1">
                            <div className="size-1 rounded-full bg-black" />
                            <div className="size-1 rounded-full bg-black" />
                          </div>
                          <div className="w-3 h-1 border-b-2 border-black rounded-b-full rotate-[-12deg]" />
                        </>
                      )}
                      {item.faceType === 'smirk' && (
                        <>
                          <div className="flex gap-2.5 mb-1">
                            <span className="text-[10px] font-bold text-black leading-none">O</span>
                            <span className="text-[10px] font-bold text-black leading-none">O</span>
                          </div>
                          <div className="w-3 h-0.5 border-b border-black rounded-b-full" />
                        </>
                      )}
                      {item.faceType === 'smile' && (
                        <>
                          <div className="flex gap-3 mb-1">
                            <div className="size-1.5 rounded-full bg-black" />
                            <div className="size-1.5 rounded-full bg-black" />
                          </div>
                          <div className="w-4 h-1.5 border-b-2 border-black rounded-b-full" />
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Shirts on Torso */}
                {item.type === 'shirt' && (
                  <div className="flex flex-col items-center">
                    {/* Head */}
                    <div className="size-5 bg-neutral-300 rounded-xs mb-0.5" />
                    {/* Shirt Torso */}
                    <div className="flex items-start gap-0.5">
                      <div
                        className="w-2.5 h-9 rounded-xs"
                        style={{
                          backgroundColor:
                            item.shirtType === 'white' ? '#f4f4f5' : '#18181b',
                        }}
                      />
                      <div
                        className="w-7 h-9 rounded-xs flex items-center justify-center relative overflow-hidden"
                        style={{
                          backgroundColor:
                            item.shirtType === 'white' ? '#f4f4f5' : '#18181b',
                        }}
                      >
                        {item.shirtType === 'cat' && (
                          <div className="size-4 bg-black/60 rounded-xs flex items-center justify-center text-[8px]">
                            🐱
                          </div>
                        )}
                        {item.shirtType === 'white' && (
                          <div className="size-2 bg-neutral-800 rounded-full" />
                        )}
                        {item.shirtType === 'black' && (
                          <div className="w-5 h-2 bg-white/90 rounded-xs" />
                        )}
                      </div>
                      <div
                        className="w-2.5 h-9 rounded-xs"
                        style={{
                          backgroundColor:
                            item.shirtType === 'white' ? '#f4f4f5' : '#18181b',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Info matching Image 2 */}
            <div className="flex flex-col gap-0.5">
              <h4 className="text-xs font-bold text-white leading-tight truncate group-hover:text-white">
                {item.name}
              </h4>
              <span className="text-[11px] text-white/50 truncate">By {item.creator}</span>
              <div className="flex items-center gap-1 mt-0.5">
                {item.isOffSale ? (
                  <span className="text-[11px] text-white/40 font-medium">Off Sale</span>
                ) : item.priceDisplay === 'Free' ? (
                  <span className="text-[11px] text-white/80 font-bold">Free</span>
                ) : (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-white">
                    <img src="/novelo-currency.png" alt="Currency" className="size-3 object-contain" />
                    <span>{item.priceDisplay}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
