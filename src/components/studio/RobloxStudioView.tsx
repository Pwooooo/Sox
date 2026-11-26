import { useState, useEffect, useRef } from 'react'
import { WaveBackground } from '@/components/WaveBackground'
import { HexColorPicker } from './HexColorPicker'
import { ExplorerPanel } from './ExplorerPanel'
import { PropertiesPanel } from './PropertiesPanel'
import { TerrainEditorPanel } from './TerrainEditorPanel'
import { MaterialPickerPopup } from './MaterialPickerPopup'
import { UiCanvasOverlay } from './UiCanvasOverlay'
import { Icons8Icon } from './Icons8Icon'
import { NoveloCheckbox } from './NoveloCheckbox'
import { ScriptEditor } from './ScriptEditor'
import {
  NoveloViewport,
  createStarterWorld,
  createPartData,
  createScreenGuiData,
  createUiElementData,
  createInstanceData,
  createRigModelData,
  findInstanceById,
  removeInstanceById,
  reparentInstance,
  cloneInstanceTree,
  generateId,
  serializeNvlo,
  deserializeNvlo,
  type LightingPreset,
  type NvloClassName,
  type NvloDocument,
  type NvloInstanceData,
  type PartMaterial,
  type PartShape,
  type UiElementClass,
  type Vec3,
} from '@engine/index'
import {
  MousePointer,
  Move,
  Maximize2,
  RotateCw,
  Box,
  Mountain,
  User,
  Layout,
  Code2,
  Upload,
  Palette,
  Layers,
  Lock,
  Anchor,
  Play,
  Pause,
  Square,
  StepForward,
  Search,
  Filter,
  Plus,
  X,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Folder,
  ShoppingBag,
  Sparkles,
  Image as ImageIcon,
  Gamepad2,
  Plug,
  Volume2,
  Sliders,
  Globe,
  Camera,
  Sun,
  Shield,
  FileCode,
  Tv,
  RefreshCw,
  Minus,
  Maximize,
  Clock,
  Lightbulb,
  Share2,
  Coins,
  Check,
} from 'lucide-react'
import { PlayerModel3D } from '@/components/PlayerModel3D'

interface RobloxStudioViewProps {
  onClose?: () => void
  gameName?: string
  initialDoc?: NvloDocument
  onSaveDoc?: (doc: NvloDocument, thumbnail?: string) => void
  createViewport?: (container: HTMLElement, callbacks: any) => any
}

interface ExplorerNode {
  id: string
  name: string
  className: string
  icon: any
  iconColor: string
  children?: ExplorerNode[]
  properties?: Record<string, string | number | boolean>
}

const DEFAULT_EXPLORER_TREE: ExplorerNode[] = [
  {
    id: 'workspace',
    name: 'Workspace',
    className: 'Workspace',
    icon: Globe,
    iconColor: 'text-blue-400',
    children: [
      {
        id: 'cat_island',
        name: 'CatIsland',
        className: 'Model',
        icon: Box,
        iconColor: 'text-amber-400',
        properties: {
          Name: 'CatIsland',
          ClassName: 'Model',
          PrimaryPart: 'IslandBase',
          Position: '0, 50, 0',
          Scale: '1, 1, 1',
        },
        children: [
          {
            id: 'island_base',
            name: 'IslandBase',
            className: 'Part',
            icon: Box,
            iconColor: 'text-emerald-400',
            properties: {
              Name: 'IslandBase',
              ClassName: 'Part',
              Material: 'Grass',
              Color: '#34d399',
              Size: '240, 24, 160',
              Position: '0, 48, 0',
              Anchored: true,
              CanCollide: true,
            },
          },
          {
            id: 'temple_pavilion',
            name: 'ToriiShrinePavilion',
            className: 'Model',
            icon: Box,
            iconColor: 'text-rose-400',
            properties: {
              Name: 'ToriiShrinePavilion',
              ClassName: 'Model',
              Material: 'WoodPlanks',
              Color: '#dc2626',
              Position: '0, 62, -45',
              Anchored: true,
            },
          },
          {
            id: 'sakura_trees',
            name: 'SakuraGrove',
            className: 'Model',
            icon: Mountain,
            iconColor: 'text-pink-400',
            properties: {
              Name: 'SakuraGrove',
              ClassName: 'Model',
              TreeCount: 12,
              LeafColor: '#f472b6',
              BarkMaterial: 'Wood',
            },
          },
          {
            id: 'koi_pond',
            name: 'KoiPondBridge',
            className: 'Model',
            icon: Box,
            iconColor: 'text-cyan-400',
            properties: {
              Name: 'KoiPondBridge',
              ClassName: 'Model',
              WaterReflectance: 0.85,
              BridgeMaterial: 'RedLacquer',
            },
          },
          {
            id: 'arena_ring',
            name: 'ArenaRingPlatform',
            className: 'Part',
            icon: Box,
            iconColor: 'text-stone-300',
            properties: {
              Name: 'ArenaRingPlatform',
              ClassName: 'Part',
              Material: 'Cobblestone',
              Color: '#e5e7eb',
              Size: '64, 2, 64',
              Position: '0, 60, 0',
              Anchored: true,
            },
          },
        ],
      },
      {
        id: 'cat_dummy',
        name: 'Cat Dummy [M1 Test]',
        className: 'HumanoidModel',
        icon: User,
        iconColor: 'text-orange-400',
        properties: {
          Name: 'Cat Dummy [M1 Test]',
          ClassName: 'Model',
          Health: '100 / 100',
          MaxHealth: 100,
          WalkSpeed: 16,
          JumpPower: 50,
          RigType: 'R15 CatRig',
          Position: '0, 61, 0',
          Anchored: false,
        },
      },
      {
        id: 'spawn_location',
        name: 'SpawnLocation',
        className: 'SpawnLocation',
        icon: Box,
        iconColor: 'text-emerald-300',
        properties: {
          Name: 'SpawnLocation',
          ClassName: 'SpawnLocation',
          Neutral: true,
          Duration: 10,
          Position: '0, 60.5, 20',
          Size: '12, 1, 12',
          Anchored: true,
        },
      },
      {
        id: 'camera',
        name: 'Camera',
        className: 'Camera',
        icon: Camera,
        iconColor: 'text-indigo-400',
        properties: {
          Name: 'Camera',
          ClassName: 'Camera',
          CameraType: 'Custom',
          FieldOfView: 70,
          Position: '35, 80, 65',
        },
      },
      {
        id: 'terrain',
        name: 'Terrain',
        className: 'Terrain',
        icon: Mountain,
        iconColor: 'text-emerald-500',
        properties: {
          Name: 'Terrain',
          ClassName: 'Terrain',
          WaterWaveSize: 0.15,
          WaterWaveSpeed: 10,
          Decoration: true,
        },
      },
    ],
  },
  {
    id: 'players',
    name: 'Players',
    className: 'Players',
    icon: User,
    iconColor: 'text-sky-400',
    properties: {
      Name: 'Players',
      ClassName: 'Players',
      MaxPlayers: 16,
      RespawnTime: 5,
    },
  },
  {
    id: 'lighting',
    name: 'Lighting',
    className: 'Lighting',
    icon: Sun,
    iconColor: 'text-amber-300',
    properties: {
      Name: 'Lighting',
      ClassName: 'Lighting',
      TimeOfDay: '14:30:00',
      Ambient: '#808080',
      Brightness: 2.5,
      GlobalShadows: true,
      AtmosphereDensity: 0.3,
    },
  },
  {
    id: 'material_service',
    name: 'MaterialService',
    className: 'MaterialService',
    icon: Box,
    iconColor: 'text-purple-400',
  },
  {
    id: 'network_client',
    name: 'NetworkClient',
    className: 'NetworkClient',
    icon: Shield,
    iconColor: 'text-cyan-400',
  },
  {
    id: 'replicated_first',
    name: 'ReplicatedFirst',
    className: 'ReplicatedFirst',
    icon: Folder,
    iconColor: 'text-amber-500',
  },
  {
    id: 'replicated_storage',
    name: 'ReplicatedStorage',
    className: 'ReplicatedStorage',
    icon: Folder,
    iconColor: 'text-amber-400',
    children: [
      {
        id: 'cat_abilities',
        name: 'CatAbilities',
        className: 'Folder',
        icon: Folder,
        iconColor: 'text-amber-400',
      },
      {
        id: 'combat_remotes',
        name: 'CombatEvents',
        className: 'Folder',
        icon: Folder,
        iconColor: 'text-amber-400',
      },
    ],
  },
  {
    id: 'server_script_service',
    name: 'ServerScriptService',
    className: 'ServerScriptService',
    icon: FileCode,
    iconColor: 'text-green-400',
    children: [
      {
        id: 'round_manager',
        name: 'RoundManager',
        className: 'Script',
        icon: Code2,
        iconColor: 'text-green-400',
        properties: {
          Name: 'RoundManager',
          ClassName: 'Script',
          Enabled: true,
          RunContext: 'Legacy',
        },
      },
      {
        id: 'combat_controller',
        name: 'CombatHandler',
        className: 'Script',
        icon: Code2,
        iconColor: 'text-green-400',
        properties: {
          Name: 'CombatHandler',
          ClassName: 'Script',
          Enabled: true,
        },
      },
    ],
  },
  {
    id: 'server_storage',
    name: 'ServerStorage',
    className: 'ServerStorage',
    icon: Folder,
    iconColor: 'text-slate-400',
  },
  {
    id: 'starter_gui',
    name: 'StarterGui',
    className: 'StarterGui',
    icon: Tv,
    iconColor: 'text-pink-400',
    children: [
      {
        id: 'main_hud',
        name: 'CatBattlesHUD',
        className: 'ScreenGui',
        icon: Tv,
        iconColor: 'text-pink-400',
        properties: {
          Name: 'CatBattlesHUD',
          ClassName: 'ScreenGui',
          ResetOnSpawn: false,
          DisplayOrder: 1,
        },
      },
    ],
  },
  {
    id: 'starter_pack',
    name: 'StarterPack',
    className: 'StarterPack',
    icon: ShoppingBag,
    iconColor: 'text-blue-300',
  },
  {
    id: 'starter_player',
    name: 'StarterPlayer',
    className: 'StarterPlayer',
    icon: User,
    iconColor: 'text-violet-400',
  },
  {
    id: 'teams',
    name: 'Teams',
    className: 'Teams',
    icon: User,
    iconColor: 'text-emerald-400',
  },
  {
    id: 'sound_service',
    name: 'SoundService',
    className: 'SoundService',
    icon: Volume2,
    iconColor: 'text-amber-400',
  },
  {
    id: 'text_chat_service',
    name: 'TextChatService',
    className: 'TextChatService',
    icon: Code2,
    iconColor: 'text-sky-300',
  },
  {
    id: 'voice_chat_service',
    name: 'VoiceChatService',
    className: 'VoiceChatService',
    icon: Volume2,
    iconColor: 'text-indigo-400',
  },
]

