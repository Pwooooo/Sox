import { useState } from 'react'
import {
  ChevronDown,
  ArrowLeftRight,
  Plus,
  X,
  Check,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { IsometricMannequin } from '@/components/IsometricMannequin'

export interface TradeItem {
  id: string
  name: string
  creator: string
  type: 'hat' | 'hair' | 'face' | 'clothing' | 'accessory' | 'tool'
  value: number
}

export type TradeCategory = 'Inbound' | 'Outbound' | 'Completed' | 'Inactive'

export interface TradeRequest {
  id: string
  category: TradeCategory
  partner: string
  partnerTag: string
  date: string
  expiresDate: string
  status: string
  receiveItems: TradeItem[]
  giveItems: TradeItem[]
  note?: string
}

// User's tradeable inventory
const USER_INVENTORY: TradeItem[] = [
  { id: 'u1', name: 'Blue Plaid Fedora', creator: 'Luduvo', type: 'hat', value: 1342 },
  { id: 'u2', name: 'Crown of Novelo', creator: 'PixelMaster', type: 'hat', value: 250 },
  { id: 'u3', name: 'Pink Bomber', creator: 'UrbanWear', type: 'hat', value: 50 },
  { id: 'u4', name: 'Samurai Armor', creator: 'LunarDesigns', type: 'clothing', value: 180 },
  { id: 'u5', name: 'Jetpack', creator: 'TechTitan', type: 'tool', value: 380 },
  { id: 'u6', name: 'Angel Halo', creator: 'DivineDesigns', type: 'hat', value: 175 },
  { id: 'u7', name: 'Pixel Sword', creator: 'RetroRealm', type: 'tool', value: 90 },
  { id: 'u8', name: 'Viking Helmet', creator: 'NordicNorse', type: 'hat', value: 130 },
  { id: 'u9', name: 'Flame Skull', creator: 'HellfireHUD', type: 'face', value: 120 },
  { id: 'u10', name: 'Cat Ears', creator: 'KawaiiClub', type: 'hair', value: 60 },
  { id: 'u11', name: 'Golden Watch', creator: 'LuxuryLabs', type: 'accessory', value: 500 },
  { id: 'u12', name: 'Top Hat', creator: 'ClassicCuts', type: 'hat', value: 70 },
]

// Available partners and their trade pools
const PARTNERS = [
  {
    name: 'GOODEVER',
    tag: '@goodever',
    pool: [
      { id: 'p_g1', name: 'Leopard Fedora', creator: 'NordicNorse', type: 'hat' as const, value: 780 },
      { id: 'p_g2', name: 'Dragon Wings', creator: 'FantasyForge', type: 'accessory' as const, value: 450 },
      { id: 'p_g3', name: 'Diamond Necklace', creator: 'LuxuryLabs', type: 'accessory' as const, value: 600 },
    ],
  },
  {
    name: 'ActuallyDot',
    tag: '@actually_dot',
    pool: [
      { id: 'p_a1', name: 'Dragon Wings', creator: 'FantasyForge', type: 'accessory' as const, value: 450 },
      { id: 'p_a2', name: 'Butterfly Wings', creator: 'FantasyForge', type: 'accessory' as const, value: 300 },
      { id: 'p_a3', name: 'Neon Shades', creator: 'CyberStyle', type: 'face' as const, value: 35 },
    ],
  },
  {
    name: 'BeetleSlugger',
    tag: '@beetle_s',
    pool: [
      { id: 'p_b1', name: 'Neon Shades', creator: 'CyberStyle', type: 'face' as const, value: 35 },
      { id: 'p_b2', name: 'Starfall Staff', creator: 'MagicWorks', type: 'tool' as const, value: 320 },
      { id: 'p_b3', name: 'Cyberpunk Jacket', creator: 'NeonNation', type: 'clothing' as const, value: 150 },
    ],
  },
  {
    name: 'Flaminndragon',
    tag: '@flaminndragon',
    pool: [
      { id: 'p_f1', name: 'Starfall Staff', creator: 'MagicWorks', type: 'tool' as const, value: 320 },
      { id: 'p_f2', name: 'Laser Gun', creator: 'TechTitan', type: 'tool' as const, value: 280 },
      { id: 'p_f3', name: 'Golden Watch', creator: 'LuxuryLabs', type: 'accessory' as const, value: 500 },
    ],
  },
  {
    name: 'forzch',
    tag: '@forzch',
    pool: [
      { id: 'p_z1', name: 'Golden Watch', creator: 'LuxuryLabs', type: 'accessory' as const, value: 500 },
      { id: 'p_z2', name: 'Ghostly Aura', creator: 'SpookyStudio', type: 'accessory' as const, value: 200 },
      { id: 'p_z3', name: 'Tuxedo Suit', creator: 'ClassicCuts', type: 'clothing' as const, value: 200 },
    ],
  },
  {
    name: 'RblxMellodas',
    tag: '@rblx_mellodas',
    pool: [
      { id: 'p_m1', name: 'Diamond Necklace', creator: 'LuxuryLabs', type: 'accessory' as const, value: 600 },
      { id: 'p_m2', name: 'Crown of Novelo', creator: 'PixelMaster', type: 'hat' as const, value: 250 },
      { id: 'p_m3', name: 'Wizard Beard', creator: 'FantasyForge', type: 'hair' as const, value: 85 },
    ],
  },
  {
    name: 'BlahBlahNoodles',
    tag: '@noodles',
    pool: [
      { id: 'p_n1', name: 'Laser Gun', creator: 'TechTitan', type: 'tool' as const, value: 280 },
      { id: 'p_n2', name: 'Pink Bomber', creator: 'UrbanWear', type: 'hat' as const, value: 50 },
      { id: 'p_n3', name: 'Cat Ears', creator: 'KawaiiClub', type: 'hair' as const, value: 60 },
    ],
  },
  {
    name: 'Disincline',
    tag: '@disincline',
    pool: [
      { id: 'p_d1', name: 'Butterfly Wings', creator: 'FantasyForge', type: 'accessory' as const, value: 300 },
      { id: 'p_d2', name: 'Viking Helmet', creator: 'NordicNorse', type: 'hat' as const, value: 130 },
      { id: 'p_d3', name: 'Samurai Armor', creator: 'LunarDesigns', type: 'clothing' as const, value: 180 },
    ],
  },
  {
    name: 'smokedmen',
    tag: '@smokedmen',
    pool: [
      { id: 'p_s1', name: 'Ghostly Aura', creator: 'SpookyStudio', type: 'accessory' as const, value: 200 },
      { id: 'p_s2', name: 'Flame Skull', creator: 'HellfireHUD', type: 'face' as const, value: 120 },
      { id: 'p_s3', name: 'Leopard Fedora', creator: 'NordicNorse', type: 'hat' as const, value: 780 },
    ],
  },
]

const INITIAL_TRADES: TradeRequest[] = [
  {
    id: 'tr1',
    category: 'Inbound',
    partner: 'GOODEVER',
    partnerTag: '@goodever',
    date: '4/2/20',
    expiresDate: '4/7/20',
    status: 'Unknown',
    receiveItems: [
      { id: 'ri1', name: 'Leopard Fedora', creator: 'NordicNorse', type: 'hat', value: 780 },
    ],
    giveItems: [
      { id: 'gi1', name: 'Blue Plaid Fedora', creator: 'Luduvo', type: 'hat', value: 1342 },
    ],
  },
  {
    id: 'tr2',
    category: 'Inbound',
    partner: 'ActuallyDot',
    partnerTag: '@actually_dot',
    date: '4/2/20',
    expiresDate: '4/7/20',
    status: 'Unknown',
    receiveItems: [
      { id: 'ri2', name: 'Dragon Wings', creator: 'FantasyForge', type: 'accessory', value: 450 },
    ],
    giveItems: [
      { id: 'gi2', name: 'Crown of Novelo', creator: 'PixelMaster', type: 'hat', value: 250 },
    ],
  },
  {
    id: 'tr3',
    category: 'Inbound',
    partner: 'BeetleSlugger',
    partnerTag: '@beetle_s',
    date: '4/2/20',
    expiresDate: '4/7/20',
    status: 'Unknown',
    receiveItems: [
      { id: 'ri3', name: 'Neon Shades', creator: 'CyberStyle', type: 'face', value: 35 },
    ],
    giveItems: [
      { id: 'gi3', name: 'Pink Bomber', creator: 'UrbanWear', type: 'hat', value: 50 },
    ],
  },
  {
    id: 'tr4',
    category: 'Inbound',
    partner: 'Flaminndragon',
    partnerTag: '@flaminndragon',
    date: '3/29/20',
    expiresDate: '4/3/20',
    status: 'Unknown',
    receiveItems: [
      { id: 'ri4', name: 'Starfall Staff', creator: 'MagicWorks', type: 'tool', value: 320 },
    ],
    giveItems: [
      { id: 'gi4', name: 'Samurai Armor', creator: 'LunarDesigns', type: 'clothing', value: 180 },
    ],
  },
  {
    id: 'tr5',
    category: 'Inbound',
    partner: 'forzch',
    partnerTag: '@forzch',
    date: '3/29/20',
    expiresDate: '4/3/20',
    status: 'Unknown',
    receiveItems: [
      { id: 'ri5', name: 'Golden Watch', creator: 'LuxuryLabs', type: 'accessory', value: 500 },
    ],
    giveItems: [
      { id: 'gi5', name: 'Jetpack', creator: 'TechTitan', type: 'tool', value: 380 },
    ],
  },
  {
    id: 'tr6',
    category: 'Inbound',
    partner: 'RblxMellodas',
    partnerTag: '@rblx_mellodas',
    date: '3/29/20',
    expiresDate: '4/3/20',
    status: 'Unknown',
    receiveItems: [
      { id: 'ri6', name: 'Diamond Necklace', creator: 'LuxuryLabs', type: 'accessory', value: 600 },
    ],
    giveItems: [
      { id: 'gi6', name: 'Angel Halo', creator: 'DivineDesigns', type: 'hat', value: 175 },
    ],
  },
  {
    id: 'tr7',
    category: 'Inbound',
    partner: 'BlahBlahNoodles',
    partnerTag: '@noodles',
    date: '3/29/20',
    expiresDate: '4/3/20',
    status: 'Unknown',
    receiveItems: [
      { id: 'ri7', name: 'Laser Gun', creator: 'TechTitan', type: 'tool', value: 280 },
    ],
    giveItems: [
      { id: 'gi7', name: 'Pixel Sword', creator: 'RetroRealm', type: 'tool', value: 90 },
    ],
  },
  {
    id: 'tr8',
    category: 'Inbound',
    partner: 'Disincline',
    partnerTag: '@disincline',
    date: '3/28/20',
    expiresDate: '4/2/20',
    status: 'Unknown',
    receiveItems: [
      { id: 'ri8', name: 'Butterfly Wings', creator: 'FantasyForge', type: 'accessory', value: 300 },
    ],
    giveItems: [
      { id: 'gi8', name: 'Viking Helmet', creator: 'NordicNorse', type: 'hat', value: 130 },
    ],
  },
  {
    id: 'tr9',
    category: 'Inbound',
    partner: 'smokedmen',
    partnerTag: '@smokedmen',
    date: '3/28/20',
    expiresDate: '4/2/20',
    status: 'Unknown',
    receiveItems: [
      { id: 'ri9', name: 'Ghostly Aura', creator: 'SpookyStudio', type: 'accessory', value: 200 },
    ],
    giveItems: [
      { id: 'gi9', name: 'Flame Skull', creator: 'HellfireHUD', type: 'face', value: 120 },
    ],
  },
  // Outbound trade
  {
    id: 'tr_out_1',
    category: 'Outbound',
    partner: 'ActuallyDot',
    partnerTag: '@actually_dot',
    date: '4/1/20',
    expiresDate: '4/6/20',
    status: 'Pending',
    receiveItems: [
      { id: 'ri_out1', name: 'Butterfly Wings', creator: 'FantasyForge', type: 'accessory', value: 300 },
    ],
    giveItems: [
      { id: 'gi_out1', name: 'Golden Watch', creator: 'LuxuryLabs', type: 'accessory', value: 500 },
    ],
  },
  // Completed trade
  {
    id: 'tr_comp_1',
    category: 'Completed',
    partner: 'forzch',
    partnerTag: '@forzch',
    date: '3/20/20',
    expiresDate: 'Completed',
    status: 'Completed',
    receiveItems: [
      { id: 'ri_c1', name: 'Laser Gun', creator: 'TechTitan', type: 'tool', value: 280 },
    ],
    giveItems: [
      { id: 'gi_c1', name: 'Dragon Wings', creator: 'FantasyForge', type: 'accessory', value: 450 },
    ],
  },
]

// Authentic Stock Avatar matching Screenshot 10
export function StockAvatar({ className = '' }: { className?: string }) {
  return (
    <div
      className={`size-9 rounded-full bg-[#202024] flex items-center justify-center overflow-hidden shrink-0 shadow-inner ${className}`}
    >
      <svg
        viewBox="0 0 32 32"
        className="w-full h-full object-contain"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head */}
        <rect x="10" y="7" width="12" height="11" rx="2.5" fill="#d4d4d8" />
        {/* Eyes */}
        <circle cx="13" cy="12" r="1" fill="#18181b" />
        <circle cx="19" cy="12" r="1" fill="#18181b" />
        {/* Smile */}
        <path
          d="M14 14.8C14.5 15.8 17.5 15.8 18 14.8"
          stroke="#18181b"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        {/* Torso / Shoulders */}
        <path
          d="M8 21C8 19.5 10 18.5 16 18.5C22 18.5 24 19.5 24 21V32H8V21Z"
          fill="#3f3f46"
        />
      </svg>
    </div>
  )
}

