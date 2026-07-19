const PLACEHOLDER_GAMES = [
  { name: 'Placeholder Game 1', players: 0 },
  { name: 'Placeholder Game 2', players: 0 },
  { name: 'Placeholder Game 3', players: 0 },
  { name: 'Placeholder Game 4', players: 0 },
  { name: 'Placeholder Game 5', players: 0 },
  { name: 'Placeholder Game 6', players: 0 },
  { name: 'Placeholder Game 7', players: 0 },
  { name: 'Placeholder Game 8', players: 0 },
  { name: 'Placeholder Game 9', players: 0 },
  { name: 'Placeholder Game 10', players: 0 },
  { name: 'Placeholder Game 11', players: 0 },
  { name: 'Placeholder Game 12', players: 0 },
  { name: 'Placeholder Game 13', players: 0 },
  { name: 'Placeholder Game 14', players: 0 },
  { name: 'Placeholder Game 15', players: 0 },
  { name: 'Placeholder Game 16', players: 0 },
  { name: 'Placeholder Game 17', players: 0 },
  { name: 'Placeholder Game 18', players: 0 },
  { name: 'Placeholder Game 19', players: 0 },
  { name: 'Placeholder Game 20', players: 0 },
]

export function Home() {
  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Discover</h1>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm font-medium rounded-lg bg-accent text-accent-foreground hover:bg-accent/80 transition-colors cursor-pointer border-none">
            All
          </button>
          <button className="px-3 py-1.5 text-sm font-medium rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors cursor-pointer border-none bg-transparent">
            Favorites
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {PLACEHOLDER_GAMES.map((game) => (
          <div
            key={game.name}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-card border border-border">
              <img
                src="/placeholder.webp"
                alt={game.name}
                className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {game.players > 0 && (
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 rounded-md px-2 py-0.5">
                  <span className="size-1.5 rounded-full bg-green" />
                  <span className="text-[11px] font-medium text-white">{game.players}</span>
                </div>
              )}
            </div>
            <div className="mt-2 px-0.5">
              <p className="text-sm font-medium text-foreground truncate leading-tight">{game.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">0 playing</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
