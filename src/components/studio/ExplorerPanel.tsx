import { useState, useRef, useEffect } from 'react'
import {
  Box,
  Boxes,
  Check,
  CircleDot,
  Code2,
  Columns2,
  FileText,
  Folder,
  Globe,
  Hash,
  Image as ImageIcon,
  Keyboard,
  LayoutGrid,
  Lightbulb,
  MessageCircle,
  MessagesSquare,
  MoreHorizontal,
  MousePointerClick,
  Move,
  Plus,
  Sparkles,
  Square,
  Sun,
  Type,
  Volume2,
  Wrench,
  Layers,
  Maximize2,
  Minimize2,
  X,
} from 'lucide-react'
import { Icons8Icon } from './Icons8Icon'
import type { NvloClassName, NvloInstanceData, PartShape } from '@engine/index'

interface ExplorerPanelProps {
  rootChildren: NvloInstanceData[]
  selectedId: string
  expandedNodes: Record<string, boolean>
  search: string
  onSearchChange: (val: string) => void
  onToggleExpand: (id: string) => void
  onSelect: (id: string) => void
  onRename: (id: string, newName: string) => void
  onInsertPart: (shape: PartShape) => void
  onInsertObject: (parentId: string, className: NvloClassName, selectAfter?: boolean) => void
  onReparent: (childId: string, targetId: string, position: 'inside' | 'before' | 'after') => void
  onContextMenu: (id: string, clientX: number, clientY: number) => void
  isFloating?: boolean
  onToggleFloat?: () => void
  onClose?: () => void
  onHeaderPointerDown?: (e: React.PointerEvent) => void
  onOpenScript?: (id: string) => void
}

interface InsertCategory {
  title: string
  items: { className: NvloClassName; label: string }[]
}

const INSERT_OBJECT_CATEGORIES: InsertCategory[] = [
  {
    title: 'Frequently Used',
    items: [
      { className: 'Part', label: 'Part' },
      { className: 'Script', label: 'Script' },
      { className: 'Folder', label: 'Folder' },
      { className: 'Tool', label: 'Tool' },
      { className: 'SpawnLocation', label: 'SpawnLocation' },
      { className: 'MeshPart', label: 'MeshPart' },
      { className: 'Model', label: 'Model' },
    ],
  },
  {
    title: '3D Interfaces',
    items: [
      { className: 'ClickDetector', label: 'ClickDetector' },
      { className: 'Decal', label: 'Decal' },
      { className: 'Dialog', label: 'Dialog' },
      { className: 'DialogChoice', label: 'DialogChoice' },
      { className: 'DragDetector', label: 'DragDetector' },
      { className: 'MaterialVariant', label: 'MaterialVariant' },
      { className: 'ProximityPrompt', label: 'ProximityPrompt' },
      { className: 'SurfaceAppearance', label: 'SurfaceAppearance' },
    ],
  },
  {
    title: 'Scripting',
    items: [
      { className: 'Script', label: 'Script' },
      { className: 'LocalScript', label: 'LocalScript' },
      { className: 'ModuleScript', label: 'ModuleScript' },
    ],
  },
  {
    title: 'UI',
    items: [
      { className: 'ScreenGui', label: 'ScreenGui' },
      { className: 'Frame', label: 'Frame' },
      { className: 'TextLabel', label: 'TextLabel' },
      { className: 'TextButton', label: 'TextButton' },
      { className: 'ImageLabel', label: 'ImageLabel' },
      { className: 'ImageButton', label: 'ImageButton' },
      { className: 'TextBox', label: 'TextBox' },
      { className: 'ScrollingFrame', label: 'ScrollingFrame' },
    ],
  },
  {
    title: 'Effects & Lighting',
    items: [
      { className: 'PointLight', label: 'PointLight' },
      { className: 'SpotLight', label: 'SpotLight' },
      { className: 'SurfaceLight', label: 'SurfaceLight' },
      { className: 'ParticleEmitter', label: 'ParticleEmitter' },
      { className: 'Sound', label: 'Sound' },
    ],
  },
  {
    title: 'Values',
    items: [
      { className: 'BoolValue', label: 'BoolValue' },
      { className: 'IntValue', label: 'IntValue' },
      { className: 'NumberValue', label: 'NumberValue' },
      { className: 'StringValue', label: 'StringValue' },
      { className: 'ObjectValue', label: 'ObjectValue' },
    ],
  },
]

