import { useState } from 'react'
import { ArrowLeftRight, Check, X, Shield, Sparkles, AlertCircle, History } from 'lucide-react'
import { ITEMS, Item } from '@/data/items'

interface Trader {
  id: string
  name: string
  tag: string
  avatarColor: string
  items: Item[]
}

const TRADERS: Trader[] = [
  {
    id: 't1',
    name: 'Carro',
    tag: '@carro_dev',
    avatarColor: '#fcd34d',
    items: [ITEMS[1], ITEMS[2], ITEMS[5]],
  },
  {
    id: 't2',
    name: 'dev',
    tag: '@core_dev',
    avatarColor: '#18181b',
    items: [ITEMS[3], ITEMS[7], ITEMS[9]],
  },
  {
    id: 't3',
    name: 'Krampus',
    tag: '@krampus_99',
    avatarColor: '#9ca3af',
    items: [ITEMS[0], ITEMS[4], ITEMS[8]],
  },
]

export function Trade() {
  const [selectedTraderId, setSelectedTraderId] = useState('t1')
  const [myOffer, setMyOffer] = useState<number[]>([1])
  const [theirOffer, setTheirOffer] = useState<number[]>([2])
  const [tradeSent, setTradeSent] = useState(false)
  const [tradeTab, setTradeTab] = useState<'create' | 'inbound' | 'outbound'>('create')

  const trader = TRADERS.find((t) => t.id === selectedTraderId) || TRADERS[0]
  const myItems = ITEMS.slice(0, 8)

  const toggleMyItem = (id: number) => {
    setMyOffer((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleTheirItem = (id: number) => {
    setTheirOffer((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const myValue = myOffer.reduce((sum, id) => {
    const item = myItems.find((i) => i.id === id)
    return sum + (item?.price || 0)
  }, 0)

  const theirValue = theirOffer.reduce((sum, id) => {
    const item = trader.items.find((i) => i.id === id)
    return sum + (item?.price || 0)
  }, 0)

  const handleSendTrade = () => {
    if (myOffer.length === 0 || theirOffer.length === 0) {
      alert('Please select at least one item on each side to propose a trade!')
      return
    }
    setTradeSent(true)
    setTimeout(() => {
      alert(`Trade offer sent to ${trader.name}!`)
      setTradeSent(false)
      setMyOffer([])
      setTheirOffer([])
    }, 1000)
  }

  return (
    <div className="p-4 md:p-6 lg:p-7 flex flex-col gap-6 max-w-[1700px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Trading System
          </h1>
          <p className="text-xs md:text-sm text-white/50 mt-0.5">
            Safely trade rare and collectible items with fellow Novelo community members
          </p>
        </div>

        {/* Trade Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTradeTab('create')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none ${
              tradeTab === 'create' ? 'bg-white text-black' : 'bg-white/10 text-white/70'
            }`}
          >
            New Trade
          </button>
          <button
            onClick={() => setTradeTab('inbound')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none ${
              tradeTab === 'inbound' ? 'bg-white text-black' : 'bg-white/10 text-white/70'
            }`}
          >
            Inbound (1)
          </button>
          <button
            onClick={() => setTradeTab('outbound')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none ${
              tradeTab === 'outbound' ? 'bg-white text-black' : 'bg-white/10 text-white/70'
            }`}
          >
            Outbound (0)
          </button>
        </div>
      </div>

      {tradeTab === 'inbound' ? (
        /* Inbound Trades List */
        <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white">Trade from Krampus</h3>
              <p className="text-xs text-white/50">Expires in 23 hours</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Trade accepted! Items transferred to inventory.')}
                className="px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold cursor-pointer border-none"
              >
                Accept Trade
              </button>
              <button
                onClick={() => alert('Trade declined.')}
                className="px-4 py-2 rounded-xl bg-white/10 text-white/80 hover:bg-white/20 text-xs font-bold cursor-pointer border-none"
              >
                Decline
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5">
              <span className="text-white/50 block mb-2 font-bold">You will receive:</span>
              <span className="font-bold text-white">Dragon Wings (450 Novelo)</span>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5">
              <span className="text-white/50 block mb-2 font-bold">You will give:</span>
              <span className="font-bold text-white">Crown of Novelo (250 Novelo)</span>
            </div>
          </div>
        </div>
      ) : tradeTab === 'outbound' ? (
        <div className="py-16 text-center text-white/40 text-xs">
          No pending outbound trade requests.
        </div>
      ) : (
        /* Trade Window */
        <div className="flex flex-col gap-5">
          {/* Trader Selector */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs text-white/50 font-bold shrink-0">Trading With:</span>
            {TRADERS.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTraderId(t.id)
                  setTheirOffer([])
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-all border ${
                  selectedTraderId === t.id
                    ? 'bg-white text-black border-white shadow-md'
                    : 'bg-[#141414] text-white/70 hover:text-white border-white/10'
                }`}
              >
                <div
                  className="size-4 rounded-full border border-black/20"
                  style={{ backgroundColor: t.avatarColor }}
                />
                <span>{t.name}</span>
              </button>
            ))}
          </div>

          {/* 2-Column Trade Workspace */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left: Your Offer */}
            <div className="p-5 rounded-2xl bg-[#121212]/90 border border-white/10 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-sm font-bold text-white">Your Offer (Sky)</h3>
                  <p className="text-xs text-white/50">{myOffer.length} items selected</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <img src="/novelo-currency.png" alt="Currency" className="size-3.5 object-contain" />
                  <span>{myValue.toLocaleString()} Value</span>
                </div>
              </div>

              {/* Your Inventory Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {myItems.map((item) => {
                  const isSelected = myOffer.includes(item.id)
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleMyItem(item.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col items-center gap-2 text-center ${
                        isSelected
                          ? 'bg-white/15 border-white text-white shadow-md'
                          : 'bg-[#161616] border-white/10 text-white/70 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <div className="size-12 rounded-lg bg-black/40 flex items-center justify-center">
                        <Sparkles className="size-4 text-white/30" />
                      </div>
                      <span className="text-xs font-bold truncate max-w-full">{item.name}</span>
                      <span className="text-[10px] text-white/50">{item.price} Novelo</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right: Their Offer */}
            <div className="p-5 rounded-2xl bg-[#121212]/90 border border-white/10 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-sm font-bold text-white">{trader.name}'s Items</h3>
                  <p className="text-xs text-white/50">{theirOffer.length} items requested</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <img src="/novelo-currency.png" alt="Currency" className="size-3.5 object-contain" />
                  <span>{theirValue.toLocaleString()} Value</span>
                </div>
              </div>

              {/* Their Inventory Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {trader.items.map((item) => {
                  const isSelected = theirOffer.includes(item.id)
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleTheirItem(item.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col items-center gap-2 text-center ${
                        isSelected
                          ? 'bg-white/15 border-white text-white shadow-md'
                          : 'bg-[#161616] border-white/10 text-white/70 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <div className="size-12 rounded-lg bg-black/40 flex items-center justify-center">
                        <Sparkles className="size-4 text-white/30" />
                      </div>
                      <span className="text-xs font-bold truncate max-w-full">{item.name}</span>
                      <span className="text-[10px] text-white/50">{item.price} Novelo</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="p-4 rounded-xl bg-[#141414] border border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-white/60">
              <Shield className="size-4 text-emerald-400" />
              <span>Trades are protected by Novelo Escrow. Once accepted, items swap immediately.</span>
            </div>

            <button
              onClick={handleSendTrade}
              disabled={tradeSent}
              className="h-10 px-6 rounded-xl bg-white text-black hover:bg-neutral-200 transition-all font-bold text-xs flex items-center gap-2 cursor-pointer border-none shadow-md shrink-0"
            >
              <ArrowLeftRight className="size-4" />
              <span>{tradeSent ? 'Sending...' : 'Send Trade Request'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
