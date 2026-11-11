import { useState } from 'react'
import { Sparkles, Tag, Gift, Shield, Check, Info, ArrowRight } from 'lucide-react'

interface PackageItem {
  id: string
  amount: string
  strikethrough: string
  bonus: string
  price: string
  isForYou?: boolean
}

const BONUS_PACKAGES: PackageItem[] = [
  { id: 'b1', amount: '24,000', strikethrough: '22,500', bonus: '+ 1,500 more', price: '€239.99' },
  { id: 'b2', amount: '11,000', strikethrough: '10,000', bonus: '+ 1,000 more', price: '€119.99' },
  { id: 'b3', amount: '5,250', strikethrough: '4,500', bonus: '+ 750 more', price: '€59.99' },
  { id: 'b4', amount: '3,625', strikethrough: '3,150', bonus: '+ 475 more', price: '€39.99', isForYou: true },
  { id: 'b5', amount: '2,000', strikethrough: '1,700', bonus: '+ 300 more', price: '€23.99' },
]

const STANDARD_PACKAGES: PackageItem[] = [
  { id: 's1', amount: '1,500', strikethrough: '1,200', bonus: '+ 300 more', price: '€17.99' },
  { id: 's2', amount: '1,000', strikethrough: '800', bonus: '+ 200 more', price: '€11.99' },
  { id: 's3', amount: '500', strikethrough: '400', bonus: '+ 100 more', price: '€5.99' },
]

export function Store() {
  const [purchasingId, setPurchasingId] = useState<string | null>(null)

  const handleBuy = (item: PackageItem) => {
    setPurchasingId(item.id)
    setTimeout(() => {
      alert(`Success! Added ${item.amount} Novelo to your balance.`)
      setPurchasingId(null)
    }, 700)
  }

  return (
    <div className="p-4 md:p-6 lg:p-7 flex flex-col gap-8 max-w-[850px] mx-auto">
      {/* 1. Bonus Item We Picked For You */}
      <section className="flex flex-col gap-3">
        <h2 className="text-base md:text-lg font-bold text-white tracking-tight">
          Bonus item we picked for you
        </h2>

        <div className="rounded-2xl bg-[#121214] border border-white/[0.06] overflow-hidden flex flex-col shadow-xl">
          {/* Top Bundle Hero Banner */}
          <div className="h-28 bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-neutral-900 p-4 flex items-center gap-4 relative overflow-hidden">
            <div className="size-16 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-md">
              <Gift className="size-8" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-white tracking-wide uppercase">RIVALS</span>
                <Info className="size-3 text-white/50" />
              </div>
              <span className="text-xs text-white/80 font-medium">RPG Bundle!</span>
            </div>
          </div>

          {/* List of Bonus Packages */}
          <div className="p-4 flex flex-col gap-3">
            {BONUS_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="flex items-center justify-between gap-4 py-2 border-b border-white/[0.04] last:border-none"
              >
                {/* Left Amount & Bonus tag */}
                <div className="flex items-center gap-3">
                  {/* Currency Icon */}
                  <img src="/novelo-currency.png" alt="Currency" className="size-5 object-contain" />

                  {/* Primary Amount */}
                  <span className="text-base md:text-lg font-black text-white tabular-numbers">
                    {pkg.amount}
                  </span>

                  {/* Strikethrough Value */}
                  <span className="text-xs text-white/40 line-through tabular-numbers">
                    {pkg.strikethrough}
                  </span>

                  {/* Bonus Badge */}
                  <span className="text-[11px] font-bold text-white/70 bg-white/5 px-2 py-0.5 rounded-md">
                    {pkg.bonus}
                  </span>

                  {/* "For you" Pill */}
                  {pkg.isForYou && (
                    <span className="text-[11px] font-bold text-white/90 bg-white/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span>👁</span>
                      <span>For you</span>
                    </span>
                  )}
                </div>

                {/* Right Purchase Button */}
                <button
                  onClick={() => handleBuy(pkg)}
                  className={`h-9 px-6 rounded-xl font-bold text-xs transition-all cursor-pointer border-none shadow-md ${
                    pkg.isForYou
                      ? 'bg-[#00a2ff] hover:bg-[#0091e6] text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {purchasingId === pkg.id ? 'Loading...' : pkg.price}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Novelo Packages */}
      <section className="flex flex-col gap-3">
        <h2 className="text-base md:text-lg font-bold text-white tracking-tight">
          Novelo packages
        </h2>

        <div className="rounded-2xl bg-[#121214] border border-white/[0.06] p-4 flex flex-col gap-3 shadow-xl">
          {STANDARD_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="flex items-center justify-between gap-4 py-2 border-b border-white/[0.04] last:border-none"
            >
              {/* Left Amount & Bonus */}
              <div className="flex items-center gap-3">
                <img src="/novelo-currency.png" alt="Currency" className="size-5 object-contain" />

                <span className="text-base md:text-lg font-black text-white tabular-numbers">
                  {pkg.amount}
                </span>

                <span className="text-xs text-white/40 line-through tabular-numbers">
                  {pkg.strikethrough}
                </span>

                <span className="text-[11px] font-bold text-white/70 bg-white/5 px-2 py-0.5 rounded-md">
                  {pkg.bonus}
                </span>
              </div>

              {/* Purchase Button */}
              <button
                onClick={() => handleBuy(pkg)}
                className="h-9 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer border-none shadow-md"
              >
                {purchasingId === pkg.id ? 'Loading...' : pkg.price}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. New on Novelo (Novelo Plus Membership Card) */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <img src="/novelo-currency.png" alt="Currency" className="size-4 object-contain" />
          <h2 className="text-base md:text-lg font-bold text-white tracking-tight">
            New on Novelo
          </h2>
        </div>

        <div className="rounded-2xl bg-[#121214] border border-white/[0.06] p-5 flex flex-col gap-5 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <img src="/novelo-currency.png" alt="Currency" className="size-5 object-contain" />
              <h3 className="text-sm font-bold text-white">Get Novelo Plus</h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <span className="line-through text-white/40">€5.99</span>
              <span className="text-emerald-400">Free</span>
            </div>
          </div>

          {/* 2-Column Perks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3.5 gap-x-6 text-xs text-white/70">
            <div className="flex items-center gap-2.5">
              <Tag className="size-4 text-white/50 shrink-0" />
              <span>10% off in-game items, avatars, and more</span>
            </div>
            <div className="flex items-center gap-2.5">
              <img src="/novelo-currency.png" alt="Currency" className="size-3.5 object-contain opacity-60 shrink-0" />
              <span>Send Novelo for free</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="size-4 text-white/50 shrink-0" />
              <span>20% off these items after 2 months</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Shield className="size-4 text-white/50 shrink-0" />
              <span>Trade and resell limited items</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Gift className="size-4 text-white/50 shrink-0" />
              <span>Free private servers</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ArrowRight className="size-4 text-white/50 shrink-0" />
              <span>Publish games and avatar items</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => alert('Novelo Plus activated successfully!')}
              className="flex-1 h-10 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition-all cursor-pointer border-none shadow-md"
            >
              Try it for free
            </button>
            <button
              onClick={() => alert('Novelo Plus detailed terms and benefits.')}
              className="flex-1 h-10 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all cursor-pointer border-none"
            >
              Learn more
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
