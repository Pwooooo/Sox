import { useState, useRef, useEffect } from 'react'
import {
  Folder,
  Home,
  BookOpen,
  ShoppingBag,
  MessageSquare,
  Megaphone,
  CircleDollarSign,
  BarChart2,
  Volume2,
  Grid,
  Menu,
  Search,
  Bell,
  Lock,
  Globe,
  SquareArrowOutUpRight,
  Play,
  Square,
  RotateCcw,
  Box,
  Move,
  Maximize2,
  Layers,
  Settings,
  ChevronRight,
  ChevronDown,
  Eye,
  Plus,
  ArrowLeft,
  Upload,
  Check,
  Compass,
} from 'lucide-react'
import { CustomDropdown, DropdownOption } from '@/components/CustomDropdown'
import { StockAvatar } from '@/pages/Trade'

interface Experience {
  id: string
  name: string
  privacy: 'Playtesters' | 'Public'
  thumbnail: string
  updatedDate: string
  visits: string
  createdDate: string
}

const DEFAULT_EXPERIENCES: Experience[] = [
  {
    id: 'exp1',
    name: 'Cat Battles',
    privacy: 'Playtesters',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    updatedDate: '10/24/2026',
    visits: '14.2K',
    createdDate: '10/12/2026',
  },
  {
    id: 'exp2',
    name: 'Lifting Haven',
    privacy: 'Playtesters',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    updatedDate: '10/18/2026',
    visits: '89.1K',
    createdDate: '9/28/2026',
  },
  {
    id: 'exp3',
    name: 'Pookie Dinosaur Wolrd',
    privacy: 'Playtesters',
    thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    updatedDate: '10/15/2026',
    visits: '3.4K',
    createdDate: '10/01/2026',
  },
  {
    id: 'exp4',
    name: 'Steal A Noob',
    privacy: 'Playtesters',
    thumbnail: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80',
    updatedDate: '10/10/2026',
    visits: '124K',
    createdDate: '8/14/2026',
  },
  {
    id: 'exp5',
    name: "JadexDraft1337's Place",
    privacy: 'Playtesters',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    updatedDate: '10/02/2026',
    visits: '420',
    createdDate: '7/20/2026',
  },
]

