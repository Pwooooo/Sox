import { useState } from 'react'
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
  SquareArrowOutUpRight,
  Play,
  Square,
  Box,
  Move,
  Maximize2,
  Plus,
  ArrowLeft,
  Upload,
  Compass,
  ChevronDown,
  X,
  Pencil,
  Sparkles,
  Gamepad2,
  ArrowLeftRight,
  Coins,
  Store,
  LayoutGrid,
  FileText,
  Users,
  Frown,
} from 'lucide-react'
import { CustomDropdown, DropdownOption } from '@/components/CustomDropdown'
import { StockAvatar } from '@/pages/Trade'

interface Experience {
  id: string
  name: string
  promotionalText?: string
  description?: string
  genre?: string
  subgenre?: string
  privacy: 'Playtesters' | 'Public'
  thumbnail?: string
  fallbackType: 'ocean' | 'autumn' | 'baseplate' | 'house' | 'mountain'
  updatedDate: string
  visits: string
  createdDate: string
}

// Visual In-Engine Vector Thumbnails (Guaranteed never to 404 or show broken image)
function ThumbnailCanvas({ type }: { type: 'ocean' | 'autumn' | 'baseplate' | 'house' | 'mountain' }) {
  if (type === 'ocean') {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full object-cover">
        <defs>
          <linearGradient id="oceanSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="35%" stopColor="#fdba74" />
            <stop offset="70%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="oceanWater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="60%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </linearGradient>
        </defs>
        <rect width="200" height="110" fill="url(#oceanSky)" />
        <circle cx="100" cy="80" r="26" fill="#fef08a" opacity="0.9" filter="blur(2px)" />
        <rect y="110" width="200" height="90" fill="url(#oceanWater)" />
        <polygon points="100,110 80,200 120,200" fill="#fef08a" opacity="0.25" />
        <path d="M0,165 Q100,140 200,175 L200,200 L0,200 Z" fill="#e0d0b0" />
      </svg>
    )
  }

  if (type === 'autumn') {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full object-cover">
        <defs>
          <linearGradient id="autumnSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="60%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>
        <rect width="200" height="110" fill="url(#autumnSky)" />
        <polygon points="-20,110 50,45 120,110" fill="#475569" opacity="0.6" />
        <polygon points="80,110 150,30 220,110" fill="#334155" opacity="0.8" />
        <rect y="110" width="200" height="90" fill="#eab308" />
        <path d="M-20,130 Q90,110 220,140 L220,200 L-20,200 Z" fill="#ca8a04" />
        <path d="M70,110 Q90,150 140,200 L110,200 Q75,150 60,110 Z" fill="#38bdf8" opacity="0.7" />
      </svg>
    )
  }

  if (type === 'baseplate') {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full object-cover bg-[#16161a]">
        <defs>
          <linearGradient id="darkStudioSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e1e24" />
            <stop offset="100%" stopColor="#0f0f13" />
          </linearGradient>
        </defs>
        <rect width="200" height="110" fill="url(#darkStudioSky)" />
        <line x1="0" y1="110" x2="200" y2="110" stroke="#33333d" strokeWidth="1" />
        <polygon points="100,110 210,165 100,195 -10,165" fill="#2d2d35" stroke="#3e3e48" strokeWidth="1" />
        <line x1="45" y1="137" x2="155" y2="180" stroke="#4a4a56" strokeWidth="0.8" opacity="0.6" />
        <line x1="155" y1="137" x2="45" y2="180" stroke="#4a4a56" strokeWidth="0.8" opacity="0.6" />
        <polygon points="100,138 125,150 100,162 75,150" fill="#10b981" stroke="#34d399" strokeWidth="1" />
        <circle cx="100" cy="150" r="3.5" fill="#ffffff" />
        <rect x="97" y="128" width="6" height="6" rx="1" fill="#d4d4d8" />
        <rect x="95" y="134" width="10" height="9" rx="1" fill="#3b82f6" />
      </svg>
    )
  }

  if (type === 'house') {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full object-cover">
        <defs>
          <linearGradient id="nordicSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>
        <rect width="200" height="115" fill="url(#nordicSky)" />
        <path d="M-20,130 Q100,90 220,135 L220,200 L-20,200 Z" fill="#4d7c0f" />
        <circle cx="40" cy="155" r="2.5" fill="#ffffff" />
        <circle cx="55" cy="170" r="2" fill="#ffffff" />
        <circle cx="140" cy="160" r="2.5" fill="#ffffff" />
        <circle cx="165" cy="175" r="2" fill="#ffffff" />
        <polygon points="100,75 75,98 125,98" fill="#7f1d1d" />
        <rect x="80" y="98" width="40" height="30" fill="#991b1b" />
        <rect x="87" y="104" width="8" height="8" fill="#ffffff" stroke="#7f1d1d" strokeWidth="1" />
        <rect x="105" y="104" width="8" height="8" fill="#ffffff" stroke="#7f1d1d" strokeWidth="1" />
        <rect x="96" y="116" width="8" height="12" fill="#450a0a" />
      </svg>
    )
  }

  // Mountain Landscape
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full object-cover">
      <defs>
        <linearGradient id="mountainSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="60%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#f0f9ff" />
        </linearGradient>
      </defs>
      <rect width="200" height="100" fill="url(#mountainSky)" />
      <polygon points="10,100 65,30 120,100" fill="#475569" />
      <polygon points="65,30 45,55 85,55" fill="#ffffff" />
      <polygon points="90,100 145,20 200,100" fill="#334155" />
      <polygon points="145,20 125,50 165,50" fill="#ffffff" />
      <path d="M-20,120 Q100,95 220,120 L220,200 L-20,200 Z" fill="#15803d" />
      <polygon points="30,140 22,160 38,160" fill="#14532d" />
      <polygon points="50,135 40,158 60,158" fill="#14532d" />
      <polygon points="160,138 152,160 168,160" fill="#14532d" />
    </svg>
  )
}