const PROTECTED_RENAME_CLASSES = new Set([
  'World',
  'Workspace',
  'Lighting',
  'ServerScriptService',
  'StarterGui',
  'ReplicatedStorage',
])

function getIcons8NameForClass(cls: string): string | null {
  switch (cls) {
    case 'Workspace':
      return 'globe'
    case 'Lighting':
      return 'sun'
    case 'ServerScriptService':
      return 'source-code'
    case 'StarterGui':
    case 'ScreenGui':
    case 'Frame':
    case 'TextLabel':
    case 'TextButton':
    case 'ImageLabel':
      return 'web-design'
    case 'ReplicatedStorage':
      return 'opened-folder'
    case 'SpawnLocation':
      return 'star'
    case 'Script':
      return 'code'
    default:
      return null
  }
}

function renderClassIcon(cls: string, isSelected = false, forMenu = false) {
  const icons8Name = forMenu ? null : getIcons8NameForClass(cls)
  if (icons8Name) {
    return <Icons8Icon name={icons8Name} filled={isSelected} className="size-3.5 shrink-0" />
  }

  switch (cls) {
    case 'Part':
      return (
        <Box
          className={`size-3.5 shrink-0 transition-all ${
            isSelected ? 'text-[#0a0a0a] fill-white' : 'text-white/85 fill-none'
          }`}
        />
      )
    case 'Script':
      return <FileText className="size-3.5 shrink-0 text-white/90" />
    case 'LocalScript':
      return <Code2 className="size-3.5 shrink-0 text-[#60a5fa]" />
    case 'ModuleScript':
      return <Code2 className="size-3.5 shrink-0 text-[#c084fc]" />
    case 'Folder':
      return <Folder className="size-3.5 shrink-0 text-[#facc15] fill-[#facc15]/85" />
    case 'Tool':
      return <Wrench className="size-3.5 shrink-0 text-white/85" />
    case 'SpawnLocation':
      return <Sun className="size-3.5 shrink-0 text-white/90" />
    case 'MeshPart':
      return <Globe className="size-3.5 shrink-0 text-white/85" />
    case 'Model':
      return <Boxes className="size-3.5 shrink-0 text-[#f59e0b]" />
    case 'Humanoid':
      return <Icons8Icon name="user" filled={isSelected} className="size-3.5 shrink-0" />
    case 'ClickDetector':
      return <MousePointerClick className="size-3.5 shrink-0 text-[#38bdf8]" />
    case 'Decal':
    case 'ImageLabel':
    case 'ImageButton':
      return <ImageIcon className="size-3.5 shrink-0 text-[#38bdf8]" />
    case 'Dialog':
      return <MessageCircle className="size-3.5 shrink-0 text-[#38bdf8]" />
    case 'DialogChoice':
      return <MessagesSquare className="size-3.5 shrink-0 text-[#38bdf8]" />
    case 'DragDetector':
      return <Move className="size-3.5 shrink-0 text-[#38bdf8]" />
    case 'MaterialVariant':
      return <CircleDot className="size-3.5 shrink-0 text-white/85" />
    case 'ProximityPrompt':
      return <Keyboard className="size-3.5 shrink-0 text-[#38bdf8]" />
    case 'SurfaceAppearance':
      return <Layers className="size-3.5 shrink-0 text-[#38bdf8]" />
    case 'ScreenGui':
      return <LayoutGrid className="size-3.5 shrink-0 text-[#ec4899]" />
    case 'Frame':
    case 'ScrollingFrame':
      return <Square className="size-3.5 shrink-0 text-[#f97316]" />
    case 'TextLabel':
    case 'TextButton':
    case 'TextBox':
      return <Type className="size-3.5 shrink-0 text-[#38bdf8]" />
    case 'PointLight':
    case 'SpotLight':
    case 'SurfaceLight':
      return <Lightbulb className="size-3.5 shrink-0 text-[#fde047]" />
    case 'ParticleEmitter':
      return <Sparkles className="size-3.5 shrink-0 text-[#a78bfa]" />
    case 'Sound':
      return <Volume2 className="size-3.5 shrink-0 text-[#34d399]" />
    case 'BoolValue':
    case 'IntValue':
    case 'NumberValue':
    case 'StringValue':
    case 'ObjectValue':
      return <Hash className="size-3.5 shrink-0 text-[#4ade80]" />
    default:
      return (
        <Box
          className={`size-3.5 shrink-0 transition-all ${
            isSelected ? 'text-[#0a0a0a] fill-white' : 'text-white/70 fill-none'
          }`}
        />
      )
  }
}

