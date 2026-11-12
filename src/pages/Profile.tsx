import { useState } from 'react'
import { Edit3, MoreHorizontal, Users, Calendar, Clock, ChevronRight, Cat, Rocket } from 'lucide-react'
import { UnderConstruction } from '@/components/UnderConstruction'

export function Profile() {
  const [activeTab, setActiveTab] = useState<'About' | 'Games' | 'Groups' | 'Inventory' | 'Wishlist'>('About')

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
                  {/* Blocky Character Headshot */}
                  <div className="relative size-16 flex flex-col items-center justify-center">
                    <div className="size-11 rounded-sm bg-white flex flex-col items-center justify-center relative shadow-sm">
                      <div className="flex gap-2.5 mb-0.5">
                        <div className="size-1 rounded-full bg-black" />
                        <div className="size-1 rounded-full bg-black" />
                      </div>
                      <div className="w-3.5 h-1 border-b-[1.5px] border-black rounded-b-full" />
                    </div>
                    {/* Collar & Bow */}
                    <div className="w-14 h-3 bg-neutral-900 -mt-0.5 rounded-b flex items-center justify-center">
                      <div className="size-2 bg-neutral-400 rotate-45" />
                    </div>
                  </div>
                </div>

                {/* Blue Online / Verified Dot */}
                <span className="absolute bottom-1 right-1 size-5 rounded-full bg-[#00a2ff] border-3 border-[#0a0a0a] shadow-sm" />
              </div>

              {/* Username & Badges */}
              <div className="flex flex-col mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Sky</h1>
                  {/* Cat badge & Rocket badge */}
                  <Cat className="size-4 text-white/80" />
                  <Rocket className="size-4 text-white/80" />
                </div>
                <span className="text-xs text-white/50 font-medium">@sky</span>
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
          <div className="md:col-span-4 rounded-2xl bg-[#0f0f12] border border-white/[0.05] p-6 flex flex-col items-center justify-center min-h-[380px] shadow-xl relative overflow-hidden">
            {/* Ground Ambient Glow */}
            <div className="absolute bottom-10 w-44 h-8 bg-black/80 rounded-full blur-md" />

            {/* Blocky Character Standing */}
            <div className="relative flex flex-col items-center transition-transform hover:scale-105 duration-300">
              {/* Head */}
              <div className="size-16 rounded-sm bg-white flex flex-col items-center justify-center relative shadow-sm z-10">
                <div className="flex gap-3 mb-1">
                  <div className="size-1.5 rounded-full bg-black" />
                  <div className="size-1.5 rounded-full bg-black" />
                </div>
                <div className="w-4 h-1 border-b-2 border-black rounded-b-full" />
              </div>

              {/* Torso & Uniform with Collar and Buttons */}
              <div className="flex items-start gap-1 mt-1 z-10">
                {/* Left Arm */}
                <div className="w-8 h-24 bg-[#141416] rounded-sm shadow-md" />

                {/* Torso */}
                <div className="w-20 h-24 bg-[#141416] rounded-sm shadow-md flex flex-col items-center pt-1 relative">
                  {/* Collar frills */}
                  <div className="w-16 h-3 bg-white/90 rounded-sm flex items-center justify-center mb-1">
                    <div className="size-2 bg-neutral-900 rotate-45" />
                  </div>
                  {/* Uniform Double Buttons */}
                  <div className="flex flex-col gap-2 mt-1">
                    <div className="flex gap-4">
                      <div className="size-1 rounded-full bg-neutral-400" />
                      <div className="size-1 rounded-full bg-neutral-400" />
                    </div>
                    <div className="flex gap-4">
                      <div className="size-1 rounded-full bg-neutral-400" />
                      <div className="size-1 rounded-full bg-neutral-400" />
                    </div>
                  </div>
                </div>

                {/* Right Arm */}
                <div className="w-8 h-24 bg-[#141416] rounded-sm shadow-md" />
              </div>

              {/* Legs with Frills & Stockings */}
              <div className="flex items-center gap-1 mt-1 z-10">
                {/* Left Leg */}
                <div className="w-9 h-24 bg-[#141416] rounded-b-sm flex flex-col justify-start">
                  <div className="w-full h-4 bg-white/95 rounded-t-xs" />
                </div>
                {/* Right Leg */}
                <div className="w-9 h-24 bg-[#141416] rounded-b-sm flex flex-col justify-start">
                  <div className="w-full h-4 bg-white/95 rounded-t-xs flex items-center justify-center">
                    <div className="size-1 bg-black rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Game Showcase Card */}
          <div className="md:col-span-8 rounded-2xl bg-[#0f0f12] border border-white/[0.05] p-5 flex flex-col gap-4 shadow-xl">
            {/* Title with Arrow */}
            <div className="flex items-center gap-1 text-sm font-bold text-white tracking-tight cursor-pointer hover:text-white/80 transition-colors">
              <span>Game Showcase</span>
              <ChevronRight className="size-4" />
            </div>

            {/* Showcase Cards Grid matching Image 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1 */}
              <div className="rounded-xl overflow-hidden bg-[#161618] border border-white/[0.04] flex flex-col group cursor-pointer hover:border-white/10 transition-all">
                <div className="aspect-[16/9] w-full bg-emerald-950/40 relative overflow-hidden flex items-center justify-center">
                  {/* Clean Roblox Baseplate rendering */}
                  <div className="w-full h-full bg-gradient-to-b from-[#9bc4e2] to-[#5a9159] relative flex items-center justify-center">
                    <div className="w-20 h-10 bg-white/90 border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)] rounded-sm" />
                  </div>
                </div>
                <div className="p-3 flex flex-col gap-1">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-white">
                    new update
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-white/40">
                    <span>N/A</span>
                    <span>👤 0</span>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="rounded-xl overflow-hidden bg-[#161618] border border-white/[0.04] flex flex-col group cursor-pointer hover:border-white/10 transition-all">
                <div className="aspect-[16/9] w-full bg-emerald-950/40 relative overflow-hidden flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-b from-[#9bc4e2] to-[#5a9159] relative flex items-end justify-center">
                    <div className="w-32 h-20 bg-neutral-200/90 rounded-t-sm shadow-md" />
                  </div>
                </div>
                <div className="p-3 flex flex-col gap-1">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-white">
                    hi read desc (i cant update my games)
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-white/40">
                    <span>N/A</span>
                    <span>👤 0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Games Tab */}
      {activeTab === 'Games' && (
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white tracking-tight">Created Experiences</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="rounded-xl overflow-hidden bg-[#161618] border border-white/[0.04] flex flex-col group cursor-pointer hover:border-white/10 transition-all">
              <div className="aspect-[16/9] w-full bg-emerald-950/40 relative overflow-hidden flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-b from-[#9bc4e2] to-[#5a9159] relative flex items-center justify-center">
                  <div className="w-20 h-10 bg-white/90 border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)] rounded-sm" />
                </div>
              </div>
              <div className="p-3 flex flex-col gap-1">
                <h4 className="text-xs font-bold text-white truncate group-hover:text-white">
                  new update
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-white/40">
                  <span>N/A</span>
                  <span>👤 0</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden bg-[#161618] border border-white/[0.04] flex flex-col group cursor-pointer hover:border-white/10 transition-all">
              <div className="aspect-[16/9] w-full bg-emerald-950/40 relative overflow-hidden flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-b from-[#9bc4e2] to-[#5a9159] relative flex items-end justify-center">
                  <div className="w-32 h-20 bg-neutral-200/90 rounded-t-sm shadow-md" />
                </div>
              </div>
              <div className="p-3 flex flex-col gap-1">
                <h4 className="text-xs font-bold text-white truncate group-hover:text-white">
                  hi read desc (i cant update my games)
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-white/40">
                  <span>N/A</span>
                  <span>👤 0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs placeholder */}
      {activeTab !== 'About' && activeTab !== 'Games' && (
        <UnderConstruction onGoBack={() => setActiveTab('About')} />
      )}
    </div>
  )
}
