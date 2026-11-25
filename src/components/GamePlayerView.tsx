import { useEffect, useRef, useState } from 'react'
import {
  Loader2,
  MessageSquare,
  Menu,
  Send,
  Users,
  Settings as SettingsIcon,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Minus,
  X,
  ZoomIn,
} from 'lucide-react'
import { NoveloViewport, createStarterWorld, type NvloDocument } from '@engine/index'
import { fetchExperienceById } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import {
  PlayerModel3D,
  loadSavedBodyColors,
  applyAvatarToRiggedModel,
  AVATAR_COLORS_EVENT,
} from '@/components/PlayerModel3D'
import {
  loadEquippedClothingIds,
  resolveEquippedClothing,
  EQUIPPED_CLOTHING_EVENT,
  CLOTHING_UPDATED_EVENT,
} from '@/data/clothingStore'

interface GamePlayerViewProps {
  gameId: string
  onLeave: () => void
}

interface LoadedGame {
  name: string
  creator: string
  doc: NvloDocument
}

interface ChatMessage {
  id: string
  author: string
  text: string
  isSystem?: boolean
}

async function resolveGameDoc(gameId: string): Promise<LoadedGame | null> {
  try {
    const remote = await fetchExperienceById(gameId)
    if (remote && remote.doc) {
      return {
        name: remote.name || 'Untitled Experience',
        creator: remote.owner_username || 'Creator',
        doc: remote.doc as NvloDocument,
      }
    }
  } catch {
    // ignore and fall back to local
  }

  try {
    if ((window as any).__TAURI_INTERNALS__) {
      const { invoke } = await import('@tauri-apps/api/core')
      const raw = await invoke<string>('load_studio_projects')
      const list = JSON.parse(raw)
      if (Array.isArray(list)) {
        const match = list.find((p: any) => p.id === gameId)
        if (match && match.doc) {
          return {
            name: match.name || 'Untitled Experience',
            creator: match.owner_username || 'Creator',
            doc: match.doc as NvloDocument,
          }
        }
      }
    }
  } catch {
    // ignore
  }

  try {
    const lsRaw = localStorage.getItem('novelo_studio_projects_v1')
    if (lsRaw) {
      const list = JSON.parse(lsRaw)
      if (Array.isArray(list)) {
        const match = list.find((p: any) => p.id === gameId)
        if (match && match.doc) {
          return {
            name: match.name || 'Untitled Experience',
            creator: match.owner_username || 'Creator',
            doc: match.doc as NvloDocument,
          }
        }
      }
    }
  } catch {
    // ignore
  }

  return null
}