function nodeMatchesSearch(node: NvloInstanceData, query: string): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  if (node.name.toLowerCase().includes(q) || node.className.toLowerCase().includes(q)) {
    return true
  }
  return node.children?.some((c) => nodeMatchesSearch(c, q)) ?? false
}

function getRecommendedClasses(parentClassName: string): Set<NvloClassName> | null {
  switch (parentClassName) {
    case 'StarterGui':
      return new Set(['ScreenGui', 'Folder', 'LocalScript', 'ModuleScript'])
    case 'ScreenGui':
    case 'Frame':
    case 'TextLabel':
    case 'TextButton':
    case 'ImageLabel':
    case 'ImageButton':
    case 'TextBox':
    case 'ScrollingFrame':
      return new Set([
        'Frame',
        'TextLabel',
        'TextButton',
        'ImageLabel',
        'ImageButton',
        'TextBox',
        'ScrollingFrame',
        'Folder',
        'LocalScript',
      ])
    case 'ServerScriptService':
      return new Set(['Script', 'ModuleScript', 'Folder'])
    case 'Lighting':
      return new Set(['PointLight', 'SpotLight', 'SurfaceLight', 'Folder'])
    case 'ReplicatedStorage':
      return new Set([
        'Folder',
        'ModuleScript',
        'Model',
        'Part',
        'BoolValue',
        'IntValue',
        'NumberValue',
        'StringValue',
        'ObjectValue',
      ])
    case 'Part':
    case 'MeshPart':
    case 'SpawnLocation':
      return new Set([
        'ClickDetector',
        'Decal',
        'Dialog',
        'DragDetector',
        'ProximityPrompt',
        'SurfaceAppearance',
        'PointLight',
        'SpotLight',
        'SurfaceLight',
        'ParticleEmitter',
        'Sound',
        'Script',
        'Folder',
      ])
    case 'Workspace':
    case 'Model':
    case 'Folder':
    case 'Tool':
      return new Set([
        'Part',
        'MeshPart',
        'SpawnLocation',
        'Model',
        'Folder',
        'Tool',
        'Script',
        'LocalScript',
        'PointLight',
        'Sound',
      ])
    default:
      return null
  }
}

