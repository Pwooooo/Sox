import { useState, useEffect } from 'react'
import {
  X,
  Play,
  Star,
  Bell,
  ThumbsUp,
  ThumbsDown,
  Clock,
  CheckCircle2,
  ChevronDown,
  Users,
  ShoppingBag,
  Gamepad2,
  RefreshCw,
} from 'lucide-react'
import { GameDetailData } from '@/data/homeGames'
import { fetchPublicExperiences } from '@/lib/supabase'

interface GameDetailModalProps {
  game: GameDetailData
  onClose: () => void
}

type DetailTab = 'Servers' | 'Store' | 'Recommended'

export function GameDetailModal({ game, onClose }: GameDetailModalProps) {
  const [currentGame, setCurrentGame] = useState<GameDetailData>(game)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isNotified, setIsNotified] = useState(false)
  const [userRating, setUserRating] = useState<'like' | 'dislike' | null>(null)
  const [timeFilter] = useState('Past Day')
  const [activeTab, setActiveTab] = useState<DetailTab>('Servers')
  const [recommended, setRecommended] = useState<GameDetailData[]>([])
  const [loadingRecs, setLoadingRecs] = useState(false)

  useEffect(() => {
    setCurrentGame(game)
  }, [game])

  useEffect(() => {
    let cancelled = false
    setLoadingRecs(true)
    fetchPublicExperiences()
      .then((rows) => {
        if (cancelled) return
        const mapped: GameDetailData[] = rows
          .filter((r) => r.id !== currentGame.id)
          .slice(0, 10)
          .map((r) => ({
            id: r.id,
            name: r.name || 'Untitled Experience',
            creator: r.owner_username || 'Creator',
            thumbnail: r.thumbnail || '',
            description: r.description || '',
            genre: r.genre || 'All',
            subgenre: r.subgenre || 'All',
            players: '0',
            likePercent: 100,
            createdDate: r.updated_at ? new Date(r.updated_at).toLocaleDateString() : undefined,
            updatedDate: 'Recently',
          }))
        setRecommended(mapped)
      })
      .finally(() => {
        if (!cancelled) setLoadingRecs(false)
      })
    return () => {
      cancelled = true
    }
  }, [currentGame.id])

  const handlePlay = (targetId = currentGame.id) => {
    if ((window as any).__TAURI_INTERNALS__) {
      window.dispatchEvent(new CustomEvent('novelo-join-game', { detail: { id: targetId } }))
      onClose()
    } else {
      window.location.href = `novelo://join?entry=${encodeURIComponent(targetId)}&token=guest&address=127.0.0.1&port=24221`
    }
  }

  const likesDisplay = currentGame.likesCount || `${currentGame.likePercent * 10}K+`
  const dislikesDisplay = currentGame.dislikesCount || `${(100 - currentGame.likePercent) * 2}K+`
  const favoritesDisplay = currentGame.favoritesCount || '0'
  const visitsDisplay = currentGame.visitsCount || '0'
  const serverSize = currentGame.serverSize || 20
  const created = currentGame.createdDate || '—'
  const updated = currentGame.updatedDate || 'Recently'
  const genre = currentGame.genre || 'All'
  const subgenre = currentGame.subgenre || 'All'
  const maturity = currentGame.maturity || 'Mild'
  const maturityDetail = currentGame.maturityDetail || 'Suitable for everyone'

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 overflow-y-auto animate-in fade-in select-none"
      onClick={onClose}
    >
      <div
        className="relative w-[95vw] max-w-6xl min-h-[86vh] max-h-[94vh] overflow-y-auto rounded-2xl bg-[#141414] border border-white/10 shadow-2xl p-6 md:p-10 flex flex-col gap-6 text-white no-scrollbar"
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
          <div className="md:col-span-7 rounded-xl overflow-hidden aspect-[16/9] bg-[#0c0c0c] border border-white/10 shadow-md flex items-center justify-center">
            {currentGame.thumbnail ? (
              <img
                src={currentGame.thumbnail}
                alt={currentGame.name}
                className="size-full object-cover"
              />
            ) : (
              <Gamepad2 className="size-12 text-white/25" />
            )}
          </div>

          {/* Right: Info & Play Actions */}
          <div className="md:col-span-5 flex flex-col gap-3">
            {/* Title */}
            <h2 className="text-xl md:text-2xl font-black text-white leading-tight tracking-tight">
              {currentGame.name}
            </h2>

            {/* Creator with Verified Badge */}
            <div className="flex items-center gap-1.5 text-xs text-white/70">
              <span>By</span>
              <span className="font-bold text-white hover:underline cursor-pointer">
                {currentGame.creator}
              </span>
              {currentGame.isVerified && (
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
            <div className="pt-2">
              {/* Classic Roblox Green Play Button */}
              <button
                onClick={() => handlePlay(currentGame.id)}
                className="w-full h-12 rounded-xl bg-[#02b070] hover:bg-[#009b62] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-white font-extrabold text-base shadow-lg cursor-pointer border-none"
              >
                <Play className="size-6 fill-white text-white ml-0.5" />
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
                    style={{ width: `${currentGame.likePercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Controls Section */}
        <div className="flex flex-col gap-3 text-sm text-white/80 leading-relaxed pt-2 border-t border-white/[0.08]">
          <p className="whitespace-pre-line">
            {currentGame.description || 'Created in Novelo Studio.'}
          </p>

          {currentGame.controls && currentGame.controls.length > 0 && (
            <div className="mt-2 p-3.5 rounded-xl bg-[#0e0e0e] border border-white/[0.06] flex flex-col gap-1 text-xs text-white/70 font-mono">
              <span className="font-bold text-white font-sans text-xs mb-1">🖥 Controls:</span>
              {currentGame.controls.map((ctrl) => (
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
              <span className="text-xs font-bold text-white tabular-numbers">{currentGame.players}</span>
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

        {/* Servers | Store | Recommended Tabs matching Screenshot 3 */}
        <div className="flex flex-col gap-4 pt-2">
          <div className="grid grid-cols-3 border-b border-white/[0.08] bg-white/[0.03] rounded-t-xl overflow-hidden">
            {(['Servers', 'Store', 'Recommended'] as DetailTab[]).map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`h-11 text-xs md:text-sm font-semibold transition-colors cursor-pointer border-0 border-b-2 bg-transparent ${
                    isActive
                      ? 'border-white text-white font-bold bg-white/[0.04]'
                      : 'border-transparent text-white/55 hover:text-white/85 hover:bg-white/[0.02]'
                  }`}
                >
                  {tab}
                </button>
              )
            })}
          </div>

          {activeTab === 'Servers' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white m-0">Servers</h3>
                <button
                  type="button"
                  onClick={() => handlePlay(currentGame.id)}
                  className="h-8 px-3 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-white/85 flex items-center gap-1.5 cursor-pointer border-none transition-colors"
                >
                  <RefreshCw className="size-3.5" />
                  <span>Join Server</span>
                </button>
              </div>
              {Number(currentGame.players) > 0 ? (
                <div className="rounded-xl bg-[#1a1a1d] border border-white/[0.06] p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/75">
                      <Users className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white m-0">Public Server #1</p>
                      <p className="text-[11px] text-white/50 m-0 mt-0.5">
                        {currentGame.players} of {serverSize} people max
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePlay(currentGame.id)}
                    className="h-9 px-5 rounded-lg bg-[#02b070] hover:bg-[#009b62] text-xs font-bold text-white cursor-pointer border-none transition-colors"
                  >
                    Join
                  </button>
                </div>
              ) : (
                <div className="py-10 rounded-xl bg-[#1a1a1d]/60 border border-white/[0.05] flex flex-col items-center justify-center gap-2 text-center">
                  <Users className="size-6 text-white/30" />
                  <p className="text-xs font-medium text-white/55 m-0">
                    No active servers right now. Press Play above to start a server.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Store' && (
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-white m-0">Store</h3>
              <div className="py-10 rounded-xl bg-[#1a1a1d]/60 border border-white/[0.05] flex flex-col items-center justify-center gap-2 text-center">
                <ShoppingBag className="size-6 text-white/30" />
                <p className="text-xs font-medium text-white/55 m-0">
                  This experience does not have any passes or store items yet.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'Recommended' && (
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-white m-0">Recommended Experiences</h3>
              {loadingRecs ? (
                <div className="py-10 text-center text-xs text-white/45">
                  Loading recommended experiences...
                </div>
              ) : recommended.length === 0 ? (
                <div className="py-10 rounded-xl bg-[#1a1a1d]/60 border border-white/[0.05] flex flex-col items-center justify-center gap-2 text-center">
                  <Gamepad2 className="size-6 text-white/30" />
                  <p className="text-xs font-medium text-white/55 m-0">
                    No other public experiences available yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                  {recommended.map((rec) => (
                    <button
                      key={rec.id}
                      type="button"
                      onClick={() => {
                        setCurrentGame(rec)
                        setActiveTab('Servers')
                      }}
                      className="rounded-xl overflow-hidden bg-[#1a1a1d] border border-white/[0.06] hover:border-white/20 transition-all flex flex-col text-left cursor-pointer p-0 group"
                    >
                      <div className="aspect-[16/9] w-full bg-black/50 flex items-center justify-center overflow-hidden">
                        {rec.thumbnail ? (
                          <img
                            src={rec.thumbnail}
                            alt={rec.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <Gamepad2 className="size-7 text-white/30" />
                        )}
                      </div>
                      <div className="p-2.5 flex flex-col gap-1">
                        <span className="text-xs font-bold text-white truncate">{rec.name}</span>
                        <span className="text-[10px] text-white/45 truncate">by {rec.creator}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
