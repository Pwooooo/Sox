import { useState } from 'react'
import { Plus, Play, Settings, Box, Globe, Users, BarChart3, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Experience {
  id: string
  name: string
  visits: number
  activePlayers: number
  isPublic: boolean
  lastUpdated: string
}

const USER_EXPERIENCES: Experience[] = [
  {
    id: 'exp-1',
    name: "Pwo's Starter Place",
    visits: 1420,
    activePlayers: 18,
    isPublic: true,
    lastUpdated: '2 days ago',
  },
  {
    id: 'exp-2',
    name: 'Neon Obby Adventure',
    visits: 8900,
    activePlayers: 42,
    isPublic: true,
    lastUpdated: 'Yesterday',
  },
  {
    id: 'exp-3',
    name: 'Sword Battle Arena [Testing]',
    visits: 340,
    activePlayers: 4,
    isPublic: false,
    lastUpdated: '1 hour ago',
  },
]

export function Create() {
  const [activeTab, setActiveTab] = useState<'experiences' | 'assets' | 'group'>('experiences')
  const [experiences, setExperiences] = useState<Experience[]>(USER_EXPERIENCES)
  const [newModalOpen, setNewModalOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const handleCreateNew = (templateName: string) => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      name: newTitle || `${templateName} Experience`,
      visits: 0,
      activePlayers: 0,
      isPublic: false,
      lastUpdated: 'Just now',
    }
    setExperiences([newExp, ...experiences])
    setNewModalOpen(false)
    setNewTitle('')
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Creator Studio
          </h1>
          <p className="text-sm text-white/60 mt-0.5">
            Manage your experiences, uploaded assets, and monetization.
          </p>
        </div>

        <button
          onClick={() => setNewModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 active:scale-95 transition-all shadow-lg cursor-pointer border-none"
        >
          <Plus className="size-4 stroke-[3]" />
          Create Experience
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1">
        <button
          onClick={() => setActiveTab('experiences')}
          className={cn(
            "px-4 py-2 text-xs md:text-sm font-semibold transition-colors cursor-pointer border-b-2 -mb-1",
            activeTab === 'experiences'
              ? "text-white border-white"
              : "text-white/50 border-transparent hover:text-white"
          )}
        >
          My Experiences
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={cn(
            "px-4 py-2 text-xs md:text-sm font-semibold transition-colors cursor-pointer border-b-2 -mb-1",
            activeTab === 'assets'
              ? "text-white border-white"
              : "text-white/50 border-transparent hover:text-white"
          )}
        >
          Catalog Items & Models
        </button>
      </div>

      {/* Experience List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="rounded-2xl bg-[#111111] border border-white/[0.08] hover:border-white/20 p-5 flex flex-col gap-4 transition-all duration-200 shadow-md group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="size-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0">
                <Box className="size-6 text-white/50 group-hover:text-white transition-colors" />
              </div>

              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                  exp.isPublic
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-white/5 text-white/40 border-white/10"
                )}
              >
                {exp.isPublic ? 'Public' : 'Private'}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white group-hover:text-white truncate">
                {exp.name}
              </h3>
              <p className="text-xs text-white/40 mt-0.5">Updated {exp.lastUpdated}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06] text-xs text-white/60">
              <div className="flex items-center gap-1.5 font-medium">
                <Users className="size-3.5 text-white/40" />
                <span className="tabular-numbers text-white font-bold">{exp.activePlayers}</span> playing
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <BarChart3 className="size-3.5 text-white/40" />
                <span className="tabular-numbers text-white font-bold">{exp.visits.toLocaleString()}</span> visits
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button className="flex-1 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-white/90 transition-all cursor-pointer border-none flex items-center justify-center gap-1.5">
                <Play className="size-3.5 fill-current" />
                Edit in Studio
              </button>
              <button className="size-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white cursor-pointer">
                <Settings className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create New Modal */}
      {newModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setNewModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-[#111111] border border-white/[0.1] p-6 flex flex-col gap-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Create New Experience</h2>
              <p className="text-xs text-white/50 mt-0.5">
                Choose a starter template to generate your new game.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white/70">Experience Title</label>
              <input
                type="text"
                placeholder="My Awesome Game"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#161616] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-white/30"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-white/70">Starter Template</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Baseplate', desc: 'Standard empty grid for custom building' },
                  { name: 'Obby Obstacle', desc: 'Pre-configured obstacle checkpoints' },
                  { name: 'Combat Arena', desc: 'Weapons, spawns, and PvP zones' },
                  { name: 'Open City', desc: 'Streets, vehicles, and roleplay buildings' },
                ].map((tpl) => (
                  <button
                    key={tpl.name}
                    onClick={() => handleCreateNew(tpl.name)}
                    className="p-3.5 rounded-xl bg-[#161616] border border-white/[0.08] hover:border-white/30 text-left flex flex-col gap-1 transition-all cursor-pointer group"
                  >
                    <span className="text-xs font-bold text-white group-hover:text-white">
                      {tpl.name}
                    </span>
                    <span className="text-[11px] text-white/40 leading-snug">
                      {tpl.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
