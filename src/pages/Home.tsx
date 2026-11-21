import { useState, useEffect } from 'react'
import { ArrowRight, Gamepad2 } from 'lucide-react'
import { FriendsHeader } from '@/components/FriendsHeader'
import { GameCard } from '@/components/GameCard'
import { GameDetailModal } from '@/components/GameDetailModal'
import type { GameDetailData } from '@/data/homeGames'

export function Home() {
  const [selectedGame, setSelectedGame] = useState<GameDetailData | null>(null)
  const [games, setGames] = useState<GameDetailData[]>([])

  useEffect(() => {
    let cancelled = false
    const mapProjects = (list: any[]): GameDetailData[] =>
      list
        .filter((p: any) => !p.archived && p.privacy === 'Public')
        .map((p: any) => ({
          id: p.id,
          name: p.name || 'Untitled Experience',
          creator: 'Sky',
          thumbnail: p.thumbnail || '',
          likePercent: 100,
          players: '0',
          visitsCount: '0',
          genre: p.genre || 'All',
          description: p.description || 'Created in Novelo Studio.',
          serverSize: 20,
        }))

    const load = async () => {
      try {
        if ((window as any).__TAURI_INTERNALS__) {
          const { invoke } = await import('@tauri-apps/api/core')
          const raw = await invoke<string>('load_studio_projects')
          if (!cancelled && raw) {
            const parsed = JSON.parse(raw)
            if (Array.isArray(parsed)) {
              setGames(mapProjects(parsed))
              return
            }
          }
        }
      } catch {
        // Fallback to HTTP endpoint
      }
      try {
        const res = await fetch('/api/studio-projects')
        if (res.ok) {
          const list = await res.json()
          if (!cancelled && Array.isArray(list)) {
            setGames(mapProjects(list))
          }
        }
      } catch {
        // Ignore offline fetch error
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="p-4 md:p-6 lg:p-7 flex flex-col gap-8 max-w-[1700px]">
      {/* 1. Friends & Greeting at top */}
      <FriendsHeader username="Sky" />

      {/* 2. Recommended For You */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-base md:text-lg font-bold text-white tracking-tight">
            Recommended For You
          </h2>
        </div>

        {games.length === 0 ? (
          <div className="py-12 rounded-[10px] bg-white/[0.02] border border-white/[0.06] flex flex-col items-center justify-center gap-2 text-center">
            <Gamepad2 className="size-8 text-white/30" />
            <span className="text-xs font-medium text-white/50">
              No public experiences yet. Publish a game from Novelo Studio!
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 md:gap-4">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                aspect="16/9"
                onClick={() => setSelectedGame(game)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 3. Continue */}
      <section className="flex flex-col gap-3 group/continue">
        <div className="flex items-center justify-between px-0.5">
          <button className="flex items-center gap-1.5 text-base md:text-lg font-bold text-white tracking-tight hover:text-white/80 transition-colors cursor-pointer border-none bg-transparent group/title">
            <span>Continue</span>
            <ArrowRight className="size-4 text-white/70 group-hover/title:translate-x-0.5 group-hover/title:text-white transition-all" />
          </button>
        </div>

        {games.length === 0 ? (
          <div className="py-8 rounded-[10px] bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-xs text-white/40">
            No recently played experiences.
          </div>
        ) : (
          <div
            className="flex items-start gap-3 md:gap-3.5 overflow-x-auto no-scrollbar pb-2 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                aspect="1/1"
                onClick={() => setSelectedGame(game)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Game Detail Modal */}
      {selectedGame && (
        <GameDetailModal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
        />
      )}
    </div>
  )
}