export function GamePlayerView({ gameId, onLeave }: GamePlayerViewProps) {
  const { user, profile } = useAuth()
  const currentUsername =
    profile?.username || (user?.user_metadata?.username as string) || 'Player'

  const containerRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<NoveloViewport | null>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const [status, setStatus] = useState<'loading' | 'playing' | 'error'>('loading')
  const [gameMeta, setGameMeta] = useState<{ name: string; creator: string }>({
    name: 'Loading experience...',
    creator: '',
  })
  const [errorMsg, setErrorMsg] = useState('')

  const [menuOpen, setMenuOpen] = useState(false)
  const [playerListOpen, setPlayerListOpen] = useState(true)
  const [selectedPlayerCardOpen, setSelectedPlayerCardOpen] = useState(false)
  const [examineAvatarOpen, setExamineAvatarOpen] = useState(false)
  const [menuTab, setMenuTab] = useState<'people' | 'settings'>('people')
  const [peopleView, setPeopleView] = useState<'grid' | 'list'>('grid')
  const [volume, setVolume] = useState(8)
  const [graphicsQuality, setGraphicsQuality] = useState<'Auto' | 'Low' | 'Medium' | 'High'>(() => {
    try {
      const saved = localStorage.getItem('novelo_player_quality')
      if (saved === 'Low' || saved === 'Medium' || saved === 'High' || saved === 'Auto') return saved
    } catch {
      // ignore
    }
    return 'Auto'
  })
  const [maxFps, setMaxFps] = useState<60 | 120 | 144 | 240 | 'Unlimited'>(() => {
    try {
      const saved = localStorage.getItem('novelo_player_fps')
      if (saved === '60') return 60
      if (saved === '120') return 120
      if (saved === '144') return 144
      if (saved === '240') return 240
      if (saved === 'Unlimited') return 'Unlimited'
    } catch {
      // ignore
    }
    return 60
  })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [chatOpen, setChatOpen] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    let cancelled = false
    let viewport: NoveloViewport | null = null

    ;(async () => {
      setStatus('loading')
      setErrorMsg('')
      const loaded = await resolveGameDoc(gameId)
      if (cancelled) return

      if (!loaded) {
        setStatus('error')
        setErrorMsg('Could not load this experience. Make sure it is public or saved.')
        return
      }

      setGameMeta({ name: loaded.name, creator: loaded.creator })

      const el = containerRef.current
      if (!el) return

      try {
        viewport = new NoveloViewport(el, {
          onSelect: () => {},
          onTransformCommit: () => {},
          onMetrics: () => {},
        })
        viewportRef.current = viewport
        viewport.loadDocument(loaded.doc || createStarterWorld(loaded.name))
        viewport.startPlay()

        const applyInGameAvatar = () => {
          const charGroup = (viewport as any)?.character?.group
          if (!charGroup || !charGroup.children || charGroup.children.length < 2) return false
          const riggedModel = charGroup.children[1]
          if (!riggedModel) return false
          applyAvatarToRiggedModel(
            riggedModel,
            loadSavedBodyColors(),
            resolveEquippedClothing(loadEquippedClothingIds())
          )
          return true
        }

        if (!applyInGameAvatar()) {
          let tries = 0
          const poll = window.setInterval(() => {
            tries += 1
            if (cancelled || applyInGameAvatar() || tries >= 40) {
              window.clearInterval(poll)
            }
          }, 150)
        }

        setStatus('playing')
        setMessages([
          {
            id: `sys_${Date.now()}`,
            author: 'System',
            text: `Joined ${loaded.name}`,
            isSystem: true,
          },
        ])
      } catch (err) {
        setStatus('error')
        setErrorMsg(err instanceof Error ? err.message : 'Failed to start game.')
      }
    })()

    return () => {
      cancelled = true
      viewportRef.current = null
      if (viewport) {
        try {
          viewport.stopPlay()
        } catch {
          // ignore
        }
        try {
          viewport.dispose()
        } catch {
          // ignore
        }
      }
    }
  }, [gameId])

  useEffect(() => {
    const syncInGameAvatar = () => {
      const charGroup = (viewportRef.current as any)?.character?.group
      const riggedModel = charGroup?.children?.[1]
      if (!riggedModel) return
      applyAvatarToRiggedModel(
        riggedModel,
        loadSavedBodyColors(),
        resolveEquippedClothing(loadEquippedClothingIds())
      )
    }
    window.addEventListener(AVATAR_COLORS_EVENT, syncInGameAvatar)
    window.addEventListener(EQUIPPED_CLOTHING_EVENT, syncInGameAvatar)
    window.addEventListener(CLOTHING_UPDATED_EVENT, syncInGameAvatar)
    return () => {
      window.removeEventListener(AVATAR_COLORS_EVENT, syncInGameAvatar)
      window.removeEventListener(EQUIPPED_CLOTHING_EVENT, syncInGameAvatar)
      window.removeEventListener(CLOTHING_UPDATED_EVENT, syncInGameAvatar)
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen((v) => !v)
      } else if (menuOpen && e.key.toLowerCase() === 'l') {
        e.preventDefault()
        onLeave()
      } else if (menuOpen && e.key.toLowerCase() === 'r') {
        e.preventDefault()
        handleRespawn()
      } else if (
        e.key === 'Tab' &&
        document.activeElement !== chatInputRef.current &&
        !menuOpen
      ) {
        e.preventDefault()
        setPlayerListOpen((v) => !v)
      } else if (
        e.key === '/' &&
        document.activeElement !== chatInputRef.current &&
        !menuOpen
      ) {
        e.preventDefault()
        setChatOpen(true)
        setUnreadCount(0)
        setTimeout(() => chatInputRef.current?.focus(), 0)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen, onLeave])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, chatOpen])

  const handleToggleChat = () => {
    setChatOpen((prev) => {
      const next = !prev
      if (next) setUnreadCount(0)
      return next
    })
  }

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault()
    const text = chatInput.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      {
        id: `msg_${Date.now()}`,
        author: currentUsername,
        text,
      },
    ])
    setChatInput('')
    chatInputRef.current?.blur()
  }

  const handleRespawn = () => {
    const vp = viewportRef.current
    if (vp) {
      try {
        vp.stopPlay()
        vp.startPlay()
      } catch {
        // ignore
      }
    }
    setMenuOpen(false)
  }

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch {
      // ignore
    }
  }

  const cycleQuality = (dir: -1 | 1) => {
    const order: Array<'Auto' | 'Low' | 'Medium' | 'High'> = ['Auto', 'Low', 'Medium', 'High']
    const idx = order.indexOf(graphicsQuality)
    const next = order[(idx + dir + order.length) % order.length]
    setGraphicsQuality(next)
    try {
      localStorage.setItem('novelo_player_quality', next)
    } catch {
      // ignore
    }
  }

  const cycleFps = (dir: -1 | 1) => {
    const order: Array<60 | 120 | 144 | 240 | 'Unlimited'> = [60, 120, 144, 240, 'Unlimited']
    const idx = order.indexOf(maxFps)
    const next = order[(idx + dir + order.length) % order.length]
    setMaxFps(next)
    try {
      localStorage.setItem('novelo_player_fps', String(next))
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    const vp = viewportRef.current as any
    const renderer = vp?.renderer
    if (!renderer) return
    const dpr = window.devicePixelRatio || 1
    if (graphicsQuality === 'Low') {
      renderer.setPixelRatio(0.75)
      if (renderer.shadowMap) renderer.shadowMap.enabled = false
    } else if (graphicsQuality === 'Medium') {
      renderer.setPixelRatio(1)
      if (renderer.shadowMap) renderer.shadowMap.enabled = true
    } else if (graphicsQuality === 'High') {
      renderer.setPixelRatio(Math.min(dpr, 2))
      if (renderer.shadowMap) renderer.shadowMap.enabled = true
    } else {
      renderer.setPixelRatio(Math.min(dpr, 1.5))
      if (renderer.shadowMap) renderer.shadowMap.enabled = true
    }
  }, [graphicsQuality, status])

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b] text-white select-none overflow-hidden">
      {/* Fullscreen 3D Viewport */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Top-Left Floating Settings & Chat Controls */}
      <div className="fixed top-3 left-3 z-30 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          title="Settings (Esc)"
          className="size-10 rounded-[8px] bg-black/50 hover:bg-black/65 backdrop-blur-md border-none flex items-center justify-center cursor-pointer transition-all duration-200 ease-out shadow-lg overflow-hidden"
        >
          <img src="/ingame-settings-logo.png" alt="Settings" className="size-10 scale-[1.7] object-contain" />
        </button>

        <div className="h-10 px-1 rounded-[8px] bg-black/50 backdrop-blur-md flex items-center gap-1 shadow-lg">
          <button
            type="button"
            onClick={() => setPlayerListOpen((v) => !v)}
            title="Player List (Tab)"
            className={`size-8 rounded-[6px] flex items-center justify-center cursor-pointer border-none transition-all duration-200 ease-out ${
              playerListOpen
                ? 'bg-white/[0.14] text-white'
                : 'bg-transparent text-white/85 hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            <Menu className="size-4" />
          </button>

          <button
            type="button"
            onClick={handleToggleChat}
            title="Toggle Chat (/)"
            className={`relative size-8 rounded-[6px] flex items-center justify-center cursor-pointer border-none transition-all duration-200 ease-out ${
              chatOpen
                ? 'bg-white/[0.14] text-white'
                : 'bg-transparent text-white/85 hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            <MessageSquare className="size-4" />
            {!chatOpen && unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Top-Left Translucent Chat Box */}
      {chatOpen && status === 'playing' && (
        <div className="fixed top-16 left-3 z-20 w-80 max-w-[calc(100vw-24px)] rounded-[10px] bg-black/50 backdrop-blur-md flex flex-col overflow-hidden shadow-xl">
          <div className="max-h-44 overflow-y-auto px-3 py-2 flex flex-col gap-1 text-xs no-scrollbar">
            {messages.map((m) => (
              <div key={m.id} className="leading-snug break-words">
                {m.isSystem ? (
                  <span className="text-white/50 italic">{m.text}</span>
                ) : (
                  <>
                    <span className="font-bold text-white/95">{m.author}: </span>
                    <span className="text-white/85">{m.text}</span>
                  </>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form
            onSubmit={handleSendChat}
            className="border-t border-white/[0.08] px-2.5 py-1.5 flex items-center gap-2 bg-black/20"
          >
            <input
              ref={chatInputRef}
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder="To chat click here or press /"
              className="flex-1 bg-transparent border-none text-xs text-white placeholder:text-white/40 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="size-6 rounded-[6px] bg-white/[0.1] hover:bg-white/[0.2] disabled:opacity-35 text-white flex items-center justify-center cursor-pointer border-none transition-colors shrink-0"
            >
              <Send className="size-3" />
            </button>
          </form>
        </div>
      )}

      {/* Top-Right Player List & Player Context Card */}
      {playerListOpen && status === 'playing' && !menuOpen && (
        <>
          {selectedPlayerCardOpen && (
            <div className="fixed top-9 right-[276px] z-20 w-[276px] rounded-[8px] bg-black/50 backdrop-blur-md overflow-visible shadow-xl">
              {/* Top Translucent Header Band with Overlapping Avatar Bust */}
              <div className="px-3.5 pt-2 pb-2.5 bg-white/[0.08] rounded-t-[8px] flex items-center gap-3 relative border-b border-white/[0.08]">
                <div className="size-16 -mt-4 rounded-md overflow-hidden shrink-0 drop-shadow-lg">
                  <PlayerModel3D mode="headshot" className="w-full h-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-bold text-white leading-tight truncate">
                    {profile?.display_name || (user?.user_metadata?.display_name as string | undefined) || currentUsername}
                  </p>
                  <p className="text-xs text-white/60 truncate mt-0.5">@{currentUsername}</p>
                </div>
              </div>

              {/* Bottom Examine Avatar Row */}
              <button
                type="button"
                onClick={() => setExamineAvatarOpen(true)}
                className="w-full px-4 py-3 rounded-b-[8px] flex items-center gap-3 text-[13px] font-bold text-white hover:bg-white/[0.08] transition-colors cursor-pointer border-none bg-transparent text-left"
              >
                <ZoomIn className="size-4 text-white/90" />
                <span>Examine Avatar</span>
              </button>
            </div>
          )}

          <div className="fixed top-3 right-3 z-20 w-[260px] rounded-[8px] bg-black/50 backdrop-blur-md overflow-hidden shadow-xl">
            <div className="px-3 pt-2 pb-1.5 flex flex-col items-start gap-1">
              <button
                type="button"
                onClick={() => {
                  setPlayerListOpen(false)
                  setSelectedPlayerCardOpen(false)
                }}
                title="Close Player List"
                className="size-4 -ml-0.5 rounded hover:bg-white/10 flex items-center justify-center text-white/85 hover:text-white cursor-pointer border-none bg-transparent"
              >
                <X className="size-3.5 stroke-[2.2]" />
              </button>
              <span className="text-[11px] font-medium text-white/75 pl-1">People</span>
            </div>
            <div className="p-1.5 flex flex-col gap-0.5 max-h-60 overflow-y-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedPlayerCardOpen((v) => !v)}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-[6px] transition-all duration-200 ease-out cursor-pointer border-none text-left ${
                  selectedPlayerCardOpen ? 'bg-white/[0.14]' : 'bg-transparent hover:bg-white/[0.08]'
                }`}
              >
                <div className="size-5 rounded-full overflow-hidden shrink-0">
                  <PlayerModel3D mode="headshot" className="w-full h-full" />
                </div>
                <span className="text-xs font-medium text-white truncate flex-1">
                  {profile?.display_name || (user?.user_metadata?.display_name as string | undefined) || currentUsername}
                </span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Examine Avatar Modal */}
      {examineAvatarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setExamineAvatarOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-[#111114] border border-white/10 p-4 flex flex-col gap-3 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">
                  {profile?.display_name || (user?.user_metadata?.display_name as string | undefined) || currentUsername}
                </p>
                <p className="text-[11px] text-white/50">@{currentUsername}</p>
              </div>
              <button
                type="button"
                onClick={() => setExamineAvatarOpen(false)}
                className="size-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white cursor-pointer border-none bg-transparent"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="h-80 rounded-xl bg-[#09090b] border border-white/[0.06] overflow-hidden">
              <PlayerModel3D mode="full" interactive className="w-full h-full" />
            </div>
          </div>
        </div>
      )}

      {/* In-Game People & Settings Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/15 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setMenuOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl h-[min(560px,86vh)] rounded-[12px] bg-black/50 backdrop-blur-md flex flex-col justify-between overflow-hidden shadow-2xl"
          >
            {/* Top 2 Tabs: People & Settings with Sliding Highlight */}
            <div className="p-2 border-b border-white/[0.08] shrink-0">
              <div className="relative grid grid-cols-2 gap-2">
                <div
                  className={`absolute inset-y-0 w-[calc(50%-4px)] rounded-[8px] bg-white/[0.14] transition-[left] duration-200 ease-out pointer-events-none ${
                    menuTab === 'settings' ? 'left-[calc(50%+4px)]' : 'left-0'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setMenuTab('people')}
                  className={`relative z-10 h-10 rounded-[8px] flex items-center justify-center gap-2 text-xs font-bold cursor-pointer border-none bg-transparent outline-none transition-colors duration-150 ${
                    menuTab === 'people'
                      ? 'text-white'
                      : 'text-white/55 hover:text-white/90'
                  }`}
                >
                  <Users className="size-4" />
                  <span>People</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMenuTab('settings')}
                  className={`relative z-10 h-10 rounded-[8px] flex items-center justify-center gap-2 text-xs font-bold cursor-pointer border-none bg-transparent outline-none transition-colors duration-150 ${
                    menuTab === 'settings'
                      ? 'text-white'
                      : 'text-white/55 hover:text-white/90'
                  }`}
                >
                  <SettingsIcon className="size-4" />
                  <span>Settings</span>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 no-scrollbar">
              {menuTab === 'people' ? (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white m-0">In this server</h3>
                    <div className="flex items-center gap-1 bg-white/[0.06] p-0.5 rounded-[8px]">
                      <button
                        type="button"
                        onClick={() => setPeopleView('grid')}
                        className={`size-7 rounded-[6px] flex items-center justify-center cursor-pointer border-none transition-colors ${
                          peopleView === 'grid'
                            ? 'bg-white/[0.12] text-white'
                            : 'bg-transparent text-white/45 hover:text-white'
                        }`}
                      >
                        <LayoutGrid className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPeopleView('list')}
                        className={`size-7 rounded-[6px] flex items-center justify-center cursor-pointer border-none transition-colors ${
                          peopleView === 'list'
                            ? 'bg-white/[0.12] text-white'
                            : 'bg-transparent text-white/45 hover:text-white'
                        }`}
                      >
                        <List className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {peopleView === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="rounded-[10px] bg-white/[0.06] p-2.5 flex flex-col gap-2">
                        <div className="w-full aspect-square rounded-[8px] bg-black/25 overflow-hidden">
                          <PlayerModel3D
                            mode="full"
                            interactive={false}
                            autoRotate={false}
                            initialYaw={0.2}
                            useSavedColors
                            useSavedClothing
                            className="w-full h-full"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">
                            {currentUsername}
                          </div>
                          <div className="text-[11px] text-white/45 truncate">
                            @{currentUsername}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="rounded-[10px] bg-white/[0.06] p-2.5 flex items-center gap-3">
                        <div className="size-10 rounded-[8px] bg-black/25 overflow-hidden shrink-0">
                          <PlayerModel3D
                            mode="headshot"
                            interactive={false}
                            autoRotate={false}
                            useSavedColors
                            useSavedClothing
                            className="w-full h-full"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">
                            {currentUsername}
                          </div>
                          <div className="text-[11px] text-white/45 truncate">
                            @{currentUsername}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col gap-5">
                  {/* Audio */}
                  <div className="flex flex-col gap-2.5">
                    <h3 className="text-sm font-bold text-white m-0">Audio</h3>

                    <div className="rounded-[10px] bg-white/[0.06] px-4 py-3 flex items-center justify-between gap-4">
                      <span className="text-xs font-semibold text-white/85">Volume</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setVolume((v) => Math.max(0, v - 1))}
                          className="size-6 rounded-full border border-white/25 text-white/80 hover:text-white flex items-center justify-center bg-transparent cursor-pointer"
                        >
                          <Minus className="size-3" />
                        </button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 10 }, (_, idx) => {
                            const level = idx + 1
                            const active = level <= volume
                            return (
                              <button
                                key={level}
                                type="button"
                                onClick={() => setVolume(level)}
                                className={`w-5 h-5 rounded-[4px] border-none cursor-pointer transition-colors ${
                                  active
                                    ? 'bg-white/90 hover:bg-white'
                                    : 'bg-white/15 hover:bg-white/30'
                                }`}
                              />
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Experience & Display */}
                  <div className="flex flex-col gap-2.5">
                    <h3 className="text-sm font-bold text-white m-0">Display &amp; Graphics</h3>

                    <div className="rounded-[10px] bg-white/[0.06] px-4 py-3 flex items-center justify-between gap-4">
                      <span className="text-xs font-semibold text-white/85">Graphics Quality</span>
                      <div className="flex items-center gap-6">
                        <button
                          type="button"
                          onClick={() => cycleQuality(-1)}
                          className="text-white/60 hover:text-white bg-transparent border-none cursor-pointer p-1"
                        >
                          <ChevronLeft className="size-4" />
                        </button>
                        <span className="text-xs font-semibold text-white min-w-16 text-center">
                          {graphicsQuality}
                        </span>
                        <button
                          type="button"
                          onClick={() => cycleQuality(1)}
                          className="text-white/60 hover:text-white bg-transparent border-none cursor-pointer p-1"
                        >
                          <ChevronRight className="size-4" />
                        </button>
                      </div>
                    </div>

                    <div className="rounded-[10px] bg-white/[0.06] px-4 py-3 flex items-center justify-between gap-4">
                      <span className="text-xs font-semibold text-white/85">Maximum Frame Rate</span>
                      <div className="flex items-center gap-6">
                        <button
                          type="button"
                          onClick={() => cycleFps(-1)}
                          className="text-white/60 hover:text-white bg-transparent border-none cursor-pointer p-1"
                        >
                          <ChevronLeft className="size-4" />
                        </button>
                        <span className="text-xs font-semibold text-white min-w-20 text-center">
                          {maxFps === 'Unlimited' ? 'Unlimited' : `${maxFps} FPS`}
                        </span>
                        <button
                          type="button"
                          onClick={() => cycleFps(1)}
                          className="text-white/60 hover:text-white bg-transparent border-none cursor-pointer p-1"
                        >
                          <ChevronRight className="size-4" />
                        </button>
                      </div>
                    </div>

                    <div className="rounded-[10px] bg-white/[0.06] px-4 py-3 flex items-center justify-between gap-4">
                      <span className="text-xs font-semibold text-white/85">Fullscreen</span>
                      <div className="flex items-center gap-6">
                        <button
                          type="button"
                          onClick={toggleFullscreen}
                          className="text-white/60 hover:text-white bg-transparent border-none cursor-pointer p-1"
                        >
                          <ChevronLeft className="size-4" />
                        </button>
                        <span className="text-xs font-semibold text-white min-w-16 text-center">
                          {isFullscreen ? 'On' : 'Off'}
                        </span>
                        <button
                          type="button"
                          onClick={toggleFullscreen}
                          className="text-white/60 hover:text-white bg-transparent border-none cursor-pointer p-1"
                        >
                          <ChevronRight className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action Bar: Leave, Respawn, Resume */}
            <div className="p-4 border-t border-white/[0.08] grid grid-cols-3 gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onLeave}
                className="h-10 px-4 rounded-[10px] bg-white/[0.08] hover:bg-white/[0.14] border-none text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
              >
                <span className="px-1.5 py-0.5 rounded-[4px] border border-white/25 text-[10px] font-bold leading-none">
                  L
                </span>
                <span>Leave</span>
              </button>

              <button
                type="button"
                onClick={handleRespawn}
                className="h-10 px-4 rounded-[10px] bg-white/[0.08] hover:bg-white/[0.14] border-none text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
              >
                <span className="px-1.5 py-0.5 rounded-[4px] border border-white/25 text-[10px] font-bold leading-none">
                  R
                </span>
                <span>Respawn</span>
              </button>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="h-10 px-4 rounded-[10px] bg-white hover:bg-neutral-200 border-none text-xs font-bold text-black flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
              >
                <span className="px-1.5 py-0.5 rounded-[4px] border border-black/30 text-[10px] font-bold leading-none">
                  ESC
                </span>
                <span>Resume</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {status === 'loading' && (
        <div className="fixed inset-0 bg-[#09090b] flex flex-col items-center justify-center gap-3 z-50">
          <Loader2 className="size-7 text-[#02b070] animate-spin" />
          <p className="text-xs font-semibold text-white/70 m-0">Joining experience...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="fixed inset-0 bg-[#09090b] flex flex-col items-center justify-center gap-3 p-6 text-center z-50">
          <p className="text-sm font-bold text-white m-0">{errorMsg}</p>
          <button
            type="button"
            onClick={onLeave}
            className="h-9 px-4 rounded-[8px] bg-white text-black hover:bg-neutral-200 text-xs font-bold cursor-pointer border-none"
          >
            Back to Novelo
          </button>
        </div>
      )}
    </div>
  )
}
