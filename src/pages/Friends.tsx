import { useEffect, useState } from 'react'
import {
  Search,
  UserPlus,
  Check,
  X,
  UserMinus,
  Loader2,
  Users,
  HelpCircle,
} from 'lucide-react'
import { searchProfilesByUsername, type UserProfile } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import {
  loadFriends,
  addFriendFromProfile,
  removeFriend,
  FRIENDS_EVENT,
  type StoredFriend,
} from '@/lib/friendsStore'
import { addNotification } from '@/lib/notifications'
import { PlayerModel3D } from '@/components/PlayerModel3D'

type FriendsMainTab = 'friends' | 'following' | 'followers' | 'requests' | 'add'

interface FriendRequestItem {
  id: string
  name: string
  username: string
}

export function Friends() {
  const { user, profile } = useAuth()
  const ownerKey = user?.id || profile?.username || 'guest'

  const [activeTab, setActiveTab] = useState<FriendsMainTab>(() => {
    const sub = new URLSearchParams(window.location.search).get('subtab')
    if (sub === 'add' || sub === 'following' || sub === 'followers' || sub === 'requests') {
      return sub
    }
    return 'friends'
  })
  const [hoveredTab, setHoveredTab] = useState<FriendsMainTab | null>(null)
  const [searchFriendsQuery, setSearchFriendsQuery] = useState('')
  const [friends, setFriends] = useState<StoredFriend[]>(() => loadFriends(ownerKey))
  const [requests, setRequests] = useState<FriendRequestItem[]>([])

  // Add Friends tab search state
  const [playerQuery, setPlayerQuery] = useState('')
  const [playerResults, setPlayerResults] = useState<UserProfile[]>([])
  const [searchingPlayers, setSearchingPlayers] = useState(false)

  useEffect(() => {
    const sync = () => setFriends(loadFriends(ownerKey))
    sync()
    window.addEventListener(FRIENDS_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(FRIENDS_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [ownerKey])

  useEffect(() => {
    const onPopState = () => {
      const sub = new URLSearchParams(window.location.search).get('subtab')
      if (sub === 'add' || sub === 'following' || sub === 'followers' || sub === 'requests') {
        setActiveTab(sub)
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (activeTab !== 'add') return
    const clean = playerQuery.trim().replace(/^@/, '')
    if (!clean) {
      setPlayerResults([])
      setSearchingPlayers(false)
      return
    }
    let cancelled = false
    setSearchingPlayers(true)
    const timer = window.setTimeout(() => {
      searchProfilesByUsername(clean)
        .then((rows) => {
          if (!cancelled) setPlayerResults(rows)
        })
        .catch(() => {
          if (!cancelled) setPlayerResults([])
        })
        .finally(() => {
          if (!cancelled) setSearchingPlayers(false)
        })
    }, 200)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [playerQuery, activeTab])

  const filteredFriends = friends.filter((f) => {
    const q = searchFriendsQuery.trim().toLowerCase()
    if (!q) return true
    return (
      f.username.toLowerCase().includes(q) ||
      (f.displayName || '').toLowerCase().includes(q)
    )
  })

  const isAlreadyFriend = (p: UserProfile) =>
    friends.some(
      (f) =>
        f.id === p.auth_uid ||
        (p.id && f.profileId === p.id) ||
        f.username.toLowerCase() === p.username.toLowerCase(),
    )

  const isSelf = (p: UserProfile) =>
    Boolean(
      (user?.id && p.auth_uid === user.id) ||
        (profile?.id && p.id === profile.id) ||
        (profile?.username && p.username.toLowerCase() === profile.username.toLowerCase()),
    )

  const handleToggleFriend = (p: UserProfile) => {
    if (isSelf(p)) return
    if (isAlreadyFriend(p)) {
      const target = friends.find(
        (f) =>
          f.id === p.auth_uid ||
          (p.id && f.profileId === p.id) ||
          f.username.toLowerCase() === p.username.toLowerCase(),
      )
      if (target) setFriends(removeFriend(target.id, ownerKey))
    } else {
      setFriends(addFriendFromProfile(p, ownerKey))
      addNotification({
        title: p.display_name || p.username,
        body: `@${p.username} was added to your friends list.`,
        category: 'social',
        actionTab: 'Friends',
      })
    }
  }

  const tabs: { id: FriendsMainTab; label: string }[] = [
    { id: 'friends', label: 'Friends' },
    { id: 'following', label: 'Following' },
    { id: 'followers', label: 'Followers' },
    { id: 'requests', label: 'Requests' },
    { id: 'add', label: 'Add Friends' },
  ]

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-5 max-w-[1200px]">
      {/* Page Title */}
      <h1 className="text-2xl md:text-[28px] font-extrabold text-white tracking-tight m-0">
        My Friends
      </h1>

      {/* Sliding Highlight Tab Bar */}
      <div className="p-1.5 rounded-xl bg-white/[0.04]">
        <div
          className="relative grid grid-cols-5 gap-2"
          onMouseLeave={() => setHoveredTab(null)}
        >
          <div
            className="absolute inset-y-0 rounded-[8px] bg-white/[0.14] transition-[left] duration-200 ease-out pointer-events-none"
            style={{
              width: 'calc(20% - 6.4px)',
              left: `calc(${Math.max(
                0,
                tabs.findIndex((t) => t.id === (hoveredTab ?? activeTab)),
              )} * (20% + 1.6px))`,
            }}
          />
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                onMouseEnter={() => setHoveredTab(tab.id)}
                className={`relative z-10 h-10 rounded-[8px] text-xs md:text-sm font-bold transition-colors duration-150 cursor-pointer border-none bg-transparent outline-none ${
                  isActive ? 'text-white' : 'text-white/55 hover:text-white/90'
                }`}
              >
                <span>{tab.label}</span>
                {tab.id === 'requests' && requests.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-white/15 text-[10px] font-bold">
                    {requests.length}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab 1: Friends */}
      {activeTab === 'friends' && (
        <div className="flex flex-col gap-4">
          {/* Count + Search Friends */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-white m-0">
                Friends ({friends.length})
              </h2>
              <HelpCircle className="size-4 text-white/40" />
            </div>

            <div className="relative w-full sm:w-[240px]">
              <Search className="size-3.5 text-white/45 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search Friends"
                value={searchFriendsQuery}
                onChange={(e) => setSearchFriendsQuery(e.target.value)}
                className="w-full h-9 pl-8 pr-3 rounded-[8px] bg-[#1c1c1c] border border-white/[0.12] focus:border-white/30 text-xs text-white placeholder:text-white/40 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Friend Cards Grid */}
          {filteredFriends.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  onClick={() => {
                    if (friend.profileId) {
                      window.history.pushState({}, '', `/profile/${friend.profileId}`)
                      window.dispatchEvent(new PopStateEvent('popstate'))
                    }
                  }}
                  className="p-3.5 rounded-xl bg-[#141414]/90 hover:bg-[#1c1c1c] border border-white/[0.08] transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="size-16 rounded-full bg-[#1c1c1c] border border-white/[0.08] overflow-hidden shrink-0">
                      <PlayerModel3D mode="headshot" className="w-full h-full" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white truncate m-0">
                        {friend.displayName || friend.username}
                      </h3>
                      <p className="text-xs text-white/50 truncate m-0 mt-0.5">
                        @{friend.username}
                      </p>
                      <p className="text-[11px] text-white/40 m-0 mt-1">Offline</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFriend(friend.id, ownerKey)
                    }}
                    title="Remove friend"
                    className="size-8 rounded-lg bg-white/[0.06] hover:bg-red-500/20 text-white/45 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer border-none shrink-0"
                  >
                    <UserMinus className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-14 rounded-xl bg-[#141414]/90 border border-white/[0.08] flex flex-col items-center justify-center gap-2.5 text-center">
              <Users className="size-6 text-white/30" />
              <p className="text-xs text-white/55 m-0">
                {searchFriendsQuery.trim()
                  ? 'No friends match your search.'
                  : 'No friends yet. Open the Add Friends tab to find players.'}
              </p>
              {!searchFriendsQuery.trim() && (
                <button
                  type="button"
                  onClick={() => setActiveTab('add')}
                  className="mt-1 h-9 px-4 rounded-[10px] bg-white text-black hover:bg-neutral-200 text-xs font-bold cursor-pointer border-none transition-colors"
                >
                  Add Friends
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Following */}
      {activeTab === 'following' && (
        <div className="py-14 rounded-xl bg-[#141414]/90 border border-white/[0.08] flex flex-col items-center justify-center gap-2 text-center">
          <Users className="size-6 text-white/30" />
          <p className="text-xs text-white/55 m-0">You are not following anyone yet.</p>
        </div>
      )}

      {/* Tab 3: Followers */}
      {activeTab === 'followers' && (
        <div className="py-14 rounded-xl bg-[#141414]/90 border border-white/[0.08] flex flex-col items-center justify-center gap-2 text-center">
          <Users className="size-6 text-white/30" />
          <p className="text-xs text-white/55 m-0">No followers yet.</p>
        </div>
      )}

      {/* Tab 4: Requests */}
      {activeTab === 'requests' && (
        <div className="flex flex-col gap-3">
          {requests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-xl bg-[#141414]/90 border border-white/[0.08] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-12 rounded-full bg-[#1c1c1c] border border-white/[0.08] overflow-hidden shrink-0">
                      <PlayerModel3D mode="headshot" className="w-full h-full" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white truncate m-0">{req.name}</h3>
                      <p className="text-xs text-white/50 truncate m-0">@{req.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setRequests((prev) => prev.filter((r) => r.id !== req.id))}
                      className="size-8 rounded-lg bg-white text-black hover:bg-neutral-200 flex items-center justify-center cursor-pointer border-none"
                    >
                      <Check className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setRequests((prev) => prev.filter((r) => r.id !== req.id))}
                      className="size-8 rounded-lg bg-white/10 hover:bg-white/20 text-white/75 flex items-center justify-center cursor-pointer border-none"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-14 rounded-xl bg-[#141414]/90 border border-white/[0.08] flex flex-col items-center justify-center gap-2 text-center">
              <Users className="size-6 text-white/30" />
              <p className="text-xs text-white/55 m-0">No pending friend requests.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Add Friends */}
      {activeTab === 'add' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-white m-0">Add Friends</h2>
            <div className="relative w-full sm:w-[280px]">
              <Search className="size-3.5 text-white/45 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                autoFocus
                placeholder="Search players by username..."
                value={playerQuery}
                onChange={(e) => setPlayerQuery(e.target.value)}
                className="w-full h-9 pl-8 pr-3 rounded-[8px] bg-[#1c1c1c] border border-white/[0.12] focus:border-white/30 text-xs text-white placeholder:text-white/40 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {searchingPlayers ? (
            <div className="py-14 rounded-xl bg-[#141414]/90 border border-white/[0.08] flex items-center justify-center gap-2 text-xs text-white/55">
              <Loader2 className="size-4 animate-spin" />
              <span>Searching players...</span>
            </div>
          ) : !playerQuery.trim() ? (
            <div className="py-14 rounded-xl bg-[#141414]/90 border border-white/[0.08] flex flex-col items-center justify-center gap-2 text-center">
              <Search className="size-6 text-white/30" />
              <p className="text-xs text-white/55 m-0">
                Type a username above to find and add players.
              </p>
            </div>
          ) : playerResults.length === 0 ? (
            <div className="py-14 rounded-xl bg-[#141414]/90 border border-white/[0.08] flex flex-col items-center justify-center gap-2 text-center">
              <Users className="size-6 text-white/30" />
              <p className="text-xs text-white/55 m-0">
                No players found matching "{playerQuery.trim()}".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {playerResults.map((p) => {
                const self = isSelf(p)
                const added = isAlreadyFriend(p)
                return (
                  <div
                    key={p.auth_uid || p.id}
                    className="p-3.5 rounded-xl bg-[#141414]/90 border border-white/[0.08] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="size-14 rounded-full bg-[#1c1c1c] border border-white/[0.08] overflow-hidden shrink-0">
                        <PlayerModel3D mode="headshot" className="w-full h-full" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-white truncate m-0">
                          {p.display_name || p.username}
                        </h3>
                        <p className="text-xs text-white/50 truncate m-0 mt-0.5">
                          @{p.username}
                        </p>
                      </div>
                    </div>

                    {self ? (
                      <span className="px-3 py-1.5 rounded-[8px] bg-white/[0.06] text-xs font-semibold text-white/45 shrink-0">
                        You
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggleFriend(p)}
                        className={`h-8 px-3.5 rounded-[8px] text-xs font-bold flex items-center gap-1.5 cursor-pointer border-none transition-colors shrink-0 ${
                          added
                            ? 'bg-white/[0.1] hover:bg-white/[0.16] text-white/85'
                            : 'bg-white text-black hover:bg-neutral-200'
                        }`}
                      >
                        {added ? (
                          <>
                            <Check className="size-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="size-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
