import { useState, useEffect, useRef } from 'react'
import { Check, ChevronDown, ChevronRight, Maximize2, Minimize2, Search, Upload, X } from 'lucide-react'
import { NoveloCheckbox } from './NoveloCheckbox'
import type { LightingPreset, NvloInstanceData, PartMaterial, PartShape, Vec3 } from '@engine/index'

interface PropertiesPanelProps {
  activeNode: NvloInstanceData | null
  parentName?: string
  lightingPreset: LightingPreset
  search: string
  onSearchChange: (val: string) => void
  onUpdateProperty: (key: string, value: string | boolean | number | Vec3) => void
  onLightingPresetChange: (preset: LightingPreset) => void
  isFloating?: boolean
  onToggleFloat?: () => void
  onClose?: () => void
  onHeaderPointerDown?: (e: React.PointerEvent) => void
}

const MATERIALS: PartMaterial[] = [
  'Plastic',
  'SmoothPlastic',
  'Grass',
  'Wood',
  'Marble',
  'Metal',
  'Concrete',
  'Neon',
  'Glass',
]

const SHAPES: PartShape[] = ['Brick', 'Sphere', 'Cylinder', 'Wedge', 'Truss', 'Seat']

const LIGHTING_PRESETS: LightingPreset[] = [
  'BrightDay',
  'GoldenSunset',
  'StarryMidnight',
  'CyberpunkNeon',
]

type CategoryName = 'Appearance' | 'Data' | 'Transform' | 'Collision' | 'Part' | 'Behavior'

const CATEGORY_ORDER: CategoryName[] = ['Appearance', 'Data', 'Transform', 'Collision', 'Part', 'Behavior']

const CATEGORY_MAP: Record<string, CategoryName> = {
  CastShadow: 'Appearance',
  Color: 'Appearance',
  BackgroundColor: 'Appearance',
  TextColor: 'Appearance',
  BackgroundTransparency: 'Appearance',
  CornerRadius: 'Appearance',
  Text: 'Appearance',
  FontSize: 'Appearance',
  ImageUrl: 'Appearance',
  Material: 'Appearance',
  Transparency: 'Appearance',
  Locked: 'Data',
  Name: 'Data',
  Gravity: 'Data',
  TimeOfDay: 'Data',
  Brightness: 'Data',
  Source: 'Data',
  Size: 'Transform',
  Position: 'Transform',
  Rotation: 'Transform',
  PositionX: 'Transform',
  PositionY: 'Transform',
  Width: 'Transform',
  Height: 'Transform',
  CanCollide: 'Collision',
  Anchored: 'Part',
  Shape: 'Part',
  IsSpawn: 'Part',
  Disabled: 'Part',
  Visible: 'Behavior',
}

function StudioCheckbox({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (next: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`size-3.5 rounded-[3px] flex items-center justify-center border cursor-pointer transition-colors p-0 ${
        checked
          ? 'bg-white border-white text-[#0a0a0a]'
          : 'bg-white/[0.04] border-white/25 hover:border-white/45 text-transparent'
      }`}
    >
      {checked && <Check className="size-2.5 stroke-[3]" />}
    </button>
  )
}

