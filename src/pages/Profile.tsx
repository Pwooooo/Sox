import { useState } from 'react'
import { Calendar, Users, Eye, Trophy, Sparkles, Share2, Edit3, ShieldCheck, Gamepad2, Award } from 'lucide-react'
import { RECOMMENDED_GAMES } from '@/data/homeGames'
import { ITEMS } from '@/data/items'

export function Profile() {
  const [activeTab, setActiveTab] = useState<'about' | 'creations' | 'inventory' | 'badges'>('about')
  const [statusText, setStatusText] = useState('Grinding The Strongest Battlegrounds ranked 🔥')
  const [isEditingStatus, setIsEditingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState(statusText)

  const handleSaveStatus = () => {
    setStatusText(newStatus)
    setIsEditingStatus(false)
  }

  const BADGES = [
    { id: 'b1', name: 'Veteran Builder', desc: 'Active member for over 2 years', icon: Trophy },
    { id: 'b2', name: 'Top Duelist', desc: 'Won 500+ PvP matches', icon: Award },
    { id: 'b3', name: 'Early Adopter', desc: 'Joined during Novelo Alpha', icon: Sparkles },
    { id: 'b4', name: 'Creator Verified', desc: 'Verified experience developer', icon: ShieldCheck },
  ]

  return (
    <div className="p-4 md:p-6 lg:p-7 flex flex-col gap-6 max-w-[1400px]">
      {/* Profile Header Card */}
      <div className="relative rounded-2xl bg-[#121212]/90 border border-white/10 overflow-hidden shadow-2xl">
        {/* Banner */}
        <div className="h-36 md:h-48 bg-gradient-to-r from-neutral-900 via-[#181818] to-neutral-800 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_70%)]" />
        </div>

        {/* User Info Bar */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-4">
          {/* Avatar + Main Details */}
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-16 md:-mt-20">
            {/* Avatar Headshot */}
            <div className="size-28 md:size-32 rounded-2xl bg-[#181818] border-4 border-[#121212] flex items-center justify-center overflow-hidden shadow-2xl relative">
              <div className="relative size-20 flex flex-col items-center justify-center">
                <div className="size-14 rounded-sm bg-white flex flex-col items-center justify-center relative shadow-sm">
                  <div className="flex gap-3 mb-1">
                    <div className="size-1.5 rounded-full bg-black" />
                    <div className="size-1.5 rounded-full bg-black" />
                  </div>
                  <div className="w-4 h-1.5 border-b-2 border-black rounded-b-full" />
                </div>
                <div className="w-16 h-4 bg-neutral-900 -mt-1 rounded-b flex items-center justify-center">
                  <div className="w-3 h-2 bg-white/40 rounded-sm" />
                </div>
              </div>
            </div>

            {/* Name, Tag, Join Date */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Sky</h1>
                <ShieldCheck className="size-5 text-[#00a2ff]" />
              </div>
              <span className="text-xs text-white/50">@sky • Joined August 2022</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href)
                alert('Profile link copied to clipboard!')
              }}
              className="h-9 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border-none"
            >
              <Share2 className="size-3.5" />
              <span>Share</span>
            </button>
            <button
              onClick={() => alert('Settings opened')}
              className="h-9 px-4 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border-none shadow-md"
            >
              <Edit3 className="size-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-white/[0.08] divide-x divide-white/[0.08] bg-[#0e0e0e]/50 py-3 text-center">
          <div>
            <span className="text-xs text-white/50 block">Friends</span>
            <span className="text-base font-black text-white tabular-numbers">142</span>
          </div>
          <div>
            <span className="text-xs text-white/50 block">Followers</span>
            <span className="text-base font-black text-white tabular-numbers">1.2K</span>
          </div>
          <div>
            <span className="text-xs text-white/50 block">Following</span>
            <span className="text-base font-black text-white tabular-numbers">89</span>
          </div>
          <div>
            <span className="text-xs text-white/50 block">Place Visits</span>
            <span className="text-base font-black text-white tabular-numbers">45.2K</span>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-4 rounded-xl bg-[#121212]/80 border border-white/10 flex items-center justify-between gap-3">
        {isEditingStatus ? (
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="flex-1 h-9 px-3 rounded-lg bg-[#1a1a1a] border border-white/10 text-xs text-white focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleSaveStatus}
              className="h-9 px-3.5 rounded-lg bg-white text-black text-xs font-bold cursor-pointer border-none"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-white/80">
            <span className="font-bold text-white/50">Status:</span>
            <span className="italic">"{statusText}"</span>
          </div>
        )}

        {!isEditingStatus && (
          <button
            onClick={() => {
              setNewStatus(statusText)
              setIsEditingStatus(true)
            }}
            className="text-xs text-white/50 hover:text-white cursor-pointer bg-transparent border-none flex items-center gap-1"
          >
            <Edit3 className="size-3" />
            <span>Update</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
        {(['about', 'creations', 'inventory', 'badges'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer border-none ${
              activeTab === tab
                ? 'bg-white text-black shadow-md'
                : 'bg-transparent text-white/60 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'about' && (
        <div className="flex flex-col gap-5">
          {/* About Box */}
          <div className="p-5 rounded-2xl bg-[#121212]/80 border border-white/10 flex flex-col gap-2">
            <h3 className="text-sm font-bold text-white">About</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Hey! I am Sky. I make fast-paced PvP and battleground games on Novelo.
              Feel free to send a trade or friend request if we played together.
              Currently working on a major combat update.
            </p>
          </div>

          {/* Currently Wearing Showcase */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white">Currently Wearing</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {ITEMS.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-[#141414] border border-white/10 flex flex-col items-center gap-2 text-center"
                >
                  <div className="size-16 rounded-lg bg-neutral-900 border border-white/5 flex items-center justify-center text-xs text-white/50">
                    <Sparkles className="size-6 text-white/30" />
                  </div>
                  <span className="text-xs font-bold text-white truncate max-w-full">{item.name}</span>
                  <span className="text-[10px] text-white/40 capitalize">{item.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'creations' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {RECOMMENDED_GAMES.slice(0, 3).map((game) => (
            <div
              key={game.id}
              className="rounded-xl bg-[#141414] border border-white/10 overflow-hidden flex flex-col"
            >
              <div className="aspect-[16/9] w-full overflow-hidden">
                <img src={game.thumbnail} alt={game.name} className="size-full object-cover" />
              </div>
              <div className="p-3.5 flex flex-col gap-1">
                <h4 className="text-sm font-bold text-white truncate">{game.name}</h4>
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>{game.players} Playing</span>
                  <span>{game.likePercent}% Rating</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {ITEMS.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-[#141414] border border-white/10 flex flex-col items-center gap-2 text-center hover:border-white/20 transition-all cursor-pointer"
            >
              <div className="size-16 rounded-lg bg-neutral-900 border border-white/5 flex items-center justify-center text-xs text-white/50">
                <Sparkles className="size-6 text-white/30" />
              </div>
              <span className="text-xs font-bold text-white truncate max-w-full">{item.name}</span>
              <span className="text-[10px] text-white/40">{item.price === 0 ? 'FREE' : `${item.price} Novelo`}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {BADGES.map((b) => {
            const Icon = b.icon
            return (
              <div
                key={b.id}
                className="p-4 rounded-xl bg-[#141414] border border-white/10 flex items-center gap-3"
              >
                <div className="size-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0">
                  <Icon className="size-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{b.name}</h4>
                  <p className="text-[11px] text-white/50 mt-0.5">{b.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