export function ExplorerPanel({
  rootChildren,
  selectedId,
  expandedNodes,
  search,
  onSearchChange,
  onToggleExpand,
  onSelect,
  onRename,
  onInsertPart,
  onInsertObject,
  onReparent,
  onContextMenu,
  isFloating,
  onToggleFloat,
  onClose,
  onHeaderPointerDown,
  onOpenScript,
}: ExplorerPanelProps) {
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameDraft, setRenameDraft] = useState('')
  const [showInsertMenu, setShowInsertMenu] = useState(false)
  const [insertObjectState, setInsertObjectState] = useState<{
    parentId: string
    parentClassName: string
    x: number
    y: number
  } | null>(null)
  const [insertObjectSearch, setInsertObjectSearch] = useState('')
  const [isColumnsView, setIsColumnsView] = useState(false)
  const [showInsertSettings, setShowInsertSettings] = useState(false)
  const [selectAfterInsert, setSelectAfterInsert] = useState(true)
  const [onlyRecommended, setOnlyRecommended] = useState(false)
  const [dragState, setDragState] = useState<{
    id: string
    name: string
    className: string
    startX: number
    startY: number
    x: number
    y: number
    active: boolean
  } | null>(null)
  const [dropTarget, setDropTarget] = useState<{
    id: string
    position: 'inside' | 'before' | 'after'
  } | null>(null)
  const renameInputRef = useRef<HTMLInputElement>(null)
  const insertMenuRef = useRef<HTMLDivElement>(null)
  const insertObjectPopoverRef = useRef<HTMLDivElement>(null)
  const insertObjectSearchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!dragState) return
    const onPointerMove = (e: PointerEvent) => {
      if (!dragState.active) {
        if (Math.hypot(e.clientX - dragState.startX, e.clientY - dragState.startY) <= 5) return
      }
      setDragState((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY, active: true } : null))
      const el = document.elementFromPoint(e.clientX, e.clientY)
      const row = el?.closest('[data-explorer-id]') as HTMLElement | null
      const targetId = row?.getAttribute('data-explorer-id') || null
      if (row && targetId && targetId !== dragState.id) {
        const rect = row.getBoundingClientRect()
        const relY = (e.clientY - rect.top) / Math.max(1, rect.height)
        const position: 'inside' | 'before' | 'after' =
          relY < 0.25 ? 'before' : relY > 0.75 ? 'after' : 'inside'
        setDropTarget({ id: targetId, position })
      } else {
        setDropTarget(null)
      }
    }
    const onPointerUp = () => {
      if (dragState.active && dropTarget && dropTarget.id !== dragState.id) {
        onReparent(dragState.id, dropTarget.id, dropTarget.position)
      }
      setDragState(null)
      setDropTarget(null)
    }
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [dragState, dropTarget, onReparent])

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus()
      renameInputRef.current.select()
    }
  }, [renamingId])

  useEffect(() => {
    if (!showInsertMenu) return
    const onOutside = (e: MouseEvent) => {
      if (insertMenuRef.current && !insertMenuRef.current.contains(e.target as Node)) {
        setShowInsertMenu(false)
      }
    }
    window.addEventListener('mousedown', onOutside)
    return () => window.removeEventListener('mousedown', onOutside)
  }, [showInsertMenu])

  useEffect(() => {
    if (!insertObjectState) return
    setTimeout(() => insertObjectSearchRef.current?.focus(), 0)
    const onOutside = (e: MouseEvent) => {
      if (
        insertObjectPopoverRef.current &&
        !insertObjectPopoverRef.current.contains(e.target as Node)
      ) {
        setInsertObjectState(null)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setInsertObjectState(null)
      }
    }
    window.addEventListener('mousedown', onOutside)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('mousedown', onOutside)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [insertObjectState])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'F2' || !selectedId || renamingId) return
      const activeTag = (document.activeElement as HTMLElement | null)?.tagName
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return
      const find = (nodes: NvloInstanceData[]): NvloInstanceData | null => {
        for (const n of nodes) {
          if (n.id === selectedId) return n
          if (n.children) {
            const f = find(n.children)
            if (f) return f
          }
        }
        return null
      }
      const target = find(rootChildren)
      if (target && !PROTECTED_RENAME_CLASSES.has(target.className)) {
        e.preventDefault()
        setRenamingId(target.id)
        setRenameDraft(target.name)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedId, renamingId, rootChildren])

  const commitRename = () => {
    if (renamingId && renameDraft.trim()) {
      onRename(renamingId, renameDraft.trim())
    }
    setRenamingId(null)
  }

  const renderNode = (node: NvloInstanceData, depth = 0) => {
    if (!nodeMatchesSearch(node, search)) return null

    const hasChildren = Boolean(node.children && node.children.length > 0)
    const isExpanded = search.trim() ? true : Boolean(expandedNodes[node.id])
    const isSelected = selectedId === node.id
    const isRenaming = renamingId === node.id
    const isProtected = PROTECTED_RENAME_CLASSES.has(node.className)
    const activeDropPos =
      dragState?.active && dropTarget?.id === node.id && dragState?.id !== node.id
        ? dropTarget.position
        : null
    const isInsertTarget = insertObjectState?.parentId === node.id

    return (
      <div key={node.id} className="flex flex-col select-none relative">
        {activeDropPos === 'before' && (
          <div
            style={{ left: `${depth * 14 + 4}px` }}
            className="absolute top-0 right-1 h-[2px] bg-white rounded-full z-20 pointer-events-none"
          />
        )}
        <div
          data-explorer-id={node.id}
          onPointerDown={(e) => {
            if (e.button !== 0 || isProtected || isRenaming) return
            setDragState({
              id: node.id,
              name: node.name,
              className: node.className,
              startX: e.clientX,
              startY: e.clientY,
              x: e.clientX,
              y: e.clientY,
              active: false,
            })
          }}
          onClick={() => onSelect(node.id)}
          onDoubleClick={() => {
            if (
              onOpenScript &&
              (node.className === 'Script' ||
                node.className === 'LocalScript' ||
                node.className === 'ModuleScript')
            ) {
              onOpenScript(node.id)
            } else if (!isProtected) {
              setRenamingId(node.id)
              setRenameDraft(node.name)
            } else if (hasChildren) {
              onToggleExpand(node.id)
            }
          }}
          onContextMenu={(e) => {
            e.preventDefault()
            onSelect(node.id)
            onContextMenu(node.id, e.clientX, e.clientY)
          }}
          className={`group h-[23px] px-1 flex items-center gap-1.5 cursor-pointer text-[11px] rounded-[4px] transition-colors border-none ${
            activeDropPos === 'inside'
              ? 'bg-white/15 ring-1 ring-white/40 text-white'
              : isSelected
                ? 'bg-white/10 text-white font-medium'
                : 'hover:bg-white/[0.05] text-[#cccccc]'
          }`}
          style={{ paddingLeft: `${depth * 14 + 4}px` }}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleExpand(node.id)
              }}
              className="size-3.5 flex items-center justify-center border-none bg-transparent p-0 cursor-pointer shrink-0 opacity-65 hover:opacity-100"
            >
              <Icons8Icon name={isExpanded ? 'expand-arrow' : 'forward'} className="size-2.5" />
            </button>
          ) : (
            <span className="w-3.5 shrink-0" />
          )}

          {renderClassIcon(node.className, isSelected)}

          {isRenaming ? (
            <input
              ref={renameInputRef}
              value={renameDraft}
              onChange={(e) => setRenameDraft(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                e.stopPropagation()
                if (e.key === 'Enter') commitRename()
                if (e.key === 'Escape') setRenamingId(null)
              }}
              className="flex-1 h-[18px] px-1 rounded bg-black/50 border border-white/25 text-white text-[11px] font-mono focus:outline-none"
            />
          ) : (
            <>
              <span className="truncate">{node.name}</span>
              <button
                type="button"
                title={`Insert Object into ${node.name}`}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation()
                  const rect = e.currentTarget.getBoundingClientRect()
                  const menuW = 248
                  const menuH = 420
                  const x = Math.max(
                    8,
                    Math.min(rect.left - menuW + 24, window.innerWidth - menuW - 8),
                  )
                  const y = Math.max(
                    8,
                    Math.min(rect.bottom + 4, window.innerHeight - menuH - 8),
                  )
                  setInsertObjectSearch('')
                  setShowInsertSettings(false)
                  setInsertObjectState((prev) =>
                    prev?.parentId === node.id
                      ? null
                      : { parentId: node.id, parentClassName: node.className, x, y },
                  )
                }}
                className={`size-3.5 rounded-full bg-[#d4d4d8]/75 hover:bg-white/95 text-[#141416] flex items-center justify-center border-none p-0 cursor-pointer shrink-0 transition-opacity ${
                  isSelected || isInsertTarget
                    ? 'opacity-100'
                    : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                <Plus className="size-2.5 stroke-[3]" />
              </button>
              <span className="flex-1" />
            </>
          )}
        </div>

        {activeDropPos === 'after' && (
          <div
            style={{ left: `${depth * 14 + 4}px` }}
            className="absolute bottom-0 right-1 h-[2px] bg-white rounded-full z-20 pointer-events-none"
          />
        )}

        {hasChildren && isExpanded && (
          <div className="flex flex-col">
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col border-b border-white/[0.08] overflow-hidden bg-transparent min-h-0">
      <div
        onPointerDown={onHeaderPointerDown}
        className="h-8 px-2.5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02] cursor-grab active:cursor-grabbing select-none"
      >
        <span className="text-[11px] font-bold text-white tracking-tight">Explorer</span>
        <div
          className="flex items-center gap-0.5"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="relative" ref={insertMenuRef}>
            <button
              onClick={() => setShowInsertMenu((v) => !v)}
              className={`size-5 rounded flex items-center justify-center border-none cursor-pointer transition-colors ${
                showInsertMenu ? 'bg-white/15 text-white' : 'hover:bg-white/[0.08] bg-transparent'
              }`}
              title="Insert Part into Workspace"
            >
              <Icons8Icon name="plus-math" filled={showInsertMenu} className="size-3" />
            </button>
            {showInsertMenu && (
              <div className="absolute right-0 top-6 w-32 bg-[#141416] border border-white/10 rounded-[6px] shadow-2xl p-1 z-50 flex flex-col gap-0.5">
                {(['Brick', 'Sphere', 'Wedge', 'Cylinder'] as const).map((shape) => (
                  <button
                    key={shape}
                    onClick={() => {
                      onInsertPart(shape)
                      setShowInsertMenu(false)
                    }}
                    className="w-full px-2.5 py-1.5 rounded-[4px] text-left text-white/80 hover:bg-white/[0.08] hover:text-white text-[11px] font-medium border-none bg-transparent cursor-pointer flex items-center gap-2 transition-colors"
                  >
                    <Box className="size-3 text-white/60" />
                    <span>{shape}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {onToggleFloat && (
            <button
              type="button"
              onClick={onToggleFloat}
              className="size-5 rounded flex items-center justify-center text-white/45 hover:text-white hover:bg-white/[0.08] border-none bg-transparent cursor-pointer transition-colors"
              title={isFloating ? 'Dock Explorer' : 'Undock Explorer'}
            >
              {isFloating ? <Minimize2 className="size-3" /> : <Maximize2 className="size-3" />}
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="size-5 rounded flex items-center justify-center text-white/45 hover:text-white hover:bg-white/[0.08] border-none bg-transparent cursor-pointer transition-colors"
              title="Close Explorer"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-1.5 border-b border-white/[0.06] bg-transparent">
        <div className="relative flex items-center">
          <Icons8Icon name="search" className="size-3 absolute left-2 pointer-events-none opacity-60" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Explorer..."
            className="w-full h-6 pl-7 pr-6 rounded-[4px] bg-black/40 border border-white/[0.08] text-white text-[10px] placeholder:text-white/30 focus:outline-none focus:border-white/25"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-1.5 border-none bg-transparent p-0 cursor-pointer opacity-60 hover:opacity-100 flex items-center"
              title="Clear Search"
            >
              <Icons8Icon name="delete-sign" className="size-2.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tree View */}
      <div className="flex-1 overflow-y-auto p-1 font-sans text-[11px] no-scrollbar">
        {rootChildren.map((node) => renderNode(node))}
      </div>

      {dragState?.active && (
        <div
          style={{ top: dragState.y + 10, left: dragState.x + 12 }}
          className="fixed z-50 pointer-events-none px-2.5 py-1 rounded-[6px] bg-[#141416]/95 border border-white/15 text-white text-[11px] font-medium shadow-2xl flex items-center gap-1.5"
        >
          {renderClassIcon(dragState.className, true)}
          <span>{dragState.name}</span>
        </div>
      )}

      {insertObjectState && (() => {
        const q = insertObjectSearch.trim().toLowerCase()
        const recommendedSet = onlyRecommended
          ? getRecommendedClasses(insertObjectState.parentClassName)
          : null

        const filteredCategories = INSERT_OBJECT_CATEGORIES.map((cat) => ({
          ...cat,
          items: cat.items.filter((item) => {
            if (recommendedSet && !recommendedSet.has(item.className)) return false
            if (!q) return true
            return (
              item.label.toLowerCase().includes(q) ||
              item.className.toLowerCase().includes(q)
            )
          }),
        })).filter((cat) => cat.items.length > 0)

        const firstMatch = filteredCategories[0]?.items[0]
        const popoverW = isColumnsView ? Math.min(820, window.innerWidth - 24) : 248
        const popoverLeft = Math.max(
          8,
          Math.min(insertObjectState.x - (isColumnsView ? popoverW - 248 : 0), window.innerWidth - popoverW - 8),
        )

        return (
          <div
            ref={insertObjectPopoverRef}
            style={{ top: insertObjectState.y, left: popoverLeft, width: popoverW }}
            className="fixed z-[90] bg-[#18191c]/92 backdrop-blur-md border border-white/15 rounded-[6px] shadow-2xl flex flex-col overflow-visible"
          >
            {/* Header Search Bar */}
            <div className="p-1.5 border-b border-white/[0.08] flex items-center gap-1.5 bg-[#1e1f23]/95 rounded-t-[6px] relative">
              <input
                ref={insertObjectSearchRef}
                type="text"
                value={insertObjectSearch}
                onChange={(e) => setInsertObjectSearch(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation()
                  if (e.key === 'Enter' && firstMatch) {
                    onInsertObject(
                      insertObjectState.parentId,
                      firstMatch.className,
                      selectAfterInsert,
                    )
                    setInsertObjectState(null)
                  } else if (e.key === 'Escape') {
                    if (showInsertSettings) setShowInsertSettings(false)
                    else setInsertObjectState(null)
                  }
                }}
                placeholder="Search object"
                className="flex-1 h-6 px-2 rounded-[3px] bg-[#111214] border border-white/25 focus:border-white/50 text-white text-[11px] placeholder:text-white/40 focus:outline-none"
              />
              <button
                type="button"
                title="Columns view"
                onClick={() => setIsColumnsView((v) => !v)}
                className={`size-5 rounded-[3px] flex items-center justify-center border-none cursor-pointer shrink-0 transition-colors ${
                  isColumnsView
                    ? 'bg-white/15 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.08] bg-transparent'
                }`}
              >
                <Columns2 className="size-3.5" />
              </button>
              <button
                type="button"
                title="Settings"
                onClick={() => setShowInsertSettings((v) => !v)}
                className={`size-5 rounded-[3px] flex items-center justify-center border-none cursor-pointer shrink-0 transition-colors ${
                  showInsertSettings
                    ? 'bg-white/15 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.08] bg-transparent'
                }`}
              >
                <MoreHorizontal className="size-3.5" />
              </button>

              {/* Settings Dropdown */}
              {showInsertSettings && (
                <div className="absolute right-1.5 top-8 w-[215px] bg-[#18191c] border border-white/15 rounded-[5px] shadow-2xl p-1 z-[100] flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => setSelectAfterInsert((v) => !v)}
                    className="w-full px-2 py-1.5 rounded-[4px] flex items-center gap-2 text-left text-[11px] text-white/90 hover:bg-white/[0.08] border-none bg-transparent cursor-pointer"
                  >
                    <span className="size-3.5 flex items-center justify-center shrink-0">
                      {selectAfterInsert && <Check className="size-3 text-white" />}
                    </span>
                    <span>Select object after insert</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOnlyRecommended((v) => !v)}
                    className="w-full px-2 py-1.5 rounded-[4px] flex items-center gap-2 text-left text-[11px] text-white/90 hover:bg-white/[0.08] border-none bg-transparent cursor-pointer"
                  >
                    <span className="size-3.5 flex items-center justify-center shrink-0">
                      {onlyRecommended && <Check className="size-3 text-white" />}
                    </span>
                    <span>Show only recommended objects</span>
                  </button>
                </div>
              )}
            </div>

            {/* Categorized Object List (Single Column or Columns View) */}
            <div
              className={
                isColumnsView
                  ? 'h-[372px] overflow-x-auto overflow-y-hidden p-2 columns-[165px] gap-3 no-scrollbar'
                  : 'max-h-[372px] overflow-y-auto p-1 flex flex-col gap-0.5 no-scrollbar'
              }
            >
              {filteredCategories.length === 0 ? (
                <div className="py-6 text-center text-[11px] text-white/40">No matching objects</div>
              ) : (
                filteredCategories.map((cat) => (
                  <div
                    key={cat.title}
                    className={isColumnsView ? 'break-inside-avoid-column mb-2' : 'flex flex-col'}
                  >
                    <div className="px-2 py-1 text-[11px] font-medium text-white/45 select-none">
                      {cat.title}
                    </div>
                    {cat.items.map((item) => (
                      <button
                        key={`${cat.title}-${item.className}`}
                        type="button"
                        onClick={() => {
                          onInsertObject(
                            insertObjectState.parentId,
                            item.className,
                            selectAfterInsert,
                          )
                          setInsertObjectState(null)
                        }}
                        className="w-full h-[24px] px-2.5 rounded-[4px] flex items-center gap-2 text-left text-[12px] text-white/90 hover:bg-white/[0.1] hover:text-white border-none bg-transparent cursor-pointer transition-colors"
                      >
                        {renderClassIcon(item.className, false, true)}
                        <span className="truncate">{item.label}</span>
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