export function RobloxStudioView({
  onClose,
  gameName = 'Cat Battles',
  initialDoc,
  onSaveDoc,
  createViewport,
}: RobloxStudioViewProps) {
  // Navigation & ribbon tab state
  const [activeRibbonTab, setActiveRibbonTab] = useState<'Home' | 'Avatar' | 'UI' | 'Script' | 'Model' | 'Plugins'>('Home')
  const [activeTool, setActiveTool] = useState<'select' | 'move' | 'scale' | 'rotate' | 'transform'>('select')

  // Docks visibility, docking & sizing
  const [showExplorer, setShowExplorer] = useState(true)
  const [showProperties, setShowProperties] = useState(true)
  const [explorerDock, setExplorerDock] = useState<'left' | 'right' | 'float'>('right')
  const [propertiesDock, setPropertiesDock] = useState<'left' | 'right' | 'float'>('right')
  const [leftDockWidth, setLeftDockWidth] = useState(320)
  const [rightDockWidth, setRightDockWidth] = useState(320)
  const [propertiesHeight, setPropertiesHeight] = useState(320)
  const [explorerFloatRect, setExplorerFloatRect] = useState({ x: 380, y: 140, w: 300, h: 420 })
  const [propertiesFloatRect, setPropertiesFloatRect] = useState({ x: 440, y: 200, w: 300, h: 360 })
  const [dockHoverSide, setDockHoverSide] = useState<'left' | 'right' | null>(null)
  const [panelDrag, setPanelDrag] = useState<
    | { type: 'resize-right'; startX: number; origW: number }
    | { type: 'resize-left'; startX: number; origW: number }
    | { type: 'resize-props'; startY: number; origH: number }
    | { type: 'resize-output'; startY: number; origH: number; wasOpen: boolean }
    | { type: 'move-float'; panel: 'explorer' | 'properties'; startX: number; startY: number; origX: number; origY: number }
    | { type: 'undock-drag'; panel: 'explorer' | 'properties'; startX: number; startY: number; active: boolean }
    | { type: 'resize-float'; panel: 'explorer' | 'properties'; startX: number; startY: number; origW: number; origH: number }
    | null
  >(null)

  const [showTerrainEditor, setShowTerrainEditor] = useState(false)
  const [cmdInput, setCmdInput] = useState('')
  const [showDiagnostics, setShowDiagnostics] = useState(false)
  const [outputHeight, setOutputHeight] = useState(160)
  const diagnosticsEndRef = useRef<HTMLDivElement>(null)
  const [diagnosticsLogs, setDiagnosticsLogs] = useState<
    { time: string; message: string; level?: 'info' | 'warn' | 'error' }[]
  >(() => {
    const t = new Date().toTimeString().slice(0, 8)
    return [
      { time: t, message: 'Session: the local server starts...', level: 'info' },
      { time: t, message: 'Created project: New Game Project', level: 'info' },
      { time: t, message: 'Session: the world is open.', level: 'info' },
    ]
  })
  const addDiagnostic = (message: string, level: 'info' | 'warn' | 'error' = 'info') => {
    const time = new Date().toTimeString().slice(0, 8)
    setDiagnosticsLogs((prev) => [...prev.slice(-199), { time, message, level }])
  }
  const addDiagnosticRef = useRef(addDiagnostic)
  addDiagnosticRef.current = addDiagnostic

  // Document tabs
  const [activeDocTab, setActiveDocTab] = useState<string>('viewport')
  const [openScriptIds, setOpenScriptIds] = useState<string[]>([])

  // Simulation / playtest state
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [roundTimer, setRoundTimer] = useState(15)
  const [coinCount, setCoinCount] = useState(80)
  const [dummyHealth, setDummyHealth] = useState(100)
  const [hitFeedback, setHitFeedback] = useState<string | null>(null)
  const [dashActive, setDashActive] = useState(false)

  // Explorer selection & properties
  const [selectedNodeId, setSelectedNodeId] = useState<string>('cat_dummy')
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    workspace: true,
    cat_island: true,
    replicated_storage: false,
    server_script_service: true,
    starter_gui: true,
  })
  const [explorerSearch, setExplorerSearch] = useState('')
  const [propertiesSearch, setPropertiesSearch] = useState('')

  // Snapping values
  const [geometricMode, setGeometricMode] = useState(true)

  // Part dropdown
  const [showPartDropdown, setShowPartDropdown] = useState(false)
  const [partMenuPos, setPartMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const partBtnRef = useRef<HTMLButtonElement>(null)

  // UI/GUI dropdown
  const [showUiDropdown, setShowUiDropdown] = useState(false)
  const [uiMenuPos, setUiMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const uiBtnRef = useRef<HTMLButtonElement>(null)
  const pngInputRef = useRef<HTMLInputElement>(null)

  // Character Generate Rig popup
  const [showCharacterPopup, setShowCharacterPopup] = useState(false)
  const [characterMenuPos, setCharacterMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const characterBtnRef = useRef<HTMLButtonElement>(null)

  // File menu dropdown
  const [showFileMenu, setShowFileMenu] = useState(false)
  const [fileMenuPos, setFileMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const fileBtnRef = useRef<HTMLButtonElement>(null)

  // Material picker dropdown
  const [showMaterialPicker, setShowMaterialPicker] = useState(false)
  const [activeMaterial, setActiveMaterial] = useState<PartMaterial>('Plastic')
  const [materialMenuPos, setMaterialMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const materialBtnRef = useRef<HTMLButtonElement>(null)

  // Color picker dropdown
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [activeColor, setActiveColor] = useState('#2b7fff')
  const [colorMenuPos, setColorMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const colorBtnRef = useRef<HTMLButtonElement>(null)

  // Part right-click context menu
  const [partContextMenu, setPartContextMenu] = useState<{ id: string; x: number; y: number } | null>(null)
  const heldControlKeysRef = useRef<Set<string>>(new Set())
  const heldMouseButtonsRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    const CONTROL_KEYS = new Set([
      'w',
      'a',
      's',
      'd',
      'q',
      'e',
      ' ',
      'shift',
      'control',
      'alt',
      'meta',
      'arrowup',
      'arrowdown',
      'arrowleft',
      'arrowright',
    ])
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (CONTROL_KEYS.has(k)) heldControlKeysRef.current.add(k)
    }
    const onKeyUp = (e: KeyboardEvent) => {
      heldControlKeysRef.current.delete(e.key.toLowerCase())
    }
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 2) heldMouseButtonsRef.current.add(e.button)
    }
    const onMouseUp = (e: MouseEvent) => {
      heldMouseButtonsRef.current.delete(e.button)
    }
    const onBlur = () => {
      heldControlKeysRef.current.clear()
      heldMouseButtonsRef.current.clear()
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [])
  const [showInsertSubmenu, setShowInsertSubmenu] = useState(false)
  const [clipboardPart, setClipboardPart] = useState<NvloInstanceData | null>(null)
  const [snapMoveEnabled, setSnapMoveEnabled] = useState(true)
  const [snapMoveStuds, setSnapMoveStuds] = useState(1)
  const [snapMoveDraft, setSnapMoveDraft] = useState('1')
  const [snapRotateEnabled, setSnapRotateEnabled] = useState(true)
  const [snapRotateDeg, setSnapRotateDeg] = useState(45)
  const [snapRotateDraft, setSnapRotateDraft] = useState('45')
  const [terrainRegionSize, setTerrainRegionSize] = useState<Vec3>([240, 64, 240])
  const [terrainRegionPos, setTerrainRegionPos] = useState<Vec3>([0, 0, 0])

  useEffect(() => {
    if (!showPartDropdown && !showUiDropdown && !showCharacterPopup && !showFileMenu && !showMaterialPicker && !showColorPicker && !partContextMenu) return
    const handleOutside = (e: MouseEvent) => {
      if (showPartDropdown && !(partBtnRef.current && partBtnRef.current.contains(e.target as Node))) {
        setShowPartDropdown(false)
      }
      if (showUiDropdown && !(uiBtnRef.current && uiBtnRef.current.contains(e.target as Node))) {
        setShowUiDropdown(false)
      }
      if (showCharacterPopup && !(characterBtnRef.current && characterBtnRef.current.contains(e.target as Node))) {
        setShowCharacterPopup(false)
      }
      if (showFileMenu && !(fileBtnRef.current && fileBtnRef.current.contains(e.target as Node))) {
        setShowFileMenu(false)
      }
      if (showMaterialPicker && !(materialBtnRef.current && materialBtnRef.current.contains(e.target as Node))) {
        setShowMaterialPicker(false)
      }
      if (showColorPicker && !(colorBtnRef.current && colorBtnRef.current.contains(e.target as Node))) {
        setShowColorPicker(false)
      }
      if (partContextMenu) {
        setPartContextMenu(null)
        setShowInsertSubmenu(false)
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowPartDropdown(false)
        setShowUiDropdown(false)
        setShowCharacterPopup(false)
        setShowFileMenu(false)
        setShowMaterialPicker(false)
        setShowColorPicker(false)
        setPartContextMenu(null)
        setShowInsertSubmenu(false)
      }
    }
    window.addEventListener('mousedown', handleOutside)
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('mousedown', handleOutside)
      window.removeEventListener('keydown', handleKey)
    }
  }, [showPartDropdown, showUiDropdown, showCharacterPopup, showFileMenu, showMaterialPicker, showColorPicker, partContextMenu])

  useEffect(() => {
    if (showDiagnostics) {
      diagnosticsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [diagnosticsLogs, showDiagnostics])

  useEffect(() => {
    if (!panelDrag) return
    const onMove = (e: PointerEvent) => {
      if (panelDrag.type === 'resize-right') {
        const dx = panelDrag.startX - e.clientX
        setRightDockWidth(Math.max(220, Math.min(560, panelDrag.origW + dx)))
      } else if (panelDrag.type === 'resize-left') {
        const dx = e.clientX - panelDrag.startX
        setLeftDockWidth(Math.max(220, Math.min(560, panelDrag.origW + dx)))
      } else if (panelDrag.type === 'resize-props') {
        const dy = panelDrag.startY - e.clientY
        setPropertiesHeight(Math.max(140, Math.min(620, panelDrag.origH + dy)))
      } else if (panelDrag.type === 'resize-output') {
        const dy = panelDrag.startY - e.clientY
        if (!panelDrag.wasOpen && dy > 16) {
          setShowDiagnostics(true)
          setOutputHeight(Math.max(90, Math.min(440, dy + 40)))
        } else if (panelDrag.wasOpen) {
          const nextH = panelDrag.origH + dy
          if (nextH < 48) {
            setShowDiagnostics(false)
          } else {
            setOutputHeight(Math.max(80, Math.min(440, nextH)))
          }
        }
      } else if (panelDrag.type === 'undock-drag') {
        if (!panelDrag.active && Math.hypot(e.clientX - panelDrag.startX, e.clientY - panelDrag.startY) > 10) {
          const x = Math.max(12, Math.min(window.innerWidth - 312, e.clientX - 150))
          const y = Math.max(48, Math.min(window.innerHeight - 240, e.clientY - 14))
          if (panelDrag.panel === 'explorer') {
            setExplorerDock('float')
            setExplorerFloatRect((r) => ({ ...r, x, y }))
          } else {
            setPropertiesDock('float')
            setPropertiesFloatRect((r) => ({ ...r, x, y }))
          }
          setPanelDrag({
            type: 'move-float',
            panel: panelDrag.panel,
            startX: e.clientX,
            startY: e.clientY,
            origX: x,
            origY: y,
          })
        }
      } else if (panelDrag.type === 'move-float') {
        const nx = Math.max(8, Math.min(window.innerWidth - 120, panelDrag.origX + (e.clientX - panelDrag.startX)))
        const ny = Math.max(40, Math.min(window.innerHeight - 80, panelDrag.origY + (e.clientY - panelDrag.startY)))
        if (panelDrag.panel === 'explorer') {
          setExplorerFloatRect((r) => ({ ...r, x: nx, y: ny }))
        } else {
          setPropertiesFloatRect((r) => ({ ...r, x: nx, y: ny }))
        }
        if (e.clientX < 90) setDockHoverSide('left')
        else if (e.clientX > window.innerWidth - 90) setDockHoverSide('right')
        else setDockHoverSide(null)
      } else if (panelDrag.type === 'resize-float') {
        const nw = Math.max(220, Math.min(640, panelDrag.origW + (e.clientX - panelDrag.startX)))
        const nh = Math.max(180, Math.min(720, panelDrag.origH + (e.clientY - panelDrag.startY)))
        if (panelDrag.panel === 'explorer') {
          setExplorerFloatRect((r) => ({ ...r, w: nw, h: nh }))
        } else {
          setPropertiesFloatRect((r) => ({ ...r, w: nw, h: nh }))
        }
      }
    }
    const onUp = () => {
      if (panelDrag.type === 'move-float' && dockHoverSide) {
        if (panelDrag.panel === 'explorer') setExplorerDock(dockHoverSide)
        else setPropertiesDock(dockHoverSide)
      }
      setDockHoverSide(null)
      setPanelDrag(null)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [panelDrag, dockHoverSide])

  // Novelo Built-in 3D Engine state
  const [nvloDoc, setNvloDoc] = useState<NvloDocument>(
    () => initialDoc ?? createStarterWorld(gameName),
  )
  const nvloDocRef = useRef(nvloDoc)
  nvloDocRef.current = nvloDoc
  const onSaveDocRef = useRef(onSaveDoc)
  onSaveDocRef.current = onSaveDoc
  const [backendRunning, setBackendRunning] = useState(true)
  const [backendFps, setBackendFps] = useState<number>(60)
  const [backendObjects, setBackendObjects] = useState<number>(0)
  const [engineLogs, setEngineLogs] = useState<string[]>([])
  const viewportRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<NoveloViewport | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const dispatchEngineAction = async (action: string, payload: Record<string, any> = {}) => {
    const engine = engineRef.current
    if (!engine) return null
    switch (action) {
      case 'play':
        engine.startPlay()
        break
      case 'stop':
        engine.stopPlay()
        break
      case 'spawn_part':
        handleSpawnPart((payload.shape as PartShape) || 'Brick')
        break
      case 'toggle_anchored':
        handleToggleAnchored()
        break
      case 'focus':
        engine.focusSelected()
        break
    }
    return { ok: true }
  }

  useEffect(() => {
    const el = viewportRef.current
    if (!el || activeDocTab !== 'viewport') return

    const callbacks = {
      onSelect: (id: string | null) => {
        setSelectedNodeId(id ?? '')
      },
      onTransformCommit: (id: string, pos: any, rot: any, size: any) => {
        setNvloDoc((prev) => {
          const next = { ...prev, root: cloneInstanceTree(prev.root) }
          const inst = findInstanceById(next.root, id)
          if (inst) {
            inst.properties.Position = pos
            inst.properties.Rotation = rot
            inst.properties.Size = size
          }
          return next
        })
      },
      onMetrics: (fps: number, partCount: number) => {
        setBackendFps(fps)
        setBackendObjects(partCount)
      },
      onLog: (msg: string, level?: 'info' | 'warn' | 'error') => {
        setEngineLogs((prev) => [...prev.slice(-30), msg])
        addDiagnosticRef.current(msg, level || 'info')
      },
      onContextMenu: (id: string, clientX: number, clientY: number) => {
        if (heldControlKeysRef.current.size > 0 || heldMouseButtonsRef.current.size > 0) return
        const x = Math.min(clientX, window.innerWidth - 220)
        const y = Math.min(clientY, window.innerHeight - 310)
        setShowInsertSubmenu(false)
        setPartContextMenu({ id, x: Math.max(8, x), y: Math.max(8, y) })
      },
      onTerrainRegionChange: (newSize: any, newPos: any) => {
        setTerrainRegionSize(newSize)
        setTerrainRegionPos(newPos)
      },
    }

    const viewport = createViewport ? createViewport(el, callbacks) : new NoveloViewport(el, callbacks)

    engineRef.current = viewport
    viewport.loadDocument(nvloDoc)
    setBackendRunning(true)

    const thumbTimer = setTimeout(() => {
      const thumb = viewport.captureThumbnail()
      if (thumb) {
        onSaveDocRef.current?.(nvloDocRef.current, thumb)
      }
    }, 600)

    return () => {
      clearTimeout(thumbTimer)
      viewport.dispose()
      engineRef.current = null
    }
  }, [activeDocTab])

  useEffect(() => {
    const tool = activeTool === 'transform' ? 'move' : activeTool
    engineRef.current?.setTool(tool)
  }, [activeTool])

  useEffect(() => {
    engineRef.current?.setSnapping(geometricMode, 1, 45)
  }, [geometricMode])

  const handleDeleteSelected = () => {
    if (isPlaying || !selectedNodeId) return
    const protectedIds = new Set([
      'world',
      'workspace',
      'lighting',
      'server_script_service',
      'replicated_storage',
      'starter_gui',
      'starter_pack',
      'starter_player',
      'teams',
      'sound_service',
    ])
    if (protectedIds.has(selectedNodeId)) return

    setNvloDoc((prev) => {
      const target = findInstanceById(prev.root, selectedNodeId)
      if (
        !target ||
        target.className === 'World' ||
        target.className === 'Workspace' ||
        target.className === 'Lighting' ||
        target.className === 'ServerScriptService' ||
        target.className === 'ReplicatedStorage' ||
        target.className === 'StarterGui'
      ) {
        return prev
      }
      const next = { ...prev, root: cloneInstanceTree(prev.root) }
      if (removeInstanceById(next.root, selectedNodeId)) {
        engineRef.current?.removePart(selectedNodeId)
        setSelectedNodeId('')
        return next
      }
      return prev
    })
  }

  const handleCopySelected = () => {
    if (isPlaying || !selectedNodeId) return
    const target = findInstanceById(nvloDoc.root, selectedNodeId)
    if (!target || (target.className !== 'Part' && target.className !== 'SpawnLocation')) return
    setClipboardPart(cloneInstanceTree(target))
  }

  const handleCutSelected = () => {
    handleCopySelected()
    handleDeleteSelected()
  }

  const spawnClonedPart = (source: NvloInstanceData, offset: Vec3 = [2, 0, 2]) => {
    const cloned = cloneInstanceTree(source)
    cloned.id = generateId('part')
    const pos = (cloned.properties.Position as Vec3) || [0, 2, 0]
    cloned.properties.Position = [pos[0] + offset[0], pos[1] + offset[1], pos[2] + offset[2]]
    setNvloDoc((prev) => {
      const next = { ...prev, root: cloneInstanceTree(prev.root) }
      const ws = findInstanceById(next.root, 'workspace')
      ws?.children.push(cloned)
      return next
    })
    engineRef.current?.syncPart(cloned)
    engineRef.current?.selectInstance(cloned.id)
    setSelectedNodeId(cloned.id)
    setExpandedNodes((prev) => ({ ...prev, workspace: true }))
  }

  const handlePastePart = () => {
    if (isPlaying || !clipboardPart) return
    spawnClonedPart(clipboardPart, [2, 0, 2])
  }

  const handleDuplicateSelected = () => {
    if (isPlaying || !selectedNodeId) return
    const target = findInstanceById(nvloDoc.root, selectedNodeId)
    if (!target || (target.className !== 'Part' && target.className !== 'SpawnLocation')) return
    spawnClonedPart(target, [2, 0, 2])
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null
      const tag = activeEl?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || activeEl?.isContentEditable) return
      if (isPlaying) return

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        handleDeleteSelected()
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        e.preventDefault()
        handleCopySelected()
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'x') {
        e.preventDefault()
        handleCutSelected()
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        e.preventDefault()
        handlePastePart()
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        handleDuplicateSelected()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedNodeId, isPlaying, nvloDoc, clipboardPart])

  const handleSpawnPart = (shape: PartShape = 'Brick') => {
    const newPart = createPartData(
      `${shape}`,
      shape,
      [Math.round((Math.random() - 0.5) * 10), 4, Math.round((Math.random() - 0.5) * 10)],
      [4, 2, 4],
      '#2b7fff',
      'Plastic',
    )
    setNvloDoc((prev) => {
      const next = { ...prev, root: cloneInstanceTree(prev.root) }
      const ws = findInstanceById(next.root, 'workspace')
      ws?.children.push(newPart)
      return next
    })
    engineRef.current?.syncPart(newPart)
    engineRef.current?.selectInstance(newPart.id)
    setSelectedNodeId(newPart.id)
    setExpandedNodes((prev) => ({ ...prev, workspace: true }))
    addDiagnostic(`Inserted ${shape} into Workspace`)
  }

  const openScriptTab = (scriptId: string) => {
    setOpenScriptIds((prev) => (prev.includes(scriptId) ? prev : [...prev, scriptId]))
    setActiveDocTab(scriptId)
    setSelectedNodeId(scriptId)
  }

  const handleCreateAndOpenScript = () => {
    if (
      activeNode &&
      (activeNode.className === 'Script' ||
        activeNode.className === 'LocalScript' ||
        activeNode.className === 'ModuleScript')
    ) {
      openScriptTab(activeNode.id)
      return
    }
    const newScript = createInstanceData('Script')
    setNvloDoc((prev) => {
      const next = { ...prev, root: cloneInstanceTree(prev.root) }
      const sss = findInstanceById(next.root, 'server_script_service')
      sss?.children.push(newScript)
      return next
    })
    setExpandedNodes((prev) => ({ ...prev, server_script_service: true }))
    openScriptTab(newScript.id)
    addDiagnostic(`Created ${newScript.name} in ServerScriptService`)
  }

  const handleUpdateScriptSource = (id: string, nextSource: string) => {
    setNvloDoc((prev) => {
      const next = { ...prev, root: cloneInstanceTree(prev.root) }
      const inst = findInstanceById(next.root, id)
      if (inst) {
        inst.properties.Source = nextSource
      }
      return next
    })
  }

  const handleInsertObject = (parentId: string, className: NvloClassName, selectAfter = true) => {
    const newInst = createInstanceData(className)
    setNvloDoc((prev) => {
      const next = { ...prev, root: cloneInstanceTree(prev.root) }
      const parent = findInstanceById(next.root, parentId)
      if (!parent) return prev
      parent.children.push(newInst)
      return next
    })
    if (className === 'Part' || className === 'SpawnLocation' || className === 'MeshPart') {
      engineRef.current?.syncPart(newInst)
    }
    if (selectAfter) {
      engineRef.current?.selectInstance(newInst.id)
      setSelectedNodeId(newInst.id)
    }
    setExpandedNodes((prev) => ({ ...prev, [parentId]: true }))
    addDiagnostic(`Inserted ${className}`)
  }

  const handleSpawnRig = (preset: string) => {
    const rigModel = createRigModelData(preset, 'R15', 'Masculine')
    setNvloDoc((prev) => {
      const next = { ...prev, root: cloneInstanceTree(prev.root) }
      const ws = findInstanceById(next.root, 'workspace')
      ws?.children.push(rigModel)
      return next
    })
    engineRef.current?.syncRigModel(rigModel)
    engineRef.current?.selectInstance(rigModel.id)
    setSelectedNodeId(rigModel.id)
    setExpandedNodes((prev) => ({ ...prev, workspace: true, [rigModel.id]: true }))
    setShowCharacterPopup(false)
    addDiagnostic(`Generated Rig: ${preset} (${rigModel.name})`)
  }

  const handleToggleAnchored = () => {
    setNvloDoc((prev) => {
      const next = { ...prev, root: cloneInstanceTree(prev.root) }
      const inst = findInstanceById(next.root, selectedNodeId)
      if (inst) {
        inst.properties.Anchored = !Boolean(inst.properties.Anchored)
        engineRef.current?.syncPart(inst)
      }
      return next
    })
  }

  const handleUpdateProperty = (key: string, rawVal: string | boolean | number | Vec3) => {
    setNvloDoc((prev) => {
      const next = { ...prev, root: cloneInstanceTree(prev.root) }
      const inst = findInstanceById(next.root, selectedNodeId)
      if (!inst) return prev

      if (typeof rawVal === 'boolean' || typeof rawVal === 'number') {
        inst.properties[key] = rawVal
      } else if (Array.isArray(rawVal)) {
        inst.properties[key] = rawVal
      } else if (key === 'Position' || key === 'Rotation' || key === 'Size') {
        const parts = rawVal.split(',').map((n) => parseFloat(n.trim()))
        if (parts.length === 3 && parts.every((n) => !Number.isNaN(n))) {
          inst.properties[key] = parts as Vec3
        }
      } else if (key === 'Transparency' || key === 'BackgroundTransparency') {
        const num = parseFloat(rawVal)
        if (!Number.isNaN(num)) inst.properties[key] = Math.max(0, Math.min(1, num))
      } else if (
        key === 'PositionX' ||
        key === 'PositionY' ||
        key === 'Width' ||
        key === 'Height' ||
        key === 'CornerRadius' ||
        key === 'FontSize'
      ) {
        const num = parseFloat(rawVal)
        if (!Number.isNaN(num)) inst.properties[key] = num
      } else {
        inst.properties[key] = rawVal
        if (key === 'Name') inst.name = rawVal
      }

      if (inst.className === 'Part' || inst.className === 'SpawnLocation') {
        engineRef.current?.syncPart(inst)
      } else if (inst.className === 'Model' && typeof inst.properties?.RigModelUrl === 'string') {
        engineRef.current?.syncRigModel(inst)
      }
      return next
    })
  }

  const handleSpawnScreenGui = () => {
    const sg = createScreenGuiData()
    setNvloDoc((prev) => {
      const next = { ...prev, root: cloneInstanceTree(prev.root) }
      const gui = findInstanceById(next.root, 'starter_gui')
      gui?.children.push(sg)
      return next
    })
    setSelectedNodeId(sg.id)
    setExpandedNodes((prev) => ({ ...prev, starter_gui: true, [sg.id]: true }))
  }

  const handleSpawnUiElement = (cls: UiElementClass) => {
    const el = createUiElementData(cls)
    let expandScreenGuiId = ''
    setNvloDoc((prev) => {
      const next = { ...prev, root: cloneInstanceTree(prev.root) }
      const gui = findInstanceById(next.root, 'starter_gui')
      if (!gui) return prev

      // Use selected ScreenGui, parent ScreenGui of selected UI element, or first ScreenGui in StarterGui
      let targetScreenGui = gui.children.find((c) => c.id === selectedNodeId && c.className === 'ScreenGui')
      if (!targetScreenGui) {
        targetScreenGui = gui.children.find(
          (c) => c.className === 'ScreenGui' && c.children?.some((child) => child.id === selectedNodeId),
        )
      }
      if (!targetScreenGui) {
        targetScreenGui = gui.children.find((c) => c.className === 'ScreenGui')
      }
      if (!targetScreenGui) {
        targetScreenGui = createScreenGuiData()
        gui.children.push(targetScreenGui)
      }
      expandScreenGuiId = targetScreenGui.id
      targetScreenGui.children.push(el)
      return next
    })
    setSelectedNodeId(el.id)
    setExpandedNodes((prev) => ({
      ...prev,
      starter_gui: true,
      ...(expandScreenGuiId ? { [expandScreenGuiId]: true } : {}),
    }))
  }

  const handleUpdateUiLayout = (id: string, updates: Record<string, number>) => {
    setNvloDoc((prev) => {
      const next = { ...prev, root: cloneInstanceTree(prev.root) }
      const inst = findInstanceById(next.root, id)
      if (!inst) return prev
      Object.entries(updates).forEach(([k, v]) => {
        inst.properties[k] = v
      })
      return next
    })
  }

  const handleRenameInstance = (id: string, newName: string) => {
    setNvloDoc((prev) => {
      const next = { ...prev, root: cloneInstanceTree(prev.root) }
      const inst = findInstanceById(next.root, id)
      if (!inst) return prev
      inst.name = newName
      inst.properties.Name = newName
      return next
    })
  }

  const handleReparentInstance = (
    childId: string,
    targetId: string,
    position: 'inside' | 'before' | 'after' = 'inside',
  ) => {
    setNvloDoc((prev) => {
      const next = { ...prev, root: cloneInstanceTree(prev.root) }
      if (!reparentInstance(next.root, childId, targetId, position)) return prev
      engineRef.current?.loadDocument(next)
      return next
    })
    if (position === 'inside') {
      setExpandedNodes((prev) => ({ ...prev, [targetId]: true }))
    }
  }

  const handleLightingPresetChange = (preset: LightingPreset) => {
    engineRef.current?.setLightingPreset(preset)
    setNvloDoc((prev) => ({
      ...prev,
      lighting: { ...prev.lighting, preset },
    }))
  }

  const handleNewProject = () => {
    const fresh = createStarterWorld(gameName)
    setNvloDoc(fresh)
    engineRef.current?.loadDocument(fresh)
    setSelectedNodeId('workspace')
    addDiagnostic(`Created project: ${gameName}`)
  }

  const handleSaveNvlo = () => {
    if (onSaveDoc) {
      const thumb = engineRef.current?.captureThumbnail() || undefined
      onSaveDoc(nvloDoc, thumb)
      addDiagnostic(`Saved project: ${nvloDoc.metadata.name || gameName}`)
      return
    }
    const content = serializeNvlo(nvloDoc)
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(nvloDoc.metadata.name || 'world').replace(/\s+/g, '_')}.nvlo`
    a.click()
    URL.revokeObjectURL(url)
    addDiagnostic(`Saved project: ${nvloDoc.metadata.name || 'world'}.nvlo`)
  }

  const handleOpenNvlo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const loaded = deserializeNvlo(String(reader.result))
        setNvloDoc(loaded)
        engineRef.current?.loadDocument(loaded)
      } catch (err) {
        console.error(err)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  // Timer countdown during test simulation
  useEffect(() => {
    if (!isPlaying || isPaused) return
    const interval = setInterval(() => {
      setRoundTimer((prev) => {
        if (prev <= 1) {
          return 15
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isPlaying, isPaused])

  // Tauri window controls
  const handleMinimize = async () => {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window')
      await getCurrentWindow().minimize()
    } catch (e) {
      console.error(e)
    }
  }

  const handleMaximize = async () => {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window')
      await getCurrentWindow().toggleMaximize()
    } catch (e) {
      console.error(e)
    }
  }

  const handleClose = async () => {
    if (onClose) {
      onClose()
      return
    }
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window')
      await getCurrentWindow().close()
    } catch (e) {
      console.error(e)
    }
  }

  // Find node by ID
  const findNode = (nodes: ExplorerNode[], id: string): ExplorerNode | null => {
    for (const n of nodes) {
      if (n.id === id) return n
      if (n.children) {
        const found = findNode(n.children, id)
        if (found) return found
      }
    }
    return null
  }

  const getInstanceGamePath = (root: NvloInstanceData, targetId: string): string => {
    const findChain = (node: NvloInstanceData): NvloInstanceData[] | null => {
      if (node.id === targetId) return [node]
      for (const c of node.children || []) {
        const sub = findChain(c)
        if (sub) return [node, ...sub]
      }
      return null
    }
    const chain = findChain(root)
    if (!chain || chain.length === 0) return 'game'
    // Skip root 'World' node and prefix with 'game'
    const parts = chain.slice(1).map((n) =>
      /^[A-Za-z_][A-Za-z0-9_]*$/.test(n.name) ? `.${n.name}` : `[${JSON.stringify(n.name)}]`,
    )
    return `game${parts.join('')}`
  }

  const activeNode = selectedNodeId ? findInstanceById(nvloDoc.root, selectedNodeId) : null

  const toggleNodeExpanded = (id: string) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const getIconForClass = (cls: string) => {
    switch (cls) {
      case 'Workspace': return { icon: Globe, color: 'text-blue-400' }
      case 'Lighting': return { icon: Sun, color: 'text-yellow-300' }
      case 'ServerScriptService': return { icon: Code2, color: 'text-emerald-400' }
      case 'StarterGui': return { icon: Layout, color: 'text-pink-400' }
      case 'ReplicatedStorage': return { icon: Folder, color: 'text-indigo-400' }
      case 'SpawnLocation': return { icon: Sparkles, color: 'text-[#2b7fff]' }
      case 'Script': return { icon: FileCode, color: 'text-emerald-400' }
      default: return { icon: Box, color: 'text-sky-400' }
    }
  }

  // Render Explorer Tree item from live NvloDocument
  const renderExplorerTree = (node: NvloInstanceData, depth = 0) => {
    const isExpanded = !!expandedNodes[node.id]
    const hasChildren = node.children && node.children.length > 0
    const isSelected = selectedNodeId === node.id

    if (explorerSearch && !node.name.toLowerCase().includes(explorerSearch.toLowerCase()) && !hasChildren) {
      return null
    }

    const { icon: NodeIcon, color: iconColor } = getIconForClass(node.className)

    return (
      <div key={node.id} className="flex flex-col select-none">
        <div
          onClick={() => {
            setSelectedNodeId(node.id)
            engineRef.current?.selectInstance(node.id)
          }}
          onContextMenu={(e) => {
            if (node.className !== 'Part' && node.className !== 'SpawnLocation') return
            e.preventDefault()
            setSelectedNodeId(node.id)
            engineRef.current?.selectInstance(node.id)
            const x = Math.min(e.clientX, window.innerWidth - 220)
            const y = Math.min(e.clientY, window.innerHeight - 310)
            setShowInsertSubmenu(false)
            setPartContextMenu({ id: node.id, x: Math.max(8, x), y: Math.max(8, y) })
          }}
          className={`h-[22px] px-1 flex items-center gap-1 cursor-pointer text-[11px] rounded-[3px] transition-colors border-none ${
            isSelected
              ? 'bg-white/10 text-white font-medium'
              : 'hover:bg-white/[0.06] text-[#cccccc]'
          }`}
          style={{ paddingLeft: `${depth * 14 + 4}px` }}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleNodeExpanded(node.id)
              }}
              className="size-3.5 flex items-center justify-center text-white/50 hover:text-white border-none bg-transparent p-0 cursor-pointer"
            >
              {isExpanded ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
            </button>
          ) : (
            <span className="w-3.5" />
          )}

          <NodeIcon className={`size-3.5 shrink-0 ${isSelected ? 'text-white' : iconColor}`} />
          <span className="truncate">{node.name}</span>
        </div>

        {hasChildren && isExpanded && (
          <div className="flex flex-col">
            {node.children!.map((child) => renderExplorerTree(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="fixed inset-0 z-50 bg-[#0a0a0a] text-[#e0e0e0] flex flex-col overflow-hidden font-sans select-none text-xs"
    >
      <WaveBackground />
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP STUDIO HEADER / WINDOW BAR                             */}
      {/* ------------------------------------------------------------- */}
      <div
        data-tauri-drag-region
        className="relative z-10 h-10 bg-[#0a0a0a]/35 border-b border-white/[0.08] flex items-center justify-between px-3 shrink-0"
      >
        {/* Left: File + Home */}
        <div className="flex items-center gap-2 flex-1">
          <button
            ref={fileBtnRef}
            onClick={() => {
              if (!showFileMenu && fileBtnRef.current) {
                const rect = fileBtnRef.current.getBoundingClientRect()
                setFileMenuPos({ top: rect.bottom + 4, left: rect.left })
              }
              setShowFileMenu((v) => !v)
            }}
            className={`h-7 px-2.5 rounded-[5px] text-[11px] font-medium border-none cursor-pointer transition-colors ${
              showFileMenu
                ? 'bg-white/10 text-white font-semibold'
                : 'bg-transparent text-[#9ca3af] hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            File
          </button>
          <button
            onClick={() => {
              setActiveRibbonTab('Home')
              setActiveDocTab('viewport')
            }}
            className={`h-7 px-2.5 rounded-[5px] text-[11px] font-medium border-none cursor-pointer transition-colors ${
              activeRibbonTab === 'Home'
                ? 'bg-white/10 text-white font-semibold'
                : 'bg-transparent text-[#9ca3af] hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            Home
          </button>
        </div>

        {/* Center: Play / Simulation controls */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-0.5">
            <button
              onClick={(e) => {
                e.currentTarget.blur()
                const nextPlaying = !isPlaying
                setIsPlaying(nextPlaying)
                setIsPaused(false)
                dispatchEngineAction(nextPlaying ? 'play' : 'stop')
              }}
              className={`h-6.5 px-2.5 rounded-[5px] font-bold text-[11px] flex items-center gap-1.5 cursor-pointer border-none transition-all duration-200 ${
                isPlaying
                  ? 'bg-rose-600/80 hover:bg-rose-600 text-white'
                  : 'bg-transparent hover:bg-white/[0.08] text-white'
              }`}
              title={isPlaying ? 'Stop Test' : 'Play / Test Game'}
            >
              {isPlaying ? (
                <>
                  <Icons8Icon name="stop" filled className="size-3" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Icons8Icon name="play" filled dark={false} className="size-3" />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              onClick={(e) => {
                e.currentTarget.blur()
                const nextPaused = !isPaused
                setIsPaused(nextPaused)
                engineRef.current?.setPaused(nextPaused)
                addDiagnostic(nextPaused ? 'Simulation paused.' : 'Simulation resumed.')
              }}
              disabled={!isPlaying}
              className={`size-6.5 flex items-center justify-center rounded-[5px] border-none cursor-pointer transition-colors ${
                isPaused
                  ? 'bg-white/15 text-white'
                  : 'bg-transparent text-white/60 hover:text-white hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed'
              }`}
              title={isPaused ? 'Resume Simulation' : 'Pause Simulation'}
            >
              <Icons8Icon name="pause" filled={isPaused} className="size-3" />
            </button>

            <button
              onClick={(e) => {
                e.currentTarget.blur()
                engineRef.current?.stepFrame()
              }}
              disabled={!isPlaying || !isPaused}
              className="size-6.5 flex items-center justify-center rounded-[5px] border-none bg-transparent text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Step Frame"
            >
              <StepForward className="size-3" />
            </button>
          </div>
        </div>

        {/* Right: Profile & Window Controls */}
        <div className="flex items-center justify-end gap-2 flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept=".nvlo"
            className="hidden"
            onChange={handleOpenNvlo}
          />
          <input
            ref={pngInputRef}
            type="file"
            accept="image/png,image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              const reader = new FileReader()
              reader.onload = () => {
                if (typeof reader.result !== 'string') return
                const dataUrl = reader.result
                const current = selectedNodeId ? findInstanceById(nvloDoc.root, selectedNodeId) : null
                if (current && current.className === 'ImageLabel') {
                  handleUpdateProperty('ImageUrl', dataUrl)
                } else {
                  const el = createUiElementData('ImageLabel', file.name.replace(/\.[^.]+$/, ''))
                  el.properties.ImageUrl = dataUrl
                  let expandScreenGuiId = ''
                  setNvloDoc((prev) => {
                    const next = { ...prev, root: cloneInstanceTree(prev.root) }
                    const gui = findInstanceById(next.root, 'starter_gui')
                    if (!gui) return prev
                    let targetScreenGui = gui.children.find((c) => c.className === 'ScreenGui')
                    if (!targetScreenGui) {
                      targetScreenGui = createScreenGuiData()
                      gui.children.push(targetScreenGui)
                    }
                    expandScreenGuiId = targetScreenGui.id
                    targetScreenGui.children.push(el)
                    return next
                  })
                  setSelectedNodeId(el.id)
                  setExpandedNodes((prev) => ({
                    ...prev,
                    starter_gui: true,
                    ...(expandScreenGuiId ? { [expandScreenGuiId]: true } : {}),
                  }))
                }
              }
              reader.readAsDataURL(file)
              e.target.value = ''
            }}
          />

          {/* Profile Circle */}
          <div className="relative size-7 rounded-full bg-[#1a1a1f] border border-white/10 overflow-hidden shrink-0 shadow-xs cursor-pointer">
            <PlayerModel3D mode="headshot" className="w-full h-full" />
          </div>

          <button className="size-7 rounded-[6px] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.06] border-none bg-transparent cursor-pointer">
            <Share2 className="size-3.5" />
          </button>

          {/* Native Tauri Window Controls */}
          <div className="flex items-center ml-1 border-l border-white/10 pl-1.5">
            <button
              onClick={handleMinimize}
              className="size-7 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.08] rounded-[5px] border-none bg-transparent cursor-pointer transition-colors"
              title="Minimize"
            >
              <Minus className="size-3.5" />
            </button>
            <button
              onClick={handleMaximize}
              className="size-7 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.08] rounded-[5px] border-none bg-transparent cursor-pointer transition-colors"
              title="Maximize"
            >
              <Maximize className="size-3" />
            </button>
            <button
              onClick={handleClose}
              className="size-7 flex items-center justify-center text-white/60 hover:text-white hover:bg-rose-600 rounded-[5px] border-none bg-transparent cursor-pointer transition-colors"
              title="Close"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. MODERN RIBBON TOOLBAR                                      */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 h-14 bg-[#0a0a0a]/35 border-b border-white/[0.08] flex items-center px-3 gap-2.5 overflow-x-auto no-scrollbar shrink-0">
        {activeRibbonTab === 'UI' ? (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleSpawnScreenGui}
              className="h-11 px-2.5 rounded-[5px] flex flex-col items-center justify-center gap-1 text-[#9ca3af] hover:text-white hover:bg-white/[0.06] border-none bg-transparent cursor-pointer transition-colors"
              title="Insert invisible ScreenGui container into StarterGui"
            >
              <Icons8Icon name="web-design" className="size-4" />
              <span className="text-[10px]">ScreenGui</span>
            </button>

            {(
              [
                { cls: 'Frame', label: 'Frame', icon: 'box' },
                { cls: 'TextLabel', label: 'TextLabel', icon: 'list' },
                { cls: 'TextButton', label: 'TextButton', icon: 'cursor' },
                { cls: 'ImageLabel', label: 'ImageLabel', icon: 'template' },
              ] as const
            ).map((item) => (
              <button
                key={item.cls}
                onClick={() => handleSpawnUiElement(item.cls)}
                className="h-11 px-2.5 rounded-[5px] flex flex-col items-center justify-center gap-1 text-[#9ca3af] hover:text-white hover:bg-white/[0.06] border-none bg-transparent cursor-pointer transition-colors"
                title={`Insert ${item.label} into StarterGui`}
              >
                <Icons8Icon name={item.icon} className="size-4" />
                <span className="text-[10px]">{item.label}</span>
              </button>
            ))}

            <div className="h-9 w-px bg-white/[0.08] mx-1 shrink-0" />

            <button
              onClick={() => pngInputRef.current?.click()}
              className="h-11 px-2.5 rounded-[5px] flex flex-col items-center justify-center gap-1 text-[#9ca3af] hover:text-white hover:bg-white/[0.06] border-none bg-transparent cursor-pointer transition-colors"
              title="Import PNG into ImageLabel"
            >
              <Icons8Icon name="upload" className="size-4" />
              <span className="text-[10px]">Import PNG</span>
            </button>

            <button
              onClick={handleDeleteSelected}
              className="h-11 px-2.5 rounded-[5px] flex flex-col items-center justify-center gap-1 text-[#9ca3af] hover:text-white hover:bg-white/[0.06] border-none bg-transparent cursor-pointer transition-colors"
              title="Delete Selected UI Element (Del)"
            >
              <Icons8Icon name="delete-sign" className="size-3.5" />
              <span className="text-[10px]">Delete</span>
            </button>

            <button
              onClick={() => setActiveRibbonTab('Home')}
              className="h-11 px-2.5 rounded-[5px] flex flex-col items-center justify-center gap-1 bg-white/10 hover:bg-white/15 text-white font-semibold border-none cursor-pointer transition-colors"
              title="Return to 3D Home Tools"
            >
              <Icons8Icon name="cursor" filled className="size-3.5" />
              <span className="text-[10px]">Done</span>
            </button>
          </div>
        ) : (
          <>
            {/* Transform Tools: Select, Move, Scale, Rotate, Transform */}
            <div className="flex items-center gap-1 shrink-0">
          {[
            { id: 'select', label: 'Select', icon: 'cursor' },
            { id: 'move', label: 'Move', icon: 'move' },
            { id: 'scale', label: 'Scale', icon: 'resize-four-directions' },
            { id: 'rotate', label: 'Rotate', icon: 'rotate-right' },
            { id: 'transform', label: 'Transform', icon: 'box' },
          ].map((tool) => {
            const isActive = activeTool === tool.id
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as any)}
                className={`h-11 px-1.5 min-w-[36px] rounded-[5px] flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-200 border-none ${
                  isActive
                    ? 'bg-white/10 text-white shadow-xs font-semibold'
                    : 'bg-transparent text-[#9ca3af] hover:text-white hover:bg-white/[0.05]'
                }`}
                title={tool.label}
              >
                <Icons8Icon name={tool.icon} filled={isActive} dark={false} className="size-4" />
                <span className="text-[10px] tracking-tight">{tool.label}</span>
              </button>
            )
          })}
        </div>

        <div className="h-9 w-px bg-white/[0.08] shrink-0" />

        {/* Snapping Group: studs, degrees, Geometric */}
        <div className="flex flex-col justify-center gap-1 text-[11px] text-[#9ca3af] shrink-0">
          <div className="flex items-center gap-1.5">
            <NoveloCheckbox
              checked={snapMoveEnabled}
              onChange={(next) => {
                setSnapMoveEnabled(next)
                engineRef.current?.setSnapping(
                  next || snapRotateEnabled,
                  next ? snapMoveStuds : 0,
                  snapRotateEnabled ? snapRotateDeg : 0,
                )
              }}
            />
            <div className="flex items-center gap-1">
              <input
                type="text"
                inputMode="decimal"
                value={snapMoveDraft}
                onChange={(e) => {
                  const val = e.target.value
                  setSnapMoveDraft(val)
                  const parsed = parseFloat(val)
                  if (!Number.isNaN(parsed) && parsed > 0) {
                    setSnapMoveStuds(parsed)
                    if (snapMoveEnabled) {
                      engineRef.current?.setSnapping(
                        true,
                        parsed,
                        snapRotateEnabled ? snapRotateDeg : 0,
                      )
                    }
                  }
                }}
                onBlur={() => {
                  const parsed = parseFloat(snapMoveDraft)
                  const valid = !Number.isNaN(parsed) && parsed > 0 ? parsed : snapMoveStuds
                  setSnapMoveStuds(valid)
                  setSnapMoveDraft(String(valid))
                  engineRef.current?.setSnapping(
                    snapMoveEnabled || snapRotateEnabled,
                    snapMoveEnabled ? valid : 0,
                    snapRotateEnabled ? snapRotateDeg : 0,
                  )
                }}
                onKeyDown={(e) => {
                  e.stopPropagation()
                  if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
                }}
                className="w-8 h-[17px] px-1 rounded-[3px] bg-black/40 border border-white/10 focus:border-white/35 text-white/90 font-mono text-[10px] text-center focus:outline-none"
              />
              <span className="font-mono text-[10px] text-white/65">studs</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <NoveloCheckbox
              checked={snapRotateEnabled}
              onChange={(next) => {
                setSnapRotateEnabled(next)
                engineRef.current?.setSnapping(
                  snapMoveEnabled || next,
                  snapMoveEnabled ? snapMoveStuds : 0,
                  next ? snapRotateDeg : 0,
                )
              }}
            />
            <div className="flex items-center gap-0.5">
              <input
                type="text"
                inputMode="decimal"
                value={snapRotateDraft}
                onChange={(e) => {
                  const val = e.target.value
                  setSnapRotateDraft(val)
                  const parsed = parseFloat(val)
                  if (!Number.isNaN(parsed) && parsed > 0 && parsed <= 360) {
                    setSnapRotateDeg(parsed)
                    if (snapRotateEnabled) {
                      engineRef.current?.setSnapping(
                        true,
                        snapMoveEnabled ? snapMoveStuds : 0,
                        parsed,
                      )
                    }
                  }
                }}
                onBlur={() => {
                  const parsed = parseFloat(snapRotateDraft)
                  const valid =
                    !Number.isNaN(parsed) && parsed > 0 ? Math.min(360, parsed) : snapRotateDeg
                  setSnapRotateDeg(valid)
                  setSnapRotateDraft(String(valid))
                  engineRef.current?.setSnapping(
                    snapMoveEnabled || snapRotateEnabled,
                    snapMoveEnabled ? snapMoveStuds : 0,
                    snapRotateEnabled ? valid : 0,
                  )
                }}
                onKeyDown={(e) => {
                  e.stopPropagation()
                  if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
                }}
                className="w-8 h-[17px] px-1 rounded-[3px] bg-black/40 border border-white/10 focus:border-white/35 text-white/90 font-mono text-[10px] text-center focus:outline-none"
              />
              <span className="font-mono text-[10px] text-white/65">°</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setGeometricMode(!geometricMode)}
          className={`h-11 px-2 rounded-[5px] flex flex-col items-center justify-center gap-0.5 border-none cursor-pointer transition-colors shrink-0 ${
            geometricMode ? 'bg-white/10 text-white' : 'bg-transparent text-white/50 hover:text-white'
          }`}
        >
          <Icons8Icon name="box" filled={geometricMode} className="size-3.5" />
          <span className="text-[9px]">Geometric</span>
        </button>

        <div className="h-9 w-px bg-white/[0.08] shrink-0" />

        {/* Insert & Core Creation Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Part Dropdown */}
          <button
            ref={partBtnRef}
            onClick={() => {
              if (!showPartDropdown && partBtnRef.current) {
                const rect = partBtnRef.current.getBoundingClientRect()
                setPartMenuPos({ top: rect.bottom + 4, left: rect.left })
              }
              setShowPartDropdown(!showPartDropdown)
            }}
            className={`h-11 px-2 rounded-[5px] flex flex-col items-center justify-center gap-1 border-none cursor-pointer transition-colors ${
              showPartDropdown ? 'bg-white/10 text-white' : 'bg-transparent text-[#e0e0e0] hover:bg-white/[0.06]'
            }`}
          >
            <div className="flex items-center gap-0.5">
              <Icons8Icon name="box" filled={showPartDropdown} className="size-4" />
              <ChevronDown className="size-2.5 text-white/40" />
            </div>
            <span className="text-[10px]">Part</span>
          </button>

          <button
            onClick={() => {
              const next = !showTerrainEditor
              setShowTerrainEditor(next)
              if (next) {
                engineRef.current?.setTerrainPreviewBox(true, [96, 28, 76], [0, 0, 0])
              } else {
                engineRef.current?.setTerrainPreviewBox(false)
                engineRef.current?.setTerrainSculptMode(false)
              }
            }}
            className={`h-11 px-2 rounded-[5px] flex flex-col items-center justify-center gap-1 border-none cursor-pointer transition-colors ${
              showTerrainEditor ? 'bg-white/10 text-white' : 'text-[#9ca3af] hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Icons8Icon name="mountain" filled={showTerrainEditor} className="size-4" />
            <span className="text-[10px]">Terrain</span>
          </button>

          <button
            ref={characterBtnRef}
            onClick={() => {
              if (!showCharacterPopup && characterBtnRef.current) {
                const rect = characterBtnRef.current.getBoundingClientRect()
                setCharacterMenuPos({ top: rect.bottom + 4, left: rect.left })
              }
              setShowCharacterPopup((v) => !v)
            }}
            className={`h-11 px-2 rounded-[5px] flex flex-col items-center justify-center gap-1 border-none cursor-pointer transition-colors ${
              showCharacterPopup ? 'bg-white/10 text-white' : 'text-[#9ca3af] hover:text-white hover:bg-white/[0.05] bg-transparent'
            }`}
          >
            <Icons8Icon name="user" filled={showCharacterPopup} className="size-4" />
            <span className="text-[10px]">Character</span>
          </button>

          <button
            ref={uiBtnRef}
            onClick={() => {
              if (!showUiDropdown && uiBtnRef.current) {
                const rect = uiBtnRef.current.getBoundingClientRect()
                setUiMenuPos({ top: rect.bottom + 4, left: rect.left })
              }
              setShowUiDropdown(!showUiDropdown)
            }}
            className={`h-11 px-2 rounded-[5px] flex flex-col items-center justify-center gap-1 border-none cursor-pointer transition-colors ${
              showUiDropdown ? 'bg-white/10 text-white' : 'text-[#9ca3af] hover:text-white hover:bg-white/[0.05] bg-transparent'
            }`}
          >
            <div className="flex items-center gap-0.5">
              <Icons8Icon name="web-design" filled={showUiDropdown} className="size-4" />
              <ChevronDown className="size-2.5 text-white/40" />
            </div>
            <span className="text-[10px]">GUI</span>
          </button>

          <button
            onClick={() => handleCreateAndOpenScript()}
            className={`h-11 px-2 rounded-[5px] flex flex-col items-center justify-center gap-1 border-none cursor-pointer transition-colors ${
              activeDocTab !== 'viewport' ? 'bg-white/10 text-white' : 'text-[#9ca3af] hover:text-white hover:bg-white/[0.05] bg-transparent'
            }`}
          >
            <Icons8Icon name="source-code" filled={activeDocTab !== 'viewport'} className="size-4" />
            <span className="text-[10px]">Script</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="h-11 px-2 rounded-[5px] flex flex-col items-center justify-center gap-1 text-[#9ca3af] hover:text-white hover:bg-white/[0.05] border-none bg-transparent cursor-pointer"
          >
            <Icons8Icon name="upload" className="size-4" />
            <span className="text-[10px]">Import</span>
          </button>

          <button
            ref={materialBtnRef}
            onClick={() => handleUpdateProperty('Material', activeMaterial)}
            onContextMenu={(e) => {
              e.preventDefault()
              if (!showMaterialPicker && materialBtnRef.current) {
                const rect = materialBtnRef.current.getBoundingClientRect()
                setMaterialMenuPos({ top: rect.bottom + 4, left: rect.left })
              }
              setShowMaterialPicker(!showMaterialPicker)
            }}
            className={`h-11 px-2 rounded-[5px] flex flex-col items-center justify-center gap-1 border-none cursor-pointer transition-colors ${
              showMaterialPicker ? 'bg-white/10 text-white' : 'bg-transparent text-[#9ca3af] hover:text-white hover:bg-white/[0.05]'
            }`}
            title="Left-click: Apply material · Right-click: Choose material"
          >
            <div className="flex items-center gap-0.5">
              <Icons8Icon name="paint-palette" filled={showMaterialPicker} className="size-4" />
              <span
                onClick={(e) => {
                  e.stopPropagation()
                  if (!showMaterialPicker && materialBtnRef.current) {
                    const rect = materialBtnRef.current.getBoundingClientRect()
                    setMaterialMenuPos({ top: rect.bottom + 4, left: rect.left })
                  }
                  setShowMaterialPicker(!showMaterialPicker)
                }}
                className="p-0.5 rounded hover:bg-white/10"
              >
                <ChevronDown className="size-2.5 text-white/40" />
              </span>
            </div>
            <span className="text-[10px]">Material</span>
          </button>

          <button
            ref={colorBtnRef}
            onClick={() => handleUpdateProperty('Color', activeColor)}
            onContextMenu={(e) => {
              e.preventDefault()
              if (!showColorPicker && colorBtnRef.current) {
                const rect = colorBtnRef.current.getBoundingClientRect()
                setColorMenuPos({ top: rect.bottom + 4, left: rect.left })
              }
              setShowColorPicker(!showColorPicker)
            }}
            className={`h-11 px-2 rounded-[5px] flex flex-col items-center justify-center gap-0.5 border-none cursor-pointer transition-colors ${
              showColorPicker ? 'bg-white/10 text-white' : 'bg-transparent text-[#9ca3af] hover:text-white hover:bg-white/[0.05]'
            }`}
            title="Left-click: Apply color · Right-click: Choose color"
          >
            <div className="flex items-center gap-0.5">
              <div className="flex flex-col items-center gap-0.5">
                <Icons8Icon name="fill-color" filled={showColorPicker} className="size-3.5" />
                <span
                  className="w-3.5 h-[2.5px] rounded-full"
                  style={{ backgroundColor: activeColor }}
                />
              </div>
              <span
                onClick={(e) => {
                  e.stopPropagation()
                  if (!showColorPicker && colorBtnRef.current) {
                    const rect = colorBtnRef.current.getBoundingClientRect()
                    setColorMenuPos({ top: rect.bottom + 4, left: rect.left })
                  }
                  setShowColorPicker(!showColorPicker)
                }}
                className="p-0.5 rounded hover:bg-white/10"
              >
                <ChevronDown className="size-2.5 text-white/40" />
              </span>
            </div>
            <span className="text-[10px]">Color</span>
          </button>

          <button className="h-11 px-2 rounded-[5px] flex flex-col items-center justify-center gap-1 text-[#9ca3af] hover:text-white hover:bg-white/[0.05] border-none bg-transparent cursor-pointer">
            <Icons8Icon name="group-objects" className="size-4" />
            <span className="text-[10px]">Group</span>
          </button>

          <button
            onClick={() => handleUpdateProperty('Locked', !Boolean(activeNode?.properties?.Locked))}
            className={`h-11 px-2 rounded-[5px] flex flex-col items-center justify-center gap-1 border-none cursor-pointer transition-colors ${
              activeNode?.properties?.Locked ? 'bg-white/10 text-white' : 'text-[#9ca3af] hover:text-white hover:bg-white/[0.05] bg-transparent'
            }`}
          >
            <Icons8Icon name="lock" filled={Boolean(activeNode?.properties?.Locked)} className="size-4" />
            <span className="text-[10px]">Lock</span>
          </button>

          <button
            onClick={() => dispatchEngineAction('toggle_anchored')}
            className={`h-11 px-2 rounded-[5px] flex flex-col items-center justify-center gap-1 border-none cursor-pointer transition-colors ${
              activeNode?.properties?.Anchored ? 'bg-white/10 text-white' : 'text-[#9ca3af] hover:text-white hover:bg-white/[0.05] bg-transparent'
            }`}
            title="Toggle Anchored on Selected Object"
          >
            <Icons8Icon name="anchor" filled={Boolean(activeNode?.properties?.Anchored)} className="size-4" />
            <span className="text-[10px]">Anchor</span>
          </button>
        </div>
          </>
        )}

        <div className="h-9 w-px bg-white/[0.08] shrink-0" />

        {/* Quick Docks Toggles: Explorer, Properties */}
        <div className="flex items-center gap-1 ml-auto shrink-0">
          <button
            onClick={() => setShowExplorer(!showExplorer)}
            className={`h-11 px-2 rounded-[5px] flex flex-col items-center justify-center gap-1 border-none cursor-pointer transition-colors ${
              showExplorer ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            <Icons8Icon name="tree-structure" filled={showExplorer} className="size-4" />
            <span className="text-[10px]">Explorer</span>
          </button>

          <button
            onClick={() => setShowProperties(!showProperties)}
            className={`h-11 px-2 rounded-[5px] flex flex-col items-center justify-center gap-1 border-none cursor-pointer transition-colors ${
              showProperties ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            <Icons8Icon name="settings" filled={showProperties} className="size-4" />
            <span className="text-[10px]">Properties</span>
          </button>
        </div>
      </div>

      {/* File Menu Dropdown */}
      {showFileMenu && (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          style={{ top: fileMenuPos.top, left: fileMenuPos.left }}
          className="fixed w-56 bg-[#18191c]/95 backdrop-blur-md border border-white/15 rounded-[6px] shadow-2xl p-1 z-50 flex flex-col gap-0.5 text-[11px]"
        >
          <button
            type="button"
            onClick={() => {
              setShowFileMenu(false)
              handleNewProject()
            }}
            className="w-full px-3 py-1.5 rounded-[4px] flex items-center justify-between text-white/90 hover:bg-white/[0.08] hover:text-white border-none bg-transparent cursor-pointer text-left"
          >
            <span>New Project...</span>
            <span className="text-white/40 font-mono text-[10px]">Ctrl+N</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowFileMenu(false)
              fileInputRef.current?.click()
            }}
            className="w-full px-3 py-1.5 rounded-[4px] flex items-center justify-between text-white/90 hover:bg-white/[0.08] hover:text-white border-none bg-transparent cursor-pointer text-left"
          >
            <span>Open Project...</span>
            <span className="text-white/40 font-mono text-[10px]">Ctrl+O</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowFileMenu(false)
              handleSaveNvlo()
            }}
            className="w-full px-3 py-1.5 rounded-[4px] flex items-center justify-between text-white/90 hover:bg-white/[0.08] hover:text-white border-none bg-transparent cursor-pointer text-left"
          >
            <span>Save</span>
            <span className="text-white/40 font-mono text-[10px]">Ctrl+S</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={() => {
                setShowFileMenu(false)
                onSaveDoc?.(nvloDoc, engineRef.current?.captureThumbnail() || undefined)
                onClose()
              }}
              className="w-full px-3 py-1.5 rounded-[4px] flex items-center justify-between text-white/90 hover:bg-white/[0.08] hover:text-white border-none bg-transparent cursor-pointer text-left"
            >
              <span>Close Project</span>
            </button>
          )}

          <div className="my-0.5 h-px bg-white/10" />

          <button
            type="button"
            onClick={() => {
              setShowFileMenu(false)
              fileInputRef.current?.click()
            }}
            className="w-full px-3 py-1.5 rounded-[4px] flex items-center justify-between text-white/90 hover:bg-white/[0.08] hover:text-white border-none bg-transparent cursor-pointer text-left"
          >
            <span>Import...</span>
          </button>

          <div className="my-0.5 h-px bg-white/10" />

          <button
            type="button"
            onClick={() => {
              setShowFileMenu(false)
              handleClose()
            }}
            className="w-full px-3 py-1.5 rounded-[4px] flex items-center justify-between text-white/90 hover:bg-white/[0.08] hover:text-white border-none bg-transparent cursor-pointer text-left"
          >
            <span>Quit</span>
            <span className="text-white/40 font-mono text-[10px]">Ctrl+Q</span>
          </button>
        </div>
      )}

      {/* Character Generate Rig Popup */}
      {showCharacterPopup && (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          style={{ top: characterMenuPos.top, left: characterMenuPos.left }}
          className="fixed w-[228px] bg-[#141416]/95 backdrop-blur-md border border-white/15 rounded-[6px] shadow-2xl p-3 z-50 flex flex-col gap-2.5 text-white"
        >
          <div className="text-center text-[12px] font-semibold text-white/90 tracking-tight">
            Generate Rig
          </div>

          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => handleSpawnRig('Man')}
              className="w-full h-7 rounded-[4px] bg-[#1e1f23] hover:bg-white/[0.12] border border-white/15 text-[11px] font-medium text-white/90 hover:text-white cursor-pointer transition-colors"
            >
              Man
            </button>
            <button
              type="button"
              onClick={() => handleSpawnRig('Your Avatar')}
              className="w-full h-7 rounded-[4px] bg-[#1e1f23] hover:bg-white/[0.12] border border-white/15 text-[11px] font-medium text-white/90 hover:text-white cursor-pointer transition-colors"
            >
              Your Avatar
            </button>
          </div>
        </div>
      )}

      {/* GUI Dropdown Menu (rendered outside overflow-x-auto ribbon so it never clips) */}
      {showUiDropdown && (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          style={{ top: uiMenuPos.top, left: uiMenuPos.left }}
          className="fixed w-44 bg-[#141416] border border-white/10 rounded-[6px] shadow-2xl p-1 z-50 flex flex-col gap-0.5"
        >
          <button
            onClick={() => {
              setShowUiDropdown(false)
              handleSpawnScreenGui()
            }}
            className="w-full px-2.5 py-1.5 rounded-[4px] text-left text-white/85 hover:bg-white/[0.08] hover:text-white text-xs font-semibold border-none bg-transparent cursor-pointer flex items-center gap-2 transition-colors"
          >
            <Icons8Icon name="web-design" filled className="size-3.5" />
            <span>ScreenGui</span>
          </button>

          <div className="my-0.5 h-px bg-white/10" />

          {(
            [
              { cls: 'Frame', label: 'Frame', icon: 'box' },
              { cls: 'TextLabel', label: 'TextLabel', icon: 'list' },
              { cls: 'TextButton', label: 'TextButton', icon: 'cursor' },
              { cls: 'ImageLabel', label: 'ImageLabel', icon: 'template' },
            ] as const
          ).map((item) => (
            <button
              key={item.cls}
              onClick={() => {
                setShowUiDropdown(false)
                handleSpawnUiElement(item.cls)
              }}
              className="w-full px-2.5 py-1.5 rounded-[4px] text-left text-white/75 hover:bg-white/[0.08] hover:text-white text-xs font-medium border-none bg-transparent cursor-pointer flex items-center gap-2 transition-colors"
            >
              <Icons8Icon name={item.icon} className="size-3.5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Material Picker Dropdown (rendered outside overflow-x-auto ribbon so it never clips) */}
      {showMaterialPicker && (
        <MaterialPickerPopup
          top={materialMenuPos.top}
          left={materialMenuPos.left}
          activeMaterial={activeMaterial}
          appliedMaterials={(() => {
            const mats = new Set<PartMaterial>()
            const walk = (n: NvloInstanceData) => {
              if (n.properties?.Material) mats.add(String(n.properties.Material) as PartMaterial)
              n.children?.forEach(walk)
            }
            walk(nvloDoc.root)
            return Array.from(mats)
          })()}
          onSelect={(mat) => {
            setActiveMaterial(mat)
            handleUpdateProperty('Material', mat)
            setShowMaterialPicker(false)
          }}
        />
      )}

      {/* Part Dropdown Menu (rendered outside overflow-x-auto ribbon so it never clips) */}
      {showPartDropdown && (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          style={{ top: partMenuPos.top, left: partMenuPos.left }}
          className="fixed w-36 bg-[#141416] border border-white/10 rounded-[6px] shadow-2xl p-1 z-50 flex flex-col gap-0.5"
        >
          {(['Brick', 'Sphere', 'Wedge', 'Cylinder'] as const).map((part) => (
            <button
              key={part}
              onClick={() => {
                setShowPartDropdown(false)
                dispatchEngineAction('spawn_part', { shape: part })
              }}
              className="w-full px-2.5 py-1.5 rounded-[4px] text-left text-white/75 hover:bg-white/[0.08] hover:text-white text-xs font-semibold border-none bg-transparent cursor-pointer flex items-center gap-2 transition-colors"
            >
              <Icons8Icon name="box" className="size-3.5" />
              <span>{part}</span>
            </button>
          ))}
        </div>
      )}

      {/* Color Picker Dropdown (rendered outside overflow-x-auto ribbon so it never clips) */}
      {showColorPicker && (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          style={{ top: colorMenuPos.top, left: colorMenuPos.left }}
          className="fixed w-[244px] bg-[#141416] border border-white/10 rounded-[6px] shadow-2xl p-2.5 z-50 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between text-[10px] text-white/50 px-0.5">
            <span className="font-semibold text-white/80">Part Color</span>
            <span className="truncate max-w-[130px] font-mono">
              {activeNode?.className === 'Part' || activeNode?.className === 'SpawnLocation'
                ? activeNode.name
                : 'No part selected'}
            </span>
          </div>

          <HexColorPicker
            value={activeColor}
            onChange={(hex) => {
              setActiveColor(hex)
              handleUpdateProperty('Color', hex)
            }}
          />

          <div className="flex items-center gap-1.5 pt-1.5 border-t border-white/10">
            <input
              type="color"
              value={activeColor}
              onChange={(e) => {
                setActiveColor(e.target.value)
                handleUpdateProperty('Color', e.target.value)
              }}
              className="size-6 rounded-[4px] border border-white/15 bg-transparent cursor-pointer p-0 shrink-0"
              title="Custom Color"
            />
            <input
              type="text"
              value={activeColor}
              onChange={(e) => {
                setActiveColor(e.target.value)
                handleUpdateProperty('Color', e.target.value)
              }}
              className="flex-1 h-6 px-2 rounded-[4px] bg-[#0d0d10] border border-white/10 text-white font-mono text-[11px] focus:outline-none focus:border-white/30"
              placeholder="#ffffff"
            />
          </div>
        </div>
      )}

      {/* Part Right-Click Context Menu */}
      {partContextMenu && (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
          style={{ top: partContextMenu.y, left: partContextMenu.x }}
          className="fixed w-52 bg-[#141416] border border-white/10 rounded-[6px] shadow-2xl p-1 z-50 flex flex-col gap-0.5 text-xs select-none"
        >
          <button
            onClick={() => {
              handleCutSelected()
              setPartContextMenu(null)
            }}
            className="w-full px-2.5 py-1.5 rounded-[4px] flex items-center justify-between text-white/80 hover:bg-white/[0.08] hover:text-white border-none bg-transparent cursor-pointer transition-colors"
          >
            <span>Cut</span>
            <span className="text-[10px] font-mono text-white/35">Ctrl+X</span>
          </button>

          <button
            onClick={() => {
              handleCopySelected()
              setPartContextMenu(null)
            }}
            className="w-full px-2.5 py-1.5 rounded-[4px] flex items-center justify-between text-white/80 hover:bg-white/[0.08] hover:text-white border-none bg-transparent cursor-pointer transition-colors"
          >
            <span>Copy</span>
            <span className="text-[10px] font-mono text-white/35">Ctrl+C</span>
          </button>

          <button
            onClick={() => {
              const path = getInstanceGamePath(nvloDoc.root, partContextMenu.id)
              void navigator.clipboard?.writeText(path)
              addDiagnostic(`Copied path: ${path}`)
              setPartContextMenu(null)
            }}
            className="w-full px-2.5 py-1.5 rounded-[4px] flex items-center justify-between text-white/80 hover:bg-white/[0.08] hover:text-white border-none bg-transparent cursor-pointer transition-colors"
          >
            <span>Copy as Path</span>
          </button>

          <button
            disabled={!clipboardPart}
            onClick={() => {
              handlePastePart()
              setPartContextMenu(null)
            }}
            className="w-full px-2.5 py-1.5 rounded-[4px] flex items-center justify-between text-white/80 hover:bg-white/[0.08] hover:text-white disabled:opacity-35 disabled:hover:bg-transparent disabled:cursor-not-allowed border-none bg-transparent cursor-pointer transition-colors"
          >
            <span>Paste</span>
            <span className="text-[10px] font-mono text-white/35">Ctrl+V</span>
          </button>

          <button
            onClick={() => {
              handleDuplicateSelected()
              setPartContextMenu(null)
            }}
            className="w-full px-2.5 py-1.5 rounded-[4px] flex items-center justify-between text-white/80 hover:bg-white/[0.08] hover:text-white border-none bg-transparent cursor-pointer transition-colors"
          >
            <span>Duplicate</span>
            <span className="text-[10px] font-mono text-white/35">Ctrl+D</span>
          </button>

          <button
            onClick={() => {
              handleDeleteSelected()
              setPartContextMenu(null)
            }}
            className="w-full px-2.5 py-1.5 rounded-[4px] flex items-center justify-between text-white/80 hover:bg-white/[0.08] hover:text-white border-none bg-transparent cursor-pointer transition-colors"
          >
            <span>Delete</span>
            <span className="text-[10px] font-mono text-white/35">Del</span>
          </button>

          <div className="my-0.5 h-px bg-white/10" />

          <button
            onClick={() => {
              engineRef.current?.focusSelected()
              setPartContextMenu(null)
            }}
            className="w-full px-2.5 py-1.5 rounded-[4px] flex items-center justify-between text-white/80 hover:bg-white/[0.08] hover:text-white border-none bg-transparent cursor-pointer transition-colors"
          >
            <span>Zoom to</span>
            <span className="text-[10px] font-mono text-white/35">F</span>
          </button>

          <button
            onClick={() => {
              handleToggleAnchored()
              setPartContextMenu(null)
            }}
            className="w-full px-2.5 py-1.5 rounded-[4px] flex items-center justify-between text-white/80 hover:bg-white/[0.08] hover:text-white border-none bg-transparent cursor-pointer transition-colors"
          >
            <span>Anchored</span>
            {Boolean(activeNode?.properties?.Anchored) && <Check className="size-3.5 text-white" />}
          </button>

          <button
            onClick={() => {
              handleUpdateProperty('Locked', !Boolean(activeNode?.properties?.Locked))
              setPartContextMenu(null)
            }}
            className="w-full px-2.5 py-1.5 rounded-[4px] flex items-center justify-between text-white/80 hover:bg-white/[0.08] hover:text-white border-none bg-transparent cursor-pointer transition-colors"
          >
            <span>Locked</span>
            {Boolean(activeNode?.properties?.Locked) && <Check className="size-3.5 text-white" />}
          </button>

          <div className="my-0.5 h-px bg-white/10" />

          <div
            className="relative"
            onMouseEnter={() => setShowInsertSubmenu(true)}
            onMouseLeave={() => setShowInsertSubmenu(false)}
          >
            <button
              onClick={() => setShowInsertSubmenu(!showInsertSubmenu)}
              className="w-full px-2.5 py-1.5 rounded-[4px] flex items-center justify-between text-white/80 hover:bg-white/[0.08] hover:text-white border-none bg-transparent cursor-pointer transition-colors"
            >
              <span>Insert Part</span>
              <ChevronRight className="size-3.5 text-white/40" />
            </button>

            {showInsertSubmenu && (
              <div className="absolute left-full top-0 ml-1 w-32 bg-[#141416] border border-white/10 rounded-[6px] shadow-2xl p-1 flex flex-col gap-0.5">
                {(['Brick', 'Sphere', 'Wedge', 'Cylinder'] as const).map((shape) => (
                  <button
                    key={shape}
                    onClick={() => {
                      handleSpawnPart(shape)
                      setShowInsertSubmenu(false)
                      setPartContextMenu(null)
                    }}
                    className="w-full px-2.5 py-1.5 rounded-[4px] text-left text-white/80 hover:bg-white/[0.08] hover:text-white border-none bg-transparent cursor-pointer flex items-center gap-2 transition-colors"
                  >
                    <Icons8Icon name="box" className="size-3.5" />
                    <span>{shape}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. MAIN WORKSPACE WITH DOCKS & VIEWPORT                      */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 flex-1 flex overflow-hidden">
        {/* LEFT DOCK: Terrain Editor */}
        {showTerrainEditor && (
          <TerrainEditorPanel
            regionSize={terrainRegionSize}
            regionPosition={terrainRegionPos}
            onClose={() => {
              setShowTerrainEditor(false)
              engineRef.current?.setTerrainPreviewBox(false)
              engineRef.current?.setTerrainSculptMode(false)
            }}
            onGenerate={(cfg) => engineRef.current?.generateTerrain(cfg)}
            onClear={() => engineRef.current?.clearTerrain()}
            onPreviewChange={(visible, size, pos) => {
              setTerrainRegionSize(size)
              setTerrainRegionPos(pos)
              engineRef.current?.setTerrainPreviewBox(visible, size, pos)
            }}
            onSculptConfigChange={(active, tool, radius, strength, paintMat) =>
              engineRef.current?.setTerrainSculptMode(active, tool, radius, strength, paintMat)
            }
          />
        )}

        {/* LEFT DOCKS: Any panel docked to left */}
        {((showExplorer && explorerDock === 'left') || (showProperties && propertiesDock === 'left')) && (
          <div className="flex shrink-0 h-full">
            <div
              style={{ width: leftDockWidth }}
              className="bg-[#0a0a0a]/35 border-r border-white/[0.08] flex flex-col shrink-0 overflow-hidden"
            >
              {showExplorer && explorerDock === 'left' && (
                <ExplorerPanel
                  rootChildren={nvloDoc.root.children}
                  selectedId={selectedNodeId}
                  expandedNodes={expandedNodes}
                  search={explorerSearch}
                  onSearchChange={setExplorerSearch}
                  onToggleExpand={toggleNodeExpanded}
                  onSelect={(id) => {
                    setSelectedNodeId(id)
                    engineRef.current?.selectInstance(id)
                  }}
                  onRename={handleRenameInstance}
                  onInsertPart={handleSpawnPart}
                  onInsertObject={handleInsertObject}
                  onReparent={handleReparentInstance}
                  onContextMenu={(id, clientX, clientY) => {
                    const x = Math.min(clientX, window.innerWidth - 220)
                    const y = Math.min(clientY, window.innerHeight - 310)
                    setShowInsertSubmenu(false)
                    setPartContextMenu({ id, x: Math.max(8, x), y: Math.max(8, y) })
                  }}
                  isFloating={false}
                  onToggleFloat={() => setExplorerDock('float')}
                  onClose={() => setShowExplorer(false)}
                  onHeaderPointerDown={(e) => {
                    if (e.button !== 0) return
                    setPanelDrag({ type: 'undock-drag', panel: 'explorer', startX: e.clientX, startY: e.clientY, active: false })
                  }}
                  onOpenScript={openScriptTab}
                />
              )}
              {showExplorer && explorerDock === 'left' && showProperties && propertiesDock === 'left' && (
                <div
                  onPointerDown={(e) => {
                    e.preventDefault()
                    setPanelDrag({ type: 'resize-props', startY: e.clientY, origH: propertiesHeight })
                  }}
                  className="h-1.5 bg-white/[0.04] hover:bg-white/25 cursor-row-resize shrink-0 transition-colors"
                />
              )}
              {showProperties && propertiesDock === 'left' && (
                <div
                  style={
                    showExplorer && explorerDock === 'left'
                      ? { height: propertiesHeight }
                      : undefined
                  }
                  className={`flex flex-col overflow-hidden ${
                    showExplorer && explorerDock === 'left' ? 'shrink-0' : 'flex-1'
                  }`}
                >
                  <PropertiesPanel
                    activeNode={activeNode}
                    parentName={(() => {
                      if (!activeNode) return 'World'
                      const findParent = (node: NvloInstanceData): string | null => {
                        for (const c of node.children || []) {
                          if (c.id === activeNode.id) return node.name
                          const sub = findParent(c)
                          if (sub) return sub
                        }
                        return null
                      }
                      return findParent(nvloDoc.root) || 'World'
                    })()}
                    lightingPreset={nvloDoc.lighting.preset}
                    search={propertiesSearch}
                    onSearchChange={setPropertiesSearch}
                    onUpdateProperty={handleUpdateProperty}
                    onLightingPresetChange={handleLightingPresetChange}
                    isFloating={false}
                    onToggleFloat={() => setPropertiesDock('float')}
                    onClose={() => setShowProperties(false)}
                    onHeaderPointerDown={(e) => {
                      if (e.button !== 0) return
                      setPanelDrag({ type: 'undock-drag', panel: 'properties', startX: e.clientX, startY: e.clientY, active: false })
                    }}
                  />
                </div>
              )}
            </div>
            <div
              onPointerDown={(e) => {
                e.preventDefault()
                setPanelDrag({ type: 'resize-left', startX: e.clientX, origW: leftDockWidth })
              }}
              className="w-1.5 bg-transparent hover:bg-white/25 cursor-col-resize shrink-0 transition-colors"
            />
          </div>
        )}

        {/* CENTER VIEWPORT / DOCUMENT AREA */}
        <div className="flex-1 flex flex-col bg-transparent overflow-hidden relative">
          {dockHoverSide === 'left' && (
            <div className="absolute left-2 top-2 bottom-2 w-60 z-40 rounded-[6px] bg-white/[0.08] border-2 border-dashed border-white/40 flex items-center justify-center text-[11px] font-semibold text-white/80 pointer-events-none">
              Dock Left
            </div>
          )}
          {dockHoverSide === 'right' && (
            <div className="absolute right-2 top-2 bottom-2 w-60 z-40 rounded-[6px] bg-white/[0.08] border-2 border-dashed border-white/40 flex items-center justify-center text-[11px] font-semibold text-white/80 pointer-events-none">
              Dock Right
            </div>
          )}
          {/* Document Tab Bar: Cat Battles ✕ */}
          <div className="h-7 bg-[#0a0a0a]/35 border-b border-white/[0.08] flex items-center px-2 gap-1 shrink-0">
            <button
              onClick={() => setActiveDocTab('viewport')}
              className={`h-6 px-2.5 rounded-t-[4px] text-[11px] font-medium flex items-center gap-1.5 border-none cursor-pointer transition-colors ${
                activeDocTab === 'viewport'
                  ? 'bg-[#18191d] text-white font-bold border-t-2 border-t-white/60'
                  : 'text-white/50 hover:text-white bg-transparent'
              }`}
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="size-3.5 text-white shrink-0"
              >
                <path
                  d="M7.5 13.5H4a1.5 1.5 0 0 1-1.5-1.5V3.5A1.5 1.5 0 0 1 4 2h4.75L12 5.25V8.5"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.5 2v3.25H12"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.2 14h3.55a1.5 1.5 0 0 0 .25-2.98 2.1 2.1 0 0 0-3.95-.52A1.65 1.65 0 0 0 10.2 14Z"
                  fill="currentColor"
                />
              </svg>
              <span>{gameName}</span>
              <span
                title="Save & Close Project"
                onClick={(e) => {
                  e.stopPropagation()
                  onSaveDoc?.(nvloDoc, engineRef.current?.captureThumbnail() || undefined)
                  onClose?.()
                }}
                className="ml-1 flex items-center text-white/40 hover:text-white cursor-pointer"
              >
                <X className="size-3" />
              </span>
            </button>

            {openScriptIds.map((sid) => {
              const scrNode = findInstanceById(nvloDoc.root, sid)
              if (!scrNode) return null
              const isTabActive = activeDocTab === sid
              return (
                <button
                  key={sid}
                  onClick={() => setActiveDocTab(sid)}
                  className={`h-6 px-2.5 rounded-t-[4px] text-[11px] font-medium flex items-center gap-1.5 border-none cursor-pointer transition-colors ${
                    isTabActive
                      ? 'bg-[#18191d] text-white font-bold border-t-2 border-t-emerald-400'
                      : 'text-white/50 hover:text-white bg-transparent'
                  }`}
                >
                  <Code2 className="size-3 text-emerald-400" />
                  <span>{scrNode.name}</span>
                  <X
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenScriptIds((prev) => prev.filter((id) => id !== sid))
                      if (activeDocTab === sid) {
                        setActiveDocTab('viewport')
                      }
                    }}
                    className="size-3 text-white/40 hover:text-white ml-1 cursor-pointer"
                  />
                </button>
              )
            })}
          </div>

          {/* MAIN VIEWPORT CONTENT */}
          {activeDocTab === 'viewport' ? (
            <div ref={viewportRef} className="flex-1 relative overflow-hidden bg-[#0a0a0a]">
              <UiCanvasOverlay
                starterGuiChildren={findInstanceById(nvloDoc.root, 'starter_gui')?.children || []}
                selectedId={selectedNodeId}
                isEditMode={
                  !isPlaying &&
                  (activeRibbonTab === 'UI' ||
                    activeNode?.className === 'ScreenGui' ||
                    activeNode?.className === 'Frame' ||
                    activeNode?.className === 'TextLabel' ||
                    activeNode?.className === 'TextButton' ||
                    activeNode?.className === 'ImageLabel' ||
                    activeNode?.className === 'ImageButton' ||
                    activeNode?.className === 'TextBox' ||
                    activeNode?.className === 'ScrollingFrame')
                }
                isPlaying={isPlaying}
                onSelect={(id) => setSelectedNodeId(id)}
                onUpdateLayout={handleUpdateUiLayout}
              />
              {isPlaying && (
                <div className="absolute top-3 left-3 z-20 px-3 py-1.5 rounded-[6px] bg-black/70 border border-white/15 text-[11px] text-white/90 font-mono pointer-events-none">
                  Play Test Active — WASD to Move · Space to Jump · Drag Mouse to Orbit
                </div>
              )}
            </div>
          ) : (() => {
            const activeScriptNode = findInstanceById(nvloDoc.root, activeDocTab)
            if (!activeScriptNode) {
              return (
                <div className="flex-1 bg-[#16171b] flex items-center justify-center text-white/40 text-xs">
                  Script not found.
                </div>
              )
            }
            return (
              <ScriptEditor
                scriptNode={activeScriptNode}
                onChangeSource={handleUpdateScriptSource}
                onRunScript={(scr) => {
                  setShowDiagnostics(true)
                  addDiagnostic(`Running ${scr.name}...`)
                  engineRef.current?.runScriptSnippet(String(scr.properties.Source ?? ''), scr)
                }}
                onSaveProject={handleSaveNvlo}
              />
            )
          })()}
        </div>

        {/* RIGHT DOCKS: Stacked Explorer & Properties with resize splitters */}
        {((showExplorer && explorerDock === 'right') || (showProperties && propertiesDock === 'right')) && (
          <div className="flex shrink-0 h-full">
            <div
              onPointerDown={(e) => {
                e.preventDefault()
                setPanelDrag({ type: 'resize-right', startX: e.clientX, origW: rightDockWidth })
              }}
              className="w-1.5 bg-transparent hover:bg-white/25 cursor-col-resize shrink-0 transition-colors"
            />
            <div
              style={{ width: rightDockWidth }}
              className="bg-[#0a0a0a]/35 border-l border-white/[0.08] flex flex-col shrink-0 overflow-hidden"
            >
              {showExplorer && explorerDock === 'right' && (
                <ExplorerPanel
                  rootChildren={nvloDoc.root.children}
                  selectedId={selectedNodeId}
                  expandedNodes={expandedNodes}
                  search={explorerSearch}
                  onSearchChange={setExplorerSearch}
                  onToggleExpand={toggleNodeExpanded}
                  onSelect={(id) => {
                    setSelectedNodeId(id)
                    engineRef.current?.selectInstance(id)
                  }}
                  onRename={handleRenameInstance}
                  onInsertPart={handleSpawnPart}
                  onInsertObject={handleInsertObject}
                  onReparent={handleReparentInstance}
                  onContextMenu={(id, clientX, clientY) => {
                    const x = Math.min(clientX, window.innerWidth - 220)
                    const y = Math.min(clientY, window.innerHeight - 310)
                    setShowInsertSubmenu(false)
                    setPartContextMenu({ id, x: Math.max(8, x), y: Math.max(8, y) })
                  }}
                  isFloating={false}
                  onToggleFloat={() => setExplorerDock('float')}
                  onClose={() => setShowExplorer(false)}
                  onHeaderPointerDown={(e) => {
                    if (e.button !== 0) return
                    setPanelDrag({ type: 'undock-drag', panel: 'explorer', startX: e.clientX, startY: e.clientY, active: false })
                  }}
                  onOpenScript={openScriptTab}
                />
              )}

              {showExplorer && explorerDock === 'right' && showProperties && propertiesDock === 'right' && (
                <div
                  onPointerDown={(e) => {
                    e.preventDefault()
                    setPanelDrag({ type: 'resize-props', startY: e.clientY, origH: propertiesHeight })
                  }}
                  className="h-1.5 bg-white/[0.04] hover:bg-white/25 cursor-row-resize shrink-0 transition-colors"
                />
              )}

              {showProperties && propertiesDock === 'right' && (
                <div
                  style={
                    showExplorer && explorerDock === 'right'
                      ? { height: propertiesHeight }
                      : undefined
                  }
                  className={`flex flex-col overflow-hidden ${
                    showExplorer && explorerDock === 'right' ? 'shrink-0' : 'flex-1'
                  }`}
                >
                  <PropertiesPanel
                    activeNode={activeNode}
                    parentName={(() => {
                      if (!activeNode) return 'World'
                      const findParent = (node: NvloInstanceData): string | null => {
                        for (const c of node.children || []) {
                          if (c.id === activeNode.id) return node.name
                          const sub = findParent(c)
                          if (sub) return sub
                        }
                        return null
                      }
                      return findParent(nvloDoc.root) || 'World'
                    })()}
                    lightingPreset={nvloDoc.lighting.preset}
                    search={propertiesSearch}
                    onSearchChange={setPropertiesSearch}
                    onUpdateProperty={handleUpdateProperty}
                    onLightingPresetChange={handleLightingPresetChange}
                    isFloating={false}
                    onToggleFloat={() => setPropertiesDock('float')}
                    onClose={() => setShowProperties(false)}
                    onHeaderPointerDown={(e) => {
                      if (e.button !== 0) return
                      setPanelDrag({ type: 'undock-drag', panel: 'properties', startX: e.clientX, startY: e.clientY, active: false })
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* FLOATING EXPLORER */}
      {showExplorer && explorerDock === 'float' && (
        <div
          style={{
            top: explorerFloatRect.y,
            left: explorerFloatRect.x,
            width: explorerFloatRect.w,
            height: explorerFloatRect.h,
          }}
          className="fixed z-40 bg-[#121316]/95 backdrop-blur-md border border-white/15 rounded-[6px] shadow-2xl flex flex-col overflow-hidden"
        >
          <ExplorerPanel
            rootChildren={nvloDoc.root.children}
            selectedId={selectedNodeId}
            expandedNodes={expandedNodes}
            search={explorerSearch}
            onSearchChange={setExplorerSearch}
            onToggleExpand={toggleNodeExpanded}
            onSelect={(id) => {
              setSelectedNodeId(id)
              engineRef.current?.selectInstance(id)
            }}
            onRename={handleRenameInstance}
            onInsertPart={handleSpawnPart}
            onInsertObject={handleInsertObject}
            onReparent={handleReparentInstance}
            onContextMenu={(id, clientX, clientY) => {
              const x = Math.min(clientX, window.innerWidth - 220)
              const y = Math.min(clientY, window.innerHeight - 310)
              setShowInsertSubmenu(false)
              setPartContextMenu({ id, x: Math.max(8, x), y: Math.max(8, y) })
            }}
            isFloating
            onToggleFloat={() => setExplorerDock('right')}
            onClose={() => setShowExplorer(false)}
            onHeaderPointerDown={(e) => {
              if (e.button !== 0) return
              setPanelDrag({
                type: 'move-float',
                panel: 'explorer',
                startX: e.clientX,
                startY: e.clientY,
                origX: explorerFloatRect.x,
                origY: explorerFloatRect.y,
              })
            }}
            onOpenScript={openScriptTab}
          />
          <div
            onPointerDown={(e) => {
              e.stopPropagation()
              setPanelDrag({
                type: 'resize-float',
                panel: 'explorer',
                startX: e.clientX,
                startY: e.clientY,
                origW: explorerFloatRect.w,
                origH: explorerFloatRect.h,
              })
            }}
            className="absolute bottom-0 right-0 size-3 cursor-nwse-resize"
            title="Resize"
          />
        </div>
      )}

      {/* FLOATING PROPERTIES */}
      {showProperties && propertiesDock === 'float' && (
        <div
          style={{
            top: propertiesFloatRect.y,
            left: propertiesFloatRect.x,
            width: propertiesFloatRect.w,
            height: propertiesFloatRect.h,
          }}
          className="fixed z-40 bg-[#121316]/95 backdrop-blur-md border border-white/15 rounded-[6px] shadow-2xl flex flex-col overflow-hidden"
        >
          <PropertiesPanel
            activeNode={activeNode}
            parentName={(() => {
              if (!activeNode) return 'World'
              const findParent = (node: NvloInstanceData): string | null => {
                for (const c of node.children || []) {
                  if (c.id === activeNode.id) return node.name
                  const sub = findParent(c)
                  if (sub) return sub
                }
                return null
              }
              return findParent(nvloDoc.root) || 'World'
            })()}
            lightingPreset={nvloDoc.lighting.preset}
            search={propertiesSearch}
            onSearchChange={setPropertiesSearch}
            onUpdateProperty={handleUpdateProperty}
            onLightingPresetChange={handleLightingPresetChange}
            isFloating
            onToggleFloat={() => setPropertiesDock('right')}
            onClose={() => setShowProperties(false)}
            onHeaderPointerDown={(e) => {
              if (e.button !== 0) return
              setPanelDrag({
                type: 'move-float',
                panel: 'properties',
                startX: e.clientX,
                startY: e.clientY,
                origX: propertiesFloatRect.x,
                origY: propertiesFloatRect.y,
              })
            }}
          />
          <div
            onPointerDown={(e) => {
              e.stopPropagation()
              setPanelDrag({
                type: 'resize-float',
                panel: 'properties',
                startX: e.clientX,
                startY: e.clientY,
                origW: propertiesFloatRect.w,
                origH: propertiesFloatRect.h,
              })
            }}
            className="absolute bottom-0 right-0 size-3 cursor-nwse-resize"
            title="Resize"
          />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. PULL-UP DIAGNOSTICS & COMMAND BAR                          */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 flex flex-col shrink-0 bg-[#0a0a0a]/65 border-t border-white/[0.08]">
        {/* Pull-up / Resize handle */}
        <div
          onPointerDown={(e) => {
            e.preventDefault()
            setPanelDrag({
              type: 'resize-output',
              startY: e.clientY,
              origH: outputHeight,
              wasOpen: showDiagnostics,
            })
          }}
          className="h-1.5 w-full cursor-row-resize hover:bg-white/25 transition-colors"
          title="Drag up to open Output / Diagnostics"
        />

        {/* Diagnostics Output Drawer */}
        {showDiagnostics && (
          <div
            style={{ height: outputHeight }}
            className="bg-[#0d0e11]/95 border-b border-white/[0.08] flex flex-col overflow-hidden"
          >
            <div className="h-6 px-3 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02] shrink-0">
              <span className="text-[10px] font-semibold text-white/70 tracking-tight">
                Output / Diagnostics
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDiagnosticsLogs([])}
                  className="text-[10px] text-white/45 hover:text-white bg-transparent border-none cursor-pointer px-1"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setShowDiagnostics(false)}
                  className="text-white/45 hover:text-white bg-transparent border-none cursor-pointer p-0 flex items-center"
                  title="Collapse Diagnostics"
                >
                  <X className="size-3" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-1.5 font-mono text-[11px] leading-[18px] select-text no-scrollbar">
              {diagnosticsLogs.map((entry, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="text-white/45 shrink-0">{entry.time}</span>
                  <span
                    className={
                      entry.level === 'error'
                        ? 'text-red-400'
                        : entry.level === 'warn'
                          ? 'text-amber-300'
                          : 'text-white/85'
                    }
                  >
                    {entry.message}
                  </span>
                </div>
              ))}
              <div ref={diagnosticsEndRef} />
            </div>
          </div>
        )}

        {/* Command Input Row */}
        <div className="h-7 flex items-center px-3 text-[11px] text-white/70 gap-2">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-white/90 font-mono font-bold">&gt;</span>
            <input
              type="text"
              value={cmdInput}
              onChange={(e) => setCmdInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && cmdInput.trim()) {
                  const raw = cmdInput.trim()
                  const cmd = raw.toLowerCase()
                  addDiagnostic(`> ${raw}`)
                  if (cmd.startsWith('spawn ')) {
                    const shape = cmd.slice(6).trim()
                    const map: Record<string, PartShape> = { brick: 'Brick', block: 'Brick', sphere: 'Sphere', wedge: 'Wedge', cylinder: 'Cylinder' }
                    handleSpawnPart(map[shape] || 'Brick')
                  } else if (cmd === 'preset sunset') {
                    engineRef.current?.setLightingPreset('GoldenSunset')
                    addDiagnostic('Lighting preset set to GoldenSunset')
                  } else if (cmd === 'preset night') {
                    engineRef.current?.setLightingPreset('StarryMidnight')
                    addDiagnostic('Lighting preset set to StarryMidnight')
                  } else if (cmd === 'preset neon') {
                    engineRef.current?.setLightingPreset('CyberpunkNeon')
                    addDiagnostic('Lighting preset set to CyberpunkNeon')
                  } else if (cmd === 'preset day') {
                    engineRef.current?.setLightingPreset('BrightDay')
                    addDiagnostic('Lighting preset set to BrightDay')
                  } else if (cmd === 'clear') {
                    setDiagnosticsLogs([])
                  } else {
                    setShowDiagnostics(true)
                    engineRef.current?.runScriptSnippet(raw)
                  }
                  setCmdInput('')
                }
              }}
              placeholder="Run a command..."
              className="w-full bg-transparent border-none text-white/90 placeholder:text-white/35 font-mono text-[11px] focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowDiagnostics((v) => !v)}
            className="size-5 rounded flex items-center justify-center text-white/45 hover:text-white hover:bg-white/[0.08] border-none bg-transparent cursor-pointer shrink-0"
            title={showDiagnostics ? 'Hide Diagnostics' : 'Show Diagnostics'}
          >
            {showDiagnostics ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
          </button>
        </div>
      </div>
    </div>
  )
}
