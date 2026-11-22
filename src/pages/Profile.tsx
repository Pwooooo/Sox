import { useState, useEffect } from 'react'
import { Edit3, MoreHorizontal, Users, Calendar, Clock, ChevronRight, Cat, Rocket, Gamepad2 } from 'lucide-react'
import { UnderConstruction } from '@/components/UnderConstruction'
import {
  fetchProfileById,
  fetchExperiencesByOwnerId,
  type UserProfile,
} from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { PlayerModel3D } from '@/components/PlayerModel3D'

interface ProfileProject {
  id: string
  name: string
  thumbnail?: string
  genre?: string
}

export function Profile({ profileId }: { profileId?: number | null }) {
  const { user, profile: myProfile } = useAuth()
  const [activeTab, setActiveTab] = useState<'About' | 'Games' | 'Groups' | 'Inventory' | 'Wishlist'>('About')
  const [projects, setProjects] = useState<ProfileProject[]>([])
  const [viewedProfile, setViewedProfile] = useState<UserProfile | null>(null)

  const targetId = profileId ?? myProfile?.id ?? null
  const ownFallbackUsername =
    !profileId && user
      ? (user.user_metadata?.username as string | undefined) || user.email?.split('@')[0]
      : undefined

  useEffect(() => {
    let cancelled = false
    const mapProjects = (list: any[]): ProfileProject[] =>
      list
        .filter((p: any) => !p.archived && p.privacy === 'Public')
        .map((p: any) => ({
          id: p.id,
          name: p.name || 'Untitled Experience',
          thumbnail: p.thumbnail || '',
          genre: p.genre || 'All',
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

  const TABS = ['About', 'Games', 'Groups', 'Inventory', 'Wishlist'] as const

  return (
    <div className="p-4 md:p-6 lg:p-7 flex flex-col gap-6 max-w-[1500px]">
      {/* 1. Header Card Matching Image 1 */}
      <div className="flex flex-col gap-4">
        {/* Dark Blank Banner with Overlapping Avatar & Action Buttons */}
        <div className="relative">
          <div className="h-44 md:h-52 w-full rounded-2xl bg-[#0f0f11] relative overflow-hidden" />

          {/* User Info Line Overlapping Banner */}
          <div className="px-3 flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-12 md:-mt-14 relative z-10">
            <div className="flex items-end gap-4">
              {/* Circular Avatar with Blue Status Dot */}
              <div className="relative">
                <div className="size-24 md:size-28 rounded-full bg-[#141416] border-4 border-[#0a0a0a] flex items-center justify-center overflow-hidden shadow-2xl">
                  <PlayerModel3D mode="headshot" className="w-full h-full" />
                </div>

                {/* Blue Online / Verified Dot */}
                <span className="absolute bottom-1 right-1 size-5 rounded-full bg-[#00a2ff] border-3 border-[#0a0a0a] shadow-sm" />
              </div>

              {/* Username & Badges */}
              <div className="flex flex-col mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    {viewedProfile?.display_name || viewedProfile?.username || ownFallbackUsername || (targetId ? `User #${targetId}` : 'Guest')}
                  </h1>
                  {/* Cat badge & Rocket badge */}
                  <Cat className="size-4 text-white/80" />
                  <Rocket className="size-4 text-white/80" />
                </div>
                <span className="text-xs text-white/50 font-medium">
                  @{(viewedProfile?.username || ownFallbackUsername || 'guest').toLowerCase()}
                  {viewedProfile?.id ? ` · ID #${viewedProfile.id}` : targetId ? ` · ID #${targetId}` : ''}
                </span>
              </div>
            </div>

            {/* Right Action Buttons matching reference #1d1d1d */}
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => alert('Edit Profile modal opened')}
                className="h-9 px-3.5 rounded-[10px] bg-[#1d1d1d] hover:bg-[#262626] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border-none outline-none select-none active:scale-[0.97]"
              >
                <Edit3 className="size-3.5 stroke-[2]" />
                <span>Edit Profile</span>
              </button>
              <button
                className="size-9 rounded-[10px] bg-[#1d1d1d] hover:bg-[#262626] text-white flex items-center justify-center transition-all cursor-pointer border-none outline-none select-none active:scale-[0.97]"
              >
                <MoreHorizontal className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Subtitle & Metadata Line */}
        <div className="px-3 flex flex-col gap-1.5">
          <span className="text-xs font-bold text-white/90">Pwo Luduvian</span>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/50">
            <div className="flex items-center gap-1.5">
              <Users className="size-3.5" />
              <span>4 friends</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              <span>Joined 5/22/2026</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              <span>Online Now</span>
            </div>
            <div className="flex items-center gap-1.5">
              <img src="/novelo-currency.png" alt="Currency" className="size-3 object-contain opacity-70" />
              <span>0</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>No past usernames</span>
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
            <PlayerModel3D mode="full" interactive className="w-full h-full relative z-10" />
          </div>

          {/* Right Column: Game Showcase Card */}
          <div className="md:col-span-8 rounded-2xl bg-[#0f0f12] border border-white/[0.05] p-5 flex flex-col gap-4 shadow-xl">
            {/* Title with Arrow */}
            <div className="flex items-center gap-1 text-sm font-bold text-white tracking-tight cursor-pointer hover:text-white/80 transition-colors">
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
                  <div key={proj.id} className="rounded-xl overflow-hidden bg-[#161618] border border-white/[0.04] flex flex-col group cursor-pointer hover:border-white/10 transition-all">
                    <div className="aspect-[16/9] w-full bg-black/50 relative overflow-hidden flex items-center justify-center">
                      {proj.thumbnail ? (
                        <img src={proj.thumbnail} alt={proj.name} className="w-full h-full object-cover" />
                      ) : (
                        <Gamepad2 className="size-8 text-white/30" />
                      )}
                    </div>
                    <div className="p-3 flex flex-col gap-1">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-white">
                        {proj.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-white/40">
                        <span>{proj.genre || 'All'}</span>
                        <span>👤 0</span>
                      </div>
                    </div>
                  </div>
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
                <div key={proj.id} className="rounded-xl overflow-hidden bg-[#161618] border border-white/[0.04] flex flex-col group cursor-pointer hover:border-white/10 transition-all">
                  <div className="aspect-[16/9] w-full bg-black/50 relative overflow-hidden flex items-center justify-center">
                    {proj.thumbnail ? (
                      <img src={proj.thumbnail} alt={proj.name} className="w-full h-full object-cover" />
                    ) : (
                      <Gamepad2 className="size-8 text-white/30" />
                    )}
                  </div>
                  <div className="p-3 flex flex-col gap-1">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-white">
                      {proj.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-white/40">
                      <span>{proj.genre || 'All'}</span>
                      <span>👤 0</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Other tabs placeholder */}
      {activeTab !== 'About' && activeTab !== 'Games' && (
        <UnderConstruction onGoBack={() => setActiveTab('About')} />
      )}
    </div>
  )
}
