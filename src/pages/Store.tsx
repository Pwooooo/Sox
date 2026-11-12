import { useState } from 'react'
import { Sparkles, Tag, Gift, Shield, ArrowRight, CreditCard, Check, Ticket } from 'lucide-react'

interface PackageItem {
  id: string
  amount: string
  bonus?: string
  price: string
  popular?: boolean
}

const NOVELO_PACKAGES: PackageItem[] = [
  { id: 'p1', amount: '24,000', bonus: '+1,500 bonus', price: '€239.99' },
  { id: 'p2', amount: '11,000', bonus: '+1,000 bonus', price: '€119.99' },
  { id: 'p3', amount: '5,250', bonus: '+750 bonus', price: '€59.99' },
  { id: 'p4', amount: '3,625', bonus: '+475 bonus', price: '€39.99', popular: true },
  { id: 'p5', amount: '2,000', bonus: '+300 bonus', price: '€23.99' },
  { id: 'p6', amount: '1,500', bonus: '+200 bonus', price: '€17.99' },
  { id: 'p7', amount: '1,000', bonus: '+100 bonus', price: '€11.99' },
  { id: 'p8', amount: '500', price: '€5.99' },
]

export function Store() {
  const [purchasingId, setPurchasingId] = useState<string | null>(null)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  const handleBuy = (item: PackageItem) => {
    setPurchasingId(item.id)
    setTimeout(() => {
      alert(`Success! Added ${item.amount} Novelo to your balance.`)
      setPurchasingId(null)
    }, 700)
  }

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!promoCode.trim()) return
    setPromoApplied(true)
    setTimeout(() => {
      alert(`Code "${promoCode.toUpperCase()}" applied! Bonus added to your account.`)
      setPromoCode('')
      setPromoApplied(false)
    }, 800)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-8 max-w-[900px] mx-auto select-none">
      {/* 1. Header with Current Balance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.04]">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Novelo Store
          </h1>
          <p className="text-xs md:text-sm text-white/50 mt-1">
            Purchase Novelo currency to unlock exclusive items, upgrades, and experiences
          </p>
        </div>

        {/* Balance Badge */}
        <div className="flex items-center gap-2.5 px-4 h-10 rounded-[12px] bg-[#141416] border border-white/[0.06] shadow-sm self-start sm:self-auto shrink-0">
          <span className="text-xs text-white/40">Balance:</span>
          <img src="/novelo-currency.png" alt="Currency" className="size-4 object-contain" />
          <span className="text-sm font-bold text-white font-mono">1,450</span>
        </div>
      </div>

      {/* 2. Novelo Currency Packages List */}
      <section className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base md:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <img src="/novelo-currency.png" alt="Currency" className="size-4 object-contain" />
            <span>Novelo Packages</span>
          </h2>
          <span className="text-xs text-white/40">Instant digital delivery</span>
        </div>

        <div className="rounded-2xl bg-[#101012] border border-white/[0.05] p-2.5 sm:p-4 flex flex-col gap-1 shadow-2xl overflow-hidden">
          {NOVELO_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-colors duration-150 ${
                pkg.popular
                  ? 'bg-white/[0.04] hover:bg-white/[0.07]'
                  : 'hover:bg-white/[0.03]'
              }`}
            >
              {/* Left Side: Currency Icon + Amount + Bonus */}
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src="/novelo-currency.png"
                  alt="Currency"
                  className="size-5 sm:size-6 object-contain shrink-0"
                />

                <span className="text-base sm:text-lg font-black text-white font-mono tabular-numbers tracking-tight">
                  {pkg.amount}
                </span>

                {pkg.bonus && (
                  <span className="text-[10px] sm:text-[11px] font-bold text-white/80 bg-white/[0.08] px-2 py-0.5 rounded-md shrink-0">
                    {pkg.bonus}
                  </span>
                )}

                {pkg.popular && (
                  <span className="hidden sm:inline-flex text-[10px] font-extrabold text-black bg-white px-2 py-0.5 rounded-full shrink-0">
                    Most Popular
                  </span>
                )}
              </div>

              {/* Right Side: Buy Button */}
              <button
                onClick={() => handleBuy(pkg)}
                className={`h-9 px-5 rounded-[10px] font-bold text-xs transition-all duration-150 cursor-pointer border-none outline-none select-none active:scale-[0.97] shrink-0 ${
                  pkg.popular
                    ? 'bg-white hover:bg-neutral-200 text-black shadow-md'
                    : 'bg-white/[0.08] hover:bg-white/[0.14] text-white'
                }`}
              >
                {purchasingId === pkg.id ? 'Processing...' : pkg.price}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Novelo Plus Membership Card */}
      <section className="flex flex-col gap-3.5">
        <h2 className="text-base md:text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="size-4 text-white/60" />
          <span>Novelo Plus Membership</span>
        </h2>

        <div className="rounded-2xl bg-[#101012] border border-white/[0.05] p-5 sm:p-6 flex flex-col gap-5 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-40 bg-white/[0.02] rounded-full blur-2xl pointer-events-none" />

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.05]">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center shrink-0">
                <img src="/novelo-currency.png" alt="Currency" className="size-6 object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Get Novelo Plus</h3>
                  <span className="text-[10px] font-bold text-black bg-white px-1.5 py-0.5 rounded-sm">
                    VIP
                  </span>
                </div>
                <p className="text-xs text-white/50 mt-0.5">Cancel or modify anytime</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1.5 self-start sm:self-auto">
              <span className="text-xl font-black text-white font-mono">€5.99</span>
              <span className="text-xs text-white/40">/ month</span>
            </div>
          </div>

          {/* 2-Column Perks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-xs text-white/70">
            <div className="flex items-center gap-3">
              <Tag className="size-4 text-white/40 shrink-0" />
              <span>10% extra Novelo bonus on all package purchases</span>
            </div>
            <div className="flex items-center gap-3">
              <Gift className="size-4 text-white/40 shrink-0" />
              <span>Exclusive limited avatar items delivered monthly</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="size-4 text-white/40 shrink-0" />
              <span>Trade and resell limited items in the Marketplace</span>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="size-4 text-white/40 shrink-0" />
              <span>Send and gift Novelo currency with zero commission</span>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="size-4 text-white/40 shrink-0" />
              <span>Free VIP private servers for supported experiences</span>
            </div>
            <div className="flex items-center gap-3">
              <ArrowRight className="size-4 text-white/40 shrink-0" />
              <span>Publish experiences and create catalog assets</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => alert('Novelo Plus activated successfully!')}
              className="w-full sm:flex-1 h-10 rounded-[10px] bg-white hover:bg-neutral-200 text-black font-bold text-xs transition-all cursor-pointer border-none shadow-md active:scale-[0.97]"
            >
              Start 30-Day Free Trial
            </button>
            <button
              onClick={() => alert('Novelo Plus Terms: Membership renews automatically monthly. Cancel anytime under Account Settings.')}
              className="w-full sm:w-auto h-10 px-5 rounded-[10px] bg-white/[0.08] hover:bg-white/[0.14] text-white font-bold text-xs transition-all cursor-pointer border-none active:scale-[0.97]"
            >
              Membership Terms
            </button>
          </div>
        </div>
      </section>

      {/* 4. Redeem Gift Card / Promo Code Box */}
      <section className="rounded-2xl bg-[#101012] border border-white/[0.05] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-10 rounded-xl bg-white/[0.08] flex items-center justify-center shrink-0">
            <Ticket className="size-5 text-white/60" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">Have a Gift Card or Promo Code?</h3>
            <p className="text-[11px] text-white/40 mt-0.5">
              Enter your code to redeem Novelo currency or exclusive virtual goods
            </p>
          </div>
        </div>

        <form onSubmit={handleRedeem} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="ENTER CODE"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="h-9 px-3.5 rounded-[10px] bg-[#161618] border border-white/10 text-xs font-mono font-bold text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 tracking-wider uppercase w-full sm:w-44"
          />
          <button
            type="submit"
            className="h-9 px-4 rounded-[10px] bg-white/[0.08] hover:bg-white/[0.14] text-white font-bold text-xs transition-all cursor-pointer border-none shrink-0 active:scale-[0.97]"
          >
            {promoApplied ? 'Applied!' : 'Redeem'}
          </button>
        </form>
      </section>
    </div>
  )
}
