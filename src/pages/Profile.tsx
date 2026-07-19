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
  const [expView, setExpView] = useState<'list' | 'grid'>('list')
  const visible = WEARING_ITEMS.slice(wearingIndex, wearingIndex + 4)

  return (
    <div className="max-w-[820px] mx-auto p-4 md:py-6 flex flex-col gap-3">
      {/* Header card */}
      <div className="bg-card rounded-2xl border border-border p-6 pt-8 pb-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div
              className="w-[110px] h-[110px] rounded-xl shrink-0 -mt-12 border-2 border-border shadow-xl"
              style={{ background: grad(4) }}
            />
            <div className="mt-0">
              <h1 className="text-[28px] font-bold text-foreground leading-tight">Sky</h1>
              <p className="text-muted-foreground text-[15px] mt-0.5">@sky</p>
              <div className="flex items-center gap-3 mt-2.5 text-[13px]">
                <span className="text-muted-foreground"><strong className="text-foreground font-semibold">0</strong> Friends</span>
                <span className="text-muted-foreground"><strong className="text-foreground font-semibold">0</strong> Followers</span>
                <span className="text-muted-foreground"><strong className="text-foreground font-semibold">0</strong> Following</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 mt-1">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm font-medium hover:bg-secondary transition-colors cursor-pointer">
              <Pencil className="size-4" />
              Edit Profile
            </button>
            <button className="size-9 rounded-lg border border-border bg-card text-foreground flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer">
              <MoreHorizontal className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* About tab bar */}
      <div className="bg-card rounded-2xl border border-border py-3 text-center">
        <span className="text-sm font-medium text-foreground">About</span>
      </div>

      {/* About content */}
      <div className="bg-card rounded-2xl border border-border p-7">
        <h2 className="text-[17px] font-bold text-foreground mb-0.5">About</h2>
        <p className="text-muted-foreground text-[14px] mb-6">Pwo Luduvian</p>

        <h3 className="text-[15px] font-bold text-foreground mb-4">Currently Wearing</h3>
        <div className="flex items-start gap-6">
          <div
            className="w-[180px] h-[220px] rounded-xl shrink-0 border border-border"
            style={{ background: grad(4) }}
          />
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-4 gap-3">
              {visible.map((item) => (
                <div key={item.index} className="flex flex-col items-center gap-2">
                  <div
                    className="w-full aspect-square rounded-xl"
                    style={{ background: grad(item.index) }}
                  />
                  <span className="text-[12px] text-muted-foreground text-center leading-tight">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
          {WEARING_ITEMS.length > 4 && (
            <div className="flex items-center gap-1 shrink-0 mt-1">
              <button
                onClick={() => setWearingIndex(Math.max(0, wearingIndex - 1))}
                disabled={wearingIndex === 0}
                className="size-7 rounded-md flex items-center justify-center disabled:opacity-25 hover:bg-secondary transition-colors cursor-pointer border-none bg-transparent"
              >
                <ChevronLeft className="size-5 text-muted-foreground" />
              </button>
              <button
                onClick={() => setWearingIndex(Math.min(WEARING_ITEMS.length - 4, wearingIndex + 1))}
                disabled={wearingIndex >= WEARING_ITEMS.length - 4}
                className="size-7 rounded-md flex items-center justify-center disabled:opacity-25 hover:bg-secondary transition-colors cursor-pointer border-none bg-transparent"
              >
                <ChevronRight className="size-5 text-muted-foreground" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Two column section to fill space */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Left */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Groups */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="text-[15px] font-bold text-foreground mb-3">Groups</h3>
            <div className="flex flex-col gap-2">
              {['Developers', 'Artists', 'Trading Hub'].map((g, i) => (
                <div key={g} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="size-9 rounded-lg shrink-0" style={{ background: grad(i + 5) }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{g}</p>
                    <p className="text-[11px] text-muted-foreground">{(1240 - i * 400).toLocaleString()} members</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="text-[15px] font-bold text-foreground mb-3">Badges</h3>
            <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {BADGES.map((b) => (
                <div key={b.name} className="shrink-0 w-[80px] cursor-pointer">
                  <div className="w-full aspect-square rounded-xl" style={{ background: grad(b.index) }} />
                  <p className="text-[11px] text-muted-foreground text-center mt-1.5 truncate">{b.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Favorites */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="text-[15px] font-bold text-foreground mb-3">Favorites</h3>
            <div className="grid grid-cols-3 gap-2.5">
              {FAVORITES.map((f) => (
                <div key={f.name} className="cursor-pointer group">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden" style={{ background: grad(f.index) }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white/20 text-[10px] font-bold">{f.name}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1.5 truncate">{f.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Experiences */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-foreground">Experiences</h3>
              <div className="flex items-center gap-1">
                <button onClick={() => setExpView('list')} className={cn("size-7 rounded-md flex items-center justify-center cursor-pointer border-none", expView === 'list' ? "bg-secondary" : "bg-transparent")}>
                  <LayoutList className="size-3.5 text-muted-foreground" />
                </button>
                <button onClick={() => setExpView('grid')} className={cn("size-7 rounded-md flex items-center justify-center cursor-pointer border-none", expView === 'grid' ? "bg-secondary" : "bg-transparent")}>
                  <LayoutGrid className="size-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {CREATIONS.map((game) => (
              <div key={game.name} className="rounded-xl border border-border overflow-hidden">
                <div className="flex items-center justify-between px-3.5 py-2 bg-secondary/40 border-b border-border">
                  <span className="text-[13px] font-medium text-foreground">{game.name}</span>
                  <MoreHorizontal className="size-3.5 text-muted-foreground" />
                </div>
                <div className="relative aspect-[16/9]" style={{ background: grad(game.index) }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/15 text-3xl font-black tracking-wider">POLYTORIA</span>
                  </div>
                  <div className="absolute bottom-2 right-2 w-16 h-12 rounded-md border border-white/10 shadow-lg" style={{ background: grad(game.index + 2) }} />
                </div>
                <div className="p-4">
                  <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed">{game.desc}</p>
                  <div className="flex items-center justify-between">
                    <button className="px-6 py-2 rounded-md bg-foreground text-background text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer border-none">Play</button>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-foreground font-semibold text-[13px]">{game.players}</p>
                        <p className="text-[11px] text-muted-foreground">Playing</p>
                      </div>
                      <div className="text-center">
                        <p className="text-foreground font-semibold text-[13px]">{game.visits.toLocaleString()}</p>
                        <p className="text-[11px] text-muted-foreground">Visits</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Friends */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-bold text-foreground">Friends <span className="text-muted-foreground font-normal">(45)</span></h3>
              <span className="text-[13px] text-muted-foreground hover:underline cursor-pointer flex items-center gap-1">
                See All <ChevronRight className="size-3.5" />
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {FRIENDS.map((f) => (
                <div key={f.name} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="relative shrink-0">
                    <div className="size-10 rounded-full" style={{ background: grad(f.index) }} />
                    <div className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-green flex items-center justify-center border-2 border-card">
                      <Shield className="size-2 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-foreground truncate">{f.name}</p>
                    {f.sub && <p className="text-[10px] text-muted-foreground truncate">{f.sub}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
