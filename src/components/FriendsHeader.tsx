import { Plus } from 'lucide-react'

interface FriendItem {
  id: string
  name: string
  avatarBg: string
  headColor: string
  shirtColor?: string
  hat?: 'boat' | 'horns' | 'none'
  avatarUrl?: string
}

const FRIENDS_DATA: FriendItem[] = [
  {
    id: 'f-1',
    name: 'Carro',
    avatarBg: '#1f2024',
    headColor: '#fcd34d',
    shirtColor: '#3b82f6',
    hat: 'boat',
  },
  {
    id: 'f-2',
    name: 'dev',
    avatarBg: '#1f2024',
    headColor: '#18181b',
    shirtColor: '#166534',
    hat: 'horns',
  },
  {
    id: 'f-3',
    name: 'Krampus',
    avatarBg: '#1f2024',
    headColor: '#9ca3af',
    shirtColor: '#6b7280',
    hat: 'none',
  },
  {
    id: 'f-4',
    name: 'Krampus',
    avatarBg: '#1f2024',
    headColor: '#facc15',
    shirtColor: '#eab308',
    hat: 'none',
  },
]

export function FriendsHeader({ username = 'Sky' }: { username?: string }) {
  // Determine greeting based on local hour
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex flex-col gap-4">
      {/* Top Profile Avatar & Greeting */}
      <div className="flex items-center gap-4">
        {/* User Circular Headshot Avatar matching Screenshot 5 */}
        <div className="size-14 md:size-16 rounded-full bg-[#181818] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
          {/* Blocky avatar illustration with collar / bow */}
          <div className="relative size-10 md:size-11 flex flex-col items-center">
            {/* Head */}
            <div className="size-8 rounded-sm bg-white flex flex-col items-center justify-center relative shadow-sm">
              {/* Eyes */}
              <div className="flex gap-2 mb-0.5">
                <div className="size-1 rounded-full bg-black" />
                <div className="size-1 rounded-full bg-black" />
              </div>
              {/* Smile */}
              <div className="w-2.5 h-1 border-b-[1.5px] border-black rounded-b-full" />
            </div>
            {/* Neck / Collar */}
            <div className="w-10 h-3 bg-neutral-900 -mt-0.5 rounded-b flex items-center justify-center">
              <div className="w-2 h-1.5 bg-white/40 rounded-sm" />
            </div>
          </div>
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

        <div className="flex items-center gap-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {FRIENDS_DATA.map((friend) => (
            <div
              key={friend.id}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
            >
              {/* Friend Avatar Circle */}
              <div className="size-14 md:size-16 rounded-full bg-[#181818] border border-white/10 group-hover:border-white/30 transition-all flex items-center justify-center overflow-hidden shadow-sm">
                <div className="relative size-10 flex flex-col items-center justify-center">
                  {/* Hat accessories if present */}
                  {friend.hat === 'boat' && (
                    <div className="w-7 h-2.5 bg-neutral-200 border border-neutral-400 rounded-t-sm -mb-0.5 z-10 flex items-center justify-center">
                      <div className="size-1 bg-red-600 rounded-full" />
                    </div>
                  )}
                  {friend.hat === 'horns' && (
                    <div className="flex justify-between w-6 -mb-1 z-10">
                      <div className="w-1 h-2 bg-neutral-900 rotate-[-20deg]" />
                      <div className="w-1 h-2 bg-neutral-900 rotate-[20deg]" />
                    </div>
                  )}

                  {/* Blocky Head */}
                  <div
                    className="size-7 rounded-sm flex flex-col items-center justify-center relative shadow-sm"
                    style={{ backgroundColor: friend.headColor }}
                  >
                    <div className="flex gap-1.5 mb-0.5">
                      <div className="size-1 rounded-full bg-black/80" />
                      <div className="size-1 rounded-full bg-black/80" />
                    </div>
                    <div className="w-2 h-0.5 border-b border-black/80 rounded-b-full" />
                  </div>

                  {/* Torso glimpse */}
                  <div
                    className="w-8 h-2 rounded-t-sm -mt-0.5"
                    style={{ backgroundColor: friend.shirtColor || '#333' }}
                  />
                </div>
              </div>

              {/* Friend Name */}
              <span className="text-xs font-semibold text-white/80 group-hover:text-white truncate max-w-[64px] text-center">
                {friend.name}
              </span>
            </div>
          ))}

          {/* Add Friends Button */}
          <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
            <div className="size-14 md:size-16 rounded-full bg-[#141414] hover:bg-[#1c1c1c] border border-white/10 group-hover:border-white/30 transition-all flex items-center justify-center text-white/60 group-hover:text-white shadow-sm">
              <Plus className="size-5 stroke-[2.5]" />
            </div>
            <span className="text-xs font-semibold text-white/60 group-hover:text-white truncate max-w-[68px] text-center">
              Add Friends
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
