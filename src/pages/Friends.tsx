import { useState } from 'react'
import { Search, UserPlus, Check, X, MessageSquare, Play, MoreVertical, ShieldAlert, UserCheck } from 'lucide-react'

interface Friend {
  id: string
  name: string
  tag: string
  status: 'in-game' | 'online' | 'offline'
  gameName?: string
  avatarBg: string
  headColor: string
  shirtColor: string
}

const INITIAL_FRIENDS: Friend[] = [
  {
    id: '1',
    name: 'Carro',
    tag: '@carro_dev',
    status: 'in-game',
    gameName: 'The Strongest Battlegrounds',
    avatarBg: '#1f2024',
    headColor: '#fcd34d',
    shirtColor: '#3b82f6',
  },
  {
    id: '2',
    name: 'dev',
    tag: '@core_dev',
    status: 'in-game',
    gameName: 'Sword Fighting Tournament',
    avatarBg: '#1f2024',
    headColor: '#18181b',
    shirtColor: '#166534',
  },
  {
    id: '3',
    name: 'Krampus',
    tag: '@krampus_99',
    status: 'online',
    avatarBg: '#1f2024',
    headColor: '#9ca3af',
    shirtColor: '#6b7280',
  },
  {
    id: '4',
    name: 'PixelKnight',
    tag: '@pixel_pro',
    status: 'offline',
    avatarBg: '#1f2024',
    headColor: '#facc15',
    shirtColor: '#eab308',
  },
]

const INITIAL_REQUESTS = [
  { id: 'r1', name: 'VortexBuilder', tag: '@vortex_b', mutualFriends: 2, headColor: '#ef4444' },
  { id: 'r2', name: 'NeonSamurai', tag: '@neon_s', mutualFriends: 5, headColor: '#06b6d4' },
  { id: 'r3', name: 'ShadowGamer', tag: '@shadow_g', mutualFriends: 1, headColor: '#a855f7' },
]

