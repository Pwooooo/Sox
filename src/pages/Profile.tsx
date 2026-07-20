import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  MoreHorizontal,
  Pencil,
  ChevronLeft,
  ChevronRight,
  LayoutList,
  LayoutGrid,
  Shield,
  Users,
  Star,
  Heart,
  Gamepad2,
} from 'lucide-react'

const WEARING_ITEMS = [
  { name: 'Dizzy', index: 0 },
  { name: 'Long Ponytail', index: 1 },
  { name: 'Pwo', index: 2 },
  { name: 'Pwo', index: 3 },
  { name: 'Classic Tee', index: 4 },
  { name: 'Black Jeans', index: 5 },
]

const FRIENDS = [
  { name: 'Nick_fromKy...', sub: 'New Cart', index: 0 },
  { name: 'VersusPro', sub: 'Anime Vanguard', index: 1 },
  { name: 'Wyky0r_particle', sub: 'SEASON 3', index: 2 },
  { name: 'YepimRalph', sub: '', index: 3 },
  { name: 'DarkSlayer', sub: 'Builder', index: 4 },
  { name: 'PixelQueen', sub: 'Artist', index: 5 },
  { name: 'BlockMaster', sub: 'Game Dev', index: 6 },
  { name: 'StarPlayer', sub: 'Pro Gamer', index: 7 },
]

const CREATIONS = [
  { name: "Sky's Place", desc: 'This is your very first creation. Check it out, then make it your own!', players: 0, visits: 0, index: 0 },
]

const BADGES = [
  { name: 'Welcome', index: 0 },
  { name: 'B1G BALANCE', index: 1 },
  { name: 'START', index: 2 },
]

const FAVORITES = [
  { name: 'EUPHORIA', index: 0 },
  { name: 'Chaos Outbreak', index: 1 },
  { name: 'Podcasts', index: 2 },
  { name: 'Breach', index: 3 },
  { name: 'Hunting Game', index: 4 },
  { name: 'Vibe Park', index: 5 },
]

function grad(i: number) {
  const g = [
    'linear-gradient(135deg, #3a3a3a 0%, #222 100%)',
    'linear-gradient(135deg, #444 0%, #2a2a2a 100%)',
    'linear-gradient(135deg, #383838 0%, #1e1e1e 100%)',
    'linear-gradient(135deg, #404040 0%, #252525 100%)',
    'linear-gradient(135deg, #333 0%, #1a1a1a 100%)',
    'linear-gradient(135deg, #3c3c3c 0%, #202020 100%)',
    'linear-gradient(135deg, #4a0a1e 0%, #1a0508 100%)',
    'linear-gradient(135deg, #3d2b1f 0%, #1a1008 100%)',
  ]
  return g[i % g.length]
}

