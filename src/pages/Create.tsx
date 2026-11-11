import { useState } from 'react'
import { Plus, Hammer, Play, BarChart3, Users, Globe, Lock, ExternalLink, Settings, Sparkles } from 'lucide-react'
import { RECOMMENDED_GAMES } from '@/data/homeGames'

interface Experience {
  id: string
  name: string
  thumbnail: string
  isPublic: boolean
  visits: string
  activePlayers: string
  createdDate: string
}

const MY_EXPERIENCES: Experience[] = [
  {
    id: 'e1',
    name: 'Sword Fighting Arena [Alpha]',
    thumbnail: RECOMMENDED_GAMES[1].thumbnail,
    isPublic: true,
    visits: '24.5K',
    activePlayers: '84',
    createdDate: '10/12/2023',
  },
  {
    id: 'e2',
    name: 'Dungeon Crawl & Boss Raids',
    thumbnail: RECOMMENDED_GAMES[0].thumbnail,
    isPublic: true,
    visits: '18.2K',
    activePlayers: '112',
    createdDate: '01/15/2024',
  },
  {
    id: 'e3',
    name: 'Test Place (Uncopylocked)',
    thumbnail: RECOMMENDED_GAMES[2].thumbnail,
    isPublic: false,
    visits: '340',
    activePlayers: '0',
    createdDate: '03/04/2024',
  },
]

export function Create() {
  const [experiences, setExperiences] = useState(MY_EXPERIENCES)
  const [activeTab, setActiveTab] = useState<'experiences' | 'models' | 'analytics'>('experiences')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newName, setNewName] = useState('')

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    const created: Experience = {
      id: Date.now().toString(),
      name: newName.trim(),
      thumbnail: RECOMMENDED_GAMES[4].thumbnail,
      isPublic: false,
      visits: '0',
      activePlayers: '0',
      createdDate: new Date().toLocaleDateString(),
    }
    setExperiences([created, ...experiences])
    setNewName('')
    setShowCreateModal(false)
  }

  const togglePublic = (id: string) => {
    setExperiences((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isPublic: !e.isPublic } : e))
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-7 flex flex-col gap-6 max-w-[1700px]">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Creator Hub
          </h1>
          <p className="text-xs md:text-sm text-white/50 mt-0.5">
            Manage your experiences, publish updates, and view analytics on Novelo Studio
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="h-10 px-4 rounded-xl bg-white text-black hover:bg-neutral-200 transition-all font-bold text-xs flex items-center gap-1.5 cursor-pointer border-none shadow-md"
          >
            <Plus className="size-4" />
            <span>Create New Experience</span>
          </button>
        </div>
      </div>

      {/* Analytics Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#141414]/90 border border-white/10 flex flex-col gap-2">
          <span className="text-xs text-white/50">Total Experience Visits</span>
          <span className="text-2xl font-black text-white tabular-numbers">43,040</span>
          <span className="text-[11px] text-emerald-400 font-semibold">+12.4% past 30 days</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#141414]/90 border border-white/10 flex flex-col gap-2">
          <span className="text-xs text-white/50">Active Concurrent Players</span>
          <span className="text-2xl font-black text-white tabular-numbers">196</span>
          <span className="text-[11px] text-white/40">Across 2 public places</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#141414]/90 border border-white/10 flex flex-col gap-2">
          <span className="text-xs text-white/50">DevEx Pending Revenue</span>
          <div className="flex items-center gap-2">
            <img src="/novelo-currency.png" alt="Currency" className="size-5 object-contain" />
            <span className="text-2xl font-black text-white tabular-numbers">18,500</span>
          </div>
          <span className="text-[11px] text-white/40">Eligible for developer payout</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
        {(['experiences', 'models', 'analytics'] as const).map((tab) => (
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

      {/* Experiences List */}
      {activeTab === 'experiences' && (
        <div className="flex flex-col gap-3">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="p-4 rounded-2xl bg-[#141414]/90 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Details */}
              <div className="flex items-center gap-4">
                <div className="w-24 h-16 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shrink-0">
                  <img src={exp.thumbnail} alt={exp.name} className="size-full object-cover" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-white">{exp.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-white/50">
                    <button
                      onClick={() => togglePublic(exp.id)}
                      className={`flex items-center gap-1 font-semibold cursor-pointer border-none bg-transparent ${
                        exp.isPublic ? 'text-emerald-400' : 'text-neutral-400'
                      }`}
                    >
                      {exp.isPublic ? <Globe className="size-3" /> : <Lock className="size-3" />}
                      <span>{exp.isPublic ? 'Public' : 'Private'}</span>
                    </button>
                    <span>• {exp.visits} Visits</span>
                    <span>• {exp.activePlayers} Playing</span>
                    <span>• Created {exp.createdDate}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Launching Novelo Studio for "${exp.name}"...`)}
                  className="px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border-none shadow-md"
                >
                  <Hammer className="size-3.5" />
                  <span>Edit in Studio</span>
                </button>
                <button
                  onClick={() => alert(`Configuring "${exp.name}"...`)}
                  className="size-9 rounded-xl bg-white/10 hover:bg-white/15 text-white flex items-center justify-center cursor-pointer border-none transition-colors"
                >
                  <Settings className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'models' && (
        <div className="py-16 text-center text-white/40 text-xs">
          No published models or assets yet. Export models from Novelo Studio to see them here.
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white">Engagement Overview</h3>
          <p className="text-xs text-white/60">
            Average Playtime: 14.2 minutes • Retention Day 1: 42% • Total Play Sessions: 89,400
          </p>
        </div>
      )}

      {/* Create Experience Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowCreateModal(false)}
        >
          <form
            onSubmit={handleCreate}
            className="w-full max-w-md rounded-2xl bg-[#141414] border border-white/10 p-6 flex flex-col gap-4 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white">Create Experience</h3>
            <p className="text-xs text-white/50">
              Enter a name for your new starter place. You can open and edit it anytime in Novelo Studio.
            </p>

            <input
              type="text"
              placeholder="Experience Name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="h-10 px-3.5 rounded-xl bg-[#1a1a1a] border border-white/10 text-xs text-white focus:outline-none"
              autoFocus
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white/80 hover:bg-white/20 text-xs font-bold cursor-pointer border-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newName.trim()}
                className="px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold cursor-pointer border-none shadow-md"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
