import { useState, useRef } from 'react'
import {
  X,
  Shirt,
  Gift,
  Heart,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  ChevronRight,
  Check,
} from 'lucide-react'
import { PlayerModel3D, ClothingSelection } from '@/components/PlayerModel3D'
import {
  CreatedClothingItem,
  loadEquippedClothingIds,
  saveEquippedClothingIds,
  resolveEquippedClothing,
} from '@/data/clothingStore'

export interface ItemDetailData {
  id: string
  name: string
  creator: string
  description?: string
  price: number
  createdAt?: number
  sold?: number
  assetType: string
  clothingType?: 'Shirt' | 'Pants' | 'T-Shirt'
  clothing?: ClothingSelection
  isOwned?: boolean
}

interface ItemDetailModalProps {
  item: ItemDetailData
  discoverItems?: CreatedClothingItem[]
  currentUsername: string
  onClose: () => void
  onSelectDiscoverItem?: (item: CreatedClothingItem) => void
  onBuy?: (item: ItemDetailData) => void
}

function toClothingSelection(item: CreatedClothingItem): ClothingSelection {
  if (item.type === 'Shirt') return { shirt: item.textureDataUrl }
  if (item.type === 'Pants') return { pants: item.textureDataUrl }
  return { tshirt: item.textureDataUrl }
}