export function Profile() {
  const [wearingIndex, setWearingIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<'about' | 'creations'>('about')
  const visible = WEARING_ITEMS.slice(wearingIndex, wearingIndex + 4)

  return (
    <div className="w-full p-4 md:p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-2xl" style={{ background: grad(4) }} />
              <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-green flex items-center justify-center border-[3px] border-card">
                <div className="size-2 rounded-full bg-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Sky</h1>
              <p className="text-muted-foreground text-sm md:text-base">@sky</p>
              <div className="flex items-center gap-1.5 mt-2 bg-secondary/60 px-2.5 py-1 rounded-full w-fit text-xs font-medium">
                <img src="/currency.png" alt="" className="size-3.5" />
                <span className="text-foreground">0</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm font-medium hover:bg-secondary transition-colors cursor-pointer">
              <Pencil className="size-4" />
              Edit Profile
            </button>
            <button className="size-9 rounded-lg border border-border bg-card text-foreground flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer">
              <MoreHorizontal className="size-5" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <span className="hover:underline cursor-pointer"><strong className="text-foreground font-semibold">0</strong> Friends</span>
          <span className="hover:underline cursor-pointer"><strong className="text-foreground font-semibold">0</strong> Followers</span>
          <span className="hover:underline cursor-pointer"><strong className="text-foreground font-semibold">0</strong> Following</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-2xl border border-border flex overflow-hidden">
        {([['about', 'About'], ['creations', 'Creations']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors cursor-pointer border-none",
              activeTab === key ? "bg-secondary/60 text-foreground" : "bg-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'about' && (
        <>
          {/* About + Currently Wearing */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-7">
            <h2 className="text-lg font-bold text-foreground mb-1">About</h2>
            <p className="text-muted-foreground text-sm mb-6">Pwo Luduvian</p>

            <h3 className="text-[15px] font-bold text-foreground mb-4">Currently Wearing</h3>
            <div className="flex items-start gap-6">
              <div className="w-[160px] md:w-[200px] h-[200px] md:h-[240px] rounded-2xl shrink-0 border border-border" style={{ background: grad(4) }} />
              <div className="flex-1 min-w-0">
                <div className="grid grid-cols-4 gap-3 md:gap-4">
                  {visible.map((item) => (
                    <div key={item.index} className="flex flex-col items-center gap-2">
                      <div className="w-full aspect-square rounded-xl" style={{ background: grad(item.index) }} />
                      <span className="text-xs text-muted-foreground text-center leading-tight">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              {WEARING_ITEMS.length > 4 && (
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setWearingIndex(Math.max(0, wearingIndex - 1))} disabled={wearingIndex === 0} className="size-8 rounded-lg flex items-center justify-center disabled:opacity-25 hover:bg-secondary transition-colors cursor-pointer border-none bg-transparent">
                    <ChevronLeft className="size-5 text-muted-foreground" />
                  </button>
                  <button onClick={() => setWearingIndex(Math.min(WEARING_ITEMS.length - 4, wearingIndex + 1))} disabled={wearingIndex >= WEARING_ITEMS.length - 4} className="size-8 rounded-lg flex items-center justify-center disabled:opacity-25 hover:bg-secondary transition-colors cursor-pointer border-none bg-transparent">
                    <ChevronRight className="size-5 text-muted-foreground" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Three column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Groups */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Shield className="size-4 text-muted-foreground" /> Groups
              </h3>
              <div className="flex flex-col gap-1.5">
                {['Developers', 'Artists', 'Trading Hub'].map((g, i) => (
                  <div key={g} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                    <div className="size-8 rounded-lg shrink-0" style={{ background: grad(i + 5) }} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{g}</p>
                      <p className="text-[10px] text-muted-foreground">{(1240 - i * 400).toLocaleString()} members</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experiences */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Gamepad2 className="size-4 text-muted-foreground" /> Experiences
                </h3>
                <div className="flex items-center gap-0.5">
                  <button className="size-6 rounded flex items-center justify-center cursor-pointer border-none bg-secondary"><LayoutList className="size-3 text-muted-foreground" /></button>
                  <button className="size-6 rounded flex items-center justify-center cursor-pointer border-none bg-transparent"><LayoutGrid className="size-3 text-muted-foreground" /></button>
                </div>
              </div>
              {CREATIONS.map((game) => (
                <div key={game.name} className="rounded-xl border border-border overflow-hidden">
                  <div className="relative aspect-[16/10]" style={{ background: grad(game.index) }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white/15 text-2xl font-black tracking-wider">POLYTORIA</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-foreground truncate mb-1">{game.name}</p>
                    <p className="text-[10px] text-muted-foreground mb-2 line-clamp-2">{game.desc}</p>
                    <div className="flex items-center justify-between">
                      <button className="px-4 py-1.5 rounded-md bg-foreground text-background text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer border-none">Play</button>
                      <div className="flex items-center gap-3 text-[10px]">
                        <span className="text-muted-foreground">Playing <strong className="text-foreground">{game.players}</strong></span>
                        <span className="text-muted-foreground">Visits <strong className="text-foreground">{game.visits}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Friends */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Users className="size-4 text-muted-foreground" /> Friends <span className="text-muted-foreground font-normal">(45)</span>
                </h3>
                <span className="text-[11px] text-muted-foreground hover:underline cursor-pointer">See All →</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {FRIENDS.map((f) => (
                  <div key={f.name} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                    <div className="relative shrink-0">
                      <div className="size-9 rounded-full" style={{ background: grad(f.index) }} />
                      <div className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-green flex items-center justify-center border-2 border-card">
                        <Shield className="size-1.5 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-foreground truncate">{f.name}</p>
                      {f.sub && <p className="text-[9px] text-muted-foreground truncate">{f.sub}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Badges */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Star className="size-4 text-muted-foreground" /> Badges
              </h3>
              <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {BADGES.map((b) => (
                  <div key={b.name} className="shrink-0 w-[72px] cursor-pointer">
                    <div className="w-full aspect-square rounded-xl" style={{ background: grad(b.index) }} />
                    <p className="text-[10px] text-muted-foreground text-center mt-1.5 truncate">{b.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorites */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Heart className="size-4 text-muted-foreground" /> Favorites
                </h3>
                <span className="text-[11px] text-muted-foreground hover:underline cursor-pointer">See All →</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {FAVORITES.map((f) => (
                  <div key={f.name} className="cursor-pointer group">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden" style={{ background: grad(f.index) }}>
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white/20 text-[9px] font-bold">{f.name}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 truncate">{f.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'creations' && (
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Experiences</h2>
            <div className="flex items-center gap-0.5">
              <button className="size-7 rounded-md flex items-center justify-center cursor-pointer border-none bg-secondary"><LayoutList className="size-3.5 text-muted-foreground" /></button>
              <button className="size-7 rounded-md flex items-center justify-center cursor-pointer border-none bg-transparent"><LayoutGrid className="size-3.5 text-muted-foreground" /></button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CREATIONS.map((game) => (
              <div key={game.name} className="rounded-xl border border-border overflow-hidden cursor-pointer group">
                <div className="relative aspect-[16/9] overflow-hidden" style={{ background: grad(game.index) }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/20 text-3xl font-black tracking-wider group-hover:scale-110 transition-transform">POLYTORIA</span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-foreground truncate mb-1">{game.name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Playing {game.players}</span>
                    <span>Visits {game.visits.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
