import { useState } from 'react'
import { Sparkles, RotateCcw, Check, Palette, Shield, Sliders, X, Tag } from 'lucide-react'
import { ITEMS, Item, TYPE_LABELS } from '@/data/items'
import { cn } from '@/lib/utils'

interface AvatarBodyColors {
  head: string
  torso: string
  leftArm: string
  rightArm: string
  leftLeg: string
  rightLeg: string
}

const DEFAULT_COLORS: AvatarBodyColors = {
  head: '#f0c080',
  torso: '#2255aa',
  leftArm: '#f0c080',
  rightArm: '#f0c080',
  leftLeg: '#33aa55',
  rightLeg: '#33aa55',
}

const PALETTE = [
  '#f0c080', '#e0aa60', '#c88040', '#8c4820', '#4a2410',
  '#2255aa', '#1a3d7c', '#00aaff', '#33aa55', '#1e6b36',
  '#cc2222', '#ff4444', '#f5a623', '#ffd700', '#9c27b0',
  '#ffffff', '#bbbbbb', '#555555', '#222222', '#111111',
]

const BODY_PARTS: { key: keyof AvatarBodyColors; label: string }[] = [
  { key: 'head', label: 'Head' },
  { key: 'torso', label: 'Torso' },
  { key: 'leftArm', label: 'Left Arm' },
  { key: 'rightArm', label: 'Right Arm' },
  { key: 'leftLeg', label: 'Left Leg' },
  { key: 'rightLeg', label: 'Right Leg' },
]