function ExperienceCardThumbnail({ exp }: { exp: Experience }) {
  const [imgError, setImgError] = useState(false)

  if (imgError || !exp.thumbnail) {
    return <ThumbnailCanvas type={exp.fallbackType} />
  }

  return (
    <img
      src={exp.thumbnail}
      alt={exp.name}
      onError={() => setImgError(true)}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  )
}

const DEFAULT_EXPERIENCES: Experience[] = [
  {
    id: 'exp1',
    name: 'Cat Battles',
    promotionalText: '',
    description: 'Battle alongside unique feline warriors in high-speed multiplayer combat arenas!',
    genre: 'Fighting',
    subgenre: '1v1 Arena',
    privacy: 'Playtesters',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    fallbackType: 'ocean',
    updatedDate: '10/24/2026',
    visits: '14.2K',
    createdDate: '10/12/2026',
  },
  {
    id: 'exp2',
    name: 'Lifting Haven',
    promotionalText: 'Double EXP Weekend active!',
    description: 'Lift weights, gain power, and unlock massive gym upgrades across the scenic valley.',
    genre: 'Simulation',
    subgenre: 'Tycoon',
    privacy: 'Playtesters',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    fallbackType: 'autumn',
    updatedDate: '10/18/2026',
    visits: '89.1K',
    createdDate: '9/28/2026',
  },
  {
    id: 'exp3',
    name: 'Pookie Dinosaur Wolrd',
    promotionalText: '',
    description: 'Explore prehistoric terrain and uncover dinosaur fossils in this sandbox world.',
    genre: 'Adventure',
    subgenre: 'Open World',
    privacy: 'Playtesters',
    fallbackType: 'baseplate',
    updatedDate: '10/15/2026',
    visits: '3.4K',
    createdDate: '10/01/2026',
  },
  {
    id: 'exp4',
    name: 'Steal A Noob',
    promotionalText: '',
    description: 'Sneak into the village, grab noobs, and escape without getting caught!',
    genre: 'Comedy',
    subgenre: 'Survival',
    privacy: 'Playtesters',
    thumbnail: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80',
    fallbackType: 'house',
    updatedDate: '10/10/2026',
    visits: '124K',
    createdDate: '8/14/2026',
  },
  {
    id: 'exp5',
    name: "JadexDraft1337's Place",
    promotionalText: '',
    description: 'Default starter place for JadexDraft1337.',
    genre: 'Building',
    subgenre: 'None',
    privacy: 'Playtesters',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    fallbackType: 'mountain',
    updatedDate: '10/02/2026',
    visits: '420',
    createdDate: '7/20/2026',
  },
]

interface CreateProps {
  onClose?: () => void
}

