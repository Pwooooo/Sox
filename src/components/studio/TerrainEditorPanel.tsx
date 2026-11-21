import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronRight, RefreshCw, X } from 'lucide-react'
import { Icons8Icon } from './Icons8Icon'
import { NoveloCheckbox } from './NoveloCheckbox'
import type {
  TerrainBiome,
  TerrainGenerateConfig,
  TerrainPaintMaterial,
  TerrainSculptTool,
  Vec3,
} from '@engine/index'

interface TerrainEditorPanelProps {
  regionSize?: Vec3
  regionPosition?: Vec3
  onClose: () => void
  onGenerate: (cfg: TerrainGenerateConfig) => void
  onClear: () => void
  onPreviewChange: (visible: boolean, size: Vec3, position: Vec3) => void
  onSculptConfigChange: (
    active: boolean,
    tool: TerrainSculptTool,
    radius: number,
    strength: number,
    paintMat: TerrainPaintMaterial,
  ) => void
}

const ALL_BIOMES: TerrainBiome[] = [
  'Arctic',
  'Dunes',
  'Canyons',
  'Lavascape',
  'Water',
  'Mountains',
  'Hills',
  'Plains',
  'Marsh',
]

const SCULPT_TOOLS: { id: TerrainSculptTool; label: string; icon: string }[] = [
  { id: 'add', label: 'Add', icon: 'plus-math' },
  { id: 'subtract', label: 'Subtract', icon: 'delete-sign' },
  { id: 'smooth', label: 'Smooth', icon: 'mountain' },
  { id: 'flatten', label: 'Flatten', icon: 'resize-four-directions' },
  { id: 'paint', label: 'Paint', icon: 'paint-palette' },
]

const PAINT_MATERIALS: { name: TerrainPaintMaterial; swatch: string }[] = [
  { name: 'Grass', swatch: '#4b974b' },
  { name: 'Rock', swatch: '#64748b' },
  { name: 'Sand', swatch: '#e6c280' },
  { name: 'Snow', swatch: '#f1f5f9' },
  { name: 'Basalt', swatch: '#27272a' },
]

function NoveloSlider({
  value,
  min,
  max,
  step,
  onChange,
}: {
  value: number
  min: number
  max: number
  step: number
  onChange: (next: number) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  const updateFromClientX = (clientX: number) => {
    const el = trackRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / Math.max(1, rect.width)))
    const raw = min + ratio * (max - min)
    const snapped = Math.round(raw / step) * step
    const clamped = Math.max(min, Math.min(max, Number(snapped.toFixed(4))))
    onChange(clamped)
  }

  const pct = Math.max(0, Math.min(100, ((value - min) / Math.max(0.0001, max - min)) * 100))

  return (
    <div
      ref={trackRef}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        setDragging(true)
        updateFromClientX(e.clientX)
      }}
      onPointerMove={(e) => {
        if (!dragging) return
        updateFromClientX(e.clientX)
      }}
      onPointerUp={(e) => {
        if (dragging) {
          setDragging(false)
          e.currentTarget.releasePointerCapture(e.pointerId)
        }
      }}
      className="relative flex-1 h-5 flex items-center cursor-pointer group select-none touch-none"
    >
      <div className="w-full h-1 rounded-full bg-white/15 overflow-hidden">
        <div
          className="h-full rounded-full bg-white/85 transition-[width] duration-75"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div
        className={`absolute size-3 rounded-full bg-white border border-black/30 shadow-[0_0_8px_rgba(255,255,255,0.35)] -translate-x-1/2 transition-transform duration-150 ${
          dragging ? 'scale-125' : 'group-hover:scale-115'
        }`}
        style={{ left: `${pct}%` }}
      />
    </div>
  )
}

