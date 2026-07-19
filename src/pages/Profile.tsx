import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  MoreHorizontal,
  Pencil,
  ExternalLink,
  LayoutGrid,
  LayoutList,
} from 'lucide-react'

const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
  'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  'linear-gradient(135deg, #d20a2e 0%, #1a0a1e 100%)',
  'linear-gradient(135deg, #f5576c 0%, #ff6a88 100%)',
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
]

function gradientFor(index: number) {
  return GRADIENTS[index % GRADIENTS.length]
}

const FRIENDS = Array.from({ length: 9 }, (_, i) => ({
  name: `User${i + 1}`,
  index: i,
}))

const BADGES = [
  { name: 'Veteran', icon: '🛡️', index: 0 },
  { name: 'Friendship', icon: '🤝', index: 1 },
  { name: 'True Heart', icon: '❤️', index: 2 },
  { name: 'Altitude', icon: '🪂', index: 3 },
  { name: 'Combat Initiation', icon: '⚔️', index: 4 },
  { name: 'Warlord', icon: '🗡️', index: 5 },
]

const CREATIONS = [
  { name: "Sky's Place", players: 0, visits: 0, index: 0 },
  { name: 'Obby Challenge', players: 12, visits: 483, index: 1 },
  { name: 'Building Tycoon', players: 5, visits: 210, index: 2 },
]

export function Profile() {
  const avatarGradient = useMemo(() => gradientFor(99), [])

  return (
    <div className="max-w-[1100px] mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
        {/* Avatar */}
        <div
          className="size-28 md:size-32 rounded-full shrink-0 border-4 border-card shadow-lg"
          style={{ background: avatarGradient }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Sky</h1>
              <p className="text-muted-foreground text-sm">@sky</p>
              <div className="flex items-center gap-1.5 mt-2">
                <div className="flex items-center gap-1 bg-secondary px-2.5 py-1 rounded-full text-xs font-medium">
                  <img src="/currency.png" alt="" className="size-3.5" />
                  0
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors cursor-pointer border-none">
                <Pencil className="size-3.5" />
                Edit Profile
              </button>
              <button className="size-8 rounded-md bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-secondary/80 transition-colors cursor-pointer border-none">
                <MoreHorizontal className="size-4" />
              </button>
            </div>
          </div>
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
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Pwo Luduvian</p>
            </div>
          </div>

          {/* Roblox Badges */}
          <div>
            <h2 className="text-lg font-bold mb-3">Roblox Badges</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-3">
              {BADGES.map((badge) => (
                <div
                  key={badge.name}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <div
                    className="size-14 rounded-full flex items-center justify-center text-2xl"
                    style={{ background: gradientFor(badge.index) }}
                  >
                    {badge.icon}
                  </div>
                  <span className="text-[11px] text-muted-foreground text-center leading-tight">{badge.name}</span>
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
                <button className="size-7 rounded-md bg-secondary flex items-center justify-center cursor-pointer border-none">
                  <LayoutList className="size-3.5 text-muted-foreground" />
                </button>
                <button className="size-7 rounded-md bg-secondary flex items-center justify-center cursor-pointer border-none">
                  <LayoutGrid className="size-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {CREATIONS.map((game) => (
                <div key={game.name} className="bg-card rounded-xl border border-border overflow-hidden cursor-pointer group">
                  {/* Game name bar */}
                  <div className="flex items-center justify-between px-4 py-2 bg-secondary/50 border-b border-border">
                    <span className="text-sm font-medium text-foreground">{game.name}</span>
                    <MoreHorizontal className="size-4 text-muted-foreground" />
                  </div>
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/9] overflow-hidden" style={{ background: gradientFor(game.index) }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white/80 text-3xl font-bold opacity-30">POLYTORIA</span>
                    </div>
                    {/* Small thumbnail inset */}
                    <div className="absolute bottom-2 right-2 w-16 h-12 rounded-md overflow-hidden border-2 border-white/20 shadow-lg" style={{ background: gradientFor(game.index + 3) }}>
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white/60 text-[8px] font-bold">THUMB</span>
                      </div>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      This is your very first creation. Check it out, then make it your own!
                    </p>
                    <div className="flex items-center justify-between">
                      <button className="px-6 py-2 rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer border-none">
                        Play
                      </button>
                      <div className="flex items-center gap-6 text-sm">
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
          </div>

          {/* Friends preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold">Friends</h2>
              <span className="text-sm text-muted-foreground">45</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
              {FRIENDS.map((friend) => (
                <div
                  key={friend.name}
                  className="flex items-center gap-3 p-2 rounded-xl bg-card border border-border hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <div
                    className="size-10 rounded-full shrink-0"
                    style={{ background: gradientFor(friend.index) }}
                  />
                  <span className="text-sm font-medium text-foreground truncate">{friend.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