function InlinePropertyDropdown({
  value,
  options,
  onChange,
}: {
  value: string
  options: readonly string[]
  onChange: (next: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number; width: number; maxHeight: number }>({
    top: 0,
    left: 0,
    width: 156,
    maxHeight: 240,
  })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setIsOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('mousedown', onOutside)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onOutside)
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen])

  const openMenu = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom - 10
      const spaceAbove = rect.top - 10
      const estHeight = Math.min(options.length * 26 + 10, 260)
      const openBelow = spaceBelow >= 120 || spaceBelow >= spaceAbove
      const maxHeight = Math.min(260, Math.max(80, openBelow ? spaceBelow : spaceAbove))
      const top = openBelow
        ? rect.bottom + 2
        : Math.max(8, rect.top - Math.min(estHeight, maxHeight) - 2)
      setPos({
        top,
        left: Math.min(rect.left, window.innerWidth - Math.max(rect.width, 150) - 8),
        width: Math.max(rect.width, 150),
        maxHeight,
      })
    }
    setIsOpen((prev) => !prev)
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openMenu}
        className={`w-full h-full px-2 flex items-center justify-between text-[11px] border-none cursor-pointer transition-colors ${
          isOpen ? 'bg-white/[0.08] text-white' : 'bg-transparent text-white/90 hover:bg-white/[0.04]'
        }`}
      >
        <span className="truncate">{value}</span>
        <ChevronDown className="size-3 text-white/40 shrink-0 ml-1" />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          onMouseDown={(e) => e.stopPropagation()}
          style={{ top: pos.top, left: pos.left, width: pos.width, maxHeight: pos.maxHeight }}
          className="fixed overflow-y-auto no-scrollbar bg-[#141416] border border-white/10 rounded-[6px] shadow-2xl p-1 z-50 flex flex-col gap-0.5"
        >
          {options.map((opt) => {
            const isSelected = opt === value
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt)
                  setIsOpen(false)
                }}
                className={`w-full px-2.5 py-1 rounded-[4px] text-left text-[11px] font-medium border-none cursor-pointer flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-white/[0.08] text-white font-semibold'
                    : 'bg-transparent text-white/70 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <span className="truncate">{opt}</span>
                {isSelected && <Check className="size-3 text-white/80 shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}

function ExpandableVec3Row({
  nodeId,
  propKey,
  value,
  expanded,
  onToggleExpand,
  onCommit,
}: {
  nodeId: string
  propKey: string
  value: Vec3
  expanded: boolean
  onToggleExpand: () => void
  onCommit: (next: Vec3) => void
}) {
  const formatted = value.map((n) => Number(n.toFixed(3))).join(', ')
  const [summaryDraft, setSummaryDraft] = useState(formatted)

  useEffect(() => {
    setSummaryDraft(value.map((n) => Number(n.toFixed(3))).join(', '))
  }, [nodeId, value[0], value[1], value[2]])

  const commitSummary = (raw: string) => {
    const parts = raw.split(',').map((n) => parseFloat(n.trim()))
    if (parts.length === 3 && parts.every((n) => !Number.isNaN(n))) {
      onCommit(parts as Vec3)
    } else {
      setSummaryDraft(formatted)
    }
  }

  const commitAxis = (idx: 0 | 1 | 2, raw: string) => {
    const parsed = parseFloat(raw)
    if (Number.isNaN(parsed)) return
    const next: Vec3 = [value[0], value[1], value[2]]
    next[idx] = parsed
    onCommit(next)
  }

  const axisNames = ['X', 'Y', 'Z'] as const

  return (
    <>
      <div className="h-[22px] flex items-center border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors">
        <div className="w-[46%] h-full px-2 flex items-center gap-1 border-r border-white/[0.06] shrink-0">
          <button
            type="button"
            onClick={onToggleExpand}
            className="size-3.5 flex items-center justify-center text-white/45 hover:text-white border-none bg-transparent p-0 cursor-pointer shrink-0"
          >
            {expanded ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
          </button>
          <span className="text-[11px] text-white/75 truncate">{propKey}</span>
        </div>
        <div className="flex-1 h-full flex items-center min-w-0">
          <input
            type="text"
            value={summaryDraft}
            onChange={(e) => setSummaryDraft(e.target.value)}
            onBlur={(e) => commitSummary(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                commitSummary((e.target as HTMLInputElement).value)
                ;(e.target as HTMLInputElement).blur()
              }
            }}
            className="w-full h-full px-2 bg-transparent border-none text-white/90 font-mono text-[11px] focus:outline-none focus:bg-white/[0.06]"
          />
        </div>
      </div>

      {expanded &&
        ([0, 1, 2] as const).map((idx) => (
          <div
            key={`${propKey}_${idx}`}
            className="h-[22px] flex items-center border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors"
          >
            <div className="w-[46%] h-full pl-7 pr-2 flex items-center border-r border-white/[0.06] shrink-0">
              <span className="text-[11px] text-white/55">{axisNames[idx]}</span>
            </div>
            <div className="flex-1 h-full flex items-center min-w-0">
              <input
                type="text"
                key={`${nodeId}_${propKey}_${idx}_${value[idx]}`}
                defaultValue={String(Number(value[idx].toFixed(3)))}
                onBlur={(e) => commitAxis(idx, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    commitAxis(idx, (e.target as HTMLInputElement).value)
                    ;(e.target as HTMLInputElement).blur()
                  }
                }}
                className="w-full h-full px-2 bg-transparent border-none text-white/90 font-mono text-[11px] focus:outline-none focus:bg-white/[0.06]"
              />
            </div>
          </div>
        ))}
    </>
  )
}

export function PropertiesPanel({
  activeNode,
  parentName = 'World',
  lightingPreset,
  search,
  onSearchChange,
  onUpdateProperty,
  onLightingPresetChange,
  isFloating,
  onToggleFloat,
  onClose,
  onHeaderPointerDown,
}: PropertiesPanelProps) {
  const filterRef = useRef<HTMLInputElement>(null)
  const [collapsedCats, setCollapsedCats] = useState<Record<string, boolean>>({})
  const [expandedVec3, setExpandedVec3] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault()
        filterRef.current?.focus()
        filterRef.current?.select()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const toggleCategory = (cat: string) => {
    setCollapsedCats((prev) => ({ ...prev, [cat]: !prev[cat] }))
  }

  const toggleVec3 = (key: string) => {
    setExpandedVec3((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const renderValueCell = (key: string, val: string | number | boolean | Vec3) => {
    if (!activeNode) return null

    if (key === 'ImageUrl') {
      const urlVal = String(val || '')
      return (
        <div className="w-full h-full px-1.5 flex items-center gap-1">
          <input
            type="text"
            key={`${activeNode.id}_ImageUrl_${urlVal}`}
            defaultValue={urlVal}
            placeholder="Import PNG..."
            onBlur={(e) => onUpdateProperty('ImageUrl', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onUpdateProperty('ImageUrl', (e.target as HTMLInputElement).value)
                ;(e.target as HTMLInputElement).blur()
              }
            }}
            className="flex-1 h-full bg-transparent border-none text-white/90 font-mono text-[10px] placeholder:text-white/30 focus:outline-none focus:bg-white/[0.06] min-w-0"
          />
          <label
            className="size-4.5 rounded-[3px] bg-white/[0.06] hover:bg-white/[0.14] flex items-center justify-center text-white/75 hover:text-white cursor-pointer shrink-0 transition-colors"
            title="Import PNG Image"
          >
            <Upload className="size-2.5" />
            <input
              type="file"
              accept="image/png,image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = () => {
                  if (typeof reader.result === 'string') {
                    onUpdateProperty('ImageUrl', reader.result)
                  }
                }
                reader.readAsDataURL(file)
                e.target.value = ''
              }}
            />
          </label>
        </div>
      )
    }

    if (key === 'Color' || key === 'BackgroundColor' || key === 'TextColor') {
      const hex = String(val || '#a3a2a5')
      return (
        <div className="w-full h-full px-2 flex items-center gap-1.5">
          <label className="relative size-3.5 rounded-[2px] border border-white/25 cursor-pointer shrink-0 overflow-hidden" style={{ backgroundColor: hex }}>
            <input
              type="color"
              value={hex}
              onChange={(e) => onUpdateProperty(key, e.target.value)}
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
            />
          </label>
          <input
            type="text"
            key={`${activeNode.id}_${key}_${hex}`}
            defaultValue={hex}
            onBlur={(e) => onUpdateProperty(key, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onUpdateProperty(key, (e.target as HTMLInputElement).value)
                ;(e.target as HTMLInputElement).blur()
              }
            }}
            className="flex-1 h-full bg-transparent border-none text-white/90 font-mono text-[11px] focus:outline-none focus:bg-white/[0.06] min-w-0"
          />
        </div>
      )
    }

    if (key === 'Material') {
      return (
        <InlinePropertyDropdown
          value={String(val)}
          options={MATERIALS}
          onChange={(next) => onUpdateProperty('Material', next)}
        />
      )
    }

    if (key === 'Shape') {
      return (
        <InlinePropertyDropdown
          value={String(val)}
          options={SHAPES}
          onChange={(next) => onUpdateProperty('Shape', next)}
        />
      )
    }

    if (key === 'Transparency') {
      const num = Number(val) || 0
      return (
        <input
          type="text"
          key={`${activeNode.id}_Transparency_${num}`}
          defaultValue={String(num)}
          onBlur={(e) => onUpdateProperty('Transparency', e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onUpdateProperty('Transparency', (e.target as HTMLInputElement).value)
              ;(e.target as HTMLInputElement).blur()
            }
          }}
          className="w-full h-full px-2 bg-transparent border-none text-white/90 font-mono text-[11px] focus:outline-none focus:bg-white/[0.06]"
        />
      )
    }

    if (typeof val === 'boolean') {
      return (
        <div className="w-full h-full px-2 flex items-center">
          <NoveloCheckbox checked={val} onChange={(next) => onUpdateProperty(key, next)} />
        </div>
      )
    }

    return (
      <input
        type="text"
        key={`${activeNode.id}_${key}_${String(val)}`}
        defaultValue={String(val)}
        onBlur={(e) => onUpdateProperty(key, e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onUpdateProperty(key, (e.target as HTMLInputElement).value)
            ;(e.target as HTMLInputElement).blur()
          }
        }}
        className="w-full h-full px-2 bg-transparent border-none text-white/90 font-sans text-[11px] focus:outline-none focus:bg-white/[0.06]"
      />
    )
  }

  const renderProperties = () => {
    if (!activeNode) {
      return (
        <div className="text-white/35 text-center py-8 px-4 text-[10px] leading-relaxed">
          Select an object in Explorer or the 3D Viewport
        </div>
      )
    }

    const q = search.trim().toLowerCase()
    const entries = Object.entries(activeNode.properties || {}).filter(
      ([key]) => !q || key.toLowerCase().includes(q),
    )

    const groups: Record<CategoryName, [string, string | number | boolean | Vec3][]> = {
      Appearance: [],
      Data: [],
      Transform: [],
      Collision: [],
      Part: [],
      Behavior: [],
    }

    for (const entry of entries) {
      const cat = CATEGORY_MAP[entry[0]] || 'Data'
      groups[cat].push(entry)
    }

    const showClassName = !q || 'classname'.includes(q)
    const showParent = !q || 'parent'.includes(q)
    const showPresetRow = activeNode.className === 'Lighting' && (!q || 'preset'.includes(q))

    return (
      <div className="flex flex-col">
        {CATEGORY_ORDER.map((cat) => {
          const items = groups[cat]
          const hasDataExtras = cat === 'Data' && (showClassName || showParent || showPresetRow)
          if (items.length === 0 && !hasDataExtras) return null
          const isCollapsed = Boolean(collapsedCats[cat])

          return (
            <div key={cat} className="flex flex-col">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(cat)}
                className="h-[24px] px-2 flex items-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.07] border-b border-white/[0.06] text-white/90 text-[11px] font-semibold border-x-0 border-t-0 cursor-pointer text-left transition-colors"
              >
                {isCollapsed ? (
                  <ChevronRight className="size-3 text-white/45" />
                ) : (
                  <ChevronDown className="size-3 text-white/45" />
                )}
                <span>{cat}</span>
              </button>

              {!isCollapsed && (
                <div className="flex flex-col">
                  {items.map(([key, val]) => {
                    if (Array.isArray(val) && val.length === 3) {
                      return (
                        <ExpandableVec3Row
                          key={key}
                          nodeId={activeNode.id}
                          propKey={key}
                          value={val as Vec3}
                          expanded={Boolean(expandedVec3[key])}
                          onToggleExpand={() => toggleVec3(key)}
                          onCommit={(next) => onUpdateProperty(key, next)}
                        />
                      )
                    }

                    return (
                      <div
                        key={key}
                        className="h-[22px] flex items-center border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors"
                      >
                        <div className="w-[46%] h-full pl-6 pr-2 flex items-center border-r border-white/[0.06] shrink-0">
                          <span className="text-[11px] text-white/75 truncate">{key}</span>
                        </div>
                        <div className="flex-1 h-full flex items-center min-w-0">
                          {renderValueCell(key, val)}
                        </div>
                      </div>
                    )
                  })}

                  {cat === 'Data' && showClassName && (
                    <div className="h-[22px] flex items-center border-b border-white/[0.05]">
                      <div className="w-[46%] h-full pl-6 pr-2 flex items-center border-r border-white/[0.06] shrink-0">
                        <span className="text-[11px] text-white/40 truncate">ClassName</span>
                      </div>
                      <div className="flex-1 h-full px-2 flex items-center min-w-0">
                        <span className="text-[11px] text-white/40 truncate">{activeNode.className}</span>
                      </div>
                    </div>
                  )}

                  {cat === 'Data' && showParent && (
                    <div className="h-[22px] flex items-center border-b border-white/[0.05]">
                      <div className="w-[46%] h-full pl-6 pr-2 flex items-center border-r border-white/[0.06] shrink-0">
                        <span className="text-[11px] text-white/75 truncate">Parent</span>
                      </div>
                      <div className="flex-1 h-full px-2 flex items-center min-w-0">
                        <span className="text-[11px] text-white/75 truncate">{parentName}</span>
                      </div>
                    </div>
                  )}

                  {cat === 'Data' && showPresetRow && (
                    <div className="h-[22px] flex items-center border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors">
                      <div className="w-[46%] h-full pl-6 pr-2 flex items-center border-r border-white/[0.06] shrink-0">
                        <span className="text-[11px] text-white/75 truncate">Preset</span>
                      </div>
                      <div className="flex-1 h-full flex items-center min-w-0">
                        <InlinePropertyDropdown
                          value={lightingPreset}
                          options={LIGHTING_PRESETS}
                          onChange={(next) => onLightingPresetChange(next as LightingPreset)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-transparent overflow-hidden">
      <div
        onPointerDown={onHeaderPointerDown}
        className="h-7 px-2.5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02] cursor-grab active:cursor-grabbing select-none"
      >
        <span className="text-[11px] font-semibold text-white/90 tracking-tight truncate">
          {activeNode ? `Properties - ${activeNode.className} "${activeNode.name}"` : 'Properties'}
        </span>
        <div
          className="flex items-center gap-0.5 shrink-0 ml-1"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {onToggleFloat && (
            <button
              type="button"
              onClick={onToggleFloat}
              className="size-5 rounded flex items-center justify-center text-white/45 hover:text-white hover:bg-white/[0.08] border-none bg-transparent cursor-pointer transition-colors"
              title={isFloating ? 'Dock Properties' : 'Undock Properties'}
            >
              {isFloating ? <Minimize2 className="size-3" /> : <Maximize2 className="size-3" />}
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="size-5 rounded flex items-center justify-center text-white/45 hover:text-white hover:bg-white/[0.08] border-none bg-transparent cursor-pointer transition-colors"
              title="Close Properties"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Properties */}
      <div className="px-1.5 py-1 border-b border-white/[0.08] bg-transparent">
        <div className="relative flex items-center">
          <Search className="size-3 text-white/35 absolute left-2 pointer-events-none" />
          <input
            ref={filterRef}
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter Properties (Ctrl+Shift+P)"
            className="w-full h-6 pl-6 pr-6 rounded-[3px] bg-black/35 border border-white/[0.08] text-white text-[11px] placeholder:text-white/40 focus:outline-none focus:border-white/25"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-1.5 text-white/40 hover:text-white border-none bg-transparent p-0 cursor-pointer"
              title="Clear Filter"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      </div>

      {/* Property Rows */}
      <div className="flex-1 overflow-y-auto no-scrollbar">{renderProperties()}</div>
    </div>
  )
}