export function Friends() {
  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'requests'>('all')
  const [search, setSearch] = useState('')
  const [friends, setFriends] = useState(INITIAL_FRIENDS)
  const [requests, setRequests] = useState(INITIAL_REQUESTS)
  const [addUsername, setAddUsername] = useState('')
  const [requestSent, setRequestSent] = useState(false)

  const handleAccept = (id: string) => {
    const req = requests.find((r) => r.id === id)
    if (req) {
      setFriends((prev) => [
        ...prev,
        {
          id: req.id,
          name: req.name,
          tag: req.tag,
          status: 'online',
          avatarBg: '#1f2024',
          headColor: req.headColor,
          shirtColor: '#3b82f6',
        },
      ])
      setRequests((prev) => prev.filter((r) => r.id !== id))
    }
  }

  const handleDecline = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id))
  }

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!addUsername.trim()) return
    setRequestSent(true)
    setTimeout(() => {
      setAddUsername('')
      setRequestSent(false)
    }, 2000)
  }

  const filteredFriends = friends.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.tag.toLowerCase().includes(search.toLowerCase())
    if (!matchesSearch) return false
    if (activeTab === 'online') return f.status === 'in-game' || f.status === 'online'
    return true
  })

  return (
    <div className="p-4 md:p-6 lg:p-7 flex flex-col gap-6 max-w-[1700px]">
      {/* Title & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Friends
          </h1>
          <p className="text-xs md:text-sm text-white/50 mt-0.5">
            Manage your friends, pending requests, and party up in games
          </p>
        </div>

        {/* Add Friend Form */}
        <form onSubmit={handleSendRequest} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add by username (@user)..."
            value={addUsername}
            onChange={(e) => setAddUsername(e.target.value)}
            className="h-10 px-3.5 rounded-xl bg-[#141414]/90 border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-white/30"
          />
          <button
            type="submit"
            disabled={requestSent}
            className="h-10 px-4 rounded-xl bg-white text-black hover:bg-neutral-200 transition-all font-bold text-xs flex items-center gap-1.5 cursor-pointer border-none shrink-0"
          >
            {requestSent ? <UserCheck className="size-4" /> : <UserPlus className="size-4" />}
            <span>{requestSent ? 'Sent!' : 'Add'}</span>
          </button>
        </form>
      </div>

      {/* Tabs Row (No outline, matching Luduvo tab animations) */}
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 h-9 rounded-[10px] text-xs font-semibold transition-all duration-150 cursor-pointer border-none outline-none select-none active:scale-[0.97] ${
              activeTab === 'all'
                ? 'bg-white/[0.08] backdrop-blur-xs text-white font-bold shadow-xs'
                : 'bg-transparent text-white/50 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            All ({friends.length})
          </button>

          <button
            onClick={() => setActiveTab('online')}
            className={`px-3.5 h-9 rounded-[10px] text-xs font-semibold transition-all duration-150 cursor-pointer border-none outline-none select-none active:scale-[0.97] ${
              activeTab === 'online'
                ? 'bg-white/[0.08] backdrop-blur-xs text-white font-bold shadow-xs'
                : 'bg-transparent text-white/50 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Online ({friends.filter((f) => f.status !== 'offline').length})
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3.5 h-9 rounded-[10px] text-xs font-semibold transition-all duration-150 cursor-pointer border-none outline-none select-none active:scale-[0.97] flex items-center gap-1.5 ${
              activeTab === 'requests'
                ? 'bg-white/[0.08] backdrop-blur-xs text-white font-bold shadow-xs'
                : 'bg-transparent text-white/50 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <span>Requests</span>
            {requests.length > 0 && (
              <span className="size-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-black">
                {requests.length}
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative w-48 md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/40" />
          <input
            type="text"
            placeholder="Search friends..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-lg bg-[#141414] border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none"
          />
        </div>
      </div>

      {/* Requests Tab */}
      {activeTab === 'requests' ? (
        <div className="flex flex-col gap-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className="p-3.5 rounded-xl bg-[#141414]/90 border border-white/10 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className="size-11 rounded-full border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-sm"
                  style={{ backgroundColor: req.headColor }}
                >
                  <div className="size-3 bg-black/60 rounded-xs" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">{req.name}</h4>
                  <p className="text-xs text-white/50">{req.tag} • {req.mutualFriends} mutual friends</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAccept(req.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 transition-colors font-bold text-xs flex items-center gap-1 cursor-pointer border-none"
                >
                  <Check className="size-3.5" />
                  <span>Accept</span>
                </button>
                <button
                  onClick={() => handleDecline(req.id)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors font-bold text-xs flex items-center gap-1 cursor-pointer border-none"
                >
                  <X className="size-3.5" />
                  <span>Decline</span>
                </button>
              </div>
            </div>
          ))}

          {requests.length === 0 && (
            <div className="py-16 text-center text-white/40 text-xs">
              No pending friend requests.
            </div>
          )}
        </div>
      ) : (
        /* Friends Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredFriends.map((friend) => (
            <div
              key={friend.id}
              className="p-4 rounded-xl bg-[#141414]/80 hover:bg-[#181818]/90 border border-white/10 transition-all flex flex-col gap-3 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div
                      className="size-12 rounded-full border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-md"
                      style={{ backgroundColor: friend.avatarBg }}
                    >
                      <div
                        className="size-6 rounded-xs flex items-center justify-center shadow-xs"
                        style={{ backgroundColor: friend.headColor }}
                      >
                        <div className="size-1 rounded-full bg-black/80" />
                      </div>
                    </div>

                    {/* Status Dot */}
                    <span
                      className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-[#141414] ${
                        friend.status === 'in-game'
                          ? 'bg-blue-500'
                          : friend.status === 'online'
                          ? 'bg-emerald-500'
                          : 'bg-neutral-600'
                      }`}
                    />
                  </div>

                  {/* Name & Tag */}
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-white transition-colors">
                      {friend.name}
                    </h3>
                    <p className="text-[11px] text-white/50">{friend.tag}</p>
                  </div>
                </div>
              </div>

              {/* Status details */}
              <div className="text-xs min-h-[32px] flex items-center">
                {friend.status === 'in-game' ? (
                  <div className="flex items-center gap-1.5 text-blue-400 font-medium truncate">
                    <Play className="size-3 fill-current shrink-0" />
                    <span className="truncate">Playing {friend.gameName}</span>
                  </div>
                ) : friend.status === 'online' ? (
                  <span className="text-emerald-400 font-medium">Online on website</span>
                ) : (
                  <span className="text-white/40">Offline</span>
                )}
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-white/[0.06]">
                {friend.status === 'in-game' && (
                  <button
                    onClick={() => alert(`Joining ${friend.name} in ${friend.gameName}...`)}
                    className="flex-1 h-8 rounded-lg bg-[#02b070] hover:bg-[#009b62] text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border-none"
                  >
                    <Play className="size-3 fill-current" />
                    <span>Join</span>
                  </button>
                )}
                <button
                  onClick={() => alert(`Opening chat with ${friend.name}...`)}
                  className={`h-8 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none ${
                    friend.status === 'in-game' ? 'px-3' : 'flex-1'
                  }`}
                >
                  <MessageSquare className="size-3.5" />
                  <span>Chat</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
