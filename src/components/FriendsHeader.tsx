import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { PlayerModel3D } from '@/components/PlayerModel3D'
import { useAuth } from '@/lib/auth'
import { loadFriends, FRIENDS_EVENT, type StoredFriend } from '@/lib/friendsStore'

export function FriendsHeader({ username = 'Sky' }: { username?: string }) {
  const { user, profile } = useAuth()
  const ownerKey = user?.id || profile?.username || 'guest'
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

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex flex-col gap-4">
      {/* Top Profile Avatar & Greeting */}
      <div className="flex items-center gap-4">
        {/* User Circular Headshot Avatar */}
        <div className="size-14 md:size-16 rounded-full bg-[#181818] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
          <PlayerModel3D mode="headshot" className="w-full h-full" />
        </div>

        {/* Greeting Text */}
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          {greeting}, {username}
        </h1>
      </div>

      {/* Friends Subtitle & Circular List */}
      <div className="flex flex-col gap-2.5">
        <h2 className="text-sm font-semibold text-white/90 tracking-tight">
          Friends
        </h2>

        <div
          className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {friends.map((friend) => (
            <button
              key={friend.id}
              type="button"
              onClick={() => {
                if (friend.profileId) {
                  window.history.pushState({}, '', `/profile/${friend.profileId}`)
                  window.dispatchEvent(new PopStateEvent('popstate'))
                }
              }}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group bg-transparent border-none p-0"
              title={friend.displayName || friend.username}
            >
              {/* Friend Avatar Circle */}
              <div className="size-14 md:size-16 rounded-full bg-[#181818] border border-white/10 group-hover:border-white/30 transition-all flex items-center justify-center overflow-hidden shadow-sm">
                <PlayerModel3D mode="headshot" className="w-full h-full" />
              </div>

              {/* Friend Name */}
              <span className="text-xs font-semibold text-white/80 group-hover:text-white truncate max-w-[64px] text-center">
                {friend.displayName || friend.username}
              </span>
            </button>
          ))}

          {/* Add Friends Button */}
          <button
            type="button"
            onClick={() => {
              window.history.pushState({}, '', '/?tab=Friends&subtab=add')
              window.dispatchEvent(new PopStateEvent('popstate'))
            }}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group bg-transparent border-none p-0"
          >
            <div className="size-14 md:size-16 rounded-full bg-[#141414] hover:bg-[#1c1c1c] border border-white/10 group-hover:border-white/30 transition-all flex items-center justify-center text-white/60 group-hover:text-white shadow-sm">
              <Plus className="size-5 stroke-[2.5]" />
            </div>
            <span className="text-xs font-semibold text-white/60 group-hover:text-white truncate max-w-[68px] text-center">
              Add Friends
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
