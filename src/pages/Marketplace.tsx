import { useState, useEffect } from 'react'
import { Search, Clock, Flame } from 'lucide-react'
import { IsometricMannequin } from '@/components/IsometricMannequin'
import { CustomDropdown, DropdownOption } from '@/components/CustomDropdown'
import { PlayerModel3D, ClothingSelection } from '@/components/PlayerModel3D'
import { ItemDetailModal, ItemDetailData } from '@/components/ItemDetailModal'
import { useAuth } from '@/lib/auth'
import {
  loadCreatedClothing,
  CLOTHING_UPDATED_EVENT,
  CreatedClothingItem,
} from '@/data/clothingStore'

interface MarketItem {
  id: string
  name: string
  creator: string
  description?: string
  price: number
  createdAt?: number
  sold?: number
  hasRainbow?: boolean
  hasStarBanner?: boolean
  timeLeft?: string
  category: string
  clothingType?: 'Shirt' | 'Pants' | 'T-Shirt'
  clothing?: ClothingSelection
}

function toMarketItem(item: CreatedClothingItem, fallbackUsername: string): MarketItem {
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
    description: item.description,
    price: item.price,
    createdAt: item.createdAt,
    sold: item.sold,
    category: 'Clothing',
    clothingType: item.type,
    clothing,
  }
}

