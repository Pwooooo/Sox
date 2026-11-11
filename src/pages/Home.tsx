import { useState } from 'react'
import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react'
import { FriendsHeader } from '@/components/FriendsHeader'
import { GameCard } from '@/components/GameCard'
import { GameDetailModal } from '@/components/GameDetailModal'
import { RECOMMENDED_GAMES, CONTINUE_GAMES, GameDetailData } from '@/data/homeGames'

export function Home() {
  const [selectedGame, setSelectedGame] = useState<GameDetailData | null>(null)

  return (
    <div className="p-4 md:p-6 lg:p-7 flex flex-col gap-8 max-w-[1700px]">
      {/* 1. Friends & Greeting at top */}
      <FriendsHeader username="Sky" />

      {/* 2. Recommended For You: 16:9 Cards matching Screenshot 1 */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-base md:text-lg font-bold text-white tracking-tight">
            Recommended For You
          </h2>
        </div>

        {/* 6-Column Responsive Grid with 16:9 thumbnails */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 md:gap-4">
          {RECOMMENDED_GAMES.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              aspect="16/9"
              onClick={() => setSelectedGame(game)}
            />
          ))}
        </div>
      </section>

      {/* 3. Continue → Section: 1:1 Square Thumbnails matching Screenshot 1 */}
      <section className="flex flex-col gap-3 group/continue">
        <div className="flex items-center justify-between px-0.5">
          <button className="flex items-center gap-1.5 text-base md:text-lg font-bold text-white tracking-tight hover:text-white/80 transition-colors cursor-pointer border-none bg-transparent group/title">
            <span>Continue</span>
            <ArrowRight className="size-4 text-white/70 group-hover/title:translate-x-0.5 group-hover/title:text-white transition-all" />
          </button>
        </div>

        {/* Horizontal Row with 1:1 Square Cards */}
        <div
          className="flex items-start gap-3 md:gap-3.5 overflow-x-auto no-scrollbar pb-2 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CONTINUE_GAMES.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              aspect="1/1"
              onClick={() => setSelectedGame(game)}
            />
          ))}
        </div>
      </section>

      {/* 4. Roblox Game Detail Modal matching Screenshot 2 */}
      {selectedGame && (
        <GameDetailModal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
        />
      )}
    </div>
  )
}