export function Create() {
  const [viewMode, setViewMode] = useState<'dashboard' | 'studio'>('dashboard')
  const [activeExp, setActiveExp] = useState<Experience>(DEFAULT_EXPERIENCES[2]) // Pookie Dinosaur Wolrd
  const [experiences, setExperiences] = useState<Experience[]>(DEFAULT_EXPERIENCES)

  // Dashboard Filters State
  const [dashboardTab, setDashboardTab] = useState<'My Experiences' | 'Shared With Me'>('My Experiences')
  const [subSidebarTab, setSubSidebarTab] = useState<'Experiences' | 'Share links' | 'Avatar items' | 'Development items'>('Experiences')
  const [showPublic, setShowPublic] = useState(false)
  const [showImpacted, setShowImpacted] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [sortBy, setSortBy] = useState('Last Updated Date')
  const [searchQuery, setSearchQuery] = useState('')

  // Studio Interactive State
  const [activeTool, setActiveTool] = useState<'select' | 'move' | 'scale' | 'rotate'>('select')
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedPart, setSelectedPart] = useState<string>('SpawnLocation')
  const [parts, setParts] = useState([
    { id: 'part1', name: 'Baseplate', type: 'Block', size: '512, 16, 512', pos: '0, -8, 0', color: '#3f3f46' },
    { id: 'part2', name: 'SpawnLocation', type: 'Block', size: '12, 1, 12', pos: '0, 0.5, 0', color: '#10b981' },
    { id: 'part3', name: 'Dino Statue', type: 'Mesh', size: '8, 14, 8', pos: '18, 7, -10', color: '#f59e0b' },
    { id: 'part4', name: 'Portal Arch', type: 'Wedge', size: '6, 12, 4', pos: '-15, 6, 12', color: '#8b5cf6' },
  ])
  const [studioLogs, setStudioLogs] = useState<string[]>([
    'Novelo Studio Engine v2.4 initialized [DirectX12]',
    'Loaded workspace place: ' + activeExp.name,
    'Physical assembly verified (4 parts, 1 spawn location)',
    'Ready for editing.',
  ])

  // Open experience in Studio
  const openInStudio = (exp: Experience) => {
    setActiveExp(exp)
    setViewMode('studio')
    setIsPlaying(false)
    setStudioLogs((prev) => [
      ...prev,
      `Switched to place "${exp.name}" (${exp.privacy})`,
    ])
  }

  // Add Part in Studio
  const handleAddPart = () => {
    const newId = 'part_' + Date.now()
    const newPart = {
      id: newId,
      name: `Part ${parts.length + 1}`,
      type: 'Block',
      size: '4, 4, 4',
      pos: `${Math.floor(Math.random() * 20 - 10)}, 2, ${Math.floor(Math.random() * 20 - 10)}`,
      color: '#3b82f6',
    }
    setParts((prev) => [...prev, newPart])
    setSelectedPart(newPart.name)
    setStudioLogs((prev) => [...prev, `Created Part "${newPart.name}" at (${newPart.pos})`])
  }

  // Toggle playtest
  const togglePlaytest = () => {
    if (!isPlaying) {
      setIsPlaying(true)
      setStudioLogs((prev) => [...prev, 'Starting playtest simulation...', 'Player character spawned at SpawnLocation (0, 1, 0)'])
    } else {
      setIsPlaying(false)
      setStudioLogs((prev) => [...prev, 'Playtest simulation stopped. Resetting workspace.'])
    }
  }

  const sortOptions: DropdownOption[] = [
    { value: 'Last Updated Date', label: 'Last Updated Date' },
    { value: 'Creation Date', label: 'Creation Date' },
    { value: 'Alphabetical', label: 'Alphabetical' },
    { value: 'Most Visits', label: 'Most Visits' },
  ]

  // Filter experiences
  const filteredExperiences = experiences.filter((exp) => {
    const matchesSearch = exp.name.toLowerCase().includes(searchQuery.toLowerCase())
    if (showPublic && exp.privacy !== 'Public') return false
    return matchesSearch
  })

  // -------------------------------------------------------------
  // VIEW: NOVELO STUDIO (MINIMALISTIC 3D STUDIO ENGINE)
  // -------------------------------------------------------------
  if (viewMode === 'studio') {
    const currentPartObj = parts.find((p) => p.name === selectedPart) || parts[1]

    return (
      <div className="flex flex-col h-[calc(100vh-60px)] -m-4 md:-m-6 lg:-m-7 bg-[#0f0f12] text-white select-none overflow-hidden">
        {/* Top Studio Ribbon Bar */}
        <div className="h-12 bg-[#141418] border-b border-white/[0.06] flex items-center justify-between px-3 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('dashboard')}
              className="h-8 px-2.5 rounded-[6px] bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border-none"
              title="Return to Creator Hub"
            >
              <ArrowLeft className="size-3.5" />
              <span>Creations</span>
            </button>

            <div className="h-4 w-px bg-white/10" />

            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold text-white tracking-tight">
                {activeExp.name}
              </span>
              <span className="text-[10px] text-white/40 px-1.5 py-0.5 rounded bg-white/[0.05]">
                {activeExp.privacy}
              </span>
            </div>
          </div>

          {/* Tools & Play Ribbon */}
          <div className="flex items-center gap-1.5">
            {/* Tool Selection */}
            <div className="flex items-center bg-[#1c1c22] rounded-[6px] p-0.5">
              <button
                onClick={() => setActiveTool('select')}
                className={`h-7 px-2.5 rounded-[5px] text-xs font-semibold flex items-center gap-1 cursor-pointer border-none transition-colors ${
                  activeTool === 'select' ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white'
                }`}
                title="Select Tool"
              >
                <span>Select</span>
              </button>
              <button
                onClick={() => setActiveTool('move')}
                className={`h-7 px-2.5 rounded-[5px] text-xs font-semibold flex items-center gap-1 cursor-pointer border-none transition-colors ${
                  activeTool === 'move' ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white'
                }`}
                title="Move Tool"
              >
                <Move className="size-3" />
                <span>Move</span>
              </button>
              <button
                onClick={() => setActiveTool('scale')}
                className={`h-7 px-2.5 rounded-[5px] text-xs font-semibold flex items-center gap-1 cursor-pointer border-none transition-colors ${
                  activeTool === 'scale' ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white'
                }`}
                title="Scale Tool"
              >
                <Maximize2 className="size-3" />
                <span>Scale</span>
              </button>
            </div>

            {/* Insert Part Button */}
            <button
              onClick={handleAddPart}
              className="h-8 px-3 rounded-[6px] bg-[#1c1c22] hover:bg-[#25252c] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer border-none transition-colors"
            >
              <Box className="size-3.5 text-blue-400" />
              <span>+ Part</span>
            </button>

            {/* Playtest / Stop Button */}
            <button
              onClick={togglePlaytest}
              className={`h-8 px-3.5 rounded-[6px] font-bold text-xs flex items-center gap-1.5 cursor-pointer border-none shadow-md transition-all active:scale-95 ${
                isPlaying
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <Square className="size-3 fill-current" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play className="size-3 fill-current" />
                  <span>Play</span>
                </>
              )}
            </button>

            {/* Publish button */}
            <button
              onClick={() => alert(`Place "${activeExp.name}" published successfully to Novelo cloud!`)}
              className="h-8 px-3 rounded-[6px] bg-white hover:bg-neutral-200 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer border-none shadow-sm transition-all"
            >
              <Upload className="size-3" />
              <span>Publish</span>
            </button>
          </div>
        </div>

        {/* Central Workspace: Viewport & Sidebars */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main 3D Interactive Viewport */}
          <div className="flex-1 bg-[#0b0b0e] relative flex flex-col justify-between overflow-hidden">
            {/* Viewport Top Overlay Badges */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <span className="px-2 py-1 rounded bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white/70 border border-white/5">
                {isPlaying ? 'RUNNING (TEST MODE)' : 'EDIT MODE'}
              </span>
              <span className="px-2 py-1 rounded bg-black/60 backdrop-blur-xs text-[10px] font-bold text-emerald-400 border border-white/5">
                60.0 FPS
              </span>
            </div>

            {/* Viewport Axis Compass in top-right */}
            <div className="absolute top-3 right-3 z-10 size-12 rounded-full bg-black/40 backdrop-blur-xs border border-white/10 flex items-center justify-center">
              <Compass className="size-6 text-white/60" />
            </div>

            {/* Isometric 3D Baseplate Rendering */}
            <div className="flex-1 flex items-center justify-center relative">
              <svg
                viewBox="0 0 800 500"
                className="w-full h-full max-h-[640px] object-contain drop-shadow-2xl"
              >
                {/* Sky & Horizon Gradient */}
                <defs>
                  <linearGradient id="studioSky" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e1e24" />
                    <stop offset="60%" stopColor="#141418" />
                    <stop offset="100%" stopColor="#0b0b0e" />
                  </linearGradient>
                  <linearGradient id="baseplateGrid" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2c2c34" />
                    <stop offset="100%" stopColor="#1e1e24" />
                  </linearGradient>
                </defs>

                {/* Sky Background */}
                <rect x="0" y="0" width="800" height="500" fill="url(#studioSky)" />

                {/* Horizon Glow Line */}
                <line x1="0" y1="260" x2="800" y2="260" stroke="#ffffff" strokeOpacity="0.04" strokeWidth="1" />

                {/* 3D Isometric Baseplate Grid */}
                <g transform="translate(400, 290)">
                  {/* Baseplate Slab */}
                  <polygon
                    points="0,-120 340,30 0,180 -340,30"
                    fill="url(#baseplateGrid)"
                    stroke="#ffffff"
                    strokeOpacity="0.12"
                    strokeWidth="1.5"
                  />
                  {/* Grid lines */}
                  {[-240, -160, -80, 0, 80, 160, 240].map((offset, i) => (
                    <g key={i}>
                      <line
                        x1={offset * 0.7}
                        y1={-120 + Math.abs(offset) * 0.25}
                        x2={offset * 0.7}
                        y2={180 - Math.abs(offset) * 0.25}
                        stroke="#ffffff"
                        strokeOpacity="0.06"
                        strokeWidth="1"
                      />
                      <line
                        y1={offset * 0.35}
                        x1={-340 + Math.abs(offset) * 0.6}
                        y2={offset * 0.35}
                        x2={340 - Math.abs(offset) * 0.6}
                        stroke="#ffffff"
                        strokeOpacity="0.06"
                        strokeWidth="1"
                      />
                    </g>
                  ))}

                  {/* Spawn Location Pad */}
                  <polygon
                    points="0,-25 60,5 0,35 -60,5"
                    fill={selectedPart === 'SpawnLocation' ? '#10b981' : '#059669'}
                    stroke="#ffffff"
                    strokeOpacity={selectedPart === 'SpawnLocation' ? '0.8' : '0.2'}
                    strokeWidth={selectedPart === 'SpawnLocation' ? '2' : '1'}
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedPart('SpawnLocation')}
                  />
                  {/* Spawn Symbol */}
                  <circle cx="0" cy="5" r="8" fill="#ffffff" fillOpacity="0.8" />

                  {/* 3D Part 1: Block */}
                  <g
                    transform="translate(100, -30)"
                    className="cursor-pointer"
                    onClick={() => setSelectedPart('Dino Statue')}
                  >
                    {/* Top face */}
                    <polygon
                      points="0,-40 35,-20 0,0 -35,-20"
                      fill={selectedPart === 'Dino Statue' ? '#fbbf24' : '#d97706'}
                      stroke="#ffffff"
                      strokeOpacity={selectedPart === 'Dino Statue' ? '0.9' : '0.2'}
                      strokeWidth="1.5"
                    />
                    {/* Left face */}
                    <polygon
                      points="-35,-20 0,0 0,50 -35,30"
                      fill={selectedPart === 'Dino Statue' ? '#d97706' : '#b45309'}
                    />
                    {/* Right face */}
                    <polygon
                      points="0,0 35,-20 35,30 0,50"
                      fill={selectedPart === 'Dino Statue' ? '#f59e0b' : '#92400e'}
                    />
                  </g>

                  {/* 3D Part 2: Purple Wedge */}
                  <g
                    transform="translate(-110, 20)"
                    className="cursor-pointer"
                    onClick={() => setSelectedPart('Portal Arch')}
                  >
                    <polygon
                      points="0,-30 30,-15 0,0 -30,-15"
                      fill={selectedPart === 'Portal Arch' ? '#a855f7' : '#7c3aed'}
                      stroke="#ffffff"
                      strokeOpacity={selectedPart === 'Portal Arch' ? '0.9' : '0.2'}
                      strokeWidth="1.5"
                    />
                    <polygon
                      points="-30,-15 0,0 0,40 -30,25"
                      fill={selectedPart === 'Portal Arch' ? '#7c3aed' : '#6d28d9'}
                    />
                    <polygon
                      points="0,0 30,-15 30,25 0,40"
                      fill={selectedPart === 'Portal Arch' ? '#9333ea' : '#5b21b6'}
                    />
                  </g>

                  {/* Playtest Character if active */}
                  {isPlaying && (
                    <g transform="translate(0, -10)">
                      <rect x="-8" y="-45" width="16" height="15" rx="3" fill="#ffffff" stroke="#18181b" strokeWidth="1" />
                      <rect x="-12" y="-28" width="24" height="20" rx="2" fill="#3b82f6" />
                      <rect x="-10" y="-8" width="8" height="18" fill="#18181b" />
                      <rect x="2" y="-8" width="8" height="18" fill="#18181b" />
                      <circle cx="-3" cy="-38" r="1.5" fill="#000000" />
                      <circle cx="3" cy="-38" r="1.5" fill="#000000" />
                    </g>
                  )}
                </g>
              </svg>
            </div>

            {/* Bottom Console / Output bar */}
            <div className="h-28 bg-[#121216] border-t border-white/[0.06] p-2.5 flex flex-col font-mono text-[11px] overflow-y-auto no-scrollbar">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1 font-sans">
                Output / System Logs
              </span>
              {studioLogs.map((log, i) => (
                <div key={i} className="flex items-center gap-2 text-white/60 leading-relaxed">
                  <span className="text-white/30 text-[10px] select-none">›</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Explorer & Properties Panel */}
          <div className="w-72 bg-[#141418] border-l border-white/[0.06] flex flex-col shrink-0">
            {/* Explorer Header */}
            <div className="p-3 border-b border-white/[0.06] flex items-center justify-between">
              <span className="text-xs font-bold text-white tracking-tight uppercase">
                Explorer
              </span>
              <button
                onClick={handleAddPart}
                className="size-6 rounded bg-white/[0.06] hover:bg-white/[0.12] text-white flex items-center justify-center cursor-pointer border-none"
                title="Add Object"
              >
                <Plus className="size-3.5" />
              </button>
            </div>

            {/* Explorer Tree */}
            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-0.5 text-xs text-white/80 no-scrollbar">
              <div className="flex items-center gap-1.5 py-1 px-2 rounded font-semibold text-white/90">
                <ChevronDown className="size-3 text-white/50" />
                <Folder className="size-3.5 text-amber-400" />
                <span>Workspace</span>
              </div>

              {/* Workspace Children */}
              <div className="pl-5 flex flex-col gap-0.5">
                {parts.map((p) => {
                  const isSel = p.name === selectedPart
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPart(p.name)}
                      className={`w-full py-1 px-2 rounded-[5px] flex items-center gap-2 text-left cursor-pointer border-none transition-colors ${
                        isSel ? 'bg-blue-600 text-white font-bold' : 'hover:bg-white/[0.05] text-white/80'
                      }`}
                    >
                      <Box className="size-3 text-white/60" />
                      <span className="truncate">{p.name}</span>
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center gap-1.5 py-1 px-2 rounded text-white/60 hover:text-white">
                <ChevronRight className="size-3 text-white/40" />
                <span className="size-3.5 rounded-full bg-blue-500/30 flex items-center justify-center text-[9px] text-blue-300">P</span>
                <span>Players</span>
              </div>
              <div className="flex items-center gap-1.5 py-1 px-2 rounded text-white/60 hover:text-white">
                <ChevronRight className="size-3 text-white/40" />
                <span className="size-3.5 rounded-full bg-amber-500/30 flex items-center justify-center text-[9px] text-amber-300">L</span>
                <span>Lighting</span>
              </div>
              <div className="flex items-center gap-1.5 py-1 px-2 rounded text-white/60 hover:text-white">
                <ChevronRight className="size-3 text-white/40" />
                <Folder className="size-3.5 text-white/40" />
                <span>ReplicatedStorage</span>
              </div>
              <div className="flex items-center gap-1.5 py-1 px-2 rounded text-white/60 hover:text-white">
                <ChevronRight className="size-3 text-white/40" />
                <Folder className="size-3.5 text-emerald-400/50" />
                <span>ServerScriptService</span>
              </div>
            </div>

            {/* Properties Panel */}
            <div className="h-56 border-t border-white/[0.06] flex flex-col bg-[#111114]">
              <div className="p-2.5 border-b border-white/[0.06] flex items-center justify-between">
                <span className="text-xs font-bold text-white tracking-tight uppercase">
                  Properties - {currentPartObj.name}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-2 text-[11px] text-white/70 no-scrollbar">
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Name</span>
                  <span className="font-semibold text-white">{currentPartObj.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Class</span>
                  <span className="text-white">{currentPartObj.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Size</span>
                  <span className="font-mono text-[10px] text-white/90">{currentPartObj.size}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Position</span>
                  <span className="font-mono text-[10px] text-white/90">{currentPartObj.pos}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Color</span>
                  <div className="flex items-center gap-1.5">
                    <span className="size-3 rounded-xs border border-white/20" style={{ backgroundColor: currentPartObj.color }} />
                    <span className="font-mono text-[10px] text-white">{currentPartObj.color}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Anchored</span>
                  <span className="text-emerald-400 font-bold">true</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">CanCollide</span>
                  <span className="text-emerald-400 font-bold">true</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------
  // VIEW: NOVELO CREATOR DASHBOARD (Matching User Reference Image)
  // -------------------------------------------------------------
  return (
    <div className="flex h-[calc(100vh-60px)] -m-4 md:-m-6 lg:-m-7 bg-[#0b0b0e] text-white select-none overflow-hidden font-sans">
      {/* 1. Left Primary Creator Hub Sidebar matching Reference Image */}
      <div className="w-16 md:w-56 bg-[#0e0e12] border-r border-white/[0.04] flex flex-col justify-between py-4 shrink-0">
        <div className="flex flex-col gap-6 px-3">
          {/* Creator Brand Logo */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="size-7 rounded-lg bg-white text-black flex items-center justify-center font-black text-sm shrink-0">
              N
            </div>
            <span className="hidden md:inline text-sm font-black tracking-wider text-white uppercase">
              Creator
            </span>
          </div>

          {/* Profile Switcher */}
          <div className="hidden md:flex items-center justify-between p-2 rounded-[8px] bg-white/[0.04] border border-white/[0.04]">
            <div className="flex items-center gap-2 min-w-0">
              <StockAvatar className="size-6 shrink-0" />
              <span className="text-xs font-semibold truncate text-white">JadexDraft1337</span>
            </div>
            <ChevronDown className="size-3.5 text-white/50 shrink-0" />
          </div>

          {/* Nav Items */}
          <div className="flex flex-col gap-1">
            <button className="flex items-center gap-3 px-2.5 h-9 rounded-[8px] text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer border-none bg-transparent text-left">
              <Home className="size-4 shrink-0" />
              <span className="hidden md:inline text-xs font-semibold">Home</span>
            </button>

            {/* Creations - Active */}
            <button className="flex items-center gap-3 px-2.5 h-9 rounded-[8px] bg-white/[0.1] text-white font-bold transition-colors cursor-pointer border-none text-left">
              <Folder className="size-4 shrink-0 fill-current" />
              <span className="hidden md:inline text-xs">Creations</span>
            </button>

            <button className="flex items-center gap-3 px-2.5 h-9 rounded-[8px] text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer border-none bg-transparent text-left">
              <BookOpen className="size-4 shrink-0" />
              <span className="hidden md:inline text-xs font-semibold">Learn</span>
            </button>

            <button className="flex items-center gap-3 px-2.5 h-9 rounded-[8px] text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer border-none bg-transparent text-left">
              <ShoppingBag className="size-4 shrink-0" />
              <span className="hidden md:inline text-xs font-semibold">Store</span>
            </button>

            <button className="flex items-center gap-3 px-2.5 h-9 rounded-[8px] text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer border-none bg-transparent text-left">
              <MessageSquare className="size-4 shrink-0" />
              <span className="hidden md:inline text-xs font-semibold">Forum</span>
            </button>

            <button className="flex items-center gap-3 px-2.5 h-9 rounded-[8px] text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer border-none bg-transparent text-left">
              <Megaphone className="size-4 shrink-0" />
              <span className="hidden md:inline text-xs font-semibold">Updates</span>
            </button>

            <div className="h-px bg-white/[0.04] my-2" />

            <button className="flex items-center gap-3 px-2.5 h-9 rounded-[8px] text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer border-none bg-transparent text-left">
              <CircleDollarSign className="size-4 shrink-0" />
              <span className="hidden md:inline text-xs font-semibold">Finances</span>
            </button>

            <button className="flex items-center gap-3 px-2.5 h-9 rounded-[8px] text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer border-none bg-transparent text-left">
              <BarChart2 className="size-4 shrink-0" />
              <span className="hidden md:inline text-xs font-semibold">Analytics</span>
            </button>

            <button className="flex items-center gap-3 px-2.5 h-9 rounded-[8px] text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer border-none bg-transparent text-left">
              <Volume2 className="size-4 shrink-0" />
              <span className="hidden md:inline text-xs font-semibold">Ads</span>
            </button>
          </div>
        </div>

        {/* All tools at bottom */}
        <div className="px-3">
          <button className="w-full flex items-center gap-3 px-2.5 h-9 rounded-[8px] text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer border-none bg-transparent text-left">
            <Grid className="size-4 shrink-0" />
            <span className="hidden md:inline text-xs font-semibold">All tools</span>
          </button>
        </div>
      </div>

      {/* 2. Creations Sub-navigation Sidebar matching Reference Image */}
      <div className="hidden lg:flex w-52 bg-[#0e0e12]/60 border-r border-white/[0.04] flex-col py-6 px-3 shrink-0 gap-4">
        <span className="px-3 text-xs font-bold text-white uppercase tracking-wider">
          Creations
        </span>

        <div className="flex flex-col gap-1">
          <button
            onClick={() => setSubSidebarTab('Experiences')}
            className={`w-full text-left px-3.5 py-2 rounded-[8px] text-xs transition-colors cursor-pointer border-none ${
              subSidebarTab === 'Experiences'
                ? 'bg-white/[0.08] text-white font-bold'
                : 'bg-transparent text-white/60 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            Experiences
          </button>

          <button
            onClick={() => setSubSidebarTab('Share links')}
            className={`w-full text-left px-3.5 py-2 rounded-[8px] text-xs transition-colors cursor-pointer border-none ${
              subSidebarTab === 'Share links'
                ? 'bg-white/[0.08] text-white font-bold'
                : 'bg-transparent text-white/60 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            Share links
          </button>

          <button
            onClick={() => setSubSidebarTab('Avatar items')}
            className={`w-full text-left px-3.5 py-2 rounded-[8px] text-xs transition-colors cursor-pointer border-none ${
              subSidebarTab === 'Avatar items'
                ? 'bg-white/[0.08] text-white font-bold'
                : 'bg-transparent text-white/60 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            Avatar items
          </button>

          <button
            onClick={() => setSubSidebarTab('Development items')}
            className={`w-full text-left px-3.5 py-2 rounded-[8px] text-xs transition-colors cursor-pointer border-none ${
              subSidebarTab === 'Development items'
                ? 'bg-white/[0.08] text-white font-bold'
                : 'bg-transparent text-white/60 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            Development items
          </button>
        </div>
      </div>

      {/* 3. Main Workspace matching Reference Image */}
      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
        {/* Top Header Bar with Hamburger & Experiences Title */}
        <div className="h-14 px-6 md:px-8 border-b border-white/[0.04] flex items-center justify-between shrink-0 bg-[#0b0b0e]">
          <div className="flex items-center gap-3">
            <Menu className="size-4 text-white/70" />
            <h1 className="text-lg md:text-xl font-black text-white tracking-tight">
              Experiences
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Search className="size-4 text-white/60 hover:text-white cursor-pointer transition-colors" />
            <Bell className="size-4 text-white/60 hover:text-white cursor-pointer transition-colors" />
            <StockAvatar className="size-7" />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 flex flex-col gap-6 max-w-[1600px]">
          {/* Filter Bar with Tabs and Switches */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-wrap">
            {/* Tabs: My Experiences | Shared With Me */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDashboardTab('My Experiences')}
                className={`h-8 px-4 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  dashboardTab === 'My Experiences'
                    ? 'bg-white text-black font-bold border-white shadow-sm'
                    : 'bg-transparent text-white/60 hover:text-white border-white/10'
                }`}
              >
                My Experiences
              </button>
              <button
                onClick={() => setDashboardTab('Shared With Me')}
                className={`h-8 px-4 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  dashboardTab === 'Shared With Me'
                    ? 'bg-white text-black font-bold border-white shadow-sm'
                    : 'bg-transparent text-white/60 hover:text-white border-white/10'
                }`}
              >
                Shared With Me
              </button>
            </div>

            {/* Right Switches & Sort Dropdown matching Reference Image */}
            <div className="flex items-center gap-5 flex-wrap">
              <div className="flex items-center gap-3.5 text-xs text-white/60">
                <span className="font-semibold text-white/40">Show:</span>

                {/* Public Switch */}
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <div
                    onClick={() => setShowPublic(!showPublic)}
                    className={`w-7 h-4 rounded-full transition-colors relative ${
                      showPublic ? 'bg-blue-600' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`size-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                        showPublic ? 'translate-x-3.5' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                  <span>Public</span>
                </label>

                {/* Impacted Switch */}
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <div
                    onClick={() => setShowImpacted(!showImpacted)}
                    className={`w-7 h-4 rounded-full transition-colors relative ${
                      showImpacted ? 'bg-blue-600' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`size-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                        showImpacted ? 'translate-x-3.5' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                  <span>Impacted</span>
                </label>

                {/* Archived Switch */}
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <div
                    onClick={() => setShowArchived(!showArchived)}
                    className={`w-7 h-4 rounded-full transition-colors relative ${
                      showArchived ? 'bg-blue-600' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`size-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                        showArchived ? 'translate-x-3.5' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                  <span>Archived</span>
                </label>
              </div>

              {/* Sort Dropdown */}
              <CustomDropdown
                value={sortBy}
                onChange={setSortBy}
                options={sortOptions}
                buttonClassName="h-8 px-3 rounded-[8px] bg-white/[0.04] hover:bg-white/[0.08] border-none text-xs"
              />
            </div>
          </div>

          {/* Primary Action Button: Create Experience */}
          <div>
            <button
              onClick={() => {
                const newExpName = `New Experience #${experiences.length + 1}`
                const newExp: Experience = {
                  id: 'exp_' + Date.now(),
                  name: newExpName,
                  privacy: 'Playtesters',
                  thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
                  updatedDate: 'Today',
                  visits: '0',
                  createdDate: 'Today',
                }
                setExperiences((prev) => [newExp, ...prev])
                openInStudio(newExp)
              }}
              className="h-9 px-4 rounded-[8px] bg-[#0055ff] hover:bg-[#0047d4] text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border-none shadow-md"
            >
              <span>Create Experience</span>
              <SquareArrowOutUpRight className="size-3.5" />
            </button>
          </div>

          {/* 5-Column Experiences Grid matching Reference Image */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredExperiences.map((exp) => (
              <div
                key={exp.id}
                onClick={() => openInStudio(exp)}
                className="flex flex-col gap-2 group cursor-pointer"
              >
                {/* Rounded Square Thumbnail Image */}
                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#16161a] relative shadow-md group-hover:ring-2 group-hover:ring-white/20 transition-all">
                  <img
                    src={exp.thumbnail}
                    alt={exp.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Hover Overlay with Edit in Studio button */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                    <span className="px-3 py-1.5 rounded-[6px] bg-white text-black font-bold text-xs shadow-lg">
                      Edit in Studio
                    </span>
                  </div>
                </div>

                {/* Info below thumbnail */}
                <div className="flex flex-col items-start gap-1">
                  {/* Privacy Badge */}
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.08] text-[10px] font-semibold text-white/80">
                    <Lock className="size-2.5 text-white/60" />
                    <span>{exp.privacy}</span>
                  </div>

                  {/* Title */}
                  <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors truncate w-full">
                    {exp.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
