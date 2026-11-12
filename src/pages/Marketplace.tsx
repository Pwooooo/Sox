import { useState } from 'react'
import { Search, Filter, Star, Clock, Palette, Flame } from 'lucide-react'
import { IsometricMannequin } from '@/components/IsometricMannequin'
import { CustomDropdown, DropdownOption } from '@/components/CustomDropdown'

interface MarketItem {
  id: string
  name: string
  creator: string
  price: number
  hasRainbow?: boolean
  hasStarBanner?: boolean
  timeLeft?: string
  category: string
}

const MARKETPLACE_ITEMS: MarketItem[] = [
  { id: 'm1', name: '???', creator: 'Luduvo', price: 42, timeLeft: '313d 10h left', category: 'Accessories' },
  { id: 'm2', name: 'Long Hair', creator: 'Luduvo', price: 50, hasRainbow: true, category: 'Hair' },
  { id: 'm3', name: 'Fedora', creator: 'Luduvo', price: 70, hasRainbow: true, category: 'Hats' },
  { id: 'm4', name: 'Ushanka', creator: 'Luduvo', price: 75, hasRainbow: true, category: 'Hats' },
  { id: 'm5', name: 'Puff', creator: 'bro', price: 2015, category: 'Clothing' },
  { id: 'm6', name: 'Antlers', creator: 'Luduvo', price: 250, hasRainbow: true, category: 'Accessories' },
  { id: 'm7', name: 'Middle Split Hair', creator: 'Luduvo', price: 50, hasRainbow: true, category: 'Hair' },
  { id: 'm8', name: 'Winter Scarf', creator: 'Luduvo', price: 75, hasRainbow: true, category: 'Accessories' },
  { id: 'm9', name: 'Eater Helmet', creator: 'Luduvo', price: 70, category: 'Hats' },
  { id: 'm10', name: "Vux's pants", creator: 'vux', price: 5, category: 'Pants' },
  { id: 'm11', name: "Vux's sweater", creator: 'vux', price: 5, category: 'Shirts' },
  { id: 'm12', name: 'Teapot', creator: 'Luduvo', price: 100, category: 'Hats' },
  { id: 'm13', name: 'Blind Ascension', creator: 'Luduvo', price: 2250, hasStarBanner: true, category: 'Accessories' },
  { id: 'm14', name: 'Chilly', creator: 'Luduvo', price: 900, hasStarBanner: true, category: 'Faces' },
  { id: 'm15', name: 'D-Delayed?', creator: 'Luduvo', price: 30, category: 'Faces' },
  { id: 'm16', name: 'Moth Wings', creator: 'Luduvo', price: 70, hasRainbow: true, category: 'Accessories' },
  { id: 'm17', name: 'Traffic Cone', creator: 'Luduvo', price: 90, category: 'Hats' },
  { id: 'm18', name: 'Crown of Rich...', creator: 'Luduvo', price: 300, category: 'Hats' },
  { id: 'm19', name: 'Golden Crown', creator: 'Luduvo', price: 1234, hasStarBanner: true, category: 'Hats' },
  { id: 'm20', name: 'Paper Bag', creator: 'Luduvo', price: 50, hasRainbow: true, category: 'Hats' },
  { id: 'm21', name: 'Ribcage', creator: 'Luduvo', price: 77, category: 'Clothing' },
  { id: 'm22', name: 'Shark Hoodie', creator: 'Luduvo', price: 70, hasRainbow: true, category: 'Clothing' },
  { id: 'm23', name: 'Blooming Eye', creator: 'Luduvo', price: 70, category: 'Faces' },
  { id: 'm24', name: 'Horned Cranium', creator: 'Luduvo', price: 420, hasStarBanner: true, category: 'Hats' },
  { id: 'm25', name: 'Party Hat', creator: 'Luduvo', price: 10, category: 'Hats' },
  { id: 'm26', name: 'Party Face', creator: 'Luduvo', price: 299, hasStarBanner: true, category: 'Faces' },
  { id: 'm27', name: 'Sweater Collar', creator: 'Luduvo', price: 40, hasRainbow: true, category: 'Accessories' },
  { id: 'm28', name: 'Red Traffic Cone', creator: 'Luduvo', price: 1200, category: 'Hats' },
  { id: 'm29', name: 'Bloodied Ribcage', creator: 'Luduvo', price: 300, hasStarBanner: true, category: 'Clothing' },
  { id: 'm30', name: 'Robot', creator: 'Luduvo', price: 2000, hasStarBanner: true, category: 'Bundles' },
]

export function Marketplace() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [sort, setSort] = useState('Relevance')
  const [userBalance, setUserBalance] = useState(1250)

  const handleBuy = (item: MarketItem) => {
    if (userBalance < item.price) {
      alert('Insufficient Novelo balance! Please acquire more currency from the Store.')
      return
    }
    setUserBalance((prev) => prev - item.price)
    alert(`Purchased ${item.name} for ${item.price} Novelo!`)
  }

  const filteredItems = MARKETPLACE_ITEMS.filter((item) => {
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
      icon: <Flame className="size-3.5 text-orange-400 stroke-[2.2]" />,
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

          {/* Filter Funnel Icon matching Image 1 */}
          <button className="size-9 rounded-[10px] bg-[#111113] border border-white/10 hover:border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer">
            <Filter className="size-3.5 stroke-[2]" />
          </button>
        </div>
      </div>

      {/* 10-Column Catalog Grid matching Image 3 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
        {sortedItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleBuy(item)}
            className="group rounded-[14px] p-2.5 flex flex-col justify-between cursor-pointer transition-colors duration-150 bg-[#121214] hover:bg-[#1c1c1f] select-none relative"
          >
            {/* Limited Time Left Banner (Top Left) */}
            {item.timeLeft && (
              <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded-full bg-red-600/90 text-white text-[9px] font-bold flex items-center gap-1 shadow-sm">
                <Clock className="size-2.5" />
                <span>{item.timeLeft}</span>
              </div>
            )}

            {/* Mannequin Preview Container (Seamless 3D Isometric Mannequin) */}
            <IsometricMannequin
              name={item.name}
              type={item.category.toLowerCase()}
              className="h-36 max-h-36"
            />

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
    </div>
  )
}