export function Create({ onClose }: CreateProps) {
  const [viewMode, setViewMode] = useState<'dashboard' | 'game_details' | 'studio'>('dashboard')
  const [activeExp, setActiveExp] = useState<Experience>(DEFAULT_EXPERIENCES[0]) // Cat Battles
  const [experiences, setExperiences] = useState<Experience[]>(DEFAULT_EXPERIENCES)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Game Details Form State
  const [formName, setFormName] = useState('')
  const [formPromo, setFormPromo] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formGenre, setFormGenre] = useState('Genre')
  const [formSubgenre, setFormSubgenre] = useState('None')
  const [formPrivacy, setFormPrivacy] = useState<'Playtesters' | 'Public'>('Playtesters')

  // Dashboard Filters State
  const [dashboardTab, setDashboardTab] = useState<'My Experiences' | 'Shared With Me'>('My Experiences')
  const [primarySidebarTab, setPrimarySidebarTab] = useState('Games')
  const [subSidebarTab, setSubSidebarTab] = useState<'Experiences' | 'Share links' | 'Avatar items' | 'Development items'>('Experiences')
  const [showPublic, setShowPublic] = useState(false)
  const [showImpacted, setShowImpacted] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [sortBy, setSortBy] = useState('Last Updated Date')

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

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Open Game Details when clicking on a card (matching Screenshot)
  const openGameDetails = (exp: Experience) => {
    setActiveExp(exp)
    setFormName(exp.name)
    setFormPromo(exp.promotionalText || '')
    setFormDesc(exp.description || '')
    setFormGenre(exp.genre || 'Genre')
    setFormSubgenre(exp.subgenre || 'None')
    setFormPrivacy(exp.privacy)
    setViewMode('game_details')
  }

  // Save Game Details
  const handleSaveDetails = () => {
    if (!formName.trim()) {
      showToast('Game name is required')
      return
    }

    setExperiences((prev) =>
      prev.map((e) =>
        e.id === activeExp.id
          ? {
              ...e,
              name: formName.trim(),
              promotionalText: formPromo.trim(),
              description: formDesc.trim(),
              genre: formGenre,
              subgenre: formSubgenre,
              privacy: formPrivacy,
              updatedDate: 'Today',
            }
          : e
      )
    )
    setActiveExp((prev) => ({
      ...prev,
      name: formName.trim(),
      promotionalText: formPromo.trim(),
      description: formDesc.trim(),
      genre: formGenre,
      subgenre: formSubgenre,
      privacy: formPrivacy,
    }))
    showToast('Changes saved successfully!')
    setViewMode('dashboard')
  }

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

  const genreOptions: DropdownOption[] = [
    { value: 'Genre', label: 'Genre' },
    { value: 'Fighting', label: 'Fighting' },
    { value: 'Adventure', label: 'Adventure' },
    { value: 'RPG', label: 'RPG' },
    { value: 'Simulation', label: 'Simulation' },
    { value: 'Building', label: 'Building' },
    { value: 'Comedy', label: 'Comedy' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Horror', label: 'Horror' },
  ]

  const subgenreOptions: DropdownOption[] = [
    { value: 'None', label: 'None' },
    { value: '1v1 Arena', label: '1v1 Arena' },
    { value: 'Open World', label: 'Open World' },
    { value: 'Story Driven', label: 'Story Driven' },
    { value: 'Survival', label: 'Survival' },
    { value: 'Tycoon', label: 'Tycoon' },
  ]

  // Filter experiences
  const filteredExperiences = experiences.filter((exp) => {
    if (showPublic && exp.privacy !== 'Public') return false
    return true
  })

  // -------------------------------------------------------------
  // VIEW 1: NOVELO STUDIO (MINIMALISTIC 3D STUDIO ENGINE)
  // -------------------------------------------------------------
  if (viewMode === 'studio') {
    const currentPartObj = parts.find((p) => p.name === selectedPart) || parts[1]

    return (
      <div className="fixed inset-0 z-50 bg-[#0f0f12] text-white select-none flex flex-col overflow-hidden font-sans">
        {/* Top Studio Ribbon Bar */}
        <div className="h-12 bg-[#141418] border-b border-white/[0.06] flex items-center justify-between px-3 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('game_details')}
              className="h-8 px-2.5 rounded-[6px] bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border-none"
              title="Return to Game Details"
            >
              <ArrowLeft className="size-3.5" />
              <span>Details</span>
            </button>

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
          <div className="flex items-center gap-2">
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
              onClick={() => showToast(`Place "${activeExp.name}" published successfully!`)}
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
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <span className="px-2 py-1 rounded bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white/70 border border-white/5">
                {isPlaying ? 'RUNNING (TEST MODE)' : 'EDIT MODE'}
              </span>
              <span className="px-2 py-1 rounded bg-black/60 backdrop-blur-xs text-[10px] font-bold text-emerald-400 border border-white/5">
                60.0 FPS
              </span>
            </div>

            <div className="absolute top-3 right-3 z-10 size-12 rounded-full bg-black/40 backdrop-blur-xs border border-white/10 flex items-center justify-center">
              <Compass className="size-6 text-white/60" />
            </div>

            {/* Isometric 3D Baseplate Rendering */}
            <div className="flex-1 flex items-center justify-center relative">
              <svg viewBox="0 0 800 500" className="w-full h-full max-h-[640px] object-contain drop-shadow-2xl">
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
                <rect width="800" height="500" fill="url(#studioSky)" />
                <line x1="0" y1="260" x2="800" y2="260" stroke="#ffffff" strokeOpacity="0.04" strokeWidth="1" />

                <g transform="translate(400, 290)">
                  <polygon points="0,-120 340,30 0,180 -340,30" fill="url(#baseplateGrid)" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1.5" />
                  {[-240, -160, -80, 0, 80, 160, 240].map((offset, i) => (
                    <g key={i}>
                      <line x1={offset * 0.7} y1={-120 + Math.abs(offset) * 0.25} x2={offset * 0.7} y2={180 - Math.abs(offset) * 0.25} stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1" />
                      <line y1={offset * 0.35} x1={-340 + Math.abs(offset) * 0.6} y2={offset * 0.35} x2={340 - Math.abs(offset) * 0.6} stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1" />
                    </g>
                  ))}

                  <polygon
                    points="0,-25 60,5 0,35 -60,5"
                    fill={selectedPart === 'SpawnLocation' ? '#10b981' : '#059669'}
                    stroke="#ffffff"
                    strokeOpacity={selectedPart === 'SpawnLocation' ? '0.8' : '0.2'}
                    strokeWidth={selectedPart === 'SpawnLocation' ? '2' : '1'}
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedPart('SpawnLocation')}
                  />
                  <circle cx="0" cy="5" r="8" fill="#ffffff" fillOpacity="0.8" />

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
            <div className="p-3 border-b border-white/[0.06] flex items-center justify-between">
              <span className="text-xs font-bold text-white tracking-tight uppercase">Explorer</span>
              <button onClick={handleAddPart} className="size-6 rounded bg-white/[0.06] hover:bg-white/[0.12] text-white flex items-center justify-center cursor-pointer border-none">
                <Plus className="size-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-0.5 text-xs text-white/80 no-scrollbar">
              <div className="flex items-center gap-1.5 py-1 px-2 rounded font-semibold text-white/90">
                <ChevronDown className="size-3 text-white/50" />
                <Folder className="size-3.5 text-amber-400" />
                <span>Workspace</span>
              </div>
              <div className="pl-5 flex flex-col gap-0.5">
                {parts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPart(p.name)}
                    className={`w-full py-1 px-2 rounded-[5px] flex items-center gap-2 text-left cursor-pointer border-none transition-colors ${
                      p.name === selectedPart ? 'bg-blue-600 text-white font-bold' : 'hover:bg-white/[0.05] text-white/80'
                    }`}
                  >
                    <Box className="size-3 text-white/60" />
                    <span className="truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-56 border-t border-white/[0.06] flex flex-col bg-[#111114]">
              <div className="p-2.5 border-b border-white/[0.06] flex items-center justify-between">
                <span className="text-xs font-bold text-white tracking-tight uppercase">Properties - {currentPartObj.name}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-2 text-[11px] text-white/70 no-scrollbar">
                <div className="flex items-center justify-between"><span className="text-white/40">Name</span><span className="font-semibold text-white">{currentPartObj.name}</span></div>
                <div className="flex items-center justify-between"><span className="text-white/40">Size</span><span className="font-mono text-[10px] text-white/90">{currentPartObj.size}</span></div>
                <div className="flex items-center justify-between"><span className="text-white/40">Position</span><span className="font-mono text-[10px] text-white/90">{currentPartObj.pos}</span></div>
                <div className="flex items-center justify-between"><span className="text-white/40">Anchored</span><span className="text-emerald-400 font-bold">true</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------
  // VIEW 2: GAME DETAILS (Matching Screenshot Exactly)
  // -------------------------------------------------------------
  if (viewMode === 'game_details') {
    return (
      <div className="fixed inset-0 z-50 bg-[#0e0e12] text-white select-none flex flex-col overflow-y-auto no-scrollbar font-sans">
        {/* Top Breadcrumb Header Bar */}
        <div className="h-14 px-6 md:px-12 border-b border-white/[0.04] flex items-center justify-between shrink-0 bg-[#0b0b0e]">
          <div className="flex items-center gap-2.5 text-xs text-white/60">
            <button
              onClick={() => setViewMode('dashboard')}
              className="text-white/70 hover:text-white flex items-center gap-2 cursor-pointer bg-transparent border-none p-0 transition-colors"
            >
              <Menu className="size-4" />
              <span className="font-semibold">Creations</span>
            </button>
            <span className="text-white/30">/</span>
            <span className="text-white/80 font-medium truncate max-w-xs">{activeExp.name}</span>
            <span className="text-white/30">/</span>
            <span className="text-white font-bold">Game details</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openInStudio(activeExp)}
              className="h-8 px-3.5 rounded-[8px] bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer border-none shadow-sm transition-all"
            >
              <Play className="size-3 fill-current" />
              <span>Edit in Studio</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="size-7 rounded-[6px] bg-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white flex items-center justify-center cursor-pointer border-none transition-colors"
                title="Close"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* Game Details Form Container matching Screenshot */}
        <div className="p-6 md:p-12 max-w-4xl flex flex-col gap-6">
          {/* Main Title */}
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Game details
          </h1>

          {/* Media Boxes Row matching Screenshot */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4 flex-wrap">
              {/* Box 1: Game Icon */}
              <div className="relative size-28 rounded-xl bg-[#141418] border border-white/5 flex items-center justify-center overflow-hidden group shadow-md">
                <svg viewBox="0 0 100 100" className="size-14 text-white/20" fill="currentColor">
                  <path d="M 28 16 L 86 28 L 72 86 L 14 74 Z M 44 45 L 59 48 L 55 63 L 40 60 Z" fillRule="evenodd" />
                </svg>
                <button
                  className="size-7 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center absolute top-2 right-2 cursor-pointer border-none shadow-sm transition-colors"
                  title="Edit Icon"
                >
                  <Pencil className="size-3.5" />
                </button>
              </div>

              {/* Box 2: Thumbnail */}
              <div className="relative w-48 h-28 rounded-xl bg-[#141418] border border-white/5 flex items-center justify-center overflow-hidden group shadow-md">
                <ExperienceCardThumbnail exp={activeExp} />
                <button
                  className="size-7 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center absolute top-2 right-2 cursor-pointer border-none shadow-sm transition-colors z-10"
                  title="Edit Thumbnail"
                >
                  <Pencil className="size-3.5" />
                </button>
              </div>

              {/* Box 3: No Video Uploaded */}
              <div className="w-56 h-28 rounded-xl bg-[#141418] border border-white/10 p-3.5 flex flex-col items-center justify-center text-center gap-1.5 shadow-md">
                <span className="text-xs font-bold text-white leading-tight">
                  No video uploaded
                </span>
                <span className="text-[10px] text-white/50 leading-tight">
                  Upload a video to help users discover your game
                </span>
                <button
                  className="mt-1 h-6 px-3.5 rounded-[6px] bg-[#222228] hover:bg-[#2c2c34] text-white text-[11px] font-semibold cursor-pointer border-none transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>

            {/* Inherited subtext matching Screenshot */}
            <span className="text-[11px] text-white/40 mt-1">
              Icon, thumbnail, and gameplay video are inherited from start place
            </span>
          </div>

          {/* Field 1: Name * */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-white tracking-tight">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={50}
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full h-10 px-3.5 rounded-[8px] bg-[#121216] border border-white/10 text-xs text-white focus:outline-none focus:border-white/30 transition-colors"
              placeholder="Experience Name"
            />
            <span className="text-[11px] text-white/40">
              {formName.length}/50
            </span>
          </div>

          {/* Field 2: Promotional text */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-white tracking-tight">
              Promotional text
            </label>
            <input
              type="text"
              value={formPromo}
              onChange={(e) => setFormPromo(e.target.value)}
              className="w-full h-10 px-3.5 rounded-[8px] bg-[#121216] border border-white/10 text-xs text-white focus:outline-none focus:border-white/30 transition-colors"
              placeholder="e.g. Double EXP Weekend active!"
            />
            <span className="text-[11px] text-white/40">
              Displays secondary or temporary information about your game.{' '}
              <a href="#" onClick={(e) => e.preventDefault()} className="text-white/60 hover:text-white underline">
                Learn more
              </a>
              .
            </span>
          </div>

          {/* Field 3: Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-white tracking-tight">
              Description
            </label>
            <textarea
              rows={4}
              maxLength={1000}
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="w-full p-3 rounded-[8px] bg-[#121216] border border-white/10 text-xs text-white focus:outline-none focus:border-white/30 transition-colors resize-y leading-relaxed"
              placeholder="Enter details about your experience..."
            />
            <span className="text-[11px] text-white/40">
              {formDesc.length}/1000
            </span>
          </div>

          {/* Field 4: Genre & Subgenre matching Screenshot */}
          <div className="flex flex-col gap-1.5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
              {/* Genre Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-white tracking-tight">
                  Genre
                </label>
                <CustomDropdown
                  value={formGenre}
                  onChange={setFormGenre}
                  options={genreOptions}
                  buttonClassName="w-full h-10 px-3.5 rounded-[8px] bg-[#121216] border border-white/10 text-xs font-medium justify-between"
                  menuClassName="w-full"
                />
              </div>

              {/* Subgenre Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-white tracking-tight">
                  Subgenre
                </label>
                <CustomDropdown
                  value={formSubgenre}
                  onChange={setFormSubgenre}
                  options={subgenreOptions}
                  buttonClassName="w-full h-10 px-3.5 rounded-[8px] bg-[#121216] border border-white/10 text-xs font-medium justify-between"
                  menuClassName="w-full"
                />
              </div>
            </div>

            <span className="text-[11px] text-white/40 mt-1">
              <a href="#" onClick={(e) => e.preventDefault()} className="text-white/60 hover:text-white underline">
                Genres
              </a>{' '}
              can only be changed every 3 months.
            </span>
          </div>

          {/* Field 5: Privacy / Visibility Setting */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-white tracking-tight">
              Privacy / Visibility
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
              <div
                onClick={() => setFormPrivacy('Public')}
                className={`flex items-start gap-3 p-3 rounded-[8px] border cursor-pointer transition-all ${
                  formPrivacy === 'Public'
                    ? 'bg-blue-600/10 border-blue-500 text-white shadow-sm'
                    : 'bg-[#121216] border-white/10 text-white/60 hover:text-white hover:border-white/20'
                }`}
              >
                <div className={`size-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${formPrivacy === 'Public' ? 'border-blue-500 bg-blue-500/20' : 'border-white/30'}`}>
                  {formPrivacy === 'Public' && <div className="size-2 rounded-full bg-blue-500" />}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-white">Public</span>
                  <span className="text-[11px] text-white/40 leading-snug">Anyone on Novelo can discover and play</span>
                </div>
              </div>

              <div
                onClick={() => setFormPrivacy('Playtesters')}
                className={`flex items-start gap-3 p-3 rounded-[8px] border cursor-pointer transition-all ${
                  formPrivacy === 'Playtesters'
                    ? 'bg-blue-600/10 border-blue-500 text-white shadow-sm'
                    : 'bg-[#121216] border-white/10 text-white/60 hover:text-white hover:border-white/20'
                }`}
              >
                <div className={`size-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${formPrivacy === 'Playtesters' ? 'border-blue-500 bg-blue-500/20' : 'border-white/30'}`}>
                  {formPrivacy === 'Playtesters' && <div className="size-2 rounded-full bg-blue-500" />}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-white">Playtesters (Private)</span>
                  <span className="text-[11px] text-white/40 leading-snug">Only you and approved playtesters can join</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Save & Cancel matching Screenshot */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleSaveDetails}
              className="h-9 px-5 rounded-[8px] bg-[#222226] hover:bg-white hover:text-black text-white font-bold text-xs cursor-pointer border-none transition-colors shadow-sm"
            >
              Save
            </button>
            <button
              onClick={() => setViewMode('dashboard')}
              className="h-9 px-5 rounded-[8px] bg-[#1c1c20] hover:bg-[#242428] text-white font-bold text-xs cursor-pointer border-none transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------
  // VIEW 3: NOVELO CREATOR DASHBOARD (STANDALONE FULLSCREEN SEPARATE UI)
  // -------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 bg-[#0b0b0e] text-white select-none flex flex-col overflow-hidden font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/20 text-white shadow-2xl text-xs font-semibold animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles className="size-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Application Bar with Return to Novelo Client & Search */}
      <div className="h-12 bg-[#0e0e12] border-b border-white/[0.06] flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="h-7 px-2.5 rounded-[6px] bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border-none"
              title="Return to Novelo"
            >
              <ArrowLeft className="size-3.5" />
              <span>Novelo</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <img
              src="/novelo-icon.png"
              alt="Novelo"
              className="h-8 w-auto max-h-9 object-contain"
            />
            <span className="text-xs font-black tracking-wider text-white uppercase translate-y-1.5">
              Creator
            </span>
          </div>
        </div>

        {/* Center Search Bar */}
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/40 pointer-events-none" />
          <input
            type="text"
            placeholder="Search experiences, items, or creators"
            className="w-full h-8 pl-9 pr-3 rounded-[8px] bg-[#16161a] border border-white/5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/20"
          />
        </div>

        {/* Right Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] text-xs font-bold text-white">
            <img src="/novelo-currency.png" alt="Currency" className="size-3.5 object-contain" />
            <span>1,250</span>
          </div>

          <button className="size-7 rounded-[6px] hover:bg-white/[0.08] flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer border-none bg-transparent">
            <Bell className="size-4" />
          </button>

          <StockAvatar className="size-7" />

          {onClose && (
            <button
              onClick={onClose}
              className="size-7 rounded-[6px] bg-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white flex items-center justify-center cursor-pointer border-none transition-colors ml-1"
              title="Close Creator Hub"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Container: Sidebar + Subnav + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Primary Creator Hub Sidebar matching Reference Image */}
        <div className="w-16 md:w-52 bg-[#0e0e12] border-r border-white/[0.04] flex flex-col justify-between py-4 shrink-0">
          <div className="flex flex-col gap-3 px-2.5">
            {/* Category: Create */}
            <div className="flex flex-col gap-1">
              <span className="hidden md:block text-[11px] font-semibold text-white/40 px-2.5 pt-1 pb-1 uppercase tracking-wider">
                Create
              </span>

              <button
                onClick={() => setPrimarySidebarTab('Games')}
                className={`flex items-center gap-3 px-2.5 h-8.5 rounded-[8px] transition-colors cursor-pointer border-none text-left ${
                  primarySidebarTab === 'Games'
                    ? 'bg-white/[0.1] text-white font-bold'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04] bg-transparent'
                }`}
              >
                <Gamepad2 className={`size-4 shrink-0 transition-transform ${primarySidebarTab === 'Games' ? 'fill-current text-white scale-105' : 'fill-none text-white/60'}`} />
                <span className="hidden md:inline text-xs font-semibold">Games</span>
              </button>

              <button
                onClick={() => setPrimarySidebarTab('Transfers')}
                className={`flex items-center gap-3 px-2.5 h-8.5 rounded-[8px] transition-colors cursor-pointer border-none text-left ${
                  primarySidebarTab === 'Transfers'
                    ? 'bg-white/[0.1] text-white font-bold'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04] bg-transparent'
                }`}
              >
                <ArrowLeftRight className={`size-4 shrink-0 transition-transform ${primarySidebarTab === 'Transfers' ? 'fill-current text-white scale-105' : 'fill-none text-white/60'}`} />
                <span className="hidden md:inline text-xs font-semibold">Transfers</span>
              </button>

              <button
                onClick={() => setPrimarySidebarTab('Payouts')}
                className={`flex items-center gap-3 px-2.5 h-8.5 rounded-[8px] transition-colors cursor-pointer border-none text-left ${
                  primarySidebarTab === 'Payouts'
                    ? 'bg-white/[0.1] text-white font-bold'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04] bg-transparent'
                }`}
              >
                <Coins className={`size-4 shrink-0 transition-transform ${primarySidebarTab === 'Payouts' ? 'fill-current text-white scale-105' : 'fill-none text-white/60'}`} />
                <span className="hidden md:inline text-xs font-semibold">Payouts</span>
              </button>

              <button
                onClick={() => setPrimarySidebarTab('Marketplace')}
                className={`flex items-center gap-3 px-2.5 h-8.5 rounded-[8px] transition-colors cursor-pointer border-none text-left ${
                  primarySidebarTab === 'Marketplace'
                    ? 'bg-white/[0.1] text-white font-bold'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04] bg-transparent'
                }`}
              >
                <Store className={`size-4 shrink-0 transition-transform ${primarySidebarTab === 'Marketplace' ? 'fill-current text-white scale-105' : 'fill-none text-white/60'}`} />
                <span className="hidden md:inline text-xs font-semibold">Marketplace</span>
              </button>

              <button
                onClick={() => setPrimarySidebarTab('Applications')}
                className={`flex items-center gap-3 px-2.5 h-8.5 rounded-[8px] transition-colors cursor-pointer border-none text-left ${
                  primarySidebarTab === 'Applications'
                    ? 'bg-white/[0.1] text-white font-bold'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04] bg-transparent'
                }`}
              >
                <LayoutGrid className={`size-4 shrink-0 transition-transform ${primarySidebarTab === 'Applications' ? 'fill-current text-white scale-105' : 'fill-none text-white/60'}`} />
                <span className="hidden md:inline text-xs font-semibold">Applications</span>
              </button>
            </div>

            {/* Category: Assets */}
            <div className="flex flex-col gap-1 pt-1">
              <span className="hidden md:block text-[11px] font-semibold text-white/40 px-2.5 pt-1 pb-1 uppercase tracking-wider">
                Assets
              </span>

              <button
                onClick={() => setPrimarySidebarTab('Library')}
                className={`flex items-center gap-3 px-2.5 h-8.5 rounded-[8px] transition-colors cursor-pointer border-none text-left ${
                  primarySidebarTab === 'Library'
                    ? 'bg-white/[0.1] text-white font-bold'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04] bg-transparent'
                }`}
              >
                <FileText className={`size-4 shrink-0 transition-transform ${primarySidebarTab === 'Library' ? 'fill-current text-white scale-105' : 'fill-none text-white/60'}`} />
                <span className="hidden md:inline text-xs font-semibold">Library</span>
              </button>

              <button
                onClick={() => setPrimarySidebarTab('Store')}
                className={`flex items-center gap-3 px-2.5 h-8.5 rounded-[8px] transition-colors cursor-pointer border-none text-left ${
                  primarySidebarTab === 'Store'
                    ? 'bg-white/[0.1] text-white font-bold'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04] bg-transparent'
                }`}
              >
                <ShoppingBag className={`size-4 shrink-0 transition-transform ${primarySidebarTab === 'Store' ? 'fill-current text-white scale-105' : 'fill-none text-white/60'}`} />
                <span className="hidden md:inline text-xs font-semibold">Store</span>
              </button>
            </div>
          </div>

          <div className="px-2.5 flex flex-col gap-1.5">
            {/* Account Selector (Thinner, no background - matching Image 2) */}
            <div
              className="flex items-center justify-between px-2 py-0.5 rounded-[4px] hover:bg-white/[0.04] cursor-pointer transition-colors"
              title="JadexDraft1337"
            >
              <div className="flex items-center gap-2 min-w-0">
                <StockAvatar className="size-4.5 shrink-0" />
                <span className="hidden md:inline text-xs font-semibold truncate text-white">
                  JadexDraft1337
                </span>
              </div>
              <ChevronDown className="hidden md:block size-3 text-white/40 shrink-0" />
            </div>

            <button className="w-full flex items-center gap-3 px-2.5 h-8.5 rounded-[8px] text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer border-none bg-transparent text-left">
              <Grid className="size-4 shrink-0" />
              <span className="hidden md:inline text-xs font-semibold">All tools</span>
            </button>
          </div>
        </div>

        {/* Creations Sub-navigation Sidebar */}
        <div className="hidden lg:flex w-48 bg-[#0c0c10] border-r border-white/[0.04] flex-col py-6 px-3 shrink-0 gap-4">
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

        {/* Main Workspace matching Reference Image */}
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-[#0b0b0e]">
          {/* Header Bar */}
          <div className="h-14 px-6 md:px-8 border-b border-white/[0.04] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Menu className="size-4 text-white/70" />
              <h1 className="text-lg md:text-xl font-black text-white tracking-tight">
                Experiences
              </h1>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 md:p-8 flex flex-col gap-6 max-w-[1600px]">
            {/* Filter Bar with Tabs and Switches */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-wrap">
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

              {/* Switches & Sort */}
              <div className="flex items-center gap-5 flex-wrap">
                <div className="flex items-center gap-3.5 text-xs text-white/60">
                  <span className="font-semibold text-white/40">Show:</span>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <div
                      onClick={() => setShowPublic(!showPublic)}
                      className={`w-7 h-4 rounded-full transition-colors relative ${
                        showPublic ? 'bg-blue-600' : 'bg-white/20'
                      }`}
                    >
                      <div className={`size-3 rounded-full bg-white absolute top-0.5 transition-transform ${showPublic ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                    </div>
                    <span>Public</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <div
                      onClick={() => setShowImpacted(!showImpacted)}
                      className={`w-7 h-4 rounded-full transition-colors relative ${
                        showImpacted ? 'bg-blue-600' : 'bg-white/20'
                      }`}
                    >
                      <div className={`size-3 rounded-full bg-white absolute top-0.5 transition-transform ${showImpacted ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                    </div>
                    <span>Impacted</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <div
                      onClick={() => setShowArchived(!showArchived)}
                      className={`w-7 h-4 rounded-full transition-colors relative ${
                        showArchived ? 'bg-blue-600' : 'bg-white/20'
                      }`}
                    >
                      <div className={`size-3 rounded-full bg-white absolute top-0.5 transition-transform ${showArchived ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                    </div>
                    <span>Archived</span>
                  </label>
                </div>

                <CustomDropdown
                  value={sortBy}
                  onChange={setSortBy}
                  options={sortOptions}
                  buttonClassName="h-8 px-3 rounded-[8px] bg-white/[0.04] hover:bg-white/[0.08] border-none text-xs"
                />
              </div>
            </div>

            {/* Create Experience Button */}
            <div>
              <button
                onClick={() => {
                  const newExpName = `New Experience #${experiences.length + 1}`
                  const newExp: Experience = {
                    id: 'exp_' + Date.now(),
                    name: newExpName,
                    privacy: 'Playtesters',
                    fallbackType: 'baseplate',
                    updatedDate: 'Today',
                    visits: '0',
                    createdDate: 'Today',
                  }
                  setExperiences((prev) => [newExp, ...prev])
                  openGameDetails(newExp)
                }}
                className="h-9 px-4 rounded-[8px] bg-[#0055ff] hover:bg-[#0047d4] text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border-none shadow-md"
              >
                <span>Create Experience</span>
                <SquareArrowOutUpRight className="size-3.5" />
              </button>
            </div>

            {/* Experiences Grid with Banner + Overlapping Thumbnail matching Image 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredExperiences.map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => openGameDetails(exp)}
                  className="flex flex-col group cursor-pointer"
                >
                  {/* Banner + Overlapping Thumbnail Container */}
                  <div className="relative">
                    {/* Landscape Banner */}
                    <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#16161a] relative shadow-md group-hover:ring-2 group-hover:ring-white/20 transition-all">
                      <ExperienceCardThumbnail exp={exp} />

                      {/* Hover Overlay with Game Details Button */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 z-10">
                        <span className="px-3 py-1.5 rounded-[6px] bg-white text-black font-bold text-xs shadow-lg">
                          Game Details
                        </span>
                      </div>
                    </div>

                    {/* Overlapping Square Thumbnail (matching Image 1) */}
                    <div className="absolute -bottom-4 left-3 size-12 md:size-13 rounded-xl overflow-hidden border-2 border-[#0b0b0e] bg-[#16161a] shadow-lg z-20 group-hover:scale-105 transition-transform">
                      <ExperienceCardThumbnail exp={exp} />
                    </div>
                  </div>

                  {/* Card Details below banner */}
                  <div className="pt-5 flex flex-col gap-1 px-1">
                    <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate w-full">
                      {exp.name}
                    </span>

                    <div className="flex items-center gap-2.5 text-white/50 text-xs">
                      <div className="flex items-center gap-1">
                        <Frown className="size-3 text-white/40" />
                        <span>N/A</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="size-3 text-white/40" />
                        <span>0</span>
                      </div>
                      <div className="ml-auto flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/[0.06] text-[10px] font-semibold text-white/70">
                        <Lock className="size-2 text-white/50" />
                        <span>{exp.privacy}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