export function Trade() {
  const [tradeCategory, setTradeCategory] = useState<TradeCategory>('Inbound')
  const [selectedTradeId, setSelectedTradeId] = useState('tr1')
  const [trades, setTrades] = useState<TradeRequest[]>(INITIAL_TRADES)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [showHowToTrade, setShowHowToTrade] = useState(false)

  // Send / Counter Trade Request Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'new' | 'counter'>('new')
  const [selectedPartnerName, setSelectedPartnerName] = useState('GOODEVER')
  const [selectedGiveItems, setSelectedGiveItems] = useState<TradeItem[]>([])
  const [selectedReceiveItems, setSelectedReceiveItems] = useState<TradeItem[]>([])
  const [tradeNote, setTradeNote] = useState('')

  // Active Dropdown for Item Selection: 'give' or 'receive'
  const [activeDropdownSide, setActiveDropdownSide] = useState<'give' | 'receive' | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Filter trades by current category
  const filteredTrades = trades.filter((t) => t.category === tradeCategory)

  // Current active trade (defaults to first in category or null)
  const activeTrade =
    filteredTrades.find((t) => t.id === selectedTradeId) || filteredTrades[0] || null

  const receiveTotal = activeTrade?.receiveItems.reduce((sum, item) => sum + item.value, 0) || 0
  const giveTotal = activeTrade?.giveItems.reduce((sum, item) => sum + item.value, 0) || 0
  const valueDiff = receiveTotal - giveTotal

  // Actions
  const handleAccept = () => {
    if (!activeTrade) return
    setTrades((prev) =>
      prev.map((t) =>
        t.id === activeTrade.id
          ? { ...t, category: 'Completed' as const, status: 'Completed', expiresDate: 'Accepted' }
          : t
      )
    )
    showToast(`Trade with ${activeTrade.partner} accepted! Items swapped.`)
  }

  const handleDecline = () => {
    if (!activeTrade) return
    setTrades((prev) =>
      prev.map((t) =>
        t.id === activeTrade.id
          ? { ...t, category: 'Inactive' as const, status: 'Declined', expiresDate: 'Declined' }
          : t
      )
    )
    showToast(`Trade with ${activeTrade.partner} declined.`)
  }

  const handleCancelOutbound = () => {
    if (!activeTrade) return
    setTrades((prev) =>
      prev.map((t) =>
        t.id === activeTrade.id
          ? { ...t, category: 'Inactive' as const, status: 'Cancelled', expiresDate: 'Cancelled' }
          : t
      )
    )
    showToast(`Trade proposal to ${activeTrade.partner} cancelled.`)
  }

  // Open "New Trade" Modal
  const openNewTradeModal = () => {
    setModalMode('new')
    setSelectedPartnerName(PARTNERS[0].name)
    setSelectedGiveItems([])
    setSelectedReceiveItems([])
    setActiveDropdownSide(null)
    setTradeNote('')
    setIsModalOpen(true)
  }

  // Open "Counter Trade" Modal
  const openCounterModal = () => {
    if (!activeTrade) return
    setModalMode('counter')
    setSelectedPartnerName(activeTrade.partner)
    setSelectedGiveItems([...activeTrade.giveItems])
    setSelectedReceiveItems([...activeTrade.receiveItems])
    setActiveDropdownSide(null)
    setTradeNote(`Countering previous offer with adjusted items.`)
    setIsModalOpen(true)
  }

  // Partner data in modal
  const currentPartnerData =
    PARTNERS.find((p) => p.name === selectedPartnerName) || PARTNERS[0]

  // Remove item from Give list
  const removeGiveItem = (item: TradeItem) => {
    setSelectedGiveItems((prev) => prev.filter((i) => i.id !== item.id))
  }

  // Remove item from Receive list
  const removeReceiveItem = (item: TradeItem) => {
    setSelectedReceiveItems((prev) => prev.filter((i) => i.id !== item.id))
  }

  // Add item to Give list
  const addGiveItem = (item: TradeItem) => {
    if (selectedGiveItems.length >= 4) {
      showToast('Maximum 4 items allowed per side')
      return
    }
    setSelectedGiveItems((prev) => [...prev, item])
    setActiveDropdownSide(null)
  }

  // Add item to Receive list
  const addReceiveItem = (item: TradeItem) => {
    if (selectedReceiveItems.length >= 4) {
      showToast('Maximum 4 items allowed per side')
      return
    }
    setSelectedReceiveItems((prev) => [...prev, item])
    setActiveDropdownSide(null)
  }

  // Handle Send Trade Request
  const handleSendTradeProposal = () => {
    if (selectedGiveItems.length === 0 && selectedReceiveItems.length === 0) {
      showToast('Select at least one item to propose a trade')
      return
    }

    const newTradeId = 'tr_out_' + Date.now()
    const newTrade: TradeRequest = {
      id: newTradeId,
      category: 'Outbound',
      partner: currentPartnerData.name,
      partnerTag: currentPartnerData.tag,
      date: 'Today',
      expiresDate: 'In 5 days',
      status: 'Pending',
      giveItems: selectedGiveItems,
      receiveItems: selectedReceiveItems,
      note: tradeNote,
    }

    setTrades((prev) => [newTrade, ...prev])
    setTradeCategory('Outbound')
    setSelectedTradeId(newTradeId)
    setIsModalOpen(false)
    showToast(
      modalMode === 'counter'
        ? `Counter offer sent to ${currentPartnerData.name}!`
        : `Trade request sent to ${currentPartnerData.name}!`
    )
  }

  const modalGiveTotal = selectedGiveItems.reduce((s, i) => s + i.value, 0)
  const modalReceiveTotal = selectedReceiveItems.reduce((s, i) => s + i.value, 0)
  const modalDiff = modalReceiveTotal - modalGiveTotal

  return (
    <div className="p-4 md:p-6 lg:p-7 max-w-[1400px] flex flex-col gap-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/20 text-white shadow-2xl text-xs font-semibold animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles className="size-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Trade Window (Seamless dark surface matching image 5) */}
      <div className="flex flex-col md:flex-row rounded-2xl bg-[#121214] overflow-hidden shadow-2xl min-h-[680px]">
        {/* Left Column: Trades List */}
        <div className="w-full md:w-80 lg:w-84 bg-[#141416] flex flex-col shrink-0">
          {/* Header */}
          <div className="p-4 pb-3 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-xl font-black text-white tracking-tight">Trades</h1>

              {/* Send Trade Request Button */}
              <button
                onClick={openNewTradeModal}
                className="h-8 px-3 rounded-[10px] bg-white hover:bg-neutral-200 text-black font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0 border-none"
              >
                <Plus className="size-3.5" />
                <span>New Trade</span>
              </button>
            </div>

            <div className="flex items-center justify-between">
              {/* Category Dropdown */}
              <div className="relative">
                <select
                  value={tradeCategory}
                  onChange={(e) => {
                    const cat = e.target.value as TradeCategory
                    setTradeCategory(cat)
                    const firstInCat = trades.find((t) => t.category === cat)
                    if (firstInCat) setSelectedTradeId(firstInCat.id)
                  }}
                  className="h-8 pl-3 pr-8 rounded-[10px] bg-[#1c1c1f] hover:bg-[#242428] text-xs font-semibold text-white focus:outline-none cursor-pointer appearance-none transition-colors border-none"
                >
                  <option value="Inbound">Inbound ({trades.filter((t) => t.category === 'Inbound').length})</option>
                  <option value="Outbound">Outbound ({trades.filter((t) => t.category === 'Outbound').length})</option>
                  <option value="Completed">Completed ({trades.filter((t) => t.category === 'Completed').length})</option>
                  <option value="Inactive">Inactive ({trades.filter((t) => t.category === 'Inactive').length})</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-white/50 pointer-events-none" />
              </div>

              {/* How do I trade link */}
              <button
                onClick={() => setShowHowToTrade(true)}
                className="text-[11px] text-white/50 hover:text-white underline cursor-pointer text-left bg-transparent border-none p-0 transition-colors"
              >
                How do I trade?
              </button>
            </div>
          </div>

          {/* List of Traders */}
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col p-2 gap-1">
            {filteredTrades.length === 0 ? (
              <div className="py-16 px-4 text-center flex flex-col items-center gap-2">
                <ArrowLeftRight className="size-8 text-white/20" />
                <span className="text-xs text-white/50 font-medium">
                  No {tradeCategory.toLowerCase()} trades found
                </span>
                {tradeCategory === 'Outbound' && (
                  <button
                    onClick={openNewTradeModal}
                    className="mt-2 text-xs font-bold text-white underline bg-transparent border-none cursor-pointer"
                  >
                    Propose a trade now
                  </button>
                )}
              </div>
            ) : (
              filteredTrades.map((trade) => {
                const isSelected = trade.id === activeTrade?.id
                return (
                  <button
                    key={trade.id}
                    onClick={() => setSelectedTradeId(trade.id)}
                    className={`p-3 flex items-center justify-between gap-3 text-left transition-all cursor-pointer border-none rounded-[12px] ${
                      isSelected
                        ? 'bg-white/[0.08] backdrop-blur-xs text-white shadow-xs'
                        : 'bg-transparent hover:bg-white/[0.04] text-white/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Stock Avatar matching image 3 */}
                      <StockAvatar />

                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold truncate leading-tight text-white">
                          {trade.partner}
                        </span>
                        {/* Status text without circle dot matching image 2 */}
                        <span className="text-[10px] text-white/40 mt-0.5 leading-none">
                          {trade.status}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] text-white/40 shrink-0 font-medium">
                      {trade.date}
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Right Column: Trade Workspace */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between gap-6 bg-[#0d0d0f]">
          {activeTrade ? (
            <div className="flex flex-col gap-6">
              {/* Partner Title & Expiry */}
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                      Trade with {activeTrade.partner}
                    </h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-white/60 font-semibold">
                      {activeTrade.category}
                    </span>
                  </div>
                  <span className="text-xs text-white/50 flex items-center gap-1.5">
                    <Clock className="size-3 text-white/40" />
                    <span>Expires on {activeTrade.expiresDate}</span>
                  </span>
                </div>

                {/* Counter / Propose Button Quick Action */}
                {activeTrade.category === 'Inbound' && (
                  <button
                    onClick={openCounterModal}
                    className="h-8 px-3 rounded-[10px] bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer border-none transition-colors"
                  >
                    <ArrowLeftRight className="size-3.5" />
                    <span>Counter Offer</span>
                  </button>
                )}
              </div>

              {/* Section 1: Items you will receive */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Items you will receive</span>
                    <span className="text-[11px] text-white/40 font-normal">
                      ({activeTrade.receiveItems.length})
                    </span>
                  </h3>
                </div>

                {/* Items Grid with Authentic IsometricMannequin Cards */}
                <div className="flex flex-wrap gap-3.5">
                  {activeTrade.receiveItems.map((item) => (
                    <div
                      key={item.id}
                      className="group w-36 sm:w-40 rounded-[14px] p-3 flex flex-col justify-between cursor-pointer transition-colors duration-150 bg-[#121214] hover:bg-[#1c1c1f] select-none"
                    >
                      <IsometricMannequin
                        name={item.name}
                        type={item.type}
                        className="h-28"
                      />
                      <div className="flex flex-col gap-0.5 text-left pt-1">
                        <h4 className="text-xs font-bold text-white leading-tight truncate group-hover:text-white">
                          {item.name}
                        </h4>
                        <span className="text-[10px] text-white/50 truncate">
                          By <span className="text-white/80 font-medium">{item.creator}</span>
                        </span>
                        <div className="flex items-center gap-1 mt-1 text-xs font-bold text-white">
                          <img
                            src="/novelo-currency.png"
                            alt="Currency"
                            className="size-3 object-contain shrink-0"
                          />
                          <span>{item.value.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Receive Total Value */}
                <div className="flex items-center gap-2 text-xs font-bold text-white pt-1">
                  <span className="text-white/50">Total Value:</span>
                  <div className="flex items-center gap-1 text-sm">
                    <img src="/novelo-currency.png" alt="Currency" className="size-3.5 object-contain" />
                    <span>{receiveTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Items you will give */}
              <div className="flex flex-col gap-3 pt-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Items you will give</span>
                    <span className="text-[11px] text-white/40 font-normal">
                      ({activeTrade.giveItems.length})
                    </span>
                  </h3>
                </div>

                {/* Items Grid with Authentic IsometricMannequin Cards */}
                <div className="flex flex-wrap gap-3.5">
                  {activeTrade.giveItems.map((item) => (
                    <div
                      key={item.id}
                      className="group w-36 sm:w-40 rounded-[14px] p-3 flex flex-col justify-between cursor-pointer transition-colors duration-150 bg-[#121214] hover:bg-[#1c1c1f] select-none"
                    >
                      <IsometricMannequin
                        name={item.name}
                        type={item.type}
                        className="h-28"
                      />
                      <div className="flex flex-col gap-0.5 text-left pt-1">
                        <h4 className="text-xs font-bold text-white leading-tight truncate group-hover:text-white">
                          {item.name}
                        </h4>
                        <span className="text-[10px] text-white/50 truncate">
                          By <span className="text-white/80 font-medium">{item.creator}</span>
                        </span>
                        <div className="flex items-center gap-1 mt-1 text-xs font-bold text-white">
                          <img
                            src="/novelo-currency.png"
                            alt="Currency"
                            className="size-3 object-contain shrink-0"
                          />
                          <span>{item.value.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Give Total Value & Plain Text Win/Loss indicator matching Image 1 */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <span className="text-white/50">Total Value:</span>
                    <div className="flex items-center gap-1 text-sm">
                      <img src="/novelo-currency.png" alt="Currency" className="size-3.5 object-contain" />
                      <span>{giveTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Plain Text Red/Green Value indicator without background matching Image 1 */}
                  <div className="flex items-center gap-2">
                    {valueDiff > 0 ? (
                      <span className="text-xs font-bold text-emerald-400">
                        +{valueDiff.toLocaleString()} Gain in your favor
                      </span>
                    ) : valueDiff < 0 ? (
                      <span className="text-xs font-bold text-red-500">
                        {valueDiff.toLocaleString()} Giving more value
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-white/50">
                        Equal Value Trade
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Buttons matching Image 5 and Roblox Client Trading */}
              <div className="flex items-center gap-3 pt-5">
                {activeTrade.category === 'Inbound' && (
                  <>
                    <button
                      onClick={handleAccept}
                      className="px-6 h-9 rounded-[10px] bg-white hover:bg-neutral-200 text-black font-bold text-xs transition-all cursor-pointer border-none shadow-md"
                    >
                      Accept
                    </button>
                    <button
                      onClick={openCounterModal}
                      className="px-6 h-9 rounded-[10px] bg-[#222226] hover:bg-[#2c2c30] text-white font-bold text-xs transition-all cursor-pointer border-none"
                    >
                      Counter
                    </button>
                    <button
                      onClick={handleDecline}
                      className="px-6 h-9 rounded-[10px] bg-[#222226] hover:bg-red-500/20 hover:text-red-400 text-white font-bold text-xs transition-all cursor-pointer border-none"
                    >
                      Decline
                    </button>
                  </>
                )}

                {activeTrade.category === 'Outbound' && (
                  <button
                    onClick={handleCancelOutbound}
                    className="px-6 h-9 rounded-[10px] bg-[#222226] hover:bg-red-500/20 hover:text-red-400 text-white font-bold text-xs transition-all cursor-pointer border-none"
                  >
                    Cancel Request
                  </button>
                )}

                {activeTrade.category === 'Completed' && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl">
                    <Check className="size-4" />
                    <span>This trade was successfully completed</span>
                  </div>
                )}

                {activeTrade.category === 'Inactive' && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-white/50 bg-white/[0.04] px-4 py-2 rounded-xl">
                    <AlertCircle className="size-4" />
                    <span>This trade is inactive ({activeTrade.status})</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
              <ArrowLeftRight className="size-12 text-white/20" />
              <span className="text-sm text-white/60 font-semibold">No trade selected</span>
              <p className="text-xs text-white/40 max-w-sm">
                Select an offer from the list or send a new trade request to exchange limited items.
              </p>
              <button
                onClick={openNewTradeModal}
                className="mt-2 h-9 px-4 rounded-[10px] bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all cursor-pointer shadow-md border-none"
              >
                Propose New Trade
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SEND TRADE REQUEST / COUNTER MODAL (Borderless dark aesthetic matching Image 5) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="w-full max-w-3xl bg-[#121214] rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <ArrowLeftRight className="size-5 text-white" />
                  <span>
                    {modalMode === 'counter'
                      ? `Counter Offer with ${selectedPartnerName}`
                      : 'Send Trade Request'}
                  </span>
                </h2>
                <p className="text-xs text-white/50 mt-0.5">
                  Click an empty slot to choose an item from the dropdown inventory.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="size-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white flex items-center justify-center cursor-pointer border-none transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-5 no-scrollbar">
              {/* Partner Picker with Stock Avatars */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-white/70 uppercase tracking-wider">
                  Trade Partner
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {PARTNERS.map((partner) => {
                    const isSelected = partner.name === selectedPartnerName
                    return (
                      <button
                        key={partner.name}
                        onClick={() => {
                          setSelectedPartnerName(partner.name)
                          setSelectedReceiveItems([])
                          setActiveDropdownSide(null)
                        }}
                        className={`p-2.5 rounded-xl flex items-center gap-2.5 text-left transition-all cursor-pointer border-none ${
                          isSelected
                            ? 'bg-white/[0.12] text-white'
                            : 'bg-[#18181c] text-white/70 hover:bg-[#202026]'
                        }`}
                      >
                        <StockAvatar className="size-7" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold truncate text-white">
                            {partner.name}
                          </span>
                          <span className="text-[10px] text-white/40 truncate">
                            {partner.pool.length} items
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Two Column Offer Section (Giving & Receiving) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Your Offer */}
                <div className="flex flex-col gap-3 p-4 rounded-xl bg-[#161618] relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Your Offer (Giving)
                      </h4>
                      <span className="text-[11px] text-white/40">
                        {selectedGiveItems.length}/4 items selected
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-white">
                      <img src="/novelo-currency.png" alt="Currency" className="size-3.5 object-contain" />
                      <span>{modalGiveTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* 4 Square Slots matching Image 4 & 8 */}
                  <div className="grid grid-cols-4 gap-2.5">
                    {[0, 1, 2, 3].map((slotIdx) => {
                      const item = selectedGiveItems[slotIdx]
                      return item ? (
                        /* Filled Slot (Square aspect ratio, perfectly scaled item matching Image 4 fix) */
                        <div
                          key={item.id}
                          className="relative aspect-square w-full rounded-2xl bg-[#121214] p-1.5 flex flex-col items-center justify-between overflow-hidden group select-none"
                        >
                          <button
                            onClick={() => removeGiveItem(item)}
                            className="absolute top-1 right-1 size-4 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center text-[10px] shadow-sm z-10 cursor-pointer border-none"
                            title="Remove"
                          >
                            ✕
                          </button>
                          <div className="w-full flex-1 flex items-center justify-center overflow-hidden pt-1">
                            <IsometricMannequin name={item.name} type={item.type} className="h-12 w-full max-h-12" />
                          </div>
                          <div className="w-full text-center pb-0.5 px-0.5">
                            <span className="text-[9.5px] font-bold text-white truncate block w-full leading-tight">
                              {item.name}
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* Empty Slot matching Image 8: click opens dropdown inventory selection */
                        <button
                          key={slotIdx}
                          onClick={() =>
                            setActiveDropdownSide(activeDropdownSide === 'give' ? null : 'give')
                          }
                          className="aspect-square w-full rounded-2xl border border-dashed border-white/15 bg-[#121214]/60 hover:bg-white/[0.04] hover:border-white/30 flex items-center justify-center text-white/30 hover:text-white transition-all cursor-pointer border-none"
                          title="Click to add item from inventory"
                        >
                          <Plus className="size-5" />
                        </button>
                      )
                    })}
                  </div>

                  {/* DROPDOWN INVENTORY SELECTION FOR YOUR OFFER (Image 7 replaced with dropdown) */}
                  {activeDropdownSide === 'give' && (
                    <div className="mt-2 p-2.5 rounded-xl bg-[#121214] flex flex-col gap-1.5 shadow-xl animate-in fade-in-50 duration-150">
                      <div className="flex items-center justify-between px-1 pb-1">
                        <span className="text-[11px] font-bold text-white/70">
                          Select item from your Inventory:
                        </span>
                        <button
                          onClick={() => setActiveDropdownSide(null)}
                          className="text-[11px] text-white/40 hover:text-white bg-transparent border-none cursor-pointer"
                        >
                          Close
                        </button>
                      </div>

                      <div className="flex flex-col gap-1 max-h-48 overflow-y-auto no-scrollbar pr-0.5">
                        {USER_INVENTORY.filter(
                          (item) => !selectedGiveItems.some((i) => i.id === item.id)
                        ).length === 0 ? (
                          <div className="text-center py-3 text-xs text-white/40">
                            All inventory items already selected
                          </div>
                        ) : (
                          USER_INVENTORY.filter(
                            (item) => !selectedGiveItems.some((i) => i.id === item.id)
                          ).map((item) => (
                            <button
                              key={item.id}
                              onClick={() => addGiveItem(item)}
                              className="w-full p-2 rounded-lg bg-[#18181c] hover:bg-[#222228] flex items-center justify-between gap-2 transition-colors cursor-pointer border-none text-left"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="size-7 rounded-md bg-[#121214] flex items-center justify-center overflow-hidden shrink-0">
                                  <IsometricMannequin name={item.name} type={item.type} className="h-6 w-6" />
                                </div>
                                <span className="text-xs font-bold text-white truncate">
                                  {item.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-xs font-bold text-white shrink-0">
                                <img
                                  src="/novelo-currency.png"
                                  alt="Currency"
                                  className="size-3 object-contain"
                                />
                                <span>{item.value.toLocaleString()}</span>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Their Offer */}
                <div className="flex flex-col gap-3 p-4 rounded-xl bg-[#161618] relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        {currentPartnerData.name}'s Offer (Receiving)
                      </h4>
                      <span className="text-[11px] text-white/40">
                        {selectedReceiveItems.length}/4 items selected
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-white">
                      <img src="/novelo-currency.png" alt="Currency" className="size-3.5 object-contain" />
                      <span>{modalReceiveTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* 4 Square Slots matching Image 4 & 8 */}
                  <div className="grid grid-cols-4 gap-2.5">
                    {[0, 1, 2, 3].map((slotIdx) => {
                      const item = selectedReceiveItems[slotIdx]
                      return item ? (
                        /* Filled Slot (Square aspect ratio, perfectly scaled item matching Image 4 fix) */
                        <div
                          key={item.id}
                          className="relative aspect-square w-full rounded-2xl bg-[#121214] p-1.5 flex flex-col items-center justify-between overflow-hidden group select-none"
                        >
                          <button
                            onClick={() => removeReceiveItem(item)}
                            className="absolute top-1 right-1 size-4 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center text-[10px] shadow-sm z-10 cursor-pointer border-none"
                            title="Remove"
                          >
                            ✕
                          </button>
                          <div className="w-full flex-1 flex items-center justify-center overflow-hidden pt-1">
                            <IsometricMannequin name={item.name} type={item.type} className="h-12 w-full max-h-12" />
                          </div>
                          <div className="w-full text-center pb-0.5 px-0.5">
                            <span className="text-[9.5px] font-bold text-white truncate block w-full leading-tight">
                              {item.name}
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* Empty Slot matching Image 8: click opens dropdown inventory selection */
                        <button
                          key={slotIdx}
                          onClick={() =>
                            setActiveDropdownSide(activeDropdownSide === 'receive' ? null : 'receive')
                          }
                          className="aspect-square w-full rounded-2xl border border-dashed border-white/15 bg-[#121214]/60 hover:bg-white/[0.04] hover:border-white/30 flex items-center justify-center text-white/30 hover:text-white transition-all cursor-pointer border-none"
                          title="Click to add item from partner"
                        >
                          <Plus className="size-5" />
                        </button>
                      )
                    })}
                  </div>

                  {/* DROPDOWN INVENTORY SELECTION FOR THEIR OFFER (Image 7 replaced with dropdown) */}
                  {activeDropdownSide === 'receive' && (
                    <div className="mt-2 p-2.5 rounded-xl bg-[#121214] flex flex-col gap-1.5 shadow-xl animate-in fade-in-50 duration-150">
                      <div className="flex items-center justify-between px-1 pb-1">
                        <span className="text-[11px] font-bold text-white/70">
                          Select item from {currentPartnerData.name}'s items:
                        </span>
                        <button
                          onClick={() => setActiveDropdownSide(null)}
                          className="text-[11px] text-white/40 hover:text-white bg-transparent border-none cursor-pointer"
                        >
                          Close
                        </button>
                      </div>

                      <div className="flex flex-col gap-1 max-h-48 overflow-y-auto no-scrollbar pr-0.5">
                        {currentPartnerData.pool.filter(
                          (item) => !selectedReceiveItems.some((i) => i.id === item.id)
                        ).length === 0 ? (
                          <div className="text-center py-3 text-xs text-white/40">
                            All partner items already selected
                          </div>
                        ) : (
                          currentPartnerData.pool.filter(
                            (item) => !selectedReceiveItems.some((i) => i.id === item.id)
                          ).map((item) => (
                            <button
                              key={item.id}
                              onClick={() => addReceiveItem(item)}
                              className="w-full p-2 rounded-lg bg-[#18181c] hover:bg-[#222228] flex items-center justify-between gap-2 transition-colors cursor-pointer border-none text-left"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="size-7 rounded-md bg-[#121214] flex items-center justify-center overflow-hidden shrink-0">
                                  <IsometricMannequin name={item.name} type={item.type} className="h-6 w-6" />
                                </div>
                                <span className="text-xs font-bold text-white truncate">
                                  {item.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-xs font-bold text-white shrink-0">
                                <img
                                  src="/novelo-currency.png"
                                  alt="Currency"
                                  className="size-3 object-contain"
                                />
                                <span>{item.value.toLocaleString()}</span>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Trade Balance Indicator (Plain text red/green without background, SafeTrade text removed) */}
              <div className="p-3 rounded-xl bg-[#161618] flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white/60">Difference:</span>
                  {modalDiff > 0 ? (
                    <span className="text-xs font-bold text-emerald-400">
                      +{modalDiff.toLocaleString()} in your favor
                    </span>
                  ) : modalDiff < 0 ? (
                    <span className="text-xs font-bold text-red-500">
                      {modalDiff.toLocaleString()} giving more value
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-white/50">
                      0 (Equal Value)
                    </span>
                  )}
                </div>
              </div>

              {/* Optional Memo */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-white/70 uppercase tracking-wider">
                  Message (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Looking for fair trade!"
                  value={tradeNote}
                  onChange={(e) => setTradeNote(e.target.value)}
                  className="w-full h-10 px-3 rounded-[10px] bg-[#161618] text-xs text-white placeholder:text-white/30 focus:outline-none border-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 flex items-center justify-end gap-3 bg-[#141416]">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 h-9 rounded-[10px] bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-bold transition-all cursor-pointer border-none"
              >
                Cancel
              </button>
              <button
                onClick={handleSendTradeProposal}
                disabled={selectedGiveItems.length === 0 && selectedReceiveItems.length === 0}
                className="px-5 h-9 rounded-[10px] bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all cursor-pointer border-none disabled:opacity-40 disabled:cursor-not-allowed shadow-md flex items-center gap-1.5"
              >
                <span>
                  {modalMode === 'counter' ? 'Send Counter Offer' : 'Send Trade Request'}
                </span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HOW TO TRADE GUIDE POPUP */}
      {showHowToTrade && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121214] rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <HelpCircle className="size-5 text-amber-400" />
                <span>How to Trade in Novelo</span>
              </h3>
              <button
                onClick={() => setShowHowToTrade(false)}
                className="size-7 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white flex items-center justify-center cursor-pointer border-none"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs text-white/70 leading-relaxed">
              <div className="p-3 rounded-xl bg-white/[0.04] flex gap-2.5">
                <span className="font-bold text-white shrink-0">1.</span>
                <span>
                  <strong className="text-white">Collectibles & Limiteds:</strong> Only tradeable limited accessories, hats, and clothing can be traded.
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.04] flex gap-2.5">
                <span className="font-bold text-white shrink-0">2.</span>
                <span>
                  <strong className="text-white">Up to 4 Items:</strong> You and your trading partner may offer up to 4 items each per proposal.
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.04] flex gap-2.5">
                <span className="font-bold text-white shrink-0">3.</span>
                <span>
                  <strong className="text-white">Reviewing Values:</strong> Check item values before accepting. Once accepted, items transfer automatically to your inventory.
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.04] flex gap-2.5">
                <span className="font-bold text-white shrink-0">4.</span>
                <span>
                  <strong className="text-white">Expiration:</strong> Pending requests expire automatically after 5 days if not accepted or countered.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowHowToTrade(false)}
              className="mt-2 w-full h-9 rounded-[10px] bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all cursor-pointer border-none"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
