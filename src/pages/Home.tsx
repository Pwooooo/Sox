import { useState } from 'react'
import { Sparkles, Users, Play, ChevronRight } from 'lucide-react'
import { GameSection } from '@/components/GameSection'
import { TOP_TRENDING_GAMES, UP_AND_COMING_GAMES } from '@/data/homeGames'
import { GameItem } from '@/components/GameCard'
import { cn } from '@/lib/utils'

const QUICK_FILTERS = [
  'All',
  'Trending',
  'Up-and-Coming',
  'Multiplayer',
  'Ragdoll',
  'Action',
  'Simulator',
  'Adventure',
]

const ONLINE_FRIENDS = [
  { name: 'Nexus', game: 'Ragdoll Physics 🩸', avatarColor: '#3b82f6' },
  { name: 'Vortex', game: 'Build a Bridge', avatarColor: '#10b981' },
  { name: 'Luna', game: 'Sweep The Moon 🌖', avatarColor: '#a855f7' },
  { name: 'Cipher', game: 'Survive Your Ideas', avatarColor: '#f59e0b' },
]

export function Home() {
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null)

  return (
    <div className="p-4 md:p-6 lg:p-7 flex flex-col gap-7">
      {/* User Greeting & Online Friends Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Welcome back, Pwo
          </h1>
          <p className="text-xs text-white/50 mt-0.5">
            Discover what your friends and the community are playing today.
          </p>
        </div>

        {/* Online Friends Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {ONLINE_FRIENDS.map((f) => (
            <div
              key={f.name}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#141414] border border-white/[0.06] hover:border-white/20 transition-all shrink-0 cursor-pointer"
            >
              <div
                className="size-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                style={{ backgroundColor: f.avatarColor }}
              >
                {f.name[0]}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-white leading-tight">{f.name}</span>
                <span className="text-[9px] text-white/40 truncate max-w-[80px]">{f.game}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {QUICK_FILTERS.map((filter) => {
          const active = selectedFilter === filter
          return (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border shrink-0",
                active
                  ? "bg-white text-black border-white shadow-sm font-bold"
                  : "bg-[#141414] text-white/60 hover:text-white hover:bg-[#1a1a1a] border-white/[0.08]"
              )}
            >
              {filter}
            </button>
          )
        })}
      </div>

      {/* Section 1: Top Trending (Matches user screenshot) */}
      <GameSection
        title="Top Trending"
        infoText="Sorted by highest active player count and community upvote velocity."
        games={TOP_TRENDING_GAMES}
        onSelectGame={(g) => setSelectedGame(g)}
      />

      {/* Section 2: Up-and-Coming (Matches user screenshot) */}
      <GameSection
        title="Up-and-Coming"
        infoText="Fast-rising experiences gaining momentum across the community."
        games={UP_AND_COMING_GAMES}
        onSelectGame={(g) => setSelectedGame(g)}
      />

      {/* Game Quick View / Play Modal */}
      {selectedGame && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedGame(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-[#111111] border border-white/[0.1] p-6 flex flex-col gap-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-4 items-center">
              <img
                src={selectedGame.thumbnail}
                alt={selectedGame.name}
                className="size-20 rounded-xl object-cover border border-white/10 shrink-0"
              />
              <div className="flex flex-col gap-1 min-w-0">
                <h3 className="text-base font-bold text-white leading-snug">
                  {selectedGame.name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-white/60">
                  <span>👍 {selectedGame.likePercent}%</span>
                  <span>👤 {selectedGame.players} Playing</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => alert(`Launching ${selectedGame.name}...`)}
                className="flex-1 py-2.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border-none shadow-lg"
              >
                <Play className="size-4 fill-current ml-0.5" />
                Play Now
              </button>
              <button
                onClick={() => setSelectedGame(null)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-colors cursor-pointer border-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
