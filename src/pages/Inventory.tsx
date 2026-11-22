import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { IsometricMannequin } from '@/components/IsometricMannequin'
import { PlayerModel3D, ClothingSelection } from '@/components/PlayerModel3D'
import {
  loadCreatedClothing,
  CLOTHING_UPDATED_EVENT,
  CreatedClothingItem,
} from '@/data/clothingStore'
import { useAuth } from '@/lib/auth'

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
  clothing?: ClothingSelection
}

const TABS = ['All', 'Favorites', 'Accessories', 'Shirts', 'Pants', 'Faces', 'Bundles'] as const

function toInventoryItem(item: CreatedClothingItem, fallbackUsername: string): InventoryItem {
  const clothing: ClothingSelection =
    item.type === 'Shirt'
      ? { shirt: item.textureDataUrl }
      : item.type === 'Pants'
        ? { pants: item.textureDataUrl }
        : { tshirt: item.textureDataUrl }
  const creator =
    !item.creator || item.creator === 'JadexDraft1337' ? fallbackUsername : item.creator
  return {
    id: item.id,
    name: item.name,
    creator,
    priceDisplay: item.price === 0 ? 'Free' : item.price.toLocaleString(),
    category: item.type === 'Pants' ? 'Pants' : 'Shirts',
    type: 'shirt',
    clothing,
  }
}

export function Inventory() {
  const { user, profile } = useAuth()
  const currentUsername =
    profile?.username || (user?.user_metadata?.username as string) || 'Player'
  const [activeTab, setActiveTab] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [createdItems, setCreatedItems] = useState<CreatedClothingItem[]>(() =>
    loadCreatedClothing()
  )

  useEffect(() => {
    const sync = () => setCreatedItems(loadCreatedClothing())
    window.addEventListener(CLOTHING_UPDATED_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(CLOTHING_UPDATED_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const inventoryItems: InventoryItem[] = createdItems.map((it) =>
    toInventoryItem(it, currentUsername)
  )

  const filteredItems = inventoryItems.filter((item) => {
    const matchesTab =
      activeTab === 'All' ||
      item.category === activeTab ||
      (activeTab === 'Favorites' && item.creator === currentUsername)
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.creator.toLowerCase().includes(search.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div className="p-4 md:p-6 lg:p-7 flex flex-col gap-6 max-w-[1700px]">
      {/* 1. Category Tabs Row matching Avatar Editor */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 h-8 rounded-[10px] text-xs font-semibold shrink-0 transition-all duration-150 cursor-pointer border-none outline-none select-none active:scale-[0.97] ${
                isActive
                  ? 'bg-white/[0.08] text-white font-bold backdrop-blur-xs'
                  : 'bg-transparent text-white/50 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {tab}
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

      {/* 3. Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl bg-[#101012]/90 border border-white/[0.06] p-12 text-center">
          <p className="text-sm font-semibold text-white/70 m-0">No items in your inventory yet</p>
          <p className="text-xs text-white/40 m-0 mt-1">
            Items you create in Studio Marketplace or acquire will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3.5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group rounded-[14px] p-3 flex flex-col justify-between cursor-pointer transition-colors duration-150 bg-[#121214] hover:bg-[#1c1c1f] select-none"
            >
              {item.clothing ? (
                <div className="w-full h-36 max-h-36 rounded-xl overflow-hidden">
                  <PlayerModel3D
                    mode="full"
                    useSavedColors={false}
                    autoRotate={false}
                    initialYaw={0.22}
                    clothing={item.clothing}
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <IsometricMannequin
                  name={item.name}
                  type={item.type}
                  shirtType={item.shirtType}
                  faceType={item.faceType}
                />
              )}

              {/* Bottom Info */}
              <div className="flex flex-col gap-0.5 text-left pt-1">
                <h4 className="text-xs md:text-sm font-bold text-white leading-tight truncate group-hover:text-white">
                  {item.name}
                </h4>
                <span className="text-[11px] text-white/50 truncate">
                  By <span className="text-white/80 font-medium">{item.creator}</span>
                </span>
                <div className="flex items-center gap-1 mt-1 text-xs font-bold text-white">
                  {item.isOffSale ? (
                    <span className="text-[11px] text-white/40 font-medium">Off Sale</span>
                  ) : item.priceDisplay === 'Free' ? (
                    <span className="text-[11px] text-white/80 font-bold">Free</span>
                  ) : (
                    <>
                      <img src="/novelo-currency.png" alt="Currency" className="size-3 object-contain shrink-0" />
                      <span>{item.priceDisplay}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
