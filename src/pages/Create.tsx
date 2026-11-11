import { useState } from 'react'
import { Plus, Download, MoreHorizontal, Play, Lock, Globe, ExternalLink } from 'lucide-react'

interface StudioExperience {
  id: string
  name: string
  privacy: 'Playtesters' | 'Public'
  concurrent: number
  dau: string
  retention: string
  revenue: string
  playtime: string
  thumbnailColor: string
}

const EXPERIENCES_DATA: StudioExperience[] = [
  {
    id: 'exp1',
    name: 'Cat Battles',
    privacy: 'Playtesters',
    concurrent: 0,
    dau: '—',
    retention: '—',
    revenue: '—',
    playtime: '—',
    thumbnailColor: '#2563eb',
  },
  {
    id: 'exp2',
    name: 'Lifting Haven',
    privacy: 'Playtesters',
    concurrent: 0,
    dau: '—',
    retention: '—',
    revenue: '—',
    playtime: '—',
    thumbnailColor: '#16a34a',
  },
  {
    id: 'exp3',
    name: 'Pookie Dinosaur World',
    privacy: 'Playtesters',
    concurrent: 0,
    dau: '—',
    retention: '—',
    revenue: '—',
    playtime: '—',
    thumbnailColor: '#059669',
  },
  {
    id: 'exp4',
    name: 'Steal A Noob',
    privacy: 'Playtesters',
    concurrent: 0,
    dau: '—',
    retention: '—',
    revenue: '—',
    playtime: '—',
    thumbnailColor: '#ea580c',
  },
  {
    id: 'exp5',
    name: "Sky's Starter Place",
    privacy: 'Playtesters',
    concurrent: 0,
    dau: '—',
    retention: '—',
    revenue: '—',
    playtime: '—',
    thumbnailColor: '#0284c7',
  },
]

export function Create() {
  const [experiences, setExperiences] = useState(EXPERIENCES_DATA)
  const [showModal, setShowModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const handleCreateExp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const newExp: StudioExperience = {
      id: Date.now().toString(),
      name: newTitle.trim(),
      privacy: 'Playtesters',
      concurrent: 0,
      dau: '—',
      retention: '—',
      revenue: '—',
      playtime: '—',
      thumbnailColor: '#4f46e5',
    }
    setExperiences([newExp, ...experiences])
    setNewTitle('')
    setShowModal(false)
  }

  return (
    <div className="p-4 md:p-6 lg:p-7 flex flex-col gap-8 max-w-[1700px]">
      {/* 1. Get Started Hero Banner matching Image 6 */}
      <div className="rounded-2xl bg-[#121214] border border-white/[0.04] p-6 flex flex-col gap-4 shadow-xl">
        <div>
          <h2 className="text-base md:text-lg font-bold text-white tracking-tight">Get Started</h2>
          <p className="text-xs text-white/50 mt-0.5">
            Watch a quick introduction to creating on Novelo, then jump into Studio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Video / Intro Box */}
          <div className="rounded-xl bg-[#0b0b0d] border border-white/[0.03] min-h-[180px] flex items-center justify-center cursor-pointer group hover:bg-[#101012] transition-colors relative overflow-hidden">
            <div className="size-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="size-5 fill-current ml-0.5" />
            </div>
          </div>

          {/* Download Studio Box */}
          <div className="rounded-xl bg-[#0b0b0d] border border-white/[0.03] min-h-[180px] flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <span className="font-black text-sm tracking-widest">N</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Get Novelo Studio</h3>
              <p className="text-xs text-white/50 mt-0.5">
                Use our all-in-one creation engine to build anything you can imagine
              </p>
            </div>
            <button
              onClick={() => alert('Downloading Novelo Studio installer...')}
              className="h-9 px-5 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold text-xs flex items-center gap-2 cursor-pointer border-none shadow-md transition-all active:scale-95"
            >
              <Download className="size-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Experiences Section matching Image 6 */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-white/80 transition-colors">
            <h2 className="text-base md:text-lg font-bold text-white tracking-tight">Experiences</h2>
            <span className="text-white/40">›</span>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="h-8 px-3.5 rounded-lg bg-white text-black hover:bg-neutral-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer border-none shadow-md transition-all active:scale-95"
          >
            <Plus className="size-3.5" />
            <span>Create Experience</span>
          </button>
        </div>

        {/* Minimalist Cards Grid matching Image 6 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="rounded-2xl bg-[#121214] hover:bg-[#161618] border border-white/[0.04] hover:border-white/10 transition-all p-4 flex flex-col gap-3 group shadow-md"
            >
              {/* Top Privacy Tag & More Options */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-white/60 font-medium">
                  <Lock className="size-2.5" />
                  <span>{exp.privacy}</span>
                </span>
                <button className="size-6 rounded-md hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer border-none bg-transparent">
                  <MoreHorizontal className="size-3.5" />
                </button>
              </div>

              {/* Title & Square Thumbnail */}
              <div className="flex items-center gap-2.5">
                <div
                  className="size-7 rounded-lg shrink-0 flex items-center justify-center text-white/80 font-black text-xs shadow-inner"
                  style={{ backgroundColor: exp.thumbnailColor }}
                >
                  {exp.name.charAt(0)}
                </div>
                <h4 className="text-xs font-bold text-white truncate group-hover:text-white">
                  {exp.name}
                </h4>
              </div>

              {/* Stats Rows matching Image 6 */}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.03] text-[11px]">
                <div className="flex flex-col">
                  <span className="text-white/40 text-[10px]">Concurrent users</span>
                  <span className="font-bold text-white tabular-numbers">{exp.concurrent}</span>
                </div>

                <div className="flex items-center justify-between text-white/50">
                  <span>Daily active users</span>
                  <span>{exp.dau}</span>
                </div>

                <div className="flex items-center justify-between text-white/50">
                  <span>D1 retention</span>
                  <span>{exp.retention}</span>
                </div>

                <div className="flex items-center justify-between text-white/50">
                  <span>Daily revenue</span>
                  <span>{exp.revenue}</span>
                </div>

                <div className="flex items-center justify-between text-white/50">
                  <span>Avg. playtime</span>
                  <span>{exp.playtime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal to Create Experience */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowModal(false)}
        >
          <form
            onSubmit={handleCreateExp}
            className="w-full max-w-md rounded-2xl bg-[#141416] border border-white/10 p-6 flex flex-col gap-4 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-white">New Experience</h3>
            <p className="text-xs text-white/50">
              Enter a name for your place. You can edit building blocks and scripts in Novelo Studio.
            </p>

            <input
              type="text"
              placeholder="e.g. Sword Arena 2026..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="h-10 px-3.5 rounded-xl bg-[#1c1c1f] border border-white/10 text-xs text-white focus:outline-none"
              autoFocus
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white/80 hover:bg-white/20 text-xs font-bold cursor-pointer border-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newTitle.trim()}
                className="px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold cursor-pointer border-none shadow-md"
              >
                Create Place
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
