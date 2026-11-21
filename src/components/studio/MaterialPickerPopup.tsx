import { useState } from 'react'
import { LayoutGrid, List, Search, X } from 'lucide-react'
import type { PartMaterial } from '@engine/index'

interface MaterialPickerPopupProps {
  top: number
  left: number
  activeMaterial: PartMaterial
  appliedMaterials: PartMaterial[]
  onSelect: (mat: PartMaterial) => void
}

interface MaterialDef {
  name: PartMaterial
  sphereStyle: string
  overlayStyle?: string
}

const MATERIAL_DEFS: MaterialDef[] = [
  {
    name: 'Plastic',
    sphereStyle:
      'radial-gradient(circle at 32% 28%, #cbd5e1 0%, #7c8594 45%, #374151 82%, #1f2937 100%)',
    overlayStyle:
      'radial-gradient(circle, rgba(255,255,255,0.16) 1.5px, transparent 1.5px)',
  },
  {
    name: 'SmoothPlastic',
    sphereStyle:
      'radial-gradient(circle at 30% 25%, #f1f5f9 0%, #94a3b8 38%, #475569 78%, #1e293b 100%)',
  },
  {
    name: 'Grass',
    sphereStyle:
      'radial-gradient(circle at 32% 28%, #86efac 0%, #4b974b 42%, #166534 80%, #052e16 100%)',
    overlayStyle:
      'repeating-linear-gradient(125deg, rgba(0,0,0,0.14) 0px, rgba(0,0,0,0.14) 1px, transparent 1px, transparent 4px)',
  },
  {
    name: 'Wood',
    sphereStyle:
      'radial-gradient(circle at 32% 28%, #d99b66 0%, #a16236 45%, #5c3419 82%, #361c0b 100%)',
    overlayStyle:
      'repeating-linear-gradient(90deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 1px, transparent 1px, transparent 6px)',
  },
  {
    name: 'Marble',
    sphereStyle:
      'radial-gradient(circle at 30% 26%, #ffffff 0%, #e2e8f0 45%, #94a3b8 82%, #475569 100%)',
    overlayStyle:
      'linear-gradient(135deg, transparent 35%, rgba(71,85,105,0.28) 42%, transparent 48%, rgba(71,85,105,0.2) 68%, transparent 74%)',
  },
  {
    name: 'Metal',
    sphereStyle:
      'radial-gradient(circle at 28% 24%, #ffffff 0%, #cbd5e1 28%, #64748b 56%, #1e293b 86%, #0f172a 100%)',
    overlayStyle:
      'repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)',
  },
  {
    name: 'Concrete',
    sphereStyle:
      'radial-gradient(circle at 32% 28%, #a1a1aa 0%, #71717a 45%, #3f3f46 82%, #27272a 100%)',
    overlayStyle:
      'radial-gradient(circle, rgba(0,0,0,0.22) 1px, transparent 1px)',
  },
  {
    name: 'Neon',
    sphereStyle:
      'radial-gradient(circle at 42% 42%, #ffffff 0%, #7dd3fc 38%, #0284c7 75%, #0369a1 100%)',
  },
  {
    name: 'Glass',
    sphereStyle:
      'radial-gradient(circle at 28% 24%, rgba(255,255,255,0.92) 0%, rgba(186,230,253,0.45) 32%, rgba(56,189,248,0.18) 68%, rgba(14,165,233,0.38) 100%)',
  },
]

