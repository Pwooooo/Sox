import { useEffect, useRef, useState } from 'react'
import { Loader2, MessageSquare, Menu, LogOut, RotateCcw, Play, Send } from 'lucide-react'
import { NoveloViewport, createStarterWorld, type NvloDocument } from '@engine/index'
import { fetchExperienceById } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

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
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen((v) => !v)
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
  }, [menuOpen])

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
          className="size-10 rounded-full bg-[#111114]/85 hover:bg-[#1b1b20]/95 backdrop-blur-md border border-white/[0.1] flex items-center justify-center cursor-pointer transition-colors shadow-lg"
        >
          <img src="/logo.png" alt="Novelo" className="size-6 object-contain" />
        </button>

        <div className="h-10 px-1.5 rounded-full bg-[#111114]/85 backdrop-blur-md border border-white/[0.1] flex items-center gap-1 shadow-lg">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            title="Menu (Esc)"
            className="size-8 rounded-full hover:bg-white/[0.08] text-white/85 hover:text-white flex items-center justify-center cursor-pointer border-none bg-transparent transition-colors"
          >
            <Menu className="size-4" />
          </button>

          <button
            type="button"
            onClick={handleToggleChat}
            title="Toggle Chat (/)"
            className="relative size-8 rounded-full hover:bg-white/[0.08] text-white/85 hover:text-white flex items-center justify-center cursor-pointer border-none bg-transparent transition-colors"
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
        <div className="fixed top-16 left-3 z-20 w-80 max-w-[calc(100vw-24px)] rounded-[12px] bg-[#111114]/70 backdrop-blur-md border border-white/[0.08] flex flex-col overflow-hidden shadow-xl">
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

      {/* In-Game Settings / Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setMenuOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-[14px] bg-[#121215] border border-white/[0.1] p-5 flex flex-col gap-4 shadow-2xl"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
              <img src="/logo.png" alt="Novelo" className="size-9 object-contain shrink-0" />
              <div className="min-w-0">
                <h2 className="text-base font-bold text-white truncate m-0">{gameMeta.name}</h2>
                {gameMeta.creator && (
                  <p className="text-xs text-white/50 truncate m-0">by {gameMeta.creator}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="w-full h-10 px-4 rounded-[10px] bg-white text-black hover:bg-neutral-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border-none transition-colors"
              >
                <Play className="size-3.5 fill-current" />
                <span>Resume</span>
              </button>

              <button
                type="button"
                onClick={handleRespawn}
                className="w-full h-10 px-4 rounded-[10px] bg-[#1a1a1f] hover:bg-[#23232a] border border-white/[0.08] text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset Character</span>
              </button>

              <button
                type="button"
                onClick={onLeave}
                className="w-full h-10 px-4 rounded-[10px] bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer border-none transition-colors"
              >
                <LogOut className="size-3.5" />
                <span>Leave</span>
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
