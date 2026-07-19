import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  MoreHorizontal,
  Pencil,
  LayoutList,
  LayoutGrid,
  ChevronRight,
  AlertCircle,
  Shield,
} from 'lucide-react'

function gradientFor(i: number) {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
    'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    'linear-gradient(135deg, #d20a2e 0%, #4a0a1e 100%)',
    'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
  ]
  return gradients[i % gradients.length]
}

const FRIENDS = [
  { name: 'Nick_fromKy...', subtitle: 'New Cart | Ca...', index: 0 },
  { name: 'VersusPro', subtitle: 'Anime Vanguard...', index: 1 },
  { name: 'Wyky0r_particle', subtitle: '[SEASON 3] Ope...', index: 2 },
  { name: 'YepimRalph', subtitle: '', index: 3 },
  { name: 'DarkSlayer', subtitle: 'Builder | Creator', index: 4 },
  { name: 'PixelQueen', subtitle: 'Artist', index: 5 },
  { name: 'BlockMaster', subtitle: 'Game Dev', index: 6 },
  { name: 'StarPlayer', subtitle: 'Pro Gamer', index: 7 },
]

const BADGES = [
  { name: 'Welcome', index: 0 },
  { name: 'B1G BALANCE', index: 1 },
  { name: 'START', index: 2 },
]

export function Profile() {
  const [experiencesView, setExperiencesView] = useState<'list' | 'grid'>('list')

  return (
    <div className="max-w-[1100px] mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start gap-6 mb-4">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div
              className="size-28 md:size-32 rounded-full shrink-0"
              style={{ background: gradientFor(8) }}
            />
            <div className="absolute -bottom-0.5 -right-0.5 size-7 rounded-full bg-green flex items-center justify-center border-4 border-background">
              <div className="size-2.5 rounded-full bg-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Sky</h1>
            <p className="text-muted-foreground text-sm">@sky</p>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex items-center gap-1 bg-secondary/80 px-2.5 py-1 rounded-full text-xs font-medium">
                <img src="/currency.png" alt="" className="size-3.5" />
                0
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 md:ml-auto">
          <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors cursor-pointer border-none">
            <Pencil className="size-3.5" />
            Edit Profile
          </button>
          <button className="size-9 rounded-md bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-secondary/80 transition-colors cursor-pointer border-none">
            <MoreHorizontal className="size-4" />
          </button>
        </div>
      </div>

      {/* Stats pills */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-muted-foreground hover:underline cursor-pointer">
          <strong className="text-foreground font-semibold">45</strong> Friends
        </span>
        <span className="text-sm text-muted-foreground hover:underline cursor-pointer">
          <strong className="text-foreground font-semibold">4</strong> Followers
        </span>
        <span className="text-sm text-muted-foreground hover:underline cursor-pointer">
          <strong className="text-foreground font-semibold">0</strong> Following
        </span>
      </div>

      {/* Two column layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          {/* About */}
          <div>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              About
              <Pencil className="size-3.5 text-muted-foreground cursor-pointer hover:text-foreground" />
            </h2>
            <div className="bg-card rounded-xl border border-border min-h-[180px] p-4 flex flex-col justify-end">
              <p className="text-sm text-muted-foreground">Pwo Luduvian</p>
            </div>
          </div>

          {/* Roblox Badges */}
          <div>
            <h2 className="text-lg font-bold mb-3">Roblox Badges</h2>
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-center">
                <p className="text-sm text-muted-foreground">This user has no Roblox Badges</p>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div>
            <h2 className="text-lg font-bold mb-3">Badges</h2>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {BADGES.map((badge) => (
                <div key={badge.name} className="shrink-0 w-[120px] cursor-pointer group">
                  <div className="aspect-square rounded-xl overflow-hidden border border-border" style={{ background: gradientFor(badge.index) }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm text-center px-2 drop-shadow-lg">{badge.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          {/* Experiences */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold">Experiences</h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setExperiencesView('list')}
                  className={cn(
                    "size-7 rounded-md flex items-center justify-center cursor-pointer border-none transition-colors",
                    experiencesView === 'list' ? "bg-secondary" : "bg-transparent"
                  )}
                >
                  <LayoutList className="size-3.5 text-muted-foreground" />
                </button>
                <button
                  onClick={() => setExperiencesView('grid')}
                  className={cn(
                    "size-7 rounded-md flex items-center justify-center cursor-pointer border-none transition-colors",
                    experiencesView === 'grid' ? "bg-secondary" : "bg-transparent"
                  )}
                >
                  <LayoutGrid className="size-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Game card - list view */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-secondary/50 border-b border-border">
                <span className="text-sm font-medium text-foreground">Sky's Place</span>
                <MoreHorizontal className="size-4 text-muted-foreground cursor-pointer" />
              </div>
              <div className="relative aspect-[16/9] overflow-hidden" style={{ background: gradientFor(0) }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/20 text-4xl font-black tracking-wider">POLYTORIA</span>
                </div>
                <div className="absolute bottom-3 right-3 w-20 h-14 rounded-lg overflow-hidden border-2 border-white/20 shadow-xl" style={{ background: gradientFor(2) }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white/50 text-[8px] font-bold">THUMB</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  This is your very first creation. Check it out, then make it your own!
                </p>
                <div className="flex items-center justify-between">
                  <button className="px-8 py-2.5 rounded-md bg-foreground text-background text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer border-none">
                    Play
                  </button>
                  <div className="flex items-center gap-8 text-sm">
                    <div className="text-center">
                      <p className="text-foreground font-semibold">0</p>
                      <p className="text-xs text-muted-foreground">Playing</p>
                    </div>
                    <div className="text-center">
                      <p className="text-foreground font-semibold">0</p>
                      <p className="text-xs text-muted-foreground">Visits</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Friends */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold">Friends <span className="text-muted-foreground font-normal">(45)</span></h2>
              <span className="text-sm text-muted-foreground hover:underline cursor-pointer flex items-center gap-1">
                See All <ChevronRight className="size-3.5" />
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {FRIENDS.map((friend) => (
                <div
                  key={friend.name}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border hover:bg-secondary/30 transition-colors cursor-pointer"
                >
                  <div className="relative">
                    <div
                      className="size-16 rounded-full"
                      style={{ background: gradientFor(friend.index) }}
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 size-5 rounded-full bg-green flex items-center justify-center border-2 border-card">
                      <Shield className="size-2.5 text-white" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-foreground truncate w-full">{friend.name}</p>
                    {friend.subtitle && (
                      <p className="text-[10px] text-muted-foreground truncate w-full">{friend.subtitle}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Favorites */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold">Favorites</h2>
              <span className="text-sm text-muted-foreground hover:underline cursor-pointer flex items-center gap-1">
                See All <ChevronRight className="size-3.5" />
              </span>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No favorites yet.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
