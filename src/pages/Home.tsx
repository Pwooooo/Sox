import { useState } from 'react'
import { Play } from 'lucide-react'
import { FriendsHeader } from '@/components/FriendsHeader'
import { GameSection } from '@/components/GameSection'
import { CONTINUE_PLAYING_GAMES, RECOMMENDED_FOR_YOU_GAMES } from '@/data/homeGames'
import { GameItem } from '@/components/GameCard'

export function Home() {
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null)

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-8 max-w-[1550px]">
      {/* 1. Friends & Greeting at the top matching Screenshot 5 */}
      <FriendsHeader username="Sky" />

      {/* 2. Continue Playing section matching Screenshot 2 */}
      <GameSection
        title="Continue Playing"
        hasChevronTitle={false}
        games={CONTINUE_PLAYING_GAMES}
        onSelectGame={(g) => setSelectedGame(g)}
      />

      {/* 3. Recommended For You section matching Screenshot 2 */}
      <GameSection
        title="Recommended For You"
        hasChevronTitle={true}
        games={RECOMMENDED_FOR_YOU_GAMES}
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
              {selectedGame.thumbnail ? (
                <img
                  src={selectedGame.thumbnail}
                  alt={selectedGame.name}
                  className="size-20 rounded-xl object-cover border border-white/10 shrink-0"
                />
              ) : (
                <div className="size-20 rounded-xl bg-[#161616] border border-white/10 flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-white/50">✦</span>
                </div>
              )}
              <div className="flex flex-col gap-1 min-w-0">
                <h3 className="text-base font-bold text-white leading-snug">
                  {selectedGame.name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-white/60">
                  <span>☺ {typeof selectedGame.likePercent === 'number' ? `${selectedGame.likePercent}%` : selectedGame.likePercent}</span>
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