export function MaterialPickerPopup({
  top,
  left,
  activeMaterial,
  appliedMaterials,
  onSelect,
}: MaterialPickerPopupProps) {
  const [search, setSearch] = useState('')
  const [filterTab, setFilterTab] = useState<'Default' | 'Recents' | 'Applied'>('Default')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [recentMaterials, setRecentMaterials] = useState<PartMaterial[]>([activeMaterial])

  const filtered = MATERIAL_DEFS.filter((m) => {
    if (search.trim() && !m.name.toLowerCase().includes(search.trim().toLowerCase())) {
      return false
    }
    if (filterTab === 'Recents') {
      return recentMaterials.includes(m.name)
    }
    if (filterTab === 'Applied') {
      return appliedMaterials.includes(m.name)
    }
    return true
  })

  const handlePick = (mat: PartMaterial) => {
    setRecentMaterials((prev) => [mat, ...prev.filter((m) => m !== mat)].slice(0, 6))
    onSelect(mat)
  }

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      style={{ top, left }}
      className="fixed w-[264px] bg-[#141416] border border-white/10 rounded-[6px] shadow-2xl p-2 z-50 flex flex-col gap-2 select-none"
    >
      {/* Top Search + View Mode Toggle */}
      <div className="flex items-center gap-1.5">
        <div className="relative flex-1 flex items-center">
          <Search className="size-3 text-white/40 absolute left-2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Materials"
            className="w-full h-6.5 pl-6.5 pr-6 rounded-[4px] bg-[#0a0a0c] border border-white/10 text-white text-[11px] placeholder:text-white/35 focus:outline-none focus:border-white/30"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-1.5 text-white/40 hover:text-white border-none bg-transparent p-0 cursor-pointer"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setViewMode((v) => (v === 'grid' ? 'list' : 'grid'))}
          className="size-6.5 rounded-[4px] bg-white/[0.04] hover:bg-white/[0.09] flex items-center justify-center text-white/70 hover:text-white border border-white/[0.08] cursor-pointer transition-colors shrink-0"
          title={viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
        >
          {viewMode === 'grid' ? <List className="size-3.5" /> : <LayoutGrid className="size-3.5" />}
        </button>
      </div>

      {/* Filter Pills: Default, Recents, Applied */}
      <div className="flex items-center gap-1">
        {(['Default', 'Recents', 'Applied'] as const).map((tab) => {
          const isActive = filterTab === tab
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterTab(tab)}
              className={`px-2.5 h-6 rounded-[4px] text-[10px] font-medium border-none cursor-pointer transition-all duration-150 ${
                isActive
                  ? 'bg-white/10 text-white font-semibold'
                  : 'bg-white/[0.03] text-white/55 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* Materials Grid / List */}
      {filtered.length === 0 ? (
        <div className="py-6 text-center text-[11px] text-white/35">No materials found</div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-3 gap-1.5 max-h-[248px] overflow-y-auto no-scrollbar">
          {filtered.map((mat) => {
            const isSelected = activeMaterial === mat.name
            return (
              <button
                key={mat.name}
                type="button"
                onClick={() => handlePick(mat.name)}
                title={mat.name}
                className={`p-1.5 rounded-[6px] border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white/10 border-white/35 text-white'
                    : 'bg-[#0e0f12] border-white/[0.07] hover:bg-white/[0.05] hover:border-white/20 text-white/75 hover:text-white'
                }`}
              >
                <div
                  className="size-12 rounded-full relative overflow-hidden shrink-0 shadow-[inset_-4px_-6px_10px_rgba(0,0,0,0.55),0_2px_6px_rgba(0,0,0,0.45)]"
                  style={{
                    background: mat.sphereStyle,
                    boxShadow:
                      mat.name === 'Neon'
                        ? '0 0 12px rgba(56,189,248,0.55), inset -3px -4px 8px rgba(0,0,0,0.3)'
                        : undefined,
                  }}
                >
                  {mat.overlayStyle && (
                    <div
                      className="absolute inset-0 rounded-full opacity-75"
                      style={{
                        backgroundImage: mat.overlayStyle,
                        backgroundSize: mat.name === 'Plastic' || mat.name === 'Concrete' ? '8px 8px' : undefined,
                      }}
                    />
                  )}
                </div>
                <span className="text-[9.5px] font-medium truncate w-full text-center leading-tight">
                  {mat.name}
                </span>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-0.5 max-h-[248px] overflow-y-auto no-scrollbar">
          {filtered.map((mat) => {
            const isSelected = activeMaterial === mat.name
            return (
              <button
                key={mat.name}
                type="button"
                onClick={() => handlePick(mat.name)}
                className={`w-full px-2 py-1.5 rounded-[4px] text-left text-xs font-medium border-none cursor-pointer flex items-center gap-2.5 transition-colors ${
                  isSelected
                    ? 'bg-white/10 text-white font-semibold'
                    : 'bg-transparent text-white/75 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <span
                  className="size-4 rounded-full shrink-0 border border-white/15"
                  style={{ background: mat.sphereStyle }}
                />
                <span>{mat.name}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
