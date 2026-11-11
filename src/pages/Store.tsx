import { useState } from 'react'
import { Sparkles, Check, Zap, Shield, Crown, ArrowRight } from 'lucide-react'

const PACKAGES = [
  { id: 'p1', amount: 400, price: '$4.99', bonus: '' },
  { id: 'p2', amount: 800, price: '$9.99', bonus: '+40 Bonus' },
  { id: 'p3', amount: 1700, price: '$19.99', popular: true, bonus: '+150 Bonus' },
  { id: 'p4', amount: 4500, price: '$49.99', bonus: '+500 Bonus' },
  { id: 'p5', amount: 10000, price: '$99.99', bonus: '+1,500 Bonus' },
]

const PREMIUM_TIERS = [
  {
    tier: 'Novelo Premium 450',
    stipend: '450 Novelo / month',
    price: '$4.99 / mo',
    perks: ['Unlock Trading Privileges', '10% More Novelo with purchases', 'Exclusive Avatar Marketplace Discounts', 'Premium Profile Badge'],
  },
  {
    tier: 'Novelo Premium 1000',
    stipend: '1,000 Novelo / month',
    price: '$9.99 / mo',
    popular: true,
    perks: ['All 450 Tier Benefits', 'Increased Developer Payout Limits', 'Priority Support & Forum Badges', 'Access to Beta Studio Features'],
  },
  {
    tier: 'Novelo Premium 2200',
    stipend: '2,200 Novelo / month',
    price: '$19.99 / mo',
    perks: ['All 1000 Tier Benefits', 'Maximum Developer DevEx Rates', 'VIP Server Hosting Discounts', 'Gold Chat & Profile Flair'],
  },
]

export function Store() {
  const [purchasedId, setPurchasedId] = useState<string | null>(null)

  const handlePurchase = (id: string, name: string) => {
    setPurchasedId(id)
    setTimeout(() => {
      alert(`Successfully purchased ${name}!`)
      setPurchasedId(null)
    }, 800)
  }

  return (
    <div className="p-4 md:p-6 lg:p-7 flex flex-col gap-8 max-w-[1700px]">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Novelo Store
        </h1>
        <p className="text-xs md:text-sm text-white/50 mt-0.5">
          Acquire Novelo currency for marketplace items, avatar upgrades, and game passes
        </p>
      </div>

      {/* Currency Packages */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <img src="/novelo-currency.png" alt="Currency" className="size-5 object-contain" />
          <span>Novelo Currency Packages</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`p-5 rounded-2xl bg-[#141414]/90 border flex flex-col items-center gap-4 text-center transition-all relative ${
                pkg.popular
                  ? 'border-white shadow-xl ring-1 ring-white/30'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-2.5 bg-white text-black text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                  Most Popular
                </span>
              )}

              {/* Currency Icon */}
              <div className="size-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <img src="/novelo-currency.png" alt="Currency" className="size-10 object-contain" />
              </div>

              {/* Amount */}
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tabular-numbers">
                  {pkg.amount.toLocaleString()}
                </span>
                <span className="text-xs text-white/50">Novelo Currency</span>
                {pkg.bonus && (
                  <span className="text-[11px] font-bold text-emerald-400 mt-1">{pkg.bonus}</span>
                )}
              </div>

              {/* Buy Button */}
              <button
                onClick={() => handlePurchase(pkg.id, `${pkg.amount} Novelo`)}
                disabled={purchasedId === pkg.id}
                className="w-full h-10 mt-auto rounded-xl bg-white text-black hover:bg-neutral-200 font-bold text-xs transition-all cursor-pointer border-none shadow-md"
              >
                {purchasedId === pkg.id ? 'Processing...' : pkg.price}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Novelo Premium Subscriptions */}
      <section className="flex flex-col gap-4 pt-4 border-t border-white/[0.08]">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Crown className="size-5 text-amber-400" />
          <span>Novelo Premium Memberships</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PREMIUM_TIERS.map((tier) => (
            <div
              key={tier.tier}
              className={`p-6 rounded-2xl bg-[#141414]/90 border flex flex-col gap-5 ${
                tier.popular
                  ? 'border-white ring-1 ring-white/20 shadow-2xl'
                  : 'border-white/10'
              }`}
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-black text-white">{tier.tier}</h3>
                <span className="text-xs text-emerald-400 font-bold">{tier.stipend}</span>
                <span className="text-xl font-black text-white mt-2">{tier.price}</span>
              </div>

              <div className="flex flex-col gap-2.5 py-2 border-y border-white/[0.08]">
                {tier.perks.map((perk) => (
                  <div key={perk} className="flex items-center gap-2 text-xs text-white/70">
                    <Check className="size-3.5 text-white shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handlePurchase(tier.tier, tier.tier)}
                className="w-full h-11 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold text-xs transition-all cursor-pointer border-none shadow-md mt-auto"
              >
                Subscribe Now
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
