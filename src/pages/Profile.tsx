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
  ExternalLink,
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
  { name: 'Nick_fromKy...', sub: 'New Cart | Ca...', index: 0 },
  { name: 'VersusPro', sub: 'Anime Vanguard...', index: 1 },
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
  { name: 'OG Player', index: 3 },
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
    <div className="w-full p-4 md:p-6 flex flex-col gap-4">
      {/* Header — Roblox style with Luduvo dark UI */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative shrink-0">
          <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-full" style={{ background: grad(4) }} />
          <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-green flex items-center justify-center border-[3px] border-background">
            <div className="size-2 rounded-full bg-white" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Sky</h1>
              <p className="text-muted-foreground text-sm">@sky</p>
              <div className="flex items-center gap-1.5 mt-2 bg-secondary/60 px-2.5 py-1 rounded-full w-fit text-xs font-medium">
                <img src="/currency.png" alt="" className="size-3.5" />
                <span className="text-foreground">0</span>
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
        </div>
      </div>

      {/* Stats pills — Roblox style */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground hover:underline cursor-pointer"><strong className="text-foreground font-semibold">0</strong> Friends</span>
        <span className="text-sm text-muted-foreground hover:underline cursor-pointer"><strong className="text-foreground font-semibold">0</strong> Followers</span>
        <span className="text-sm text-muted-foreground hover:underline cursor-pointer"><strong className="text-foreground font-semibold">0</strong> Following</span>
      </div>

      {/* Two-column Roblox layout */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left column */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* About */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
              About <Pencil className="size-3.5 text-muted-foreground cursor-pointer hover:text-foreground" />
            </h2>
            <div className="bg-card rounded-xl border border-border min-h-[200px] p-4 flex flex-col justify-end">
              <p className="text-sm text-muted-foreground">Pwo Luduvian</p>
            </div>
          </div>

          {/* Currently Wearing */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-2">Currently Wearing</h2>
            <div className="bg-card rounded-xl border border-border p-4 flex items-start gap-4">
              <div className="w-[150px] h-[180px] rounded-xl shrink-0 border border-border" style={{ background: grad(4) }} />
              <div className="flex-1 min-w-0">
                <div className="grid grid-cols-4 gap-2.5">
                  {visible.map((item) => (
                    <div key={item.index} className="flex flex-col items-center gap-1.5">
                      <div className="w-full aspect-square rounded-xl" style={{ background: grad(item.index) }} />
                      <span className="text-[11px] text-muted-foreground text-center leading-tight">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              {WEARING_ITEMS.length > 4 && (
                <div className="flex items-center gap-0.5 shrink-0">
                  <button onClick={() => setWearingIndex(Math.max(0, wearingIndex - 1))} disabled={wearingIndex === 0} className="size-7 rounded-md flex items-center justify-center disabled:opacity-25 hover:bg-secondary transition-colors cursor-pointer border-none bg-transparent">
                    <ChevronLeft className="size-4 text-muted-foreground" />
                  </button>
                  <button onClick={() => setWearingIndex(Math.min(WEARING_ITEMS.length - 4, wearingIndex + 1))} disabled={wearingIndex >= WEARING_ITEMS.length - 4} className="size-7 rounded-md flex items-center justify-center disabled:opacity-25 hover:bg-secondary transition-colors cursor-pointer border-none bg-transparent">
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Roblox Badges */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-2">Roblox Badges</h2>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground text-center">This user has no Roblox Badges</p>
            </div>
          </div>

          {/* Badges */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-2">Badges</h2>
            <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {BADGES.map((b) => (
                <div key={b.name} className="shrink-0 w-[90px] cursor-pointer group">
                  <div className="w-full aspect-square rounded-xl group-hover:scale-105 transition-transform" style={{ background: grad(b.index) }} />
                  <p className="text-[11px] text-muted-foreground text-center mt-1.5 truncate">{b.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Experiences */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-foreground">Experiences</h2>
              <div className="flex items-center gap-0.5">
                <button onClick={() => setExpView('list')} className={cn("size-7 rounded-md flex items-center justify-center cursor-pointer border-none", expView === 'list' ? "bg-secondary" : "bg-transparent")}>
                  <LayoutList className="size-3.5 text-muted-foreground" />
                </button>
                <button onClick={() => setExpView('grid')} className={cn("size-7 rounded-md flex items-center justify-center cursor-pointer border-none", expView === 'grid' ? "bg-secondary" : "bg-transparent")}>
                  <LayoutGrid className="size-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {CREATIONS.map((game) => (
              <div key={game.name} className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-secondary/40 border-b border-border">
                  <span className="text-sm font-medium text-foreground">{game.name}</span>
                  <MoreHorizontal className="size-4 text-muted-foreground cursor-pointer" />
                </div>
                <div className="relative aspect-[16/9]" style={{ background: grad(game.index) }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/15 text-3xl font-black tracking-wider">POLYTORIA</span>
                  </div>
                  <div className="absolute bottom-2 right-2 w-16 h-12 rounded-md border border-white/10 shadow-lg" style={{ background: grad(game.index + 2) }} />
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{game.desc}</p>
                  <div className="flex items-center justify-between">
                    <button className="px-8 py-2.5 rounded-md bg-foreground text-background text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer border-none">Play</button>
                    <div className="flex items-center gap-8 text-sm">
                      <div className="text-center">
                        <p className="text-foreground font-semibold">{game.players}</p>
                        <p className="text-xs text-muted-foreground">Playing</p>
                      </div>
                      <div className="text-center">
                        <p className="text-foreground font-semibold">{game.visits.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Visits</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Friends */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-foreground">Friends <span className="text-muted-foreground font-normal">(45)</span></h2>
              <span className="text-sm text-muted-foreground hover:underline cursor-pointer flex items-center gap-1">See All <ExternalLink className="size-3" /></span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {FRIENDS.map((f) => (
                <div key={f.name} className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-card border border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="relative">
                    <div className="size-14 rounded-full" style={{ background: grad(f.index) }} />
                    <div className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-green flex items-center justify-center border-2 border-card">
                      <Shield className="size-2 text-white" />
                    </div>
                  </div>
                  <p className="text-[11px] font-medium text-foreground text-center truncate w-full">{f.name}</p>
                  {f.sub && <p className="text-[9px] text-muted-foreground text-center truncate w-full">{f.sub}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
