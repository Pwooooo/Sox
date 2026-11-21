import { useState, useEffect, useRef, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RobloxStudioView } from '@/components/studio/RobloxStudioView'
import { StudioStartView, type SavedStudioProject } from '@/components/studio/StudioStartView'
import { createStarterWorld, generateId, type LightingPreset, type NvloDocument } from '@engine/index'

const STORAGE_KEY = 'novelo_studio_projects_v1'

function loadSavedProjects(): SavedStudioProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function StudioApp() {
  const [projects, setProjects] = useState<SavedStudioProject[]>(loadSavedProjects)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const hydratedRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { invoke } = await import('@tauri-apps/api/core')
        const raw = await invoke<string>('load_studio_projects')
        const shared = JSON.parse(raw) as SavedStudioProject[]
        if (!cancelled && Array.isArray(shared) && shared.length > 0) {
          setProjects((prev) => {
            const byId = new Map<string, SavedStudioProject>()
            for (const p of prev) byId.set(p.id, p)
            for (const p of shared) {
              const existing = byId.get(p.id)
              if (!existing || p.updatedAt >= existing.updatedAt) {
                byId.set(p.id, p)
              }
            }
            return Array.from(byId.values()).sort((a, b) => b.updatedAt - a.updatedAt)
          })
        }
      } catch {
        // running in browser dev
      } finally {
        hydratedRef.current = true
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const json = JSON.stringify(projects)
    try {
      localStorage.setItem(STORAGE_KEY, json)
    } catch {
      // ignore quota errors
    }
    if (!hydratedRef.current) return
    import('@tauri-apps/api/core')
      .then(({ invoke }) => invoke('save_studio_projects', { json }))
      .catch(() => {
        fetch('/api/studio-projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: json,
        }).catch(() => {})
      })
  }, [projects])

  const activeProject = projects.find((p) => p.id === activeProjectId) || null

  const handleCreateProject = (name: string, template: string, preset: LightingPreset) => {
    const doc = createStarterWorld(name)
    doc.lighting.preset = preset
    const proj: SavedStudioProject = {
      id: generateId('proj'),
      name,
      template,
      updatedAt: Date.now(),
      doc,
    }
    setProjects((prev) => [proj, ...prev])
    setActiveProjectId(proj.id)
  }

  const handleImportProject = (name: string, doc: NvloDocument) => {
    const proj: SavedStudioProject = {
      id: generateId('proj'),
      name,
      template: 'Imported',
      updatedAt: Date.now(),
      doc,
    }
    setProjects((prev) => [proj, ...prev])
    setActiveProjectId(proj.id)
  }

  const handleSaveActiveDoc = (doc: NvloDocument, thumbnail?: string) => {
    if (!activeProjectId) return
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProjectId
          ? {
              ...p,
              name: doc.metadata?.name || p.name,
              updatedAt: Date.now(),
              ...(thumbnail ? { thumbnail } : {}),
              doc,
            }
          : p,
      ),
    )
  }

  if (activeProject) {
    return (
      <RobloxStudioView
        key={activeProject.id}
        gameName={activeProject.name}
        initialDoc={activeProject.doc}
        onSaveDoc={handleSaveActiveDoc}
        onClose={() => setActiveProjectId(null)}
      />
    )
  }

  return (
    <StudioStartView
      projects={projects}
      onOpenProject={(proj) => setActiveProjectId(proj.id)}
      onCreateProject={handleCreateProject}
      onImportProject={handleImportProject}
      onDeleteProject={(id) => setProjects((prev) => prev.filter((p) => p.id !== id))}
      onToggleArchiveProject={(id) =>
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, archived: !p.archived } : p)),
        )
      }
    />
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StudioApp />
  </StrictMode>,
)
