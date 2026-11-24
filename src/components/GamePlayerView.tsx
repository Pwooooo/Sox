import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { NoveloViewport, createStarterWorld, type NvloDocument } from '@engine/index'
import { fetchExperienceById } from '@/lib/supabase'

interface GamePlayerViewProps {
  gameId: string
  onLeave: () => void
}

interface LoadedGame {
  name: string
  creator: string
  doc: NvloDocument
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
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'playing' | 'error'>('loading')
  const [gameMeta, setGameMeta] = useState<{ name: string; creator: string }>({
    name: 'Loading experience...',
    creator: '',
  })
  const [errorMsg, setErrorMsg] = useState('')

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
        viewport.loadDocument(loaded.doc || createStarterWorld(loaded.name))
        viewport.startPlay()
        setStatus('playing')
      } catch (err) {
        setStatus('error')
        setErrorMsg(err instanceof Error ? err.message : 'Failed to start game.')
      }
    })()

    return () => {
      cancelled = true
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

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b] text-white flex flex-col select-none">
      {/* Top Bar */}
      <div className="h-11 px-4 bg-[#111114]/95 border-b border-white/[0.08] flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onLeave}
            className="h-7 px-2.5 rounded-[7px] bg-white/[0.08] hover:bg-white/[0.15] text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer border-none transition-colors shrink-0"
          >
            <ArrowLeft className="size-3.5" />
            <span>Leave</span>
          </button>
          <div className="min-w-0 flex items-baseline gap-2">
            <span className="text-sm font-bold text-white truncate">{gameMeta.name}</span>
            {gameMeta.creator && (
              <span className="text-xs text-white/45 truncate">by {gameMeta.creator}</span>
            )}
          </div>
        </div>
        <span className="text-[11px] text-white/40 hidden sm:inline">
          WASD to Move · Space to Jump · Drag Mouse to Orbit
        </span>
      </div>

      {/* 3D Viewport */}
      <div className="relative flex-1 w-full overflow-hidden">
        <div ref={containerRef} className="w-full h-full" />

        {status === 'loading' && (
          <div className="absolute inset-0 bg-[#09090b] flex flex-col items-center justify-center gap-3 z-10">
            <Loader2 className="size-7 text-[#02b070] animate-spin" />
            <p className="text-xs font-semibold text-white/70 m-0">Joining experience...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="absolute inset-0 bg-[#09090b] flex flex-col items-center justify-center gap-3 p-6 text-center z-10">
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
    </div>
  )
}
