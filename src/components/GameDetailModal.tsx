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
import { subscribeGamePresence, type ActivePlayerSession } from '@/lib/gamePresence'
import { addNotification } from '@/lib/notifications'
import { PlayerModel3D } from '@/components/PlayerModel3D'

interface GameDetailModalProps {
  game: GameDetailData
  onClose: () => void
}

type DetailTab = 'Servers' | 'Store' | 'Recommended'

interface StoredGameStats {
  likes: number
  dislikes: number
  favorites: number
  visits: number
  userVote: 'like' | 'dislike' | null
  userFavorited: boolean
  userNotified: boolean
}

const GAME_STATS_KEY = 'novelo_game_stats_v1'

function loadAllGameStats(): Record<string, StoredGameStats> {
  try {
    const raw = localStorage.getItem(GAME_STATS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, StoredGameStats>) : {}
  } catch {
    return {}
  }
}

function getGameStats(gameId: string): StoredGameStats {
  const all = loadAllGameStats()
  const existing = all[gameId]
  return {
    likes: typeof existing?.likes === 'number' ? existing.likes : 0,
    dislikes: typeof existing?.dislikes === 'number' ? existing.dislikes : 0,
    favorites: typeof existing?.favorites === 'number' ? existing.favorites : 0,
    visits: typeof existing?.visits === 'number' ? existing.visits : 0,
    userVote: existing?.userVote === 'like' || existing?.userVote === 'dislike' ? existing.userVote : null,
    userFavorited: Boolean(existing?.userFavorited),
    userNotified: Boolean(existing?.userNotified),
  }
}

function saveGameStats(gameId: string, stats: StoredGameStats): void {
  try {
    const all = loadAllGameStats()
    all[gameId] = stats
    localStorage.setItem(GAME_STATS_KEY, JSON.stringify(all))
  } catch {
    // ignore storage errors
  }
}

