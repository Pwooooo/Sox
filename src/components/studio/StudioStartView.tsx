import { useState, useRef, useEffect } from 'react'
import { WaveBackground } from '@/components/WaveBackground'
import {
  Archive,
  Clock,
  Download,
  Folder,
  Gamepad2,
  Home,
  LayoutGrid,
  List,
  Minus,
  Maximize,
  MoreVertical,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import {
  deserializeNvlo,
  serializeNvlo,
  type LightingPreset,
  type NvloDocument,
} from '@engine/index'

export interface SavedStudioProject {
  id: string
  name: string
  template: string
  updatedAt: number
  archived?: boolean
  thumbnail?: string
  promo?: string
  description?: string
  genre?: string
  subgenre?: string
  privacy?: 'Public' | 'Private' | 'Playtesters'
  doc: NvloDocument
}

interface StudioStartViewProps {
  projects: SavedStudioProject[]
  onOpenProject: (project: SavedStudioProject) => void
  onCreateProject: (name: string, template: string, preset: LightingPreset) => void
  onImportProject: (name: string, doc: NvloDocument) => void
  onDeleteProject: (id: string) => void
  onToggleArchiveProject: (id: string) => void
}

type SidebarTab = 'Recents' | 'Home' | 'Experiences' | 'Archive'

export function StudioStartView({
  projects,
  onOpenProject,
  onCreateProject,
  onImportProject,
  onDeleteProject,
  onToggleArchiveProject,
}: StudioStartViewProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('Recents')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sidebarHidden, setSidebarHidden] = useState(false)
  const [openCardMenuId, setOpenCardMenuId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const openSettingsFor = async (proj: SavedStudioProject) => {
    const webBase = window.location.origin.startsWith('http://localhost')
      ? window.location.origin
      : 'https://playnovelo.vercel.app'
    const url = `${webBase}/?tab=Create&experience=${encodeURIComponent(proj.id)}`
    try {
      const { invoke } = await import('@tauri-apps/api/core')
      await invoke('open_external_url', { url })
    } catch {
      window.open(url, '_blank')
    }
  }

  useEffect(() => {
    if (!openCardMenuId) return
    const onDown = () => setOpenCardMenuId(null)
    window.addEventListener('mousedown', onDown)
    return () => window.removeEventListener('mousedown', onDown)
  }, [openCardMenuId])

  const handleMinimize = async () => {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window')
      await getCurrentWindow().minimize()
    } catch {
      // ignore in browser
    }
  }

  const handleMaximize = async () => {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window')
      await getCurrentWindow().toggleMaximize()
    } catch {
      // ignore in browser
    }
  }

  const handleClose = async () => {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window')
      await getCurrentWindow().close()
    } catch {
      // ignore in browser
    }
  }

  const handleImportNvlo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const doc = deserializeNvlo(String(reader.result))
        const name = doc.metadata?.name || file.name.replace(/\.nvlo$/i, '')
        onImportProject(name, doc)
      } catch {
        // ignore invalid file
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleExportProject = (proj: SavedStudioProject) => {
    const content = serializeNvlo(proj.doc)
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${proj.name.replace(/[^a-z0-9_-]/gi, '_')}.nvlo`
    a.click()
    URL.revokeObjectURL(url)
  }

  const q = search.trim().toLowerCase()
  const filteredProjects = projects
    .filter((p) => (activeTab === 'Archive' ? Boolean(p.archived) : !p.archived))
    .filter((p) => !q || p.name.toLowerCase().includes(q) || p.template.toLowerCase().includes(q))
    .sort((a, b) => b.updatedAt - a.updatedAt)

  const formatTime = (ts: number) => {
    const d = new Date(ts)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' · ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const navItems: { id: SidebarTab; label: string; icon: typeof Clock }[] = [
    { id: 'Recents', label: 'Recents', icon: Clock },
    { id: 'Home', label: 'Home', icon: Home },
    { id: 'Experiences', label: 'Experiences', icon: Folder },
    { id: 'Archive', label: 'Archive', icon: Archive },
  ]

  return (
    <div className="relative h-screen w-screen bg-[#0a0a0a] text-white flex flex-col overflow-hidden select-none">
      <WaveBackground />
      <input
        ref={fileInputRef}
        type="file"
        accept=".nvlo"
        className="hidden"
        onChange={handleImportNvlo}
      />

      {/* Top Window Bar */}
      <div
        data-tauri-drag-region
        className="relative z-10 h-8 bg-transparent flex items-center justify-between px-3 shrink-0"
      >
        <div className="flex items-center gap-3 text-[11px] text-white/70">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-transparent border-none text-white/70 hover:text-white cursor-pointer px-1.5 py-0.5 rounded hover:bg-white/[0.06] text-[11px]"
          >
            Open File...
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleMinimize}
            className="size-6 rounded flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.08] border-none bg-transparent cursor-pointer"
            title="Minimize"
          >
            <Minus className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={handleMaximize}
            className="size-6 rounded flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.08] border-none bg-transparent cursor-pointer"
            title="Maximize"
          >
            <Maximize className="size-3" />
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="size-6 rounded flex items-center justify-center text-white/60 hover:text-white hover:bg-rose-500/80 border-none bg-transparent cursor-pointer"
            title="Close"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Main Split */}
      <div className="relative z-10 flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        {!sidebarHidden && (
          <div className="w-56 bg-transparent flex flex-col justify-between p-3 shrink-0">
            <div className="flex flex-col gap-3">
              {/* Brand */}
              <div className="flex items-center gap-2.5 px-1.5 py-1">
                <img
                  src="/logo.png"
                  alt="Novelo"
                  className="size-7 object-contain shrink-0"
                />
                <span className="text-[13px] font-bold tracking-tight text-white">Novelo Studio</span>
              </div>

              {/* New Experience */}
              <button
                type="button"
                onClick={() =>
                  onCreateProject(
                    projects.length === 0 ? 'Untitled Experience' : `Experience ${projects.length + 1}`,
                    'Baseplate',
                    'BrightDay',
                  )
                }
                className="w-full h-8 px-2.5 rounded-[6px] bg-transparent hover:bg-white/[0.06] border-none text-white text-[12px] font-medium flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                <span className="size-4 rounded-full bg-white text-[#0c0d10] flex items-center justify-center shrink-0">
                  <Plus className="size-3 stroke-[3]" />
                </span>
                <span>New Experience</span>
              </button>

              {/* Nav Links */}
              <div className="flex flex-col gap-0.5">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full h-8 px-2.5 rounded-[6px] flex items-center gap-2.5 text-[12px] border-none cursor-pointer transition-colors text-left ${
                        isActive
                          ? 'bg-white/12 text-white font-semibold'
                          : 'bg-transparent text-white/65 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSidebarHidden(true)}
              className="w-full h-8 px-2.5 rounded-[6px] flex items-center gap-2 text-[11px] text-white/55 hover:text-white hover:bg-white/[0.05] border-none bg-transparent cursor-pointer transition-colors"
            >
              <PanelLeftClose className="size-3.5" />
              <span>Hide sidebar</span>
            </button>
          </div>
        )}

        {/* Right Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
          {/* Content Header */}
          <div className="h-14 px-6 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-2.5">
              {sidebarHidden && (
                <button
                  type="button"
                  onClick={() => setSidebarHidden(false)}
                  className="size-7 rounded-[6px] bg-white/[0.06] hover:bg-white/[0.12] text-white/75 hover:text-white flex items-center justify-center border-none cursor-pointer"
                  title="Show sidebar"
                >
                  <PanelLeftOpen className="size-4" />
                </button>
              )}
              <h1 className="text-[18px] font-bold tracking-tight text-white m-0">{activeTab}</h1>
            </div>

            {/* Search */}
            <div className="relative w-72">
              <Search className="size-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="w-full h-8 pl-8 pr-3 rounded-full bg-white/[0.05] border border-white/[0.1] focus:border-white/30 text-white text-[12px] placeholder:text-white/40 focus:outline-none"
              />
            </div>

            {/* Grid/List Toggle */}
            <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-[6px] border border-white/[0.08]">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`size-6 rounded-[4px] flex items-center justify-center border-none cursor-pointer transition-colors ${
                  viewMode === 'grid' ? 'bg-white/15 text-white' : 'bg-transparent text-white/45 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`size-6 rounded-[4px] flex items-center justify-center border-none cursor-pointer transition-colors ${
                  viewMode === 'list' ? 'bg-white/15 text-white' : 'bg-transparent text-white/45 hover:text-white'
                }`}
                title="List View"
              >
                <List className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 no-scrollbar">
            {filteredProjects.length === 0 ? (
              <div className="h-full min-h-[360px] flex flex-col items-center justify-center gap-3 text-center">
                <div className="size-16 rounded-[12px] border border-white/15 bg-white/[0.03] flex items-center justify-center -rotate-6">
                  <Gamepad2 className="size-8 text-white/75" />
                </div>
                <div className="text-[13px] font-semibold text-white/85">
                  {activeTab === 'Archive' ? 'No Archived Experiences.' : 'No Experiences to display.'}
                </div>
                {activeTab !== 'Archive' && (
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() =>
                        onCreateProject(
                          projects.length === 0
                            ? 'Untitled Experience'
                            : `Experience ${projects.length + 1}`,
                          'Baseplate',
                          'BrightDay',
                        )
                      }
                      className="h-8 px-4 rounded-[6px] bg-white text-[#0c0d10] hover:bg-white/90 text-[12px] font-semibold border-none cursor-pointer transition-colors"
                    >
                      Create a new Experience
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-8 px-3 rounded-[6px] bg-white/[0.08] hover:bg-white/[0.14] text-white text-[12px] font-medium border border-white/10 cursor-pointer flex items-center gap-1.5 transition-colors"
                    >
                      <Upload className="size-3.5" />
                      <span>Open .nvlo</span>
                    </button>
                  </div>
                )}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(195px,1fr))] gap-4 pt-2">
                {filteredProjects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => onOpenProject(proj)}
                    className="group p-2.5 pb-5 rounded-[10px] bg-[#141519]/90 hover:bg-[#1a1b20]/95 backdrop-blur-md border-none shadow-lg flex flex-col gap-3 cursor-pointer transition-all relative"
                  >
                    <div className="aspect-square w-full rounded-[7px] bg-black/50 border-none flex items-center justify-center relative overflow-hidden">
                      {proj.thumbnail ? (
                        <img
                          src={proj.thumbnail}
                          alt={proj.name}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        />
                      ) : (
                        <Gamepad2 className="size-9 text-white/40 group-hover:text-white/80 transition-colors" />
                      )}
                    </div>

                    <div className="flex flex-col gap-0.5 px-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[13px] font-semibold text-white/95 truncate">
                          {proj.name}
                        </div>
                        <div
                          className="relative shrink-0"
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setOpenCardMenuId((prev) => (prev === proj.id ? null : proj.id))
                            }
                            className="size-6 rounded flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 border-none bg-transparent cursor-pointer transition-colors"
                            title="More options"
                          >
                            <MoreVertical className="size-3.5" />
                          </button>

                          {openCardMenuId === proj.id && (
                            <div className="absolute right-0 top-7 w-36 bg-[#0d0e11]/95 backdrop-blur-md border border-white/15 rounded-[6px] shadow-2xl p-1 z-30 flex flex-col gap-0.5 text-[11px]">
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenCardMenuId(null)
                                  openSettingsFor(proj)
                                }}
                                className="w-full px-2.5 py-1.5 rounded-[4px] flex items-center gap-2 text-left text-white/85 hover:bg-white/[0.08] hover:text-white border-none bg-transparent cursor-pointer"
                              >
                                <Settings className="size-3.5" />
                                <span>Settings</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenCardMenuId(null)
                                  handleExportProject(proj)
                                }}
                                className="w-full px-2.5 py-1.5 rounded-[4px] flex items-center gap-2 text-left text-white/85 hover:bg-white/[0.08] hover:text-white border-none bg-transparent cursor-pointer"
                              >
                                <Download className="size-3.5" />
                                <span>Export .nvlo</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenCardMenuId(null)
                                  onToggleArchiveProject(proj.id)
                                }}
                                className="w-full px-2.5 py-1.5 rounded-[4px] flex items-center gap-2 text-left text-white/85 hover:bg-white/[0.08] hover:text-white border-none bg-transparent cursor-pointer"
                              >
                                {proj.archived ? (
                                  <RotateCcw className="size-3.5" />
                                ) : (
                                  <Archive className="size-3.5" />
                                )}
                                <span>{proj.archived ? 'Restore' : 'Archive'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenCardMenuId(null)
                                  onDeleteProject(proj.id)
                                }}
                                className="w-full px-2.5 py-1.5 rounded-[4px] flex items-center gap-2 text-left text-rose-400 hover:bg-white/[0.08] border-none bg-transparent cursor-pointer"
                              >
                                <Trash2 className="size-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-[10px] text-white/45">
                        Modified {formatTime(proj.updatedAt)}
                      </div>
                      <div className="text-[10px] text-white/40 pt-0.5">Novelo Studio</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 pt-2">
                {filteredProjects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => onOpenProject(proj)}
                    className="h-12 px-3 rounded-[8px] bg-[#141519]/90 hover:bg-[#1a1b20]/95 backdrop-blur-md border-none flex items-center justify-between gap-3 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Gamepad2 className="size-4 text-white/60 shrink-0" />
                      <span className="text-[12px] font-semibold text-white truncate">{proj.name}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[11px] text-white/45">{formatTime(proj.updatedAt)}</span>
                      <button
                        type="button"
                        onClick={() => openSettingsFor(proj)}
                        className="size-6 rounded flex items-center justify-center text-white/45 hover:text-white hover:bg-white/10 border-none bg-transparent cursor-pointer"
                        title="Settings"
                      >
                        <Settings className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExportProject(proj)}
                        className="size-6 rounded flex items-center justify-center text-white/45 hover:text-white hover:bg-white/10 border-none bg-transparent cursor-pointer"
                        title="Export .nvlo"
                      >
                        <Download className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleArchiveProject(proj.id)}
                        className="size-6 rounded flex items-center justify-center text-white/45 hover:text-white hover:bg-white/10 border-none bg-transparent cursor-pointer"
                        title={proj.archived ? 'Restore' : 'Archive'}
                      >
                        {proj.archived ? <RotateCcw className="size-3.5" /> : <Archive className="size-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteProject(proj.id)}
                        className="size-6 rounded flex items-center justify-center text-white/45 hover:text-rose-400 hover:bg-white/10 border-none bg-transparent cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
