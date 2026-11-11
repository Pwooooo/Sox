import { useState } from 'react'
import {
  X,
  Play,
  Box,
  Star,
  Bell,
  ThumbsUp,
  ThumbsDown,
  Clock,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react'
import { GameDetailData } from '@/data/homeGames'

interface GameDetailModalProps {
  game: GameDetailData
  onClose: () => void
}

export function GameDetailModal({ game, onClose }: GameDetailModalProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isNotified, setIsNotified] = useState(false)
  const [userRating, setUserRating] = useState<'like' | 'dislike' | null>(null)
  const [timeFilter, setTimeFilter] = useState('Past Day')

  const likesDisplay = game.likesCount || `${game.likePercent * 10}K+`
  const dislikesDisplay = game.dislikesCount || `${(100 - game.likePercent) * 2}K+`
  const favoritesDisplay = game.favoritesCount || '1.5M+'
  const visitsDisplay = game.visitsCount || '450M+'
  const serverSize = game.serverSize || 20
  const created = game.createdDate || '8/2/2022'
  const updated = game.updatedDate || '18 hours ago'
  const genre = game.genre || 'Action'
  const subgenre = game.subgenre || 'Battlegrounds & Fighting'
  const maturity = game.maturity || 'Mild'
  const maturityDetail = game.maturityDetail || 'Violence (Repeated/Mild)'

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto animate-in fade-in select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#141414] border border-white/10 shadow-2xl p-5 md:p-8 flex flex-col gap-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer border-none z-10"
        >
          <X className="size-4" />
        </button>

        {/* Top Showcase: Media Left + Title & Actions Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left: Large Thumbnail */}
          <div className="md:col-span-7 rounded-xl overflow-hidden aspect-[16/9] bg-[#0c0c0c] border border-white/10 shadow-md">
            <img
              src={game.thumbnail}
              alt={game.name}
              className="size-full object-cover"
            />
          </div>

          {/* Right: Info & Play Actions */}
          <div className="md:col-span-5 flex flex-col gap-3">
            {/* Title */}
            <h2 className="text-xl md:text-2xl font-black text-white leading-tight tracking-tight">
              {game.name}
            </h2>

            {/* Creator with Verified Badge */}
            <div className="flex items-center gap-1.5 text-xs text-white/70">
              <span>By</span>
              <span className="font-bold text-white hover:underline cursor-pointer">
                {game.creator}
              </span>
              {game.isVerified && (
                <CheckCircle2 className="size-3.5 fill-[#00a2ff] text-black shrink-0" />
              )}
            </div>

            {/* Maturity & Past Day Filter */}
            <div className="flex items-center justify-between text-xs text-white/60 pt-0.5">
              <span>Maturity: {maturity}</span>
              <div className="flex items-center gap-1 text-[11px] text-white/50 cursor-pointer hover:text-white">
                <Clock className="size-3" />
                <span>Verify User</span>
                <span className="ml-1 text-white/70 font-semibold">{timeFilter}</span>
                <ChevronDown className="size-3" />
              </div>
            </div>

            {/* Big Action Buttons Row */}
            <div className="flex items-center gap-2 pt-2">
              {/* Server / Inspect Cube Button */}
              <button
                className="size-12 rounded-xl bg-white hover:bg-neutral-200 text-black flex items-center justify-center cursor-pointer border-none transition-all shadow-md active:scale-95 shrink-0"
                title="Servers & Instances"
              >
                <Box className="size-6 stroke-[2.2] text-black" />
              </button>

              {/* Play Button: White with black middle icon */}
              <button
                onClick={() => alert(`Launching ${game.name} on Novelo client...`)}
                className="flex-1 h-12 rounded-xl bg-white hover:bg-neutral-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-black font-extrabold text-base shadow-lg cursor-pointer border-none"
              >
                <Play className="size-6 fill-black text-black ml-0.5" />
              </button>
            </div>

            {/* Interaction Bar: Favorite, Notify, Likes, Dislikes */}
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.08] text-xs text-white/75">
              {/* Favorite */}
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className="flex flex-col items-center gap-1 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
              >
                <Star className={`size-4 ${isFavorited ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span className="text-[11px]">Favorite</span>
              </button>

              {/* Notify */}
              <button
                onClick={() => setIsNotified(!isNotified)}
                className="flex flex-col items-center gap-1 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
              >
                <Bell className={`size-4 ${isNotified ? 'fill-white text-white' : ''}`} />
                <span className="text-[11px]">Notify</span>
              </button>

              {/* Like / Dislike with ratio bar */}
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setUserRating(userRating === 'like' ? null : 'like')}
                    className="flex items-center gap-1 hover:text-white cursor-pointer border-none bg-transparent text-[11px]"
                  >
                    <ThumbsUp className={`size-3.5 ${userRating === 'like' ? 'fill-white text-white' : ''}`} />
                    <span>{likesDisplay}</span>
                  </button>

                  <button
                    onClick={() => setUserRating(userRating === 'dislike' ? null : 'dislike')}
                    className="flex items-center gap-1 hover:text-white cursor-pointer border-none bg-transparent text-[11px]"
                  >
                    <ThumbsDown className={`size-3.5 ${userRating === 'dislike' ? 'fill-white text-white' : ''}`} />
                    <span>{dislikesDisplay}</span>
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-24 h-1 rounded-full bg-neutral-700 overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${game.likePercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Controls Section */}
        <div className="flex flex-col gap-3 text-sm text-white/80 leading-relaxed pt-2 border-t border-white/[0.08]">
          <p className="whitespace-pre-line">
            {game.description || 'Train & fight others to be the strongest. Explore vibrant battle arenas with unique abilities and combo systems.'}
          </p>

          {game.controls && game.controls.length > 0 && (
            <div className="mt-2 p-3.5 rounded-xl bg-[#0e0e0e] border border-white/[0.06] flex flex-col gap-1 text-xs text-white/70 font-mono">
              <span className="font-bold text-white font-sans text-xs mb-1">🖥 Controls:</span>
              {game.controls.map((ctrl) => (
                <span key={ctrl}>{ctrl}</span>
              ))}
            </div>
          )}

          {/* Maturity badge */}
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800/70 border border-white/10 text-xs text-white/80 w-fit font-medium">
            <span className="font-bold">Maturity: {maturity}</span>
            <span className="text-white/40">|</span>
            <span className="text-white/60">{maturityDetail}</span>
          </div>
        </div>

        {/* Specs & Stats Table matching Screenshot 2 */}
        <div className="mt-1 pt-4 border-t border-white/[0.08] flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-3 text-center">
            <div>
              <span className="text-[11px] text-white/45 block mb-1">Active</span>
              <span className="text-xs font-bold text-white tabular-numbers">{game.players}</span>
            </div>
            <div>
              <span className="text-[11px] text-white/45 block mb-1">Favorites</span>
              <span className="text-xs font-bold text-white tabular-numbers">{favoritesDisplay}</span>
            </div>
            <div>
              <span className="text-[11px] text-white/45 block mb-1">Visits</span>
              <span className="text-xs font-bold text-white tabular-numbers">{visitsDisplay}</span>
            </div>
            <div>
              <span className="text-[11px] text-white/45 block mb-1">Voice Chat</span>
              <span className="text-xs font-bold text-white">Supported</span>
            </div>
            <div>
              <span className="text-[11px] text-white/45 block mb-1">Camera</span>
              <span className="text-xs font-bold text-white">Not Supported</span>
            </div>
            <div>
              <span className="text-[11px] text-white/45 block mb-1">Created</span>
              <span className="text-xs font-bold text-white tabular-numbers">{created}</span>
            </div>
            <div>
              <span className="text-[11px] text-white/45 block mb-1">Updated</span>
              <span className="text-xs font-bold text-white">{updated}</span>
            </div>
            <div>
              <span className="text-[11px] text-white/45 block mb-1">Server Size</span>
              <span className="text-xs font-bold text-white tabular-numbers">{serverSize}</span>
            </div>
            <div>
              <span className="text-[11px] text-white/45 block mb-1">Genre</span>
              <span className="text-xs font-bold text-white">{genre}</span>
            </div>
            <div>
              <span className="text-[11px] text-white/45 block mb-1">Subgenre</span>
              <span className="text-xs font-bold text-white truncate" title={subgenre}>{subgenre}</span>
            </div>
          </div>

          {/* Report Abuse Link */}
          <div className="flex justify-end pt-1">
            <button className="text-xs font-semibold text-red-400 hover:text-red-300 hover:underline cursor-pointer border-none bg-transparent">
              Report Abuse
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