export function Marketplace({ initialItemId }: { initialItemId?: string | null }) {
  const { user, profile } = useAuth()
  const currentUsername =
    profile?.username || (user?.user_metadata?.username as string) || 'Player'
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [sort, setSort] = useState('Relevance')
  const [selectedItem, setSelectedItem] = useState<ItemDetailData | null>(null)
  const [createdItems, setCreatedItems] = useState<CreatedClothingItem[]>(() =>
    loadCreatedClothing()
  )

  useEffect(() => {
    if (!initialItemId) return
    const match = createdItems.find((it) => it.id === initialItemId)
    if (match) {
      const mItem = toMarketItem(match, currentUsername)
      setSelectedItem({
        id: mItem.id,
        name: mItem.name,
        creator: mItem.creator,
        description: mItem.description,
        price: mItem.price,
        createdAt: mItem.createdAt,
        sold: mItem.sold,
        assetType: mItem.clothingType || mItem.category,
        clothingType: mItem.clothingType,
        clothing: mItem.clothing,
      })
    }
  }, [initialItemId, createdItems, currentUsername])

  useEffect(() => {
    const sync = () => setCreatedItems(loadCreatedClothing())
    window.addEventListener(CLOTHING_UPDATED_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(CLOTHING_UPDATED_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const marketplaceItems: MarketItem[] = createdItems.map((it) =>
    toMarketItem(it, currentUsername)
  )

  const toDetailData = (item: MarketItem): ItemDetailData => ({
    id: item.id,
    name: item.name,
    creator: item.creator,
    description: item.description,
    price: item.price,
    createdAt: item.createdAt,
    sold: item.sold,
    assetType: item.clothingType || item.category,
    clothingType: item.clothingType,
    clothing: item.clothing,
    isOwned: false,
  })

  const filteredItems = marketplaceItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.creator.toLowerCase().includes(search.toLowerCase())
    const matchesCat = category === 'All Categories' || item.category === category
    return matchesSearch && matchesCat
  })

  const categoryOptions: DropdownOption[] = [
    { value: 'All Categories', label: 'All Categories' },
    { value: 'Hats', label: 'Hats' },
    { value: 'Hair', label: 'Hair' },
    { value: 'Faces', label: 'Faces' },
    { value: 'Clothing', label: 'Clothing' },
    { value: 'Accessories', label: 'Accessories' },
  ]

  const sortOptions: DropdownOption[] = [
    { value: 'Relevance', label: 'Relevance' },
    {
      value: 'Popular',
      label: 'Popular',
      icon: <Flame className="size-3.5 text-white stroke-[2.2]" />,
    },
    {
      value: 'Newest',
      label: 'Newest',
      icon: <Clock className="size-3.5 text-white/80 stroke-[2.2]" />,
    },
    { value: 'Price: Low to High', label: 'Price: Low to High' },
    { value: 'Price: High to Low', label: 'Price: High to Low' },
  ]

  let sortedItems = [...filteredItems]
  if (sort === 'Price: Low to High') {
    sortedItems.sort((a, b) => a.price - b.price)
  } else if (sort === 'Price: High to Low') {
    sortedItems.sort((a, b) => b.price - a.price)
  } else if (sort === 'Popular') {
    sortedItems.sort((a, b) => b.price - a.price)
  }

  return (
    <div className="p-4 md:p-6 lg:p-7 flex flex-col gap-6 max-w-[1900px]">
      {/* Top Search & Filter Header matching Image 1 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-xl w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/40" />
          <input
            type="text"
            placeholder="Search items, creators, or tags"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-10 pr-4 rounded-[10px] bg-[#111113] border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-white/25 transition-all"
          />
        </div>

        {/* Right Dropdowns & Filter Funnel matching Image 1 & 3 */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 justify-end">
          {/* Category Dropdown */}
          <CustomDropdown
            value={category}
            onChange={setCategory}
            options={categoryOptions}
          />

          {/* Relevance Dropdown matching Image 3 */}
          <CustomDropdown
            value={sort}
            onChange={setSort}
            options={sortOptions}
          />
        </div>
      </div>

      {/* 10-Column Catalog Grid matching Image 3 */}
      {sortedItems.length === 0 ? (
        <div className="rounded-2xl bg-[#101012]/90 border border-white/[0.06] p-12 text-center">
          <p className="text-sm font-semibold text-white/70 m-0">No marketplace items yet</p>
          <p className="text-xs text-white/40 m-0 mt-1">
            Items published to the Novelo Marketplace will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(toDetailData(item))}
              className="group rounded-[14px] p-2.5 flex flex-col justify-between cursor-pointer transition-colors duration-150 bg-[#121214] hover:bg-[#1c1c1f] select-none relative"
            >
              {/* Limited Time Left Banner (Top Left) */}
              {item.timeLeft && (
                <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded-full bg-red-600/90 text-white text-[9px] font-bold flex items-center gap-1 shadow-sm">
                  <Clock className="size-2.5" />
                  <span>{item.timeLeft}</span>
                </div>
              )}

              {/* Mannequin Preview Container */}
              {item.clothing ? (
                <div className="w-full h-36 max-h-36 rounded-xl overflow-hidden">
                  <PlayerModel3D
                    mode="full"
                    useSavedColors={false}
                    useSavedClothing={false}
                    autoRotate={false}
                    initialYaw={0.22}
                    clothing={item.clothing}
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <IsometricMannequin
                  name={item.name}
                  type={item.category.toLowerCase()}
                  className="h-36 max-h-36"
                />
              )}

              {/* Title, Creator, Price */}
              <div className="flex flex-col gap-0.5 min-w-0 text-left pt-1">
                <h4 className="text-xs md:text-sm font-bold text-white leading-tight truncate group-hover:text-white">
                  {item.name}
                </h4>
                <span className="text-[11px] text-white/50 truncate">
                  By <span className="text-white/80 font-medium">{item.creator}</span>
                </span>
                <div className="flex items-center gap-1 mt-1 text-xs font-bold text-white">
                  <img src="/novelo-currency.png" alt="Currency" className="size-3 object-contain shrink-0" />
                  <span>{item.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          discoverItems={createdItems}
          currentUsername={currentUsername}
          onClose={() => setSelectedItem(null)}
          onSelectDiscoverItem={(dItem) => setSelectedItem(toDetailData(toMarketItem(dItem, currentUsername)))}
        />
      )}
    </div>
  )
}