export function GameDetailModal({ game, onClose }: GameDetailModalProps) {
  const [currentGame, setCurrentGame] = useState<GameDetailData>(game)
  const [stats, setStats] = useState<StoredGameStats>(() => getGameStats(game.id))
  const [activeSessions, setActiveSessions] = useState<ActivePlayerSession[]>([])
  const [copiedServerId, setCopiedServerId] = useState(false)
  const [timeFilter] = useState('Past Day')
  const [activeTab, setActiveTab] = useState<DetailTab>('Servers')
  const [recommended, setRecommended] = useState<GameDetailData[]>([])
  const [loadingRecs, setLoadingRecs] = useState(false)

  useEffect(() => {
    setCurrentGame(game)
    setStats(getGameStats(game.id))
    setActiveSessions([])
  }, [game])

  useEffect(() => {
    setStats(getGameStats(currentGame.id))
    return subscribeGamePresence(currentGame.id, (sessions) => {
      setActiveSessions(sessions)
    })
  }, [currentGame.id])

  const activePlayers = activeSessions.length

  const updateStats = (updater: (prev: StoredGameStats) => StoredGameStats) => {
    setStats((prev) => {
      const next = updater(prev)
      saveGameStats(currentGame.id, next)
      return next
    })
  }

  const handleToggleFavorite = () => {
    updateStats((prev) => {
      const nextFav = !prev.userFavorited
      return {
        ...prev,
        userFavorited: nextFav,
        favorites: Math.max(0, prev.favorites + (nextFav ? 1 : -1)),
      }
    })
  }

  const handleToggleNotify = () => {
    const enabling = !stats.userNotified
    updateStats((prev) => ({ ...prev, userNotified: !prev.userNotified }))
    if (enabling) {
      addNotification({
        title: currentGame.name,
        body: 'Notifications enabled for this experience.',
        category: 'experience',
        actionTab: 'Home',
        thumbnail: currentGame.thumbnail,
      })
    }
  }

  const handleVote = (vote: 'like' | 'dislike') => {
    updateStats((prev) => {
      let likes = prev.likes
      let dislikes = prev.dislikes
      let userVote: 'like' | 'dislike' | null = vote

      if (prev.userVote === vote) {
        userVote = null
        if (vote === 'like') likes = Math.max(0, likes - 1)
        else dislikes = Math.max(0, dislikes - 1)
      } else {
        if (prev.userVote === 'like') likes = Math.max(0, likes - 1)
        if (prev.userVote === 'dislike') dislikes = Math.max(0, dislikes - 1)
        if (vote === 'like') likes += 1
        else dislikes += 1
      }
      return { ...prev, likes, dislikes, userVote }
    })
  }

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
    const cur = getGameStats(targetId)
    const next = { ...cur, visits: cur.visits + 1 }
    saveGameStats(targetId, next)
    if (targetId === currentGame.id) setStats(next)

    if ((window as any).__TAURI_INTERNALS__) {
      window.dispatchEvent(new CustomEvent('novelo-join-game', { detail: { id: targetId } }))
      onClose()
    } else {
      window.location.href = `novelo://join?entry=${encodeURIComponent(targetId)}&token=guest&address=127.0.0.1&port=24221`
    }
  }

  const likesDisplay = stats.likes.toLocaleString()
  const dislikesDisplay = stats.dislikes.toLocaleString()
  const totalVotes = stats.likes + stats.dislikes
  const likePercent = totalVotes > 0 ? Math.round((stats.likes / totalVotes) * 100) : 0
  const favoritesDisplay = stats.favorites.toLocaleString()
  const visitsDisplay = stats.visits.toLocaleString()
  const serverSize = currentGame.serverSize || 20
  const created = currentGame.createdDate || '—'
  const updated = currentGame.updatedDate || '—'
  const genre = currentGame.genre || 'All'
  const subgenre = currentGame.subgenre || 'All'
  const maturity = currentGame.maturity || 'Mild'
  const maturityDetail = currentGame.maturityDetail || 'Suitable for everyone'

  return (
    <div className="fixed inset-0 z-30 pt-14 md:pl-[230px] bg-[#0b0b0e] overflow-y-auto no-scrollbar animate-in fade-in select-none">
      <div className="relative w-full max-w-[780px] mx-auto px-5 py-6 md:px-7 md:py-7 flex flex-col gap-5 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="self-end size-8 rounded-[8px] bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer border-none"
        >
          <X className="size-4" />
        </button>

        {/* Top Showcase: Media Left + Title & Actions Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Left: Large Thumbnail */}
          <div className="md:col-span-7 min-w-0 w-full rounded-xl overflow-hidden aspect-[16/9] bg-[#0c0c0c] border border-white/10 shadow-md flex items-center justify-center">
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
          <div className="md:col-span-5 min-w-0 flex flex-col justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              {/* Title */}
              <h2 className="text-xl md:text-2xl font-black text-white leading-tight tracking-tight truncate">
                {currentGame.name}
              </h2>

              {/* Creator with Verified Badge */}
              <div className="flex items-center gap-1.5 text-xs text-white/75">
                <span>By</span>
                <span className="font-bold text-white hover:underline cursor-pointer">
                  {currentGame.creator}
                </span>
                {currentGame.isVerified && (
                  <CheckCircle2 className="size-3.5 fill-[#00a2ff] text-black shrink-0" />
                )}
              </div>

              {/* Maturity */}
              <span className="text-xs text-white/65">Maturity: {maturity}</span>

              {/* Verify User & Past Day Filter */}
              <div className="flex items-center justify-between text-[11px] text-white/55 pt-0.5">
                <div className="flex items-center gap-1">
                  <Clock className="size-3" />
                  <span>Verify User</span>
                </div>
                <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                  <span className="text-white/75 font-semibold">{timeFilter}</span>
                  <ChevronDown className="size-3" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 w-full max-w-[260px]">
              {/* Action Button Row */}
              <button
                onClick={() => handlePlay(currentGame.id)}
                className="w-full h-11 rounded-md bg-[#02b070] hover:bg-[#009b62] active:scale-[0.98] transition-all flex items-center justify-center text-white font-extrabold shadow-lg cursor-pointer border-none"
              >
                <Play className="size-5 fill-white text-white ml-0.5" />
              </button>

              {/* Interaction Bar: Favorite, Notify, Likes, Dislikes */}
              <div className="flex items-start justify-end pr-3 gap-6 pt-0.5 text-white/75">
                {/* Favorite */}
                <button
                  onClick={handleToggleFavorite}
                  className="flex flex-col items-center gap-1 hover:text-white transition-colors cursor-pointer border-none bg-transparent py-0.5"
                >
                  <Star className={`size-5 ${stats.userFavorited ? 'fill-amber-400 text-amber-400' : ''}`} />
                  <span className="text-[11px] font-medium">Favorite</span>
                </button>

                {/* Notify */}
                <button
                  onClick={handleToggleNotify}
                  className="flex flex-col items-center gap-1 hover:text-white transition-colors cursor-pointer border-none bg-transparent py-0.5"
                >
                  <Bell className={`size-5 ${stats.userNotified ? 'fill-white text-white' : ''}`} />
                  <span className="text-[11px] font-medium">Notify</span>
                </button>

                {/* Like / Dislike with ratio bar */}
                <div className="flex flex-col items-center gap-1 py-0.5">
                  <div className="flex items-center justify-between w-20">
                    <button
                      onClick={() => handleVote('like')}
                      className="flex items-center justify-center hover:text-white cursor-pointer border-none bg-transparent p-0"
                    >
                      <ThumbsUp className={`size-5 ${stats.userVote === 'like' ? 'fill-white text-white' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleVote('dislike')}
                      className="flex items-center justify-center hover:text-white cursor-pointer border-none bg-transparent p-0"
                    >
                      <ThumbsDown className={`size-5 ${stats.userVote === 'dislike' ? 'fill-white text-white' : ''}`} />
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="w-20 h-[2px] rounded-full bg-neutral-700 overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-200"
                      style={{ width: `${likePercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between w-20 text-[10px] font-medium text-white/70 tabular-numbers">
                    <span>{likesDisplay}</span>
                    <span>{dislikesDisplay}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Controls Section */}
        <div className="flex flex-col gap-3 text-sm text-white/80 leading-relaxed pt-1">
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
              <span className="text-xs font-bold text-white tabular-numbers">{activePlayers.toLocaleString()}</span>
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
              <span className="text-xs font-bold text-white">Not Supported</span>
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

        {/* Servers | Store | Recommended Tabs with Sliding Highlight */}
        <div className="flex flex-col gap-4 pt-2">
          <div className="p-1.5 rounded-xl bg-white/[0.04]">
            <div className="relative grid grid-cols-3 gap-2">
              <div
                className={`absolute inset-y-0 w-[calc(33.333%-5.33px)] rounded-[8px] bg-white/[0.14] transition-[left] duration-200 ease-out pointer-events-none ${
                  activeTab === 'Servers'
                    ? 'left-0'
                    : activeTab === 'Store'
                    ? 'left-[calc(33.333%+2.67px)]'
                    : 'left-[calc(66.666%+5.33px)]'
                }`}
              />
              {(['Servers', 'Store', 'Recommended'] as DetailTab[]).map((tab) => {
                const isActive = activeTab === tab
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`relative z-10 h-10 rounded-[8px] text-xs md:text-sm font-bold transition-colors duration-150 cursor-pointer border-none bg-transparent outline-none ${
                      isActive ? 'text-white' : 'text-white/55 hover:text-white/90'
                    }`}
                  >
                    {tab}
                  </button>
                )
              })}
            </div>
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
              {activePlayers > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="rounded-xl bg-[#1a1a1d] border border-white/[0.06] p-4 flex flex-col gap-3">
                    <div className="grid grid-cols-3 gap-2.5">
                      {activeSessions.slice(0, 5).map((player) => (
                        <div
                          key={player.sessionId}
                          title={player.username}
                          className="aspect-square rounded-full bg-white/[0.08] border border-white/[0.06] overflow-hidden flex items-center justify-center"
                        >
                          <PlayerModel3D mode="headshot" className="w-full h-full" />
                        </div>
                      ))}
                      {activePlayers > 5 && (
                        <div className="aspect-square rounded-full bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-xs font-bold text-white/80">
                          +{activePlayers - 5}
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-medium text-white/85 m-0">
                      {activePlayers} of {serverSize} people max
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handlePlay(currentGame.id)}
                        className="flex-1 h-8 rounded-lg bg-[#02b070] hover:bg-[#009b62] text-xs font-bold text-white cursor-pointer border-none transition-colors"
                      >
                        Join
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const shareUrl = `novelo://join?entry=${encodeURIComponent(currentGame.id)}&token=guest&address=127.0.0.1&port=24221`
                          navigator.clipboard?.writeText(shareUrl).catch(() => {})
                          setCopiedServerId(true)
                          window.setTimeout(() => setCopiedServerId(false), 1800)
                        }}
                        className="h-8 px-3.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-xs font-semibold text-white/90 cursor-pointer border-none transition-colors"
                      >
                        {copiedServerId ? 'Copied' : 'Share'}
                      </button>
                    </div>
                    <p className="text-[11px] text-white/45 m-0 font-mono">
                      ID: {currentGame.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).padEnd(4, '0')}-{currentGame.id.replace(/[^a-zA-Z0-9]/g, '').slice(4, 8).padEnd(4, '0')}
                    </p>
                  </div>
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
