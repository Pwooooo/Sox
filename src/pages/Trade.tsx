import { useState } from 'react'
import { ChevronDown, Star, Sparkles, HelpCircle } from 'lucide-react'

interface TradeItem {
  id: string
  name: string
  value: number
  color: string
}

interface TradeRequest {
  id: string
  partner: string
  date: string
  expiresDate: string
  status: string
  receiveItems: TradeItem[]
  giveItems: TradeItem[]
}

const TRADE_REQUESTS: TradeRequest[] = [
  {
    id: 'tr1',
    partner: 'GOODEVER',
    date: '4/2/20',
    expiresDate: '4/7/20',
    status: 'Unknown',
    receiveItems: [
      { id: 'ri1', name: 'Leopard Fedora', value: 780, color: '#ca8a04' },
    ],
    giveItems: [
      { id: 'gi1', name: 'Blue Plaid Fedora', value: 1342, color: '#3b82f6' },
    ],
  },
  {
    id: 'tr2',
    partner: 'ActuallyDot',
    date: '4/2/20',
    expiresDate: '4/7/20',
    status: 'Unknown',
    receiveItems: [
      { id: 'ri2', name: 'Dragon Wings', value: 450, color: '#dc2626' },
    ],
    giveItems: [
      { id: 'gi2', name: 'Crown of Novelo', value: 250, color: '#eab308' },
    ],
  },
  {
    id: 'tr3',
    partner: 'BeetleSlugger',
    date: '4/2/20',
    expiresDate: '4/7/20',
    status: 'Unknown',
    receiveItems: [
      { id: 'ri3', name: 'Neon Shades', value: 35, color: '#06b6d4' },
    ],
    giveItems: [
      { id: 'gi3', name: 'Pink Bomber', value: 0, color: '#ec4899' },
    ],
  },
  {
    id: 'tr4',
    partner: 'Flaminndragon',
    date: '3/29/20',
    expiresDate: '4/3/20',
    status: 'Unknown',
    receiveItems: [
      { id: 'ri4', name: 'Starfall Staff', value: 320, color: '#a855f7' },
    ],
    giveItems: [
      { id: 'gi4', name: 'Samurai Armor', value: 180, color: '#16a34a' },
    ],
  },
  {
    id: 'tr5',
    partner: 'forzch',
    date: '3/29/20',
    expiresDate: '4/3/20',
    status: 'Unknown',
    receiveItems: [
      { id: 'ri5', name: 'Golden Watch', value: 500, color: '#f59e0b' },
    ],
    giveItems: [
      { id: 'gi5', name: 'Jetpack', value: 380, color: '#64748b' },
    ],
  },
  {
    id: 'tr6',
    partner: 'RblxMellodas',
    date: '3/29/20',
    expiresDate: '4/3/20',
    status: 'Unknown',
    receiveItems: [
      { id: 'ri6', name: 'Diamond Necklace', value: 600, color: '#38bdf8' },
    ],
    giveItems: [
      { id: 'gi6', name: 'Angel Halo', value: 175, color: '#fbbf24' },
    ],
  },
  {
    id: 'tr7',
    partner: 'BlahBlahNoodles',
    date: '3/29/20',
    expiresDate: '4/3/20',
    status: 'Unknown',
    receiveItems: [
      { id: 'ri7', name: 'Laser Gun', value: 280, color: '#ef4444' },
    ],
    giveItems: [
      { id: 'gi7', name: 'Pixel Sword', value: 90, color: '#10b981' },
    ],
  },
  {
    id: 'tr8',
    partner: 'Disincline',
    date: '3/28/20',
    expiresDate: '4/2/20',
    status: 'Unknown',
    receiveItems: [
      { id: 'ri8', name: 'Butterfly Wings', value: 300, color: '#d946ef' },
    ],
    giveItems: [
      { id: 'gi8', name: 'Viking Helmet', value: 130, color: '#78716c' },
    ],
  },
  {
    id: 'tr9',
    partner: 'smokedmen',
    date: '3/28/20',
    expiresDate: '4/2/20',
    status: 'Unknown',
    receiveItems: [
      { id: 'ri9', name: 'Ghostly Aura', value: 200, color: '#a78bfa' },
    ],
    giveItems: [
      { id: 'gi9', name: 'Flame Skull', value: 120, color: '#f97316' },
    ],
  },
]

