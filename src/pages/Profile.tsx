import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Plus,
  Pencil,
  Users,
  UserPlus,
  Shield,
  Star,
  Package,
  Heart,
  Gamepad2,
  AlertCircle,
} from 'lucide-react'

const TABS = ['About', 'Creations'] as const

const WEARING_ITEMS = [
  { name: 'Dark Fedora', image: '/placeholder.webp' },
  { name: 'Red Scarf', image: '/placeholder.webp' },
  { name: 'Classic Tee', image: '/placeholder.webp' },
  { name: 'Black Jeans', image: '/placeholder.webp' },
  { name: 'Sneakers', image: '/placeholder.webp' },
]

const FRIENDS = Array.from({ length: 12 }, (_, i) => ({
  name: `User${i + 1}`,
  avatar: '/placeholder.webp',
}))

const GROUPS = [
  { name: 'Developers', members: 1240, role: 'Owner' },
  { name: 'Artists', members: 830, role: 'Member' },
  { name: 'Trading Hub', members: 5600, role: 'Member' },
]

const BADGES = [
  { name: 'Early Adopter', icon: '⭐' },
  { name: 'Game Creator', icon: '🎮' },
  { name: 'Top Trader', icon: '🔄' },
  { name: 'Community Star', icon: '🌟' },
  { name: 'Verified', icon: '✓' },
  { name: 'Builder', icon: '🔨' },
]

const CREATIONS = Array.from({ length: 6 }, (_, i) => ({
  name: `Game ${i + 1}`,
  image: '/placeholder.webp',
  players: Math.floor(Math.random() * 200),
  likes: Math.floor(Math.random() * 1000),
}))

const FAVORITES = Array.from({ length: 6 }, (_, i) => ({
  name: `Favorite Game ${i + 1}`,
  image: '/placeholder.webp',
}))