export function Avatar() {
  const [colors, setColors] = useState<AvatarBodyColors>(DEFAULT_COLORS)
  const [selectedPart, setSelectedPart] = useState<keyof AvatarBodyColors | 'all'>('torso')
  const [equippedIds, setEquippedIds] = useState<number[]>([1, 7, 8])
  const [activeTab, setActiveTab] = useState<'inventory' | 'skin' | 'scale'>('inventory')
  const [inventoryCategory, setInventoryCategory] = useState<string>('all')
  const [heightScale, setHeightScale] = useState(100)
  const [widthScale, setWidthScale] = useState(100)
  const [savedMessage, setSavedMessage] = useState(false)

  // Equipped item objects
  const equippedItems = ITEMS.filter((item) => equippedIds.includes(item.id))

  const handleColorSelect = (hex: string) => {
    if (selectedPart === 'all') {
      setColors({
        head: hex,
        torso: hex,
        leftArm: hex,
        rightArm: hex,
        leftLeg: hex,
        rightLeg: hex,
      })
    } else {
      setColors((prev) => ({ ...prev, [selectedPart]: hex }))
    }
  }

  const toggleEquip = (id: number) => {
    if (equippedIds.includes(id)) {
      setEquippedIds(equippedIds.filter((item) => item !== id))
    } else {
      setEquippedIds([...equippedIds, id])
    }
  }

  const handleSave = () => {
    setSavedMessage(true)
    setTimeout(() => setSavedMessage(false), 2500)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6">
      {/* Page Title */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Avatar Editor
          </h1>
          <p className="text-sm text-white/60 mt-0.5">
            Customize your character appearance, body colors, and equipped gear.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedMessage && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <Check className="size-3.5" /> Saved!
            </span>
          )}
          <button
            onClick={() => {
              setColors(DEFAULT_COLORS)
              setEquippedIds([1, 7, 8])
            }}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/[0.08]"
          >
            <RotateCcw className="size-3.5" />
            Reset
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-white/90 active:scale-95 transition-all shadow-md cursor-pointer border-none"
          >
            Save Avatar
          </button>
        </div>
      </div>

      {/* Main Grid: Avatar Doll Preview + Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Avatar Doll Canvas & Equipped Tray */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Avatar 2D Doll Box */}
          <div className="relative rounded-2xl bg-[#111111] border border-white/[0.08] p-8 flex flex-col items-center justify-center min-h-[380px] shadow-xl overflow-hidden">
            {/* Grid background effect */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Blocky Avatar Character */}
            <div
              className="relative flex flex-col items-center transition-transform duration-200"
              style={{
                transform: `scale(${widthScale / 100}, ${heightScale / 100})`,
              }}
            >
              {/* Head */}
              <div
                onClick={() => {
                  setSelectedPart('head')
                  setActiveTab('skin')
                }}
                className={cn(
                  "size-16 rounded-md shadow-md cursor-pointer border-2 transition-all relative",
                  selectedPart === 'head' ? "border-white" : "border-black/20 hover:border-white/50"
                )}
                style={{ backgroundColor: colors.head }}
              >
                {/* Face feature representation */}
                <div className="absolute inset-0 flex items-center justify-center gap-3">
                  <div className="size-2 rounded-full bg-black/70" />
                  <div className="size-2 rounded-full bg-black/70" />
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-black/60" />
              </div>

              {/* Torso & Arms */}
              <div className="flex items-center gap-1 mt-1">
                {/* Left Arm */}
                <div
                  onClick={() => {
                    setSelectedPart('leftArm')
                    setActiveTab('skin')
                  }}
                  className={cn(
                    "w-10 h-24 rounded-md shadow-md cursor-pointer border-2 transition-all",
                    selectedPart === 'leftArm' ? "border-white" : "border-black/20 hover:border-white/50"
                  )}
                  style={{ backgroundColor: colors.leftArm }}
                />

                {/* Torso */}
                <div
                  onClick={() => {
                    setSelectedPart('torso')
                    setActiveTab('skin')
                  }}
                  className={cn(
                    "w-24 h-24 rounded-md shadow-md cursor-pointer border-2 transition-all flex items-center justify-center relative",
                    selectedPart === 'torso' ? "border-white" : "border-black/20 hover:border-white/50"
                  )}
                  style={{ backgroundColor: colors.torso }}
                >
                  <span className="text-[10px] font-bold text-white/50 tracking-wider">SOX</span>
                </div>

                {/* Right Arm */}
                <div
                  onClick={() => {
                    setSelectedPart('rightArm')
                    setActiveTab('skin')
                  }}
                  className={cn(
                    "w-10 h-24 rounded-md shadow-md cursor-pointer border-2 transition-all",
                    selectedPart === 'rightArm' ? "border-white" : "border-black/20 hover:border-white/50"
                  )}
                  style={{ backgroundColor: colors.rightArm }}
                />
              </div>

              {/* Legs */}
              <div className="flex items-center gap-1 mt-1">
                {/* Left Leg */}
                <div
                  onClick={() => {
                    setSelectedPart('leftLeg')
                    setActiveTab('skin')
                  }}
                  className={cn(
                    "w-11 h-24 rounded-md shadow-md cursor-pointer border-2 transition-all",
                    selectedPart === 'leftLeg' ? "border-white" : "border-black/20 hover:border-white/50"
                  )}
                  style={{ backgroundColor: colors.leftLeg }}
                />

                {/* Right Leg */}
                <div
                  onClick={() => {
                    setSelectedPart('rightLeg')
                    setActiveTab('skin')
                  }}
                  className={cn(
                    "w-11 h-24 rounded-md shadow-md cursor-pointer border-2 transition-all",
                    selectedPart === 'rightLeg' ? "border-white" : "border-black/20 hover:border-white/50"
                  )}
                  style={{ backgroundColor: colors.rightLeg }}
                />
              </div>
            </div>
          </div>

          {/* Equipped Items Tray */}
          <div className="rounded-2xl bg-[#111111] border border-white/[0.08] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Currently Wearing ({equippedItems.length})
              </span>
              {equippedItems.length > 0 && (
                <button
                  onClick={() => setEquippedIds([])}
                  className="text-xs text-white/50 hover:text-white cursor-pointer border-none bg-transparent"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {equippedItems.length === 0 ? (
                <p className="text-xs text-white/40 italic py-2">No accessories equipped.</p>
              ) : (
                equippedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg bg-[#181818] border border-white/[0.08] text-xs text-white"
                  >
                    <span className="font-medium truncate max-w-[120px]">{item.name}</span>
                    <button
                      onClick={() => toggleEquip(item.id)}
                      className="size-4 rounded hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Customization Controls (Tabs) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Tabs Navigation */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-[#111111] border border-white/[0.08]">
            <button
              onClick={() => setActiveTab('inventory')}
              className={cn(
                "flex-1 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer border-none",
                activeTab === 'inventory'
                  ? "bg-white text-black shadow"
                  : "bg-transparent text-white/60 hover:text-white"
              )}
            >
              Inventory Accessories
            </button>
            <button
              onClick={() => setActiveTab('skin')}
              className={cn(
                "flex-1 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer border-none",
                activeTab === 'skin'
                  ? "bg-white text-black shadow"
                  : "bg-transparent text-white/60 hover:text-white"
              )}
            >
              Skin Tone & Colors
            </button>
            <button
              onClick={() => setActiveTab('scale')}
              className={cn(
                "flex-1 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer border-none",
                activeTab === 'scale'
                  ? "bg-white text-black shadow"
                  : "bg-transparent text-white/60 hover:text-white"
              )}
            >
              Body Scaling
            </button>
          </div>

          {/* Tab 1: Inventory Accessories */}
          {activeTab === 'inventory' && (
            <div className="rounded-2xl bg-[#111111] border border-white/[0.08] p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {['all', 'hat', 'hair', 'face', 'clothing', 'accessory'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setInventoryCategory(type)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer border",
                      inventoryCategory === type
                        ? "bg-white/10 text-white border-white/20"
                        : "bg-transparent text-white/50 border-transparent hover:text-white"
                    )}
                  >
                    {type === 'all' ? 'All Items' : TYPE_LABELS[type] || type}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[460px] overflow-y-auto pr-1">
                {ITEMS.filter(
                  (i) => inventoryCategory === 'all' || i.type === inventoryCategory
                ).map((item) => {
                  const isWorn = equippedIds.includes(item.id)
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleEquip(item.id)}
                      className={cn(
                        "group relative rounded-xl p-3 border transition-all cursor-pointer flex flex-col gap-2",
                        isWorn
                          ? "bg-white/[0.08] border-white shadow-md"
                          : "bg-[#141414] border-white/[0.06] hover:border-white/20"
                      )}
                    >
                      <div className="aspect-square rounded-lg bg-black/40 flex items-center justify-center relative">
                        <Tag className="size-6 text-white/40 group-hover:text-white transition-colors" />
                        {isWorn && (
                          <div className="absolute top-1 right-1 size-5 rounded-full bg-white text-black flex items-center justify-center">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                        <span className="text-[10px] text-white/40 uppercase">{item.type}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Skin Tone & Color Palette */}
          {activeTab === 'skin' && (
            <div className="rounded-2xl bg-[#111111] border border-white/[0.08] p-5 flex flex-col gap-5">
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
                  Select Body Part
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => setSelectedPart('all')}
                    className={cn(
                      "py-2 px-3 rounded-lg text-xs font-semibold border cursor-pointer",
                      selectedPart === 'all'
                        ? "bg-white text-black border-white"
                        : "bg-[#141414] text-white/70 border-white/[0.08] hover:text-white"
                    )}
                  >
                    All Parts
                  </button>
                  {BODY_PARTS.map((part) => (
                    <button
                      key={part.key}
                      onClick={() => setSelectedPart(part.key)}
                      className={cn(
                        "py-2 px-3 rounded-lg text-xs font-semibold border cursor-pointer",
                        selectedPart === part.key
                          ? "bg-white text-black border-white"
                          : "bg-[#141414] text-white/70 border-white/[0.08] hover:text-white"
                      )}
                    >
                      {part.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
                  Color Swatches
                </span>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {PALETTE.map((hex) => (
                    <button
                      key={hex}
                      onClick={() => handleColorSelect(hex)}
                      className="aspect-square rounded-lg border border-black/30 hover:scale-110 active:scale-95 transition-all shadow-sm cursor-pointer"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Body Scaling */}
          {activeTab === 'scale' && (
            <div className="rounded-2xl bg-[#111111] border border-white/[0.08] p-5 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-bold text-white">
                  <span>Height Scale</span>
                  <span className="tabular-numbers">{heightScale}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="120"
                  value={heightScale}
                  onChange={(e) => setHeightScale(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-bold text-white">
                  <span>Width Scale</span>
                  <span className="tabular-numbers">{widthScale}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="120"
                  value={widthScale}
                  onChange={(e) => setWidthScale(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
