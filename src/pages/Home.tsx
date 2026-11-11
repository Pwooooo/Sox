import { useState } from 'react'
import { Play, Sparkles, TrendingUp, Flame, Compass, ChevronRight } from 'lucide-react'
import { GameCard, Game } from '@/components/GameCard'
import { HorizontalScroll } from '@/components/HorizontalScroll'
import { cn } from '@/lib/utils'

const CATEGORY_TABS = [
  'All',
  'Most Popular',
  'Trending',
  'Top Rated',
  'Recommended',
  'Action',
  'Adventure',
  'Roleplay',
  'Simulation',
  'Obby',
]

const FEATURED_HERO: Game = {
  id: 'feat-1',
  name: 'Blox Valley - Open World RP',
  creator: 'Novelo Studios',
  thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
  players: 4820,
  likes: 89400,
  likeRatio: 94,
  tags: ['Roleplay', 'Open World', 'Multiplayer'],
}

const POPULAR_GAMES: Game[] = [
  {
    id: 'game-1',
    name: 'Blade Arena: Infinite',
    creator: 'Apex Interactive',
    players: 3410,
    likes: 42100,
    likeRatio: 96,
    thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'game-2',
    name: 'Super Obby Kingdom',
    creator: 'CloudPlay',
    players: 2890,
    likes: 35600,
    likeRatio: 91,
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'game-3',
    name: 'Pet Empire Tycoon',
    creator: 'PawStudios',
    players: 1980,
    likes: 28300,
    likeRatio: 93,
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'game-4',
    name: 'Speed Run Velocity',
    creator: 'RushDevs',
    players: 1450,
    likes: 19800,
    likeRatio: 89,
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'game-5',
    name: 'Mystery Manor Murder',
    creator: 'DarkRoom Games',
    players: 1220,
    likes: 16700,
    likeRatio: 92,
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'game-6',
    name: 'Space Station Defense',
    creator: 'Nebula Corp',
    players: 940,
    likes: 14200,
    likeRatio: 88,
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=640&q=80',
  },
]

const RECOMMENDED_GAMES: Game[] = [
  {
    id: 'rec-1',
    name: 'Medieval Castle Simulator',
    creator: 'KingdomCraft',
    players: 890,
    likes: 11200,
    likeRatio: 95,
    thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'rec-2',
    name: 'Cyberpunk Neon City',
    creator: 'VaporSoft',
    players: 1780,
    likes: 22400,
    likeRatio: 90,
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'rec-3',
    name: 'Cart Ride into a Black Hole',
    creator: 'PhysicsLabs',
    players: 640,
    likes: 8900,
    likeRatio: 86,
    thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'rec-4',
    name: 'Tower of Difficulty',
    creator: 'SpikeWorks',
    players: 1150,
    likes: 15300,
    likeRatio: 87,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'rec-5',
    name: 'Island Survival Island',
    creator: 'Wilderness',
    players: 820,
    likes: 9800,
    likeRatio: 92,
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=640&q=80',
  },
]

const TOP_RATED_GAMES: Game[] = [
  {
    id: 'top-1',
    name: 'Paint & Chill Lounge',
    creator: 'Artisan',
    players: 530,
    likes: 19400,
    likeRatio: 98,
    thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'top-2',
    name: 'Grand High School Roleplay',
    creator: 'DreamTeam',
    players: 2150,
    likes: 31200,
    likeRatio: 97,
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'top-3',
    name: 'Dungeon Crawlers RPG',
    creator: 'MythicGames',
    players: 1420,
    likes: 21800,
    likeRatio: 96,
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=640&q=80',
  },
  {
    id: 'top-4',
    name: 'Aero Flight Simulator',
    creator: 'JetSet',
    players: 760,
    likes: 12500,
    likeRatio: 95,
    thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=640&q=80',
  },
]

export function Home() {
  const [selectedTab, setSelectedTab] = useState('All')

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-8">
      {/* Featured Hero Banner (Luduvo Style) */}
      <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111111] shadow-2xl">
        <div className="absolute inset-0">
          <img
            src={FEATURED_HERO.thumbnail}
            alt={FEATURED_HERO.name}
            className="size-full object-cover opacity-35 filter blur-[1px] transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 md:p-10 max-w-xl flex flex-col items-start gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white tracking-wide uppercase">
            <Sparkles className="size-3 text-amber-400" />
            Featured Experience
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {FEATURED_HERO.name}
          </h1>

          <p className="text-sm md:text-base text-white/70 line-clamp-2 leading-relaxed">
            Immerse yourself in the ultimate roleplay world. Own dream homes, customize supercars, and explore vibrant cities with friends.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 active:scale-95 transition-all shadow-lg cursor-pointer border-none">
              <Play className="size-4 fill-current ml-0.5" />
              Play Now
            </button>
            <button className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-all cursor-pointer">
              Details
            </button>
          </div>
        </div>
      </section>

      {/* Category Pills Bar */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {CATEGORY_TABS.map((tab) => {
          const active = selectedTab === tab
          return (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={cn(
                "shrink-0 px-4 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all cursor-pointer border",
                active
                  ? "bg-white text-black border-white shadow-sm"
                  : "bg-[#141414] text-white/60 hover:text-white hover:bg-[#1a1a1a] border-white/[0.08]"
              )}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* Rows of Games */}
      <div className="flex flex-col gap-10">
        {/* Popular Experiences */}
        <HorizontalScroll
          title="Popular Experiences"
          subtitle="Top played games across the platform right now"
          actionLabel="See All"
        >
          {POPULAR_GAMES.map((game) => (
            <div key={game.id} className="w-[200px] md:w-[240px] shrink-0">
              <GameCard game={game} />
            </div>
          ))}
        </HorizontalScroll>

        {/* Recommended For You */}
        <HorizontalScroll
          title="Recommended For You"
          subtitle="Experiences handpicked based on your activity"
          actionLabel="See All"
        >
          {RECOMMENDED_GAMES.map((game) => (
            <div key={game.id} className="w-[200px] md:w-[240px] shrink-0">
              <GameCard game={game} />
            </div>
          ))}
        </HorizontalScroll>

        {/* Top Rated Experiences */}
        <HorizontalScroll
          title="Top Rated"
          subtitle="Critically acclaimed experiences by community upvotes"
          actionLabel="See All"
        >
          {TOP_RATED_GAMES.map((game) => (
            <div key={game.id} className="w-[200px] md:w-[240px] shrink-0">
              <GameCard game={game} />
            </div>
          ))}
        </HorizontalScroll>
      </div>
    </div>
  )
}