export function TerrainEditorPanel({
  regionSize,
  regionPosition,
  onClose,
  onGenerate,
  onClear,
  onPreviewChange,
  onSculptConfigChange,
}: TerrainEditorPanelProps) {
  const [tab, setTab] = useState<'create' | 'edit'>('create')
  const [createAction, setCreateAction] = useState<'import' | 'generate' | 'clear'>('generate')

  // Selection Settings
  const [selectionOpen, setSelectionOpen] = useState(true)
  const [size, setSize] = useState<Vec3>(regionSize || [96, 28, 76])
  const [position, setPosition] = useState<Vec3>(regionPosition || [0, 0, 0])
  const [snapToVoxels, setSnapToVoxels] = useState(true)

  useEffect(() => {
    if (regionSize) setSize(regionSize)
  }, [regionSize?.[0], regionSize?.[1], regionSize?.[2]])

  useEffect(() => {
    if (regionPosition) setPosition(regionPosition)
  }, [regionPosition?.[0], regionPosition?.[1], regionPosition?.[2]])

  // Biome Settings
  const [biomeOpen, setBiomeOpen] = useState(true)
  const [biomes, setBiomes] = useState<TerrainBiome[]>(['Mountains', 'Hills', 'Plains'])
  const [blending, setBlending] = useState(0.25)
  const [caves, setCaves] = useState(false)
  const [biomeSize, setBiomeSize] = useState(100)
  const [seed, setSeed] = useState(618033988)

  // Edit Sculpt Settings
  const [sculptTool, setSculptTool] = useState<TerrainSculptTool>('add')
  const [brushRadius, setBrushRadius] = useState(8)
  const [brushStrength, setBrushStrength] = useState(0.8)
  const [paintMaterial, setPaintMaterial] = useState<TerrainPaintMaterial>('Grass')

  const updateTab = (nextTab: 'create' | 'edit') => {
    setTab(nextTab)
    if (nextTab === 'create') {
      onPreviewChange(createAction === 'generate', size, position)
      onSculptConfigChange(false, sculptTool, brushRadius, brushStrength, paintMaterial)
    } else {
      onPreviewChange(false, size, position)
      onSculptConfigChange(true, sculptTool, brushRadius, brushStrength, paintMaterial)
    }
  }

  const updateSize = (idx: 0 | 1 | 2, raw: string) => {
    const val = parseFloat(raw)
    if (Number.isNaN(val)) return
    const next: Vec3 = [...size] as Vec3
    next[idx] = Math.max(4, val)
    setSize(next)
    if (tab === 'create' && createAction === 'generate') {
      onPreviewChange(true, next, position)
    }
  }

  const updatePosition = (idx: 0 | 1 | 2, raw: string) => {
    const val = parseFloat(raw)
    if (Number.isNaN(val)) return
    const next: Vec3 = [...position] as Vec3
    next[idx] = val
    setPosition(next)
    if (tab === 'create' && createAction === 'generate') {
      onPreviewChange(true, size, next)
    }
  }

  const toggleBiome = (b: TerrainBiome) => {
    setBiomes((prev) => (prev.includes(b) ? prev.filter((item) => item !== b) : [...prev, b]))
  }

  const handleGenerate = () => {
    onGenerate({
      size,
      position,
      biomes,
      blending,
      biomeSize,
      seed,
    })
    onPreviewChange(false, size, position)
  }

  const handleClear = () => {
    setCreateAction('clear')
    onClear()
    onPreviewChange(false, size, position)
  }

  const updateSculpt = (
    nextTool = sculptTool,
    nextRadius = brushRadius,
    nextStrength = brushStrength,
    nextPaint = paintMaterial,
  ) => {
    setSculptTool(nextTool)
    setBrushRadius(nextRadius)
    setBrushStrength(nextStrength)
    setPaintMaterial(nextPaint)
    onSculptConfigChange(true, nextTool, nextRadius, nextStrength, nextPaint)
  }

  return (
    <div className="w-72 bg-[#0a0a0a]/35 border-r border-white/[0.08] flex flex-col shrink-0 overflow-hidden select-none">
      {/* Header */}
      <div className="h-8 px-2.5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
        <span className="text-[11px] font-bold text-white tracking-tight">Terrain Editor</span>
        <button
          onClick={onClose}
          className="size-5 rounded flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] border-none bg-transparent cursor-pointer transition-colors"
          title="Close Terrain Editor"
        >
          <X className="size-3.5" />
        </button>
      </div>

      {/* Create / Edit Tabs */}
      <div className="flex items-center gap-1 p-1.5 border-b border-white/[0.08] bg-white/[0.02]">
        {(['create', 'edit'] as const).map((t) => {
          const isActive = tab === t
          return (
            <button
              key={t}
              onClick={() => updateTab(t)}
              className={`flex-1 h-7 rounded-[5px] text-[11px] font-medium capitalize border-none cursor-pointer transition-all duration-200 ${
                isActive
                  ? 'bg-white/10 text-white font-semibold shadow-xs'
                  : 'bg-transparent text-[#9ca3af] hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {t}
            </button>
          )
        })}
      </div>

      {tab === 'create' ? (
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
          {/* Action Tiles: Import, Generate, Clear */}
          <div className="grid grid-cols-3 gap-1.5 p-2 border-b border-white/[0.08]">
            <button
              onClick={() => {
                setCreateAction('import')
                onPreviewChange(false, size, position)
              }}
              className={`h-13 rounded-[5px] flex flex-col items-center justify-center gap-1 border-none cursor-pointer transition-colors ${
                createAction === 'import'
                  ? 'bg-white/10 text-white'
                  : 'bg-transparent text-white/70 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Icons8Icon name="upload" filled={createAction === 'import'} className="size-4" />
              <span className="text-[10px]">Import</span>
            </button>

            <button
              onClick={() => {
                setCreateAction('generate')
                onPreviewChange(true, size, position)
              }}
              className={`h-13 rounded-[5px] flex flex-col items-center justify-center gap-1 border-none cursor-pointer transition-colors ${
                createAction === 'generate'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'bg-transparent text-white/70 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Icons8Icon name="mountain" filled={createAction === 'generate'} className="size-4" />
              <span className="text-[10px]">Generate</span>
            </button>

            <button
              onClick={handleClear}
              className={`h-13 rounded-[5px] flex flex-col items-center justify-center gap-1 border-none cursor-pointer transition-colors ${
                createAction === 'clear'
                  ? 'bg-white/10 text-white'
                  : 'bg-transparent text-white/70 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Icons8Icon name="delete-sign" filled={createAction === 'clear'} className="size-3.5" />
              <span className="text-[10px]">Clear</span>
            </button>
          </div>

          {/* Selection Settings */}
          <div className="border-b border-white/[0.08]">
            <button
              onClick={() => setSelectionOpen((v) => !v)}
              className="w-full h-7 px-2.5 flex items-center gap-1.5 bg-white/[0.03] hover:bg-white/[0.05] text-white/90 text-[11px] font-semibold border-none cursor-pointer text-left"
            >
              {selectionOpen ? <ChevronDown className="size-3 text-white/50" /> : <ChevronRight className="size-3 text-white/50" />}
              <span>Selection Settings</span>
            </button>

            {selectionOpen && (
              <div className="px-3 py-2 flex flex-col gap-2.5 text-[11px]">
                {/* Size */}
                <div className="flex flex-col gap-1">
                  <span className="text-white/60 text-[10px]">Size</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['X', 'Y', 'Z'] as const).map((axis, i) => (
                      <div key={axis} className="relative flex items-center">
                        <span className="absolute left-1.5 text-[9px] font-mono text-white/35 pointer-events-none">
                          {axis}
                        </span>
                        <input
                          type="number"
                          value={size[i]}
                          onChange={(e) => updateSize(i as 0 | 1 | 2, e.target.value)}
                          className="w-full h-6 pl-4.5 pr-1 rounded-[4px] bg-black/40 border border-white/[0.08] text-white font-mono text-[10px] focus:outline-none focus:border-white/25"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Position */}
                <div className="flex flex-col gap-1">
                  <span className="text-white/60 text-[10px]">Position</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['X', 'Y', 'Z'] as const).map((axis, i) => (
                      <div key={axis} className="relative flex items-center">
                        <span className="absolute left-1.5 text-[9px] font-mono text-white/35 pointer-events-none">
                          {axis}
                        </span>
                        <input
                          type="number"
                          value={position[i]}
                          onChange={(e) => updatePosition(i as 0 | 1 | 2, e.target.value)}
                          className="w-full h-6 pl-4.5 pr-1 rounded-[4px] bg-black/40 border border-white/[0.08] text-white font-mono text-[10px] focus:outline-none focus:border-white/25"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Snap to Voxels */}
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-white/75 text-[11px]">Snap to Voxels</span>
                  <NoveloCheckbox checked={snapToVoxels} onChange={setSnapToVoxels} />
                </div>
              </div>
            )}
          </div>

          {/* Biome Settings */}
          <div className="flex-1 flex flex-col">
            <button
              onClick={() => setBiomeOpen((v) => !v)}
              className="w-full h-7 px-2.5 flex items-center gap-1.5 bg-white/[0.03] hover:bg-white/[0.05] text-white/90 text-[11px] font-semibold border-none cursor-pointer text-left"
            >
              {biomeOpen ? <ChevronDown className="size-3 text-white/50" /> : <ChevronRight className="size-3 text-white/50" />}
              <span>Biome Settings</span>
            </button>

            {biomeOpen && (
              <div className="px-3 py-2 flex flex-col gap-2.5 text-[11px]">
                <div className="flex flex-col gap-1.5">
                  <span className="text-white/60 text-[10px]">Biomes</span>
                  <div className="flex flex-col gap-1.5 pl-0.5">
                    {ALL_BIOMES.map((b) => (
                      <NoveloCheckbox
                        key={b}
                        checked={biomes.includes(b)}
                        onChange={() => toggleBiome(b)}
                        label={b}
                      />
                    ))}
                  </div>
                </div>

                {/* Blending */}
                <div className="flex flex-col gap-1 pt-1">
                  <span className="text-white/70 text-[10px]">Blending</span>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="text"
                      value={blending}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value)
                        if (!Number.isNaN(v)) setBlending(Math.max(0, Math.min(1, v)))
                      }}
                      className="w-11 h-6 px-1.5 rounded-[4px] bg-black/40 border border-white/[0.08] text-white font-mono text-[10px] text-center focus:outline-none focus:border-white/25"
                    />
                    <NoveloSlider
                      value={blending}
                      min={0}
                      max={1}
                      step={0.05}
                      onChange={setBlending}
                    />
                  </div>
                </div>

                {/* Caves */}
                <div className="flex items-center justify-between">
                  <span className="text-white/75 text-[11px]">Caves</span>
                  <NoveloCheckbox checked={caves} onChange={setCaves} />
                </div>

                {/* Biome Size */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-white/75 text-[11px] shrink-0">Biome Size</span>
                  <input
                    type="number"
                    value={biomeSize}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10)
                      if (!Number.isNaN(v)) setBiomeSize(Math.max(20, Math.min(400, v)))
                    }}
                    className="w-36 h-6 px-2 rounded-[4px] bg-black/40 border border-white/[0.08] text-white font-mono text-[10px] focus:outline-none focus:border-white/25"
                  />
                </div>

                {/* Seed */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-white/75 text-[11px] shrink-0">Seed</span>
                  <div className="flex items-center gap-1 w-36">
                    <input
                      type="number"
                      value={seed}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10)
                        if (!Number.isNaN(v)) setSeed(v)
                      }}
                      className="flex-1 min-w-0 h-6 px-2 rounded-[4px] bg-black/40 border border-white/[0.08] text-white font-mono text-[10px] focus:outline-none focus:border-white/25"
                    />
                    <button
                      type="button"
                      onClick={() => setSeed(Math.floor(Math.random() * 999999999))}
                      className="size-6 rounded-[4px] bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-white/70 hover:text-white border-none cursor-pointer shrink-0"
                      title="Randomize Seed"
                    >
                      <RefreshCw className="size-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Generate Button */}
          <div className="p-2.5 border-t border-white/[0.08] bg-white/[0.02]">
            <button
              onClick={handleGenerate}
              className="w-full h-7 rounded-[5px] bg-white/15 hover:bg-white/25 text-white font-semibold text-[11px] border-none cursor-pointer transition-colors"
            >
              Generate
            </button>
          </div>
        </div>
      ) : (
        /* Edit Sculpt Tab */
        <div className="flex-1 overflow-y-auto no-scrollbar p-2.5 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">Sculpt Tool</span>
            <div className="grid grid-cols-3 gap-1">
              {SCULPT_TOOLS.map((t) => {
                const isActive = sculptTool === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => updateSculpt(t.id, brushRadius, brushStrength, paintMaterial)}
                    className={`h-11 rounded-[5px] flex flex-col items-center justify-center gap-1 border-none cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-white/10 text-white font-semibold'
                        : 'bg-transparent text-white/65 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <Icons8Icon name={t.icon} filled={isActive} className="size-3.5" />
                    <span className="text-[10px]">{t.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.08]">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-white/65">Brush Size</span>
                <span className="font-mono text-white/85">{brushRadius}</span>
              </div>
              <NoveloSlider
                value={brushRadius}
                min={2}
                max={24}
                step={1}
                onChange={(val) => updateSculpt(sculptTool, val, brushStrength, paintMaterial)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-white/65">Strength</span>
                <span className="font-mono text-white/85">{brushStrength.toFixed(1)}</span>
              </div>
              <NoveloSlider
                value={brushStrength}
                min={0.1}
                max={2.0}
                step={0.1}
                onChange={(val) => updateSculpt(sculptTool, brushRadius, val, paintMaterial)}
              />
            </div>
          </div>

          {sculptTool === 'paint' && (
            <div className="flex flex-col gap-1.5 pt-2 border-t border-white/[0.08]">
              <span className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">Material</span>
              <div className="flex flex-col gap-1">
                {PAINT_MATERIALS.map((m) => {
                  const isSelected = paintMaterial === m.name
                  return (
                    <button
                      key={m.name}
                      onClick={() => updateSculpt(sculptTool, brushRadius, brushStrength, m.name)}
                      className={`h-7 px-2 rounded-[4px] flex items-center gap-2 border-none cursor-pointer text-[11px] transition-colors ${
                        isSelected
                          ? 'bg-white/10 text-white font-semibold'
                          : 'bg-transparent text-white/75 hover:bg-white/[0.05] hover:text-white'
                      }`}
                    >
                      <span
                        className="size-3.5 rounded-[3px] border border-white/20 shrink-0"
                        style={{ backgroundColor: m.swatch }}
                      />
                      <span>{m.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="mt-auto text-[10px] text-white/45 leading-relaxed pt-2 border-t border-white/[0.06]">
            Generate terrain in the Create tab first, then left-click and drag on the terrain to sculpt or paint.
          </div>
        </div>
      )}
    </div>
  )
}
