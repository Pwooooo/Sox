import { useState, useMemo } from 'react'
import { Search, Flame, Trophy, Sparkles, Swords, Compass, Ghost, Shield, SlidersHorizontal } from 'lucide-react'
import { GameCard } from '@/components/GameCard'
import { GameDetailModal } from '@/components/GameDetailModal'
import { RECOMMENDED_GAMES, CONTINUE_GAMES, GameDetailData } from '@/data/homeGames'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { id: 'all', label: 'All Experiences', icon: Sparkles },
  { id: 'popular', label: 'Popular', icon: Flame },
  { id: 'top_rated', label: 'Top Rated', icon: Trophy },
  { id: 'fighting', label: 'Fighting & PvP', icon: Swords },
  { id: 'adventure', label: 'Adventure', icon: Compass },
  { id: 'survival', label: 'Survival', icon: Shield },
  { id: 'horror', label: 'Horror', icon: Ghost },
]

export function Games() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGame, setSelectedGame] = useState<GameDetailData | null>(null)

  // Combine and deduplicate games
  const allGames = useMemo(() => {
    const list: GameDetailData[] = [...RECOMMENDED_GAMES, ...CONTINUE_GAMES]
    const seen = new Set<string>()
    return list.filter((g) => {
      if (seen.has(g.id)) return false
      seen.add(g.id)
      return true
    })
  }, [])

  const filteredGames = useMemo(() => {
    return allGames.filter((game) => {
      const matchesSearch =
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (game.genre && game.genre.toLowerCase().includes(searchQuery.toLowerCase()))

      if (!matchesSearch) return false

      if (selectedCategory === 'popular') {
        return (
          game.players.includes('K') ||
          parseInt(game.players.replace(/[^0-9]/g, '')) > 5000
        )
      }
      if (selectedCategory === 'top_rated') {
        return game.likePercent >= 85
      }
      if (selectedCategory === 'fighting') {
        return (
          game.genre?.toLowerCase().includes('action') ||
          game.genre?.toLowerCase().includes('battle') ||
          game.name.toLowerCase().includes('pvp') ||
          game.name.toLowerCase().includes('fight') ||
          game.name.toLowerCase().includes('strongest')
        )
      }
      if (selectedCategory === 'adventure') {
        return (
          game.genre?.toLowerCase().includes('adventure') ||
          game.genre?.toLowerCase().includes('rpg') ||
          game.name.toLowerCase().includes('extinction') ||
          game.name.toLowerCase().includes('tundra')
        )
      }
      if (selectedCategory === 'survival') {
        return (
          game.genre?.toLowerCase().includes('survival') ||
          game.name.toLowerCase().includes('survive') ||
          game.name.toLowerCase().includes('lava') ||
          game.name.toLowerCase().includes('zombie')
        )
      }
      if (selectedCategory === 'horror') {
        return (
          game.genre?.toLowerCase().includes('horror') ||
          game.name.toLowerCase().includes('music') ||
          game.name.toLowerCase().includes('zombie') ||
          game.name.toLowerCase().includes('where')
        )
      }
      return true
    })
  }, [allGames, searchQuery, selectedCategory])

  return (
    <div className="p-4 md:p-6 lg:p-7 flex flex-col gap-6 max-w-[1700px]">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Discover Experiences
          </h1>
          <p className="text-xs md:text-sm text-white/50 mt-0.5">
            Explore millions of immersive community-built games on Novelo
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
            <input
              type="text"
              placeholder="Search experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3.5 rounded-xl bg-[#141414]/90 border border-white/10 text-xs md:text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills (Soft, semi-transparent highlight letting background drift through) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1" style={{ scrollbarWidth: 'none' }}>
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          const isActive = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "group flex items-center gap-2 px-3.5 h-9 rounded-[10px] text-xs font-semibold shrink-0 cursor-pointer transition-all duration-150 border-none outline-none select-none active:scale-[0.97]",
                isActive
                  ? "bg-white/[0.08] backdrop-blur-sm text-white font-bold shadow-xs"
                  : "bg-transparent text-white/50 hover:text-white hover:bg-white/[0.03]"
              )}
            >
              <Icon
                className={cn(
                  "size-3.5 shrink-0 transition-transform duration-150",
                  isActive
                    ? "fill-current text-white scale-105"
                    : "fill-none text-white/50 group-hover:scale-105 group-hover:text-white"
                )}
              />
              <span className="tracking-tight">{cat.label}</span>
            </button>
          )
        })}
      </div>

      {/* Games Count */}
      <div className="flex items-center justify-between text-xs text-white/40 px-0.5">
        <span>Showing {filteredGames.length} experiences</span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-white/60 hover:text-white underline cursor-pointer bg-transparent border-none"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Games Grid (16:9 widescreen cards matching Roblox) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 md:gap-4">
        {filteredGames.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            aspect="16/9"
            onClick={() => setSelectedGame(game)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredGames.length === 0 && (
        <div className="py-16 flex flex-col items-center justify-center text-center gap-3">
          <div className="size-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
            <Search className="size-8 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-bold text-white">No experiences found</h3>
          <p className="text-xs text-white/50 max-w-sm">
            We couldn't find any games matching "{searchQuery}". Try searching with different keywords.
          </p>
        </div>
      )}

      {/* Roblox Game Detail Modal */}
      {selectedGame && (
        <GameDetailModal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
        />
      )}
    </div>
  )
}
