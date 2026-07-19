import { cn } from '@/lib/utils'
import { ThumbsUp, Users } from 'lucide-react'

const CATEGORIES = [
  'Most Players',
  'Popular',
  'Recommended',
  'New',
  'Rising',
  'Favorites',
  'Featured',
  'Top Rated',
]

const games = Array.from({ length: 8 }, (_, i) => ({
  name: `Placeholder Game ${i + 1}`,
  players: Math.floor(Math.random() * 500) + 1,
  likes: Math.floor(Math.random() * 5000) + 100,
}))

export function Home() {
  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Discover</h1>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat}
            className={cn(
              "shrink-0 px-4 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer border-none",
              i === 0
                ? "bg-accent text-accent-foreground"
                : "bg-transparent text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-8">
        {CATEGORIES.map((category) => (
          <section key={category}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold">{category}</h2>
              <button className="text-sm text-primary font-medium hover:underline cursor-pointer border-none bg-transparent">
                See All
              </button>
            </div>
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {games.map((game) => (
                <div key={game.name} className="group cursor-pointer w-[180px] shrink-0">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-card border border-border">
                    <div className="size-full bg-gradient-to-br from-card via-accent/50 to-card group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 rounded-md px-2 py-0.5">
                      <span className="size-1.5 rounded-full bg-green" />
                      <span className="text-[11px] font-medium text-white">{game.players}</span>
                    </div>
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 rounded-md px-2 py-0.5">
                      <ThumbsUp className="size-3 text-white" />
                      <span className="text-[11px] font-medium text-white">{game.likes.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="mt-2 px-0.5">
                    <p className="text-sm font-medium text-foreground truncate leading-tight">{game.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="size-3 text-muted-foreground" />
                        <span className="text-[11px] text-muted-foreground">{game.likes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="size-3 text-muted-foreground" />
                        <span className="text-[11px] text-muted-foreground">{game.players.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