export function Profile() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('About')
  const [wearingIndex, setWearingIndex] = useState(0)

  const visibleWearing = WEARING_ITEMS.slice(wearingIndex, wearingIndex + 4)

  return (
    <div className="max-w-[800px] mx-auto p-4 md:p-6 flex flex-col gap-4">
      {/* Header Card */}
      <div className="bg-card rounded-2xl border border-border p-6 flex items-start gap-6">
        <div className="size-28 md:size-32 rounded-xl overflow-hidden bg-muted shrink-0">
          <img src="/placeholder.webp" alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-foreground">Sky</h1>
          <p className="text-muted-foreground text-sm">@sky</p>
          <div className="flex items-center gap-4 mt-3 text-sm">
            <span className="text-foreground"><strong className="font-semibold">0</strong> <span className="text-muted-foreground">Friends</span></span>
            <span className="text-foreground"><strong className="font-semibold">0</strong> <span className="text-muted-foreground">Followers</span></span>
            <span className="text-foreground"><strong className="font-semibold">0</strong> <span className="text-muted-foreground">Following</span></span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors cursor-pointer border-none">
            <Pencil className="size-4" />
            Edit Profile
          </button>
          <button className="size-9 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-secondary/80 transition-colors cursor-pointer border-none">
            <MoreHorizontal className="size-5" />
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="bg-card rounded-2xl border border-border flex overflow-hidden">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors cursor-pointer border-none",
              activeTab === tab
                ? "bg-secondary text-foreground"
                : "bg-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'About' && (
        <>
          {/* About + Currently Wearing */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-lg font-bold mb-1">About</h2>
            <p className="text-muted-foreground text-sm mb-6">Pwo Luduvian</p>

            <h3 className="text-sm font-semibold mb-4">Currently Wearing</h3>
            <div className="flex items-center gap-6">
              {/* Full avatar preview */}
              <div className="size-40 md:size-48 rounded-xl overflow-hidden bg-muted shrink-0">
                <img src="/placeholder.webp" alt="Full body" className="w-full h-full object-cover" />
              </div>

              {/* Worn items */}
              <div className="flex-1 min-w-0">
                <div className="grid grid-cols-4 gap-3">
                  {visibleWearing.map((item) => (
                    <div key={item.name} className="flex flex-col items-center gap-1.5">
                      <div className="w-full aspect-square rounded-xl bg-muted overflow-hidden border border-border">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[11px] text-muted-foreground text-center truncate w-full">{item.name}</span>
                    </div>
                  ))}
                </div>
                {WEARING_ITEMS.length > 4 && (
                  <div className="flex items-center justify-end gap-1 mt-3">
                    <button
                      onClick={() => setWearingIndex(Math.max(0, wearingIndex - 1))}
                      disabled={wearingIndex === 0}
                      className="size-7 rounded-md bg-secondary flex items-center justify-center disabled:opacity-30 hover:bg-secondary/80 transition-colors cursor-pointer border-none"
                    >
                      <ChevronLeft className="size-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => setWearingIndex(Math.min(WEARING_ITEMS.length - 4, wearingIndex + 1))}
                      disabled={wearingIndex >= WEARING_ITEMS.length - 4}
                      className="size-7 rounded-md bg-secondary flex items-center justify-center disabled:opacity-30 hover:bg-secondary/80 transition-colors cursor-pointer border-none"
                    >
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Trophy Case */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Trophy Case</h2>
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer border-none bg-transparent">
                <Plus className="size-4" />
                Add
              </button>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <AlertCircle className="size-4 text-orange-500 shrink-0" />
              <span className="text-sm text-orange-500">This row is empty, so it will not be visible to others.</span>
            </div>
          </div>

          {/* Wishlist */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Wishlist</h2>
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer border-none bg-transparent">
                <Pencil className="size-3.5" />
                Edit
              </button>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <AlertCircle className="size-4 text-orange-500 shrink-0" />
              <span className="text-sm text-orange-500">Because this row is empty, it will not be visible to others until it is populated.</span>
            </div>
          </div>

          {/* Friends */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Users className="size-5" />
                Friends
              </h2>
              <span className="text-sm text-muted-foreground">0</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <AlertCircle className="size-4 text-orange-500 shrink-0" />
              <span className="text-sm text-orange-500">No friends yet. Add some friends to see them here.</span>
            </div>
          </div>

          {/* Groups */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Shield className="size-5" />
                Groups
              </h2>
              <span className="text-sm text-muted-foreground">{GROUPS.length}</span>
            </div>
            <div className="flex flex-col gap-3">
              {GROUPS.map((group) => (
                <div key={group.name} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
                  <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Shield className="size-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{group.name}</p>
                    <p className="text-xs text-muted-foreground">{group.members.toLocaleString()} members</p>
                  </div>
                  <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-md">{group.role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Star className="size-5" />
                Badges
              </h2>
              <span className="text-sm text-muted-foreground">{BADGES.length}</span>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {BADGES.map((badge) => (
                <div key={badge.name} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
                  <div className="size-12 rounded-full bg-muted flex items-center justify-center text-xl">
                    {badge.icon}
                  </div>
                  <span className="text-[11px] text-muted-foreground text-center">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Favorites */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Heart className="size-5" />
                Favorites
              </h2>
              <span className="text-sm text-muted-foreground">{FAVORITES.length}</span>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {FAVORITES.map((fav) => (
                <div key={fav.name} className="flex flex-col items-center gap-1.5 cursor-pointer group">
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-muted border border-border">
                    <img src={fav.image} alt={fav.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <span className="text-[11px] text-muted-foreground text-center truncate w-full">{fav.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Joined</p>
                <p className="text-sm font-medium">Jan 2026</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Net Worth</p>
                <p className="text-sm font-medium flex items-center justify-center gap-1">
                  <img src="/currency.png" alt="" className="size-4" />
                  0
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Last Online</p>
                <p className="text-sm font-medium text-green">Online</p>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'Creations' && (
        <>
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Gamepad2 className="size-5" />
                Experiences
              </h2>
              <span className="text-sm text-muted-foreground">{CREATIONS.length}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CREATIONS.map((game) => (
                <div key={game.name} className="cursor-pointer group">
                  <div className="aspect-video rounded-xl overflow-hidden bg-muted border border-border">
                    <img src={game.image} alt={game.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium truncate">{game.name}</p>
                    <p className="text-xs text-muted-foreground">{game.players} playing · {game.likes} likes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items Created */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Package className="size-5" />
                Items
              </h2>
              <span className="text-sm text-muted-foreground">0</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <AlertCircle className="size-4 text-orange-500 shrink-0" />
              <span className="text-sm text-orange-500">No items created yet.</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
