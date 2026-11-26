import { useState, useEffect, useRef, type ChangeEvent } from 'react'
import { Edit3, MoreHorizontal, Users, Calendar, Clock, ChevronRight, Gamepad2, X, Link2, Check, UserPlus, Sparkles, ImagePlus, RotateCcw } from 'lucide-react'
import { UnderConstruction } from '@/components/UnderConstruction'
import { GameCard } from '@/components/GameCard'
import { GameDetailModal } from '@/components/GameDetailModal'
import type { GameDetailData } from '@/data/homeGames'
import {
  supabase,
  fetchProfileById,
  fetchExperiencesByOwnerId,
  type UserProfile,
} from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { PlayerModel3D } from '@/components/PlayerModel3D'
import { loadFriends, FRIENDS_EVENT } from '@/lib/friendsStore'
import { HsvColorPicker } from '@/components/HsvColorPicker'

export function Profile({ profileId }: { profileId?: number | null }) {
  const { user, profile: myProfile } = useAuth()
  const [activeTab, setActiveTab] = useState<'About' | 'Games' | 'Groups' | 'Inventory'>('About')
  const [projects, setProjects] = useState<GameDetailData[]>([])
  const [selectedGame, setSelectedGame] = useState<GameDetailData | null>(null)
  const [viewedProfile, setViewedProfile] = useState<UserProfile | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const moreMenuRef = useRef<HTMLDivElement>(null)
  const [displayNameDraft, setDisplayNameDraft] = useState('')
  const [bioDraft, setBioDraft] = useState('')
  const [bannerDraft, setBannerDraft] = useState('')
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const [savingProfile, setSavingProfile] = useState(false)
  const ownerKey = user?.id || myProfile?.username || 'guest'
  const [friendsCount, setFriendsCount] = useState(() => loadFriends(ownerKey).length)

  const targetId = profileId ?? myProfile?.id ?? null
  const isOwnProfile = targetId === null || (myProfile?.id !== undefined && targetId === myProfile.id)
  const bioStorageKey = `novelo_profile_bio_${targetId ?? 'guest'}`
  const bannerStorageKey = `novelo_profile_banner_${targetId ?? 'guest'}`
  const [bio, setBio] = useState<string>(() => {
    try {
      return localStorage.getItem(`novelo_profile_bio_${profileId ?? myProfile?.id ?? 'guest'}`) || ''
    } catch {
      return ''
    }
  })
  const [banner, setBanner] = useState<string>(() => {
    try {
      return localStorage.getItem(`novelo_profile_banner_${profileId ?? myProfile?.id ?? 'guest'}`) || '#0f0f11'
    } catch {
      return '#0f0f11'
    }
  })

  useEffect(() => {
    try {
      setBio(localStorage.getItem(bioStorageKey) || '')
    } catch {
      setBio('')
    }
    try {
      const savedBanner = localStorage.getItem(bannerStorageKey)
      const metaBanner = isOwnProfile ? (user?.user_metadata?.banner as string | undefined) : undefined
      setBanner(savedBanner || metaBanner || '#0f0f11')
    } catch {
      setBanner('#0f0f11')
    }
  }, [bioStorageKey, bannerStorageKey, isOwnProfile, user?.user_metadata?.banner])

  useEffect(() => {
    const syncFriends = () => setFriendsCount(loadFriends(ownerKey).length)
    syncFriends()
    window.addEventListener(FRIENDS_EVENT, syncFriends)
    window.addEventListener('storage', syncFriends)
    return () => {
      window.removeEventListener(FRIENDS_EVENT, syncFriends)
      window.removeEventListener('storage', syncFriends)
    }
  }, [ownerKey])

  useEffect(() => {
    if (!moreOpen) return
    const onMouseDown = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreOpen(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false)
    }
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [moreOpen])

  const ownFallbackUsername =
    !profileId && user
      ? (user.user_metadata?.username as string | undefined) || user.email?.split('@')[0]
      : undefined

  useEffect(() => {
    let cancelled = false
    const mapProjects = (list: any[]): GameDetailData[] =>
      list
        .filter((p: any) => !p.archived && p.privacy === 'Public')
        .map((p: any) => ({
          id: String(p.id),
          name: p.name || 'Untitled Experience',
          thumbnail: p.thumbnail || '',
          likePercent: 0,
          players: '0',
          aspect: '16/9' as const,
          creator:
            p.owner_username ||
            viewedProfile?.username ||
            myProfile?.username ||
            'Creator',
          description: p.description || p.promo || 'Created in Novelo Studio.',
          genre: p.genre || 'All',
          subgenre: p.subgenre || 'All',
          updatedDate: p.updated_at ? new Date(p.updated_at).toLocaleDateString() : '—',
        }))

    const load = async () => {
      if (targetId !== null) {
        const remoteProfile = await fetchProfileById(targetId)
        if (!cancelled && remoteProfile) {
          setViewedProfile(remoteProfile)
        } else if (!cancelled && myProfile && myProfile.id === targetId) {
          setViewedProfile(myProfile)
        }

        const remoteExps = await fetchExperiencesByOwnerId(targetId)
        if (!cancelled && remoteExps.length > 0) {
          setProjects(mapProjects(remoteExps))
          return
        }
      } else if (myProfile && !cancelled) {
        setViewedProfile(myProfile)
      }

      try {
        if ((window as any).__TAURI_INTERNALS__) {
          const { invoke } = await import('@tauri-apps/api/core')
          const raw = await invoke<string>('load_studio_projects')
          if (!cancelled && raw) {
            const parsed = JSON.parse(raw)
            if (Array.isArray(parsed)) {
              setProjects(mapProjects(parsed))
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
            setProjects(mapProjects(list))
          }
        }
      } catch {
        // Ignore offline fetch error
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [targetId, myProfile])

  const TABS = ['About', 'Games', 'Groups', 'Inventory'] as const

  return (
    <div className="p-4 md:p-6 lg:p-7 flex flex-col gap-6 max-w-[1500px]">
      {/* 1. Header Card Matching Image 1 */}
      <div className="flex flex-col gap-4">
        {/* Profile Banner with Overlapping Avatar & Action Buttons */}
        <div className="relative">
          <div
            className="h-44 md:h-52 w-full rounded-2xl bg-[#0f0f11] relative overflow-hidden"
            style={
              banner.startsWith('data:') || banner.startsWith('http')
                ? undefined
                : { background: banner }
            }
          >
            {(banner.startsWith('data:') || banner.startsWith('http')) && (
              <img
                src={banner}
                alt="Profile banner"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* User Info Line Overlapping Banner */}
          <div className="px-3 flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-12 md:-mt-14 relative z-10">
            <div className="flex items-end gap-4">
              {/* Circular Avatar with Blue Status Dot */}
              <div className="relative">
                <div className="size-24 md:size-28 rounded-full bg-[#141416] border-4 border-[#0a0a0a] flex items-center justify-center overflow-hidden shadow-2xl">
                  <PlayerModel3D
                    mode="headshot"
                    useSavedColors={isOwnProfile}
                    useSavedClothing={isOwnProfile}
                    className="w-full h-full"
                  />
                </div>

                {/* Blue Online / Verified Dot */}
                {isOwnProfile && (
                  <span className="absolute bottom-1 right-1 size-5 rounded-full bg-[#00a2ff] border-3 border-[#0a0a0a] shadow-sm" />
                )}
              </div>

              {/* Username & Badges */}
              <div className="flex flex-col mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    {viewedProfile?.display_name ||
                      (isOwnProfile ? (user?.user_metadata?.display_name as string | undefined) : undefined) ||
                      viewedProfile?.username ||
                      ownFallbackUsername ||
                      (targetId ? `User #${targetId}` : 'Guest')}
                  </h1>
                </div>
                <span className="text-xs text-white/50 font-medium">
                  @{(viewedProfile?.username || ownFallbackUsername || 'guest').toLowerCase()}
                </span>
              </div>
            </div>

            {/* Right Action Buttons matching reference #1d1d1d */}
            <div className="flex items-center gap-2 mb-2 relative" ref={moreMenuRef}>
              {isOwnProfile && (
                <button
                  type="button"
                  onClick={() => {
                    setMoreOpen(false)
                    setDisplayNameDraft(
                      viewedProfile?.display_name ||
                        (user?.user_metadata?.display_name as string | undefined) ||
                        ''
                    )
                    setBioDraft(bio)
                    setBannerDraft(banner)
                    setEditOpen(true)
                  }}
                  className="h-9 px-3.5 rounded-[10px] bg-[#1d1d1d] hover:bg-[#262626] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border-none outline-none select-none active:scale-[0.97]"
                >
                  <Edit3 className="size-3.5 stroke-[2]" />
                  <span>Edit Profile</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setMoreOpen((prev) => !prev)}
                aria-label="More options"
                className="size-9 rounded-[10px] bg-[#1d1d1d] hover:bg-[#262626] text-white flex items-center justify-center transition-all cursor-pointer border-none outline-none select-none active:scale-[0.97]"
              >
                <MoreHorizontal className="size-4" />
              </button>

              {moreOpen && (
                <div className="absolute right-0 top-full mt-1.5 z-50 min-w-[180px] rounded-[8px] bg-[#141416] border border-white/10 p-1 shadow-2xl flex flex-col gap-0.5 animate-in fade-in-50 zoom-in-95 duration-100">
                  <button
                    type="button"
                    onClick={() => {
                      const profileUrl = targetId
                        ? `${window.location.origin}/profile/${targetId}`
                        : window.location.href
                      navigator.clipboard?.writeText(profileUrl).catch(() => {})
                      setCopiedLink(true)
                      window.setTimeout(() => {
                        setCopiedLink(false)
                        setMoreOpen(false)
                      }, 900)
                    }}
                    className="w-full px-2.5 py-1.5 rounded-[6px] flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer border-none bg-transparent text-left"
                  >
                    {copiedLink ? <Check className="size-3.5 text-emerald-400 shrink-0" /> : <Link2 className="size-3.5 shrink-0" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Profile Link'}</span>
                  </button>
                  {isOwnProfile && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setMoreOpen(false)
                          window.history.pushState({}, '', '/?tab=Avatar')
                          window.dispatchEvent(new PopStateEvent('popstate'))
                        }}
                        className="w-full px-2.5 py-1.5 rounded-[6px] flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer border-none bg-transparent text-left"
                      >
                        <Sparkles className="size-3.5 shrink-0" />
                        <span>Customize Avatar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMoreOpen(false)
                          window.history.pushState({}, '', '/?tab=Friends')
                          window.dispatchEvent(new PopStateEvent('popstate'))
                        }}
                        className="w-full px-2.5 py-1.5 rounded-[6px] flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer border-none bg-transparent text-left"
                      >
                        <UserPlus className="size-3.5 shrink-0" />
                        <span>Manage Friends</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subtitle & Metadata Line */}
        <div className="px-3 flex flex-col gap-1.5">
          {bio && <span className="text-xs font-bold text-white/90">{bio}</span>}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/50">
            <div className="flex items-center gap-1.5">
              <Users className="size-3.5" />
              <span>{isOwnProfile ? friendsCount : 0} friends</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              <span>
                Joined{' '}
                {(() => {
                  const raw = viewedProfile?.created_at || (isOwnProfile ? user?.created_at : undefined)
                  if (!raw) return '—'
                  const d = new Date(raw)
                  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString()
                })()}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              <span>{isOwnProfile ? 'Online Now' : 'Offline'}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs matching reference: solid #1d1d1d when active, transparent when unselected */}
        <div className="flex items-center gap-2 px-3 pt-3 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-8 px-3.5 rounded-[10px] text-xs font-semibold tracking-tight transition-all duration-150 cursor-pointer border-none outline-none select-none active:scale-[0.97] flex items-center justify-center shrink-0 ${
                  isActive
                    ? 'bg-white/[0.08] backdrop-blur-xs text-white font-bold shadow-xs'
                    : 'bg-transparent text-white/50 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Main Content Row: Left 3D Character Card + Right Game Showcase */}
      {activeTab === 'About' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Left Column: 3D Full-Body Character Card */}
          <div className="md:col-span-4 rounded-2xl bg-[#0f0f12] border border-white/[0.05] p-4 flex flex-col items-center justify-center h-[400px] shadow-xl relative overflow-hidden">
            {/* Ground Ambient Glow */}
            <div className="absolute bottom-8 w-44 h-8 bg-black/80 rounded-full blur-md pointer-events-none" />
            <PlayerModel3D
              mode="full"
              interactive
              useSavedColors={isOwnProfile}
              useSavedClothing={isOwnProfile}
              className="w-full h-full relative z-10"
            />
          </div>

          {/* Right Column: Game Showcase Card */}
          <div className="md:col-span-8 rounded-2xl bg-[#0f0f12] border border-white/[0.05] p-5 flex flex-col gap-4 shadow-xl">
            {/* Title with Arrow */}
            <div
              onClick={() => setActiveTab('Games')}
              className="flex items-center gap-1 text-sm font-bold text-white tracking-tight cursor-pointer hover:text-white/80 transition-colors w-fit"
            >
              <span>Game Showcase</span>
              <ChevronRight className="size-4" />
            </div>

            {/* Showcase Cards Grid */}
            {projects.length === 0 ? (
              <div className="py-10 rounded-xl bg-[#161618]/50 border border-white/[0.04] flex flex-col items-center justify-center gap-2 text-center">
                <Gamepad2 className="size-7 text-white/30" />
                <span className="text-xs font-medium text-white/50">
                  No public experiences yet.
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.slice(0, 2).map((proj) => (
                  <GameCard
                    key={proj.id}
                    game={proj}
                    aspect="16/9"
                    onClick={() => setSelectedGame(proj)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Games Tab */}
      {activeTab === 'Games' && (
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white tracking-tight">Created Experiences</h3>
          {projects.length === 0 ? (
            <div className="py-12 rounded-xl bg-[#161618]/50 border border-white/[0.04] flex flex-col items-center justify-center gap-2 text-center">
              <Gamepad2 className="size-7 text-white/30" />
              <span className="text-xs font-medium text-white/50">
                No public experiences yet.
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {projects.map((proj) => (
                <GameCard
                  key={proj.id}
                  game={proj}
                  aspect="16/9"
                  onClick={() => setSelectedGame(proj)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {selectedGame && (
        <GameDetailModal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
        />
      )}

      {/* Other tabs placeholder */}
      {activeTab !== 'About' && activeTab !== 'Games' && (
        <UnderConstruction onGoBack={() => setActiveTab('About')} />
      )}

      {/* Remade Edit Profile Modal */}
      {editOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setEditOpen(false)
          }}
        >
          <div className="w-full max-w-[480px] rounded-2xl bg-[#141414] border border-white/[0.08] overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.85)] flex flex-col">
            {/* Modal Header */}
            <div className="px-5 pt-4 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="size-4 text-white/80" />
                <h3 className="text-sm font-bold text-white m-0">Edit Profile</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                aria-label="Close"
                className="size-8 rounded-[8px] bg-white/[0.06] hover:bg-white/[0.14] flex items-center justify-center text-white/75 hover:text-white cursor-pointer border-none transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Live Banner + Avatar Preview */}
            <div className="px-5 py-2">
              <div className="rounded-xl overflow-hidden bg-[#101010]">
                <div
                  className="h-20 w-full relative overflow-hidden bg-[#0f0f11]"
                  style={
                    bannerDraft.startsWith('data:') || bannerDraft.startsWith('http')
                      ? undefined
                      : { background: bannerDraft || '#0f0f11' }
                  }
                >
                  {(bannerDraft.startsWith('data:') || bannerDraft.startsWith('http')) && (
                    <img
                      src={bannerDraft}
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="px-4 pb-3.5 -mt-7 relative z-10 flex items-end gap-3">
                  <div className="size-14 rounded-full bg-[#1c1c1c] border-[3px] border-[#101010] overflow-hidden shrink-0">
                    <PlayerModel3D
                      mode="headshot"
                      useSavedColors={isOwnProfile}
                      useSavedClothing={isOwnProfile}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="min-w-0 pb-0.5">
                    <p className="text-sm font-extrabold text-white truncate m-0">
                      {displayNameDraft.trim() ||
                        viewedProfile?.username ||
                        ownFallbackUsername ||
                        'Guest'}
                    </p>
                    <p className="text-xs text-white/45 truncate m-0">
                      @{(viewedProfile?.username || ownFallbackUsername || 'guest').toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Body */}
            <div className="px-5 py-3 flex flex-col gap-4">
              {/* Banner Customization */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white/75">Banner</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      ref={bannerInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            setBannerDraft(reader.result)
                          }
                        }
                        reader.readAsDataURL(file)
                        e.target.value = ''
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => bannerInputRef.current?.click()}
                      className="h-7 px-2.5 rounded-[6px] bg-white/[0.08] hover:bg-white/[0.14] text-white/85 text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer border-none transition-colors"
                    >
                      <ImagePlus className="size-3.5" />
                      <span>Upload</span>
                    </button>
                    {bannerDraft !== '#0f0f11' && (
                      <button
                        type="button"
                        onClick={() => setBannerDraft('#0f0f11')}
                        title="Reset banner"
                        className="size-7 rounded-[6px] bg-white/[0.06] hover:bg-white/[0.12] text-white/65 hover:text-white flex items-center justify-center cursor-pointer border-none transition-colors"
                      >
                        <RotateCcw className="size-3" />
                      </button>
                    )}
                  </div>
                </div>
                <HsvColorPicker
                  value={bannerDraft.startsWith('#') ? bannerDraft : '#0f0f11'}
                  onChange={(hex) => setBannerDraft(hex)}
                  spectrumClassName="h-32"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white/75">Display Name</label>
                  <span className="text-[11px] text-white/35 tabular-numbers">
                    {displayNameDraft.length}/30
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={30}
                  value={displayNameDraft}
                  onChange={(e) => setDisplayNameDraft(e.target.value)}
                  placeholder={viewedProfile?.username || ownFallbackUsername || 'Display name'}
                  className="h-10 rounded-[8px] bg-[#1c1c1c] border border-white/[0.12] px-3 text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white/75">Bio / About</label>
                  <span className="text-[11px] text-white/35 tabular-numbers">
                    {bioDraft.length}/160
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={160}
                  value={bioDraft}
                  onChange={(e) => setBioDraft(e.target.value)}
                  placeholder="Tell others about yourself..."
                  className="w-full rounded-[8px] bg-[#1c1c1c] border border-white/[0.12] p-3 text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-white/30 resize-none transition-colors"
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-5 pt-2 pb-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="h-9 px-4 rounded-[8px] bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-semibold cursor-pointer border-none transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingProfile}
                onClick={async () => {
                  const trimmedBio = bioDraft.trim()
                  const trimmedDisplay = displayNameDraft.trim()
                  const nextBanner = bannerDraft || '#0f0f11'
                  setSavingProfile(true)
                  setBio(trimmedBio)
                  setBanner(nextBanner)
                  try {
                    if (trimmedBio) {
                      localStorage.setItem(bioStorageKey, trimmedBio)
                    } else {
                      localStorage.removeItem(bioStorageKey)
                    }
                    if (nextBanner && nextBanner !== '#0f0f11') {
                      localStorage.setItem(bannerStorageKey, nextBanner)
                    } else {
                      localStorage.removeItem(bannerStorageKey)
                    }
                  } catch {
                    // ignore storage errors
                  }
                  if (supabase && user) {
                    await supabase.auth.updateUser({
                      data: {
                        display_name: trimmedDisplay || null,
                        bio: trimmedBio,
                        banner: nextBanner.startsWith('data:') ? undefined : nextBanner,
                      },
                    })
                    if (viewedProfile?.id) {
                      await supabase
                        .from('profiles')
                        .update({ display_name: trimmedDisplay || null })
                        .eq('id', viewedProfile.id)
                      setViewedProfile((prev) =>
                        prev ? { ...prev, display_name: trimmedDisplay || null } : prev
                      )
                    }
                  }
                  setSavingProfile(false)
                  setEditOpen(false)
                }}
                className="h-9 px-4 rounded-[8px] bg-white text-black hover:bg-neutral-200 disabled:opacity-50 text-xs font-bold cursor-pointer border-none transition-colors"
              >
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
