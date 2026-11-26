import { useEffect, useState } from 'react'
import { X, Search, UserPlus, Check, Loader2, Users } from 'lucide-react'
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

interface AddFriendsModalProps {
  open: boolean
  onClose: () => void
}

export function AddFriendsModal({ open, onClose }: AddFriendsModalProps) {
  const { user, profile } = useAuth()
  const ownerKey = user?.id || profile?.username || 'guest'

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UserProfile[]>([])
  const [searching, setSearching] = useState(false)
  const [friends, setFriends] = useState<StoredFriend[]>(() => loadFriends(ownerKey))

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
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const clean = query.trim().replace(/^@/, '')
    if (!clean) {
      setResults([])
      setSearching(false)
      return
    }
    let cancelled = false
    setSearching(true)
    const timer = window.setTimeout(() => {
      searchProfilesByUsername(clean)
        .then((rows) => {
          if (!cancelled) setResults(rows)
        })
        .catch(() => {
          if (!cancelled) setResults([])
        })
        .finally(() => {
          if (!cancelled) setSearching(false)
        })
    }, 200)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [query, open])

  if (!open) return null

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

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-[440px] rounded-2xl bg-[#141418] border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Users className="size-4 text-white/80" />
            <h2 className="text-base font-bold text-white m-0">Add Friends</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="size-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.14] flex items-center justify-center text-white/75 hover:text-white cursor-pointer border-none transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-white/[0.06]">
          <div className="relative">
            <Search className="size-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search players by username..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-black/40 border border-white/10 focus:border-white/30 text-sm text-white placeholder:text-white/40 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[320px] min-h-[180px] overflow-y-auto no-scrollbar p-2">
          {searching ? (
            <div className="h-[160px] flex items-center justify-center gap-2 text-xs text-white/55">
              <Loader2 className="size-4 animate-spin" />
              <span>Searching players...</span>
            </div>
          ) : !query.trim() ? (
            <div className="h-[160px] flex flex-col items-center justify-center gap-2 text-center px-4">
              <Search className="size-6 text-white/25" />
              <p className="text-xs text-white/50 m-0">
                Type a username to find and add players as friends.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="h-[160px] flex flex-col items-center justify-center gap-2 text-center px-4">
              <Users className="size-6 text-white/25" />
              <p className="text-xs text-white/50 m-0">
                No players found matching "{query.trim()}".
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {results.map((p) => {
                const self = isSelf(p)
                const added = isAlreadyFriend(p)
                return (
                  <div
                    key={p.auth_uid || p.id}
                    className="px-3 py-2.5 rounded-xl hover:bg-white/[0.04] flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-10 rounded-full bg-white/[0.08] border border-white/10 overflow-hidden shrink-0">
                        <PlayerModel3D mode="headshot" className="w-full h-full" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate m-0">
                          {p.display_name || p.username}
                        </p>
                        <p className="text-xs text-white/45 truncate m-0">@{p.username}</p>
                      </div>
                    </div>

                    {self ? (
                      <span className="px-3 py-1.5 rounded-lg bg-white/[0.06] text-xs font-semibold text-white/45 shrink-0">
                        You
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggleFriend(p)}
                        className={`h-8 px-3.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer border-none transition-colors shrink-0 ${
                          added
                            ? 'bg-white/[0.1] hover:bg-white/[0.16] text-white/85'
                            : 'bg-[#02b070] hover:bg-[#009b62] text-white'
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
      </div>
    </div>
  )
}
