import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Coins, Check, Sparkles, Tag, ShieldCheck, Heart } from 'lucide-react'
import { ITEMS, formatPrice, TYPE_LABELS } from '@/data/items'
import { ItemCard } from '@/components/ItemCard'

export function ItemDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const item = ITEMS.find((i) => i.id === Number(id)) || ITEMS[0]

  const [isOwned, setIsOwned] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [purchaseToast, setPurchaseToast] = useState(false)

  const relatedItems = ITEMS.filter((i) => i.type === item.type && i.id !== item.id).slice(0, 5)

  const handleBuy = () => {
    setIsOwned(true)
    setPurchaseToast(true)
    setTimeout(() => setPurchaseToast(false), 3000)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-8 max-w-6xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/marketplace')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white transition-colors cursor-pointer border-none bg-transparent w-fit"
      >
        <ArrowLeft className="size-4" />
        Back to Marketplace
      </button>

      {/* Main Item Detail Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left: 3D Preview Stage */}
        <div className="md:col-span-5 rounded-2xl bg-[#111111] border border-white/[0.08] p-8 aspect-square flex flex-col items-center justify-center relative shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Item Stage Display */}
          <div className="relative size-44 rounded-3xl bg-white/[0.04] border border-white/10 flex items-center justify-center shadow-inner hover:scale-105 transition-transform duration-300">
            <Tag className="size-20 text-white/60" />
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/40">
            <span>Asset #{item.id}</span>
            <span>Category: {TYPE_LABELS[item.type]}</span>
          </div>
        </div>

        {/* Right: Info & Purchase Action */}
        <div className="md:col-span-7 flex flex-col gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-bold text-white/60 uppercase tracking-wider mb-2">
              <Sparkles className="size-3 text-amber-400" />
              {TYPE_LABELS[item.type]}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {item.name}
            </h1>
            <p className="text-sm text-white/50 mt-1">
              Created by <span className="text-white font-medium hover:underline cursor-pointer">{item.creator}</span>
            </p>
          </div>

          {/* Price & Actions Box */}
          <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.08] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/50">Price</span>
              <div className="flex items-center gap-2 font-bold text-xl text-white">
                {item.price === 0 ? (
                  <span className="text-emerald-400">FREE</span>
                ) : (
                  <>
                    <Coins className="size-5 text-amber-400" />
                    <span className="tabular-numbers">{formatPrice(item.price)}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isOwned ? (
                <button
                  disabled
                  className="flex-1 h-11 rounded-xl bg-white/10 border border-white/20 text-white/60 text-sm font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <Check className="size-4 text-emerald-400" />
                  Item Owned
                </button>
              ) : (
                <button
                  onClick={handleBuy}
                  className="flex-1 h-11 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 active:scale-[0.99] transition-all cursor-pointer border-none shadow-lg flex items-center justify-center gap-2"
                >
                  {item.price === 0 ? 'Get Item' : 'Buy Item'}
                </button>
              )}

              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className="size-11 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <Heart className={`size-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            {purchaseToast && (
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 pt-1 animate-in fade-in">
                <Check className="size-3.5" /> Added to your avatar inventory!
              </div>
            )}
          </div>

          {/* Description & Details */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Description</h3>
            <p className="text-sm text-white/70 leading-relaxed bg-[#111111] p-4 rounded-xl border border-white/[0.08]">
              {item.desc}
            </p>
          </div>

          {/* Stats Details Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#111111] border border-white/[0.08]">
              <span className="text-[11px] text-white/40 block">Total Sales</span>
              <span className="text-sm font-bold text-white tabular-numbers">{item.sales.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#111111] border border-white/[0.08]">
              <span className="text-[11px] text-white/40 block">Rating</span>
              <span className="text-sm font-bold text-white tabular-numbers">{item.rating} / 5.0</span>
            </div>
            <div className="p-3 rounded-xl bg-[#111111] border border-white/[0.08]">
              <span className="text-[11px] text-white/40 block">Genre</span>
              <span className="text-sm font-bold text-white">All</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Items */}
      {relatedItems.length > 0 && (
        <div className="mt-8 pt-8 border-t border-white/[0.08] flex flex-col gap-4">
          <h2 className="text-lg font-bold text-white">Recommended for You</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {relatedItems.map((rel) => (
              <ItemCard
                key={rel.id}
                item={rel}
                onClick={() => navigate(`/marketplace/${rel.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