export function Trade() {
  const [tradeCategory, setTradeCategory] = useState<'Inbound' | 'Outbound' | 'Completed' | 'Inactive'>('Inbound')
  const [selectedTradeId, setSelectedTradeId] = useState('tr1')
  const [trades, setTrades] = useState(TRADE_REQUESTS)

  const activeTrade = trades.find((t) => t.id === selectedTradeId) || trades[0]

  const receiveTotal = activeTrade?.receiveItems.reduce((sum, item) => sum + item.value, 0) || 0
  const giveTotal = activeTrade?.giveItems.reduce((sum, item) => sum + item.value, 0) || 0

  const handleAccept = () => {
    alert(`Trade with ${activeTrade.partner} accepted! Items swapped.`)
    setTrades((prev) => prev.filter((t) => t.id !== activeTrade.id))
  }

  const handleDecline = () => {
    alert(`Trade with ${activeTrade.partner} declined.`)
    setTrades((prev) => prev.filter((t) => t.id !== activeTrade.id))
  }

  return (
    <div className="p-4 md:p-6 lg:p-7 max-w-[1400px] flex flex-col gap-6">
      <div className="flex flex-col md:flex-row rounded-2xl bg-[#121214] border border-white/[0.06] overflow-hidden shadow-2xl min-h-[640px]">
        {/* Left Column: Trades List matching Image 5 */}
        <div className="w-full md:w-72 lg:w-80 bg-[#161618] flex flex-col shrink-0 border-r border-white/[0.04]">
          {/* Header */}
          <div className="p-4 pb-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-black text-white tracking-tight">Trades</h1>
              {/* Inbound Dropdown */}
              <div className="relative">
                <select
                  value={tradeCategory}
                  onChange={(e) => setTradeCategory(e.target.value as any)}
                  className="h-8 pl-3 pr-7 rounded-lg bg-[#222226] border border-white/10 text-xs text-white focus:outline-none cursor-pointer appearance-none"
                >
                  <option value="Inbound">Inbound</option>
                  <option value="Outbound">Outbound</option>
                  <option value="Completed">Completed</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-white/50 pointer-events-none" />
              </div>
            </div>

            <button
              onClick={() => alert('Trading guide: Select trades from inbound to review items.')}
              className="text-[11px] text-white/50 hover:text-white underline cursor-pointer text-left bg-transparent border-none p-0"
            >
              How do I trade?
            </button>
          </div>

          {/* List of Traders matching Image 5 */}
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
            {trades.map((trade) => {
              const isSelected = trade.id === selectedTradeId
              return (
                <button
                  key={trade.id}
                  onClick={() => setSelectedTradeId(trade.id)}
                  className={`p-3.5 flex items-center justify-between gap-3 text-left transition-all cursor-pointer border-none rounded-xl ${
                    isSelected
                      ? 'bg-white/[0.08] backdrop-blur-xs text-white'
                      : 'bg-transparent hover:bg-white/[0.04] text-white/80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Blocky Circular Avatar */}
                    <div className="size-9 rounded-full bg-neutral-700 flex items-center justify-center shrink-0">
                      <div className="size-4 bg-neutral-300 rounded-xs" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold truncate leading-tight">{trade.partner}</span>
                      <span className="text-[10px] text-white/40">{trade.status}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-white/40 shrink-0">{trade.date}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Column: Trade Details Workspace matching Image 5 */}
        <div className="flex-1 p-6 flex flex-col justify-between gap-6 bg-[#0f0f11]">
          {activeTrade ? (
            <div className="flex flex-col gap-6">
              {/* Partner Title & Expiry */}
              <div className="flex flex-col gap-0.5">
                <h2 className="text-xl font-black text-white tracking-tight">
                  Trade with {activeTrade.partner}
                </h2>
                <span className="text-xs text-white/50">
                  Expires on {activeTrade.expiresDate}
                </span>
              </div>

              {/* Section 1: Items you will receive */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider">
                  Items you will receive
                </h3>

                {/* Items Grid */}
                <div className="flex flex-wrap gap-4">
                  {activeTrade.receiveItems.map((item) => (
                    <div
                      key={item.id}
                      className="w-36 rounded-xl bg-[#18181c] p-3 flex flex-col gap-2 border border-white/[0.04]"
                    >
                      <div
                        className="aspect-square w-full rounded-lg flex items-center justify-center relative overflow-hidden shadow-inner"
                        style={{ backgroundColor: '#222226' }}
                      >
                        <Sparkles className="size-6 text-white/30" />
                        <Star className="absolute bottom-1.5 left-1.5 size-3 text-white/60" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white truncate">{item.name}</span>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-white/70 mt-0.5">
                          <img src="/novelo-currency.png" alt="Currency" className="size-3 object-contain" />
                          <span>{item.value.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Value */}
                <div className="flex items-center gap-2 text-xs font-bold text-white pt-1">
                  <span className="text-white/60">Total Value:</span>
                  <div className="flex items-center gap-1">
                    <img src="/novelo-currency.png" alt="Currency" className="size-3.5 object-contain" />
                    <span>{receiveTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Items you will give */}
              <div className="flex flex-col gap-3 pt-4 border-t border-white/[0.04]">
                <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider">
                  Items you will give
                </h3>

                {/* Items Grid */}
                <div className="flex flex-wrap gap-4">
                  {activeTrade.giveItems.map((item) => (
                    <div
                      key={item.id}
                      className="w-36 rounded-xl bg-[#18181c] p-3 flex flex-col gap-2 border border-white/[0.04]"
                    >
                      <div
                        className="aspect-square w-full rounded-lg flex items-center justify-center relative overflow-hidden shadow-inner"
                        style={{ backgroundColor: '#222226' }}
                      >
                        <Sparkles className="size-6 text-white/30" />
                        <Star className="absolute bottom-1.5 left-1.5 size-3 text-white/60" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white truncate">{item.name}</span>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-white/70 mt-0.5">
                          <img src="/novelo-currency.png" alt="Currency" className="size-3 object-contain" />
                          <span>{item.value.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Value */}
                <div className="flex items-center gap-2 text-xs font-bold text-white pt-1">
                  <span className="text-white/60">Total Value:</span>
                  <div className="flex items-center gap-1">
                    <img src="/novelo-currency.png" alt="Currency" className="size-3.5 object-contain" />
                    <span>{giveTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Buttons matching Image 5 */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
                <button
                  onClick={handleAccept}
                  className="px-6 h-9 rounded-lg bg-white hover:bg-neutral-200 text-black font-bold text-xs transition-all cursor-pointer border-none shadow-md"
                >
                  Accept
                </button>
                <button
                  onClick={() => alert(`Proposing counter-offer to ${activeTrade.partner}...`)}
                  className="px-6 h-9 rounded-lg bg-[#242428] hover:bg-[#2c2c30] text-white font-bold text-xs transition-all cursor-pointer border-none"
                >
                  Counter
                </button>
                <button
                  onClick={handleDecline}
                  className="px-6 h-9 rounded-lg bg-[#242428] hover:bg-[#2c2c30] text-white font-bold text-xs transition-all cursor-pointer border-none"
                >
                  Decline
                </button>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-xs text-white/40">
              No active trade selected.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
