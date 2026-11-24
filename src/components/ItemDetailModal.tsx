import { useState, useRef, useEffect } from 'react'
import {
  X,
  Shirt,
  Gift,
  Heart,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  ChevronRight,
  Check,
  Link2,
} from 'lucide-react'
import { PlayerModel3D, ClothingSelection } from '@/components/PlayerModel3D'
import { WaveBackground } from '@/components/WaveBackground'
import { searchProfilesByUsername, UserProfile } from '@/lib/supabase'
import {
  CreatedClothingItem,
  loadEquippedClothingIds,
  saveEquippedClothingIds,
  resolveEquippedClothing,
  loadNovluxBalance,
  saveNovluxBalance,
  loadOwnedItemIds,
  addOwnedItemId,
  loadFavoriteItemIds,
  toggleFavoriteItemId,
  loadItemVotes,
  toggleItemVote,
  incrementItemSales,
  ItemVoteState,
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
  const [liked, setLiked] = useState<ItemVoteState>(() => loadItemVotes()[item.id] ?? null)
  const [favorited, setFavorited] = useState(() => loadFavoriteItemIds().includes(item.id))
  const [isOwnedState, setIsOwnedState] = useState(
    () => Boolean(item.isOwned) || loadOwnedItemIds().includes(item.id)
  )
  const [salesCount, setSalesCount] = useState(() => item.sold ?? 0)
  const [equippedIds, setEquippedIds] = useState(() => loadEquippedClothingIds())
  const [menuOpen, setMenuOpen] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [giftOpen, setGiftOpen] = useState(false)
  const [giftRecipient, setGiftRecipient] = useState('')
  const [giftMatches, setGiftMatches] = useState<UserProfile[]>([])
  const [giftSearching, setGiftSearching] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ text: string; error?: boolean } | null>(null)
  const discoverRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!giftOpen) return
    const q = giftRecipient.trim().replace(/^@/, '')
    if (!q) {
      setGiftMatches([])
      setGiftSearching(false)
      return
    }
    let cancelled = false
    setGiftSearching(true)
    const timer = setTimeout(async () => {
      const results = await searchProfilesByUsername(q)
      if (!cancelled) {
        setGiftMatches(results)
        setGiftSearching(false)
      }
    }, 180)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [giftOpen, giftRecipient])

  useEffect(() => {
    setLiked(loadItemVotes()[item.id] ?? null)
    setFavorited(loadFavoriteItemIds().includes(item.id))
    setIsOwnedState(Boolean(item.isOwned) || loadOwnedItemIds().includes(item.id))
    setSalesCount(item.sold ?? 0)
    setGiftOpen(false)
    setGiftRecipient('')
    setStatusMsg(null)
    const targetPath = `/item/${encodeURIComponent(item.id)}`
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath)
    }
  }, [item.id, item.isOwned, item.sold])

  useEffect(() => {
    return () => {
      if (window.location.pathname.startsWith('/item/')) {
        window.history.pushState({}, '', '/')
      }
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [menuOpen])

  const handleCopyLink = async () => {
    const origin =
      typeof window !== 'undefined' &&
      window.location.origin.startsWith('http') &&
      !window.location.origin.includes('tauri') &&
      !window.location.origin.includes('localhost')
        ? window.location.origin
        : 'https://playnovelo.vercel.app'
    const url = `${origin}/item/${encodeURIComponent(item.id)}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopiedLink(true)
    setTimeout(() => {
      setCopiedLink(false)
      setMenuOpen(false)
    }, 1200)
  }

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

  const handleBuyClick = () => {
    const balance = loadNovluxBalance()
    if (balance < item.price) {
      setStatusMsg({
        text: `Not enough Novlux (need ${item.price.toLocaleString()}, have ${balance.toLocaleString()})`,
        error: true,
      })
      return
    }
    saveNovluxBalance(balance - item.price)
    addOwnedItemId(item.id)
    incrementItemSales(item.id)
    setIsOwnedState(true)
    setSalesCount((c) => c + 1)
    setStatusMsg({ text: 'Purchased! You can now equip this item.', error: false })
    onBuy?.(item)
  }

  const handleToggleFavorite = () => {
    const next = toggleFavoriteItemId(item.id)
    setFavorited(next)
  }

  const handleVote = (vote: 'up' | 'down') => {
    const next = toggleItemVote(item.id, vote)
    setLiked(next)
  }

  const handleSendGift = (e: React.FormEvent) => {
    e.preventDefault()
    const recipient = giftRecipient.trim()
    if (!recipient) {
      setStatusMsg({ text: 'Enter a username to gift this item to.', error: true })
      return
    }
    const balance = loadNovluxBalance()
    if (balance < item.price) {
      setStatusMsg({
        text: `Not enough Novlux to gift (need ${item.price.toLocaleString()}, have ${balance.toLocaleString()})`,
        error: true,
      })
      return
    }
    saveNovluxBalance(balance - item.price)
    incrementItemSales(item.id)
    setSalesCount((c) => c + 1)
    setGiftOpen(false)
    setGiftRecipient('')
    setGiftMatches([])
    const priceLabel = item.price === 0 ? 'Free' : `${item.price.toLocaleString()} Novlux`
    setStatusMsg({
      text: `Bought & gifted ${item.name} to @${recipient.replace(/^@/, '')} for ${priceLabel}!`,
      error: false,
    })
  }

  const createdDateStr = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString()
    : 'Today'

  const filteredDiscover = discoverItems.filter((d) => d.id !== item.id)

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#0a0a0a] flex items-center justify-center p-6 md:p-10 overflow-y-auto"
    >
      <WaveBackground contained />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-[1160px] flex flex-col gap-8 my-auto"
      >
        {/* Top 2-Column Item Detail */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {/* Left: 3D / 2D Preview Card */}
          <div className="md:col-span-5 relative rounded-xl bg-[#161618]/85 border border-white/[0.06] aspect-square overflow-hidden flex items-center justify-center">
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
          <div className="md:col-span-7 flex flex-col justify-between gap-6">
            {/* Top: Header & Description */}
            <div className="flex flex-col">
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
                  <div ref={menuRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setMenuOpen((v) => !v)}
                      title="More options"
                      className={`size-8 rounded-[8px] border flex items-center justify-center cursor-pointer transition-colors ${
                        menuOpen
                          ? 'bg-[#1e1e22] border-white/20 text-white'
                          : 'bg-[#161618] hover:bg-[#1e1e22] border-white/[0.08] text-white/60 hover:text-white'
                      }`}
                    >
                      <MoreHorizontal className="size-4" />
                    </button>

                    {menuOpen && (
                      <div className="absolute right-0 mt-1.5 w-40 rounded-[10px] bg-[#161618] border border-white/[0.1] shadow-xl p-1 z-30">
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="w-full h-8 px-2.5 rounded-[7px] hover:bg-white/[0.08] text-xs font-medium text-white/85 hover:text-white flex items-center gap-2 cursor-pointer border-none bg-transparent transition-colors text-left"
                        >
                          {copiedLink ? (
                            <Check className="size-3.5 text-[#02b070]" />
                          ) : (
                            <Link2 className="size-3.5 text-white/60" />
                          )}
                          <span>{copiedLink ? 'Copied!' : 'Copy link'}</span>
                        </button>
                      </div>
                    )}
                  </div>
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

              <p className="text-xs text-white/60 mt-3 leading-relaxed">
                {item.description || 'No description provided.'}
              </p>
            </div>

            {/* Bottom: Metadata + Rating + Action Row */}
            <div className="flex flex-col gap-3">
              {/* Metadata + Like / Dislike Row */}
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex items-center gap-8 md:gap-12">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-medium text-white/45">Created</span>
                    <span className="text-xs font-bold text-white/90">{createdDateStr}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-medium text-white/45">Sales</span>
                    <span className="text-xs font-bold text-white/90">{salesCount}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-medium text-white/45">Asset Type</span>
                    <span className="text-xs font-bold text-white/90">
                      {item.clothingType || item.assetType}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleVote('up')}
                    className={`h-9 px-3 rounded-[8px] border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                      liked === 'up'
                        ? 'bg-white/[0.12] border-white/25 text-white'
                        : 'bg-[#161618] hover:bg-[#1e1e22] border-white/[0.08] text-white/75 hover:text-white'
                    }`}
                  >
                    <ThumbsUp className="size-3.5" />
                    <span>{liked === 'up' ? 1 : 0}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVote('down')}
                    className={`h-9 px-3 rounded-[8px] border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                      liked === 'down'
                        ? 'bg-white/[0.12] border-white/25 text-white'
                        : 'bg-[#161618] hover:bg-[#1e1e22] border-white/[0.08] text-white/75 hover:text-white'
                    }`}
                  >
                    <ThumbsDown className="size-3.5" />
                    <span>{liked === 'down' ? 1 : 0}</span>
                  </button>
                </div>
              </div>

              {/* Buy + Gift / Favorite Row */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                {isOwnedState ? (
                  <button
                    type="button"
                    onClick={handleToggleEquip}
                    className={`flex-1 min-w-[180px] h-10 px-4 rounded-[10px] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border-none transition-all active:scale-[0.98] ${
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
                    onClick={handleBuyClick}
                    className="flex-1 min-w-[180px] h-10 px-4 rounded-[10px] bg-[#02b070] hover:bg-[#009b62] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border-none transition-all active:scale-[0.98]"
                  >
                    <span>Buy for</span>
                    {item.price === 0 ? (
                      <span>Free</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-black">
                        <img
                          src="/novelo-currency.png"
                          alt="Novlux"
                          className="size-3.5 object-contain shrink-0"
                        />
                        <span>{item.price.toLocaleString()}</span>
                      </span>
                    )}
                  </button>
                )}

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setGiftOpen((v) => !v)
                      setStatusMsg(null)
                    }}
                    className={`h-10 px-3.5 rounded-[10px] border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                      giftOpen
                        ? 'bg-white/[0.12] border-white/25 text-white'
                        : 'bg-[#161618] hover:bg-[#1e1e22] border-white/[0.08] text-white/80 hover:text-white'
                    }`}
                  >
                    <Gift className="size-3.5" />
                    <span>Gift</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleFavorite}
                    className={`h-10 px-3.5 rounded-[10px] border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                      favorited
                        ? 'bg-white/[0.12] border-white/25 text-white'
                        : 'bg-[#161618] hover:bg-[#1e1e22] border-white/[0.08] text-white/80 hover:text-white'
                    }`}
                  >
                    <Heart className={`size-3.5 ${favorited ? 'fill-current text-rose-400' : ''}`} />
                    <span>{favorited ? 'Favorited' : 'Favorite'}</span>
                  </button>
                </div>
              </div>

              {giftOpen && (
                <div className="flex flex-col gap-2 p-2.5 rounded-[10px] bg-[#161618] border border-white/[0.08]">
                  <form onSubmit={handleSendGift} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={giftRecipient}
                      onChange={(e) => setGiftRecipient(e.target.value)}
                      placeholder="Recipient username..."
                      className="flex-1 h-8 px-2.5 rounded-[7px] bg-[#0e0e10] border border-white/[0.08] text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-white/25"
                    />
                    <button
                      type="submit"
                      className="h-8 px-3 rounded-[7px] bg-[#02b070] hover:bg-[#009b62] text-white text-xs font-bold cursor-pointer border-none transition-colors shrink-0"
                    >
                      Send Gift
                    </button>
                  </form>

                  {giftRecipient.trim().length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      {giftSearching ? (
                        <div className="text-[11px] text-white/45 px-1">Searching players...</div>
                      ) : giftMatches.length > 0 ? (
                        giftMatches.map((p) => {
                          const isSelected =
                            p.username.toLowerCase() ===
                            giftRecipient.trim().replace(/^@/, '').toLowerCase()
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setGiftRecipient(p.username)}
                              className={`w-full flex items-center justify-between gap-2.5 p-2 rounded-[8px] border text-left cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-[#02b070]/15 border-[#02b070]/50'
                                  : 'bg-[#101012] hover:bg-white/[0.05] border-white/[0.06]'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="size-8 rounded-full bg-[#1b1b1e] border border-white/10 flex items-center justify-center shrink-0">
                                  <div className="size-5 rounded-[4px] bg-[#e5e5e5] flex flex-col items-center justify-center">
                                    <div className="flex gap-1 mb-0.5">
                                      <div className="size-0.5 rounded-full bg-black" />
                                      <div className="size-0.5 rounded-full bg-black" />
                                    </div>
                                    <div className="w-2 h-0.5 rounded-full bg-black/80" />
                                  </div>
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-white truncate">
                                    {p.display_name || p.username}
                                  </div>
                                  <div className="text-[11px] text-white/50 truncate">
                                    @{p.username}
                                  </div>
                                </div>
                              </div>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                  isSelected
                                    ? 'bg-[#02b070] text-white'
                                    : 'bg-white/[0.08] text-white/70'
                                }`}
                              >
                                {isSelected ? 'Selected' : 'Select'}
                              </span>
                            </button>
                          )
                        })
                      ) : (
                        <div className="flex items-center justify-between gap-2.5 p-2 rounded-[8px] bg-[#101012] border border-white/[0.06]">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="size-8 rounded-full bg-[#1b1b1e] border border-white/10 flex items-center justify-center shrink-0">
                              <div className="size-5 rounded-[4px] bg-[#e5e5e5] flex flex-col items-center justify-center">
                                <div className="flex gap-1 mb-0.5">
                                  <div className="size-0.5 rounded-full bg-black" />
                                  <div className="size-0.5 rounded-full bg-black" />
                                </div>
                                <div className="w-2 h-0.5 rounded-full bg-black/80" />
                              </div>
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-white truncate">
                                {giftRecipient.trim().replace(/^@/, '')}
                              </div>
                              <div className="text-[11px] text-white/50 truncate">
                                @{giftRecipient.trim().replace(/^@/, '')}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/[0.08] text-white/70 shrink-0">
                            Recipient
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {statusMsg && (
                <p
                  className={`text-xs font-medium ${
                    statusMsg.error ? 'text-rose-400' : 'text-[#02b070]'
                  }`}
                >
                  {statusMsg.text}
                </p>
              )}
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