export function ItemDetailModal({
  item,
  discoverItems = [],
  currentUsername,
  onClose,
  onSelectDiscoverItem,
  onBuy,
}: ItemDetailModalProps) {
  const [isTryOn, setIsTryOn] = useState(false)
  const [is2D, setIs2D] = useState(false)
  const [liked, setLiked] = useState<'up' | 'down' | null>(null)
  const [favorited, setFavorited] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [equippedIds, setEquippedIds] = useState(() => loadEquippedClothingIds())
  const discoverRef = useRef<HTMLDivElement>(null)

  const isEquipped =
    equippedIds.shirtId === item.id ||
    equippedIds.pantsId === item.id ||
    equippedIds.tshirtId === item.id

  const handleToggleEquip = () => {
    if (!item.clothingType) return
    const key =
      item.clothingType === 'Shirt'
        ? 'shirtId'
        : item.clothingType === 'Pants'
          ? 'pantsId'
          : 'tshirtId'
    const next = {
      ...equippedIds,
      [key]: equippedIds[key] === item.id ? undefined : item.id,
    }
    setEquippedIds(next)
    saveEquippedClothingIds(next)
  }

  const previewClothing: ClothingSelection | undefined = isTryOn
    ? { ...resolveEquippedClothing(equippedIds), ...item.clothing }
    : item.clothing

  const createdDateStr = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString()
    : 'Today'

  const filteredDiscover = discoverItems.filter((d) => d.id !== item.id)

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#0a0a0c]/95 backdrop-blur-md flex items-center justify-center p-6 md:p-10 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[1160px] flex flex-col gap-8 my-auto"
      >
        {/* Top 2-Column Item Detail */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {/* Left: 3D / 2D Preview Card */}
          <div className="md:col-span-5 relative rounded-xl bg-[#161618] aspect-square overflow-hidden flex items-center justify-center">
            <PlayerModel3D
              mode="full"
              interactive={!is2D}
              autoRotate={!is2D}
              initialYaw={0.22}
              useSavedColors={isTryOn}
              useSavedClothing={isTryOn}
              clothing={previewClothing}
              className="w-full h-full"
            />

            {/* Bottom-right Try On + 2D/3D buttons */}
            <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsTryOn((v) => !v)}
                className={`h-8 px-3 rounded-[8px] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  isTryOn
                    ? 'bg-white text-black border border-white'
                    : 'bg-[#111113]/85 hover:bg-[#1a1a1d] text-white/85 hover:text-white border border-white/10 backdrop-blur-xs'
                }`}
              >
                <Shirt className="size-3.5" />
                <span>Try on</span>
              </button>
              <button
                type="button"
                onClick={() => setIs2D((v) => !v)}
                className="h-8 px-2.5 rounded-[8px] bg-[#111113]/85 hover:bg-[#1a1a1d] text-white/85 hover:text-white border border-white/10 text-xs font-bold cursor-pointer backdrop-blur-xs transition-all"
              >
                {is2D ? '3D' : '2D'}
              </button>
            </div>
          </div>

          {/* Right: Info & Actions */}
          <div className="md:col-span-7 flex flex-col justify-between gap-5">
            <div className="flex flex-col gap-3">
              {/* Header Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight truncate">
                    {item.name}
                  </h2>
                  <p className="text-xs text-white/50 mt-0.5">
                    By <span className="text-white/80 font-semibold">{item.creator}</span>
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    title="More options"
                    className="size-8 rounded-[8px] bg-[#161618] hover:bg-[#1e1e22] border border-white/[0.08] text-white/60 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <MoreHorizontal className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    title="Close"
                    className="size-8 rounded-[8px] bg-[#161618] hover:bg-[#1e1e22] border border-white/[0.08] text-white/60 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-white/60 leading-relaxed min-h-[36px]">
                {item.description || 'No description provided.'}
              </p>
            </div>

            {/* Bottom Metadata + Action Row */}
            <div className="flex flex-col gap-4">
              {/* Metadata & Rating Row */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-10 md:gap-14">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-white/45 font-medium">Created</span>
                    <span className="text-xs font-semibold text-white">{createdDateStr}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-white/45 font-medium">Sales</span>
                    <span className="text-xs font-semibold text-white">{item.sold ?? 0}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-white/45 font-medium">Asset Type</span>
                    <span className="text-xs font-semibold text-white">{item.assetType}</span>
                  </div>
                </div>

                {/* Likes / Dislikes */}
                <div className="flex items-center rounded-[10px] bg-[#161618] border border-white/[0.08] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setLiked(liked === 'up' ? null : 'up')}
                    className={`h-8 px-3 flex items-center gap-1.5 text-xs font-semibold cursor-pointer border-none transition-colors ${
                      liked === 'up'
                        ? 'bg-white/[0.12] text-white'
                        : 'bg-transparent text-white/60 hover:text-white'
                    }`}
                  >
                    <ThumbsUp className="size-3.5" />
                    <span>{liked === 'up' ? 1 : 0}</span>
                  </button>
                  <div className="w-px h-4 bg-white/[0.08]" />
                  <button
                    type="button"
                    onClick={() => setLiked(liked === 'down' ? null : 'down')}
                    className={`h-8 px-3 flex items-center gap-1.5 text-xs font-semibold cursor-pointer border-none transition-colors ${
                      liked === 'down'
                        ? 'bg-white/[0.12] text-white'
                        : 'bg-transparent text-white/60 hover:text-white'
                    }`}
                  >
                    <ThumbsDown className="size-3.5" />
                    <span>{liked === 'down' ? 1 : 0}</span>
                  </button>
                </div>
              </div>

              {/* Buy / Equip + Secondary Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {item.isOwned ? (
                  <button
                    type="button"
                    onClick={handleToggleEquip}
                    className={`flex-1 min-w-[160px] h-10 px-4 rounded-[10px] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border-none transition-all active:scale-[0.98] ${
                      isEquipped
                        ? 'bg-white/[0.12] text-white hover:bg-white/[0.18]'
                        : 'bg-white text-black hover:bg-neutral-200'
                    }`}
                  >
                    {isEquipped && <Check className="size-3.5 stroke-[2.5]" />}
                    <span>{isEquipped ? 'Equipped' : 'Equip'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onBuy?.(item)}
                    className="flex-1 min-w-[160px] h-10 px-4 rounded-[10px] bg-[#02b070] hover:bg-[#009b62] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border-none transition-all active:scale-[0.98]"
                  >
                    {item.price === 0 ? (
                      <span>Get for Free</span>
                    ) : (
                      <>
                        <span>Buy for</span>
                        <img
                          src="/novelo-currency.png"
                          alt="Novelo"
                          className="size-3.5 object-contain"
                        />
                        <span>{item.price.toLocaleString()}</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  className="h-10 px-3.5 rounded-[10px] bg-[#161618] hover:bg-[#1e1e22] border border-white/[0.08] text-xs font-semibold text-white/80 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Gift className="size-3.5" />
                  <span>Gift</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFavorited((v) => !v)}
                  className={`h-10 px-3.5 rounded-[10px] border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                    favorited
                      ? 'bg-white/[0.12] border-white/25 text-white'
                      : 'bg-[#161618] hover:bg-[#1e1e22] border-white/[0.08] text-white/80 hover:text-white'
                  }`}
                >
                  <Heart className={`size-3.5 ${favorited ? 'fill-current' : ''}`} />
                  <span>Favorite</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWishlisted((v) => !v)}
                  className={`h-10 px-3.5 rounded-[10px] border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                    wishlisted
                      ? 'bg-white/[0.12] border-white/25 text-white'
                      : 'bg-[#161618] hover:bg-[#1e1e22] border-white/[0.08] text-white/80 hover:text-white'
                  }`}
                >
                  <Bookmark className={`size-3.5 ${wishlisted ? 'fill-current' : ''}`} />
                  <span>Wishlist</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Discover More Row */}
        {filteredDiscover.length > 0 && (
          <div className="flex flex-col gap-3 relative">
            <h3 className="text-sm font-bold text-white tracking-tight">Discover more</h3>
            <div className="relative">
              <div
                ref={discoverRef}
                className="flex items-stretch gap-3 overflow-x-auto no-scrollbar pb-1"
              >
                {filteredDiscover.map((dItem) => {
                  const creatorName =
                    !dItem.creator || dItem.creator === 'JadexDraft1337'
                      ? currentUsername
                      : dItem.creator
                  return (
                    <div
                      key={dItem.id}
                      onClick={() => onSelectDiscoverItem?.(dItem)}
                      className="w-36 shrink-0 rounded-[12px] p-2 bg-[#141416] hover:bg-[#1c1c1f] flex flex-col gap-1.5 cursor-pointer transition-colors select-none"
                    >
                      <div className="w-full h-28 rounded-lg overflow-hidden">
                        <PlayerModel3D
                          mode="full"
                          useSavedColors={false}
                          useSavedClothing={false}
                          autoRotate={false}
                          initialYaw={0.22}
                          clothing={toClothingSelection(dItem)}
                          className="w-full h-full"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-xs font-bold text-white truncate">{dItem.name}</span>
                        <span className="text-[10px] text-white/50 truncate">
                          By <span className="text-white/75">{creatorName}</span>
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-white mt-0.5">
                          {dItem.price === 0 ? (
                            <span>Free</span>
                          ) : (
                            <>
                              <img
                                src="/novelo-currency.png"
                                alt="Novelo"
                                className="size-2.5 object-contain"
                              />
                              <span>{dItem.price.toLocaleString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {filteredDiscover.length > 4 && (
                <button
                  type="button"
                  onClick={() => discoverRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
                  className="absolute right-1 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/75 hover:bg-black border border-white/15 text-white flex items-center justify-center cursor-pointer shadow-lg"
                >
                  <ChevronRight className="size-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
