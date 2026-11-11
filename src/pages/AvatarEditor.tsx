import { useState } from 'react'
import { Sparkles, RotateCw, Check, Undo2, Save, Shirt, Smile, Shield } from 'lucide-react'
import { ITEMS, Item } from '@/data/items'

const SKIN_TONES = [
  '#f5cd2f', // Classic Noob Yellow
  '#eab308', // Gold
  '#fcd34d', // Pale Yellow
  '#d4a373', // Warm Tan
  '#a98467', // Medium Brown
  '#6f4e37', // Dark Brown
  '#3e2723', // Deep Espresso
  '#ffffff', // Pure White
  '#d1d5db', // Grey
  '#18181b', // Obsidian
  '#3b82f6', // Cobalt Blue
  '#10b981', // Emerald
  '#ef4444', // Crimson
  '#a855f7', // Purple
]

export function AvatarEditor() {
  const [headColor, setHeadColor] = useState('#ffffff')
  const [torsoColor, setTorsoColor] = useState('#18181b')
  const [selectedPart, setSelectedPart] = useState<'head' | 'torso'>('head')
  const [activeCategory, setActiveCategory] = useState<'hat' | 'hair' | 'face' | 'clothing' | 'accessory'>('hat')
  const [equippedIds, setEquippedIds] = useState<number[]>([1, 4, 10])
  const [avatarScale, setAvatarScale] = useState(100)
  const [savedNotification, setSavedNotification] = useState(false)

  const toggleEquip = (id: number) => {
    setEquippedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSave = () => {
    setSavedNotification(true)
    setTimeout(() => setSavedNotification(false), 2500)
  }

  const filteredItems = ITEMS.filter((item) => item.type === activeCategory)

  return (
    <div className="p-4 md:p-6 lg:p-7 flex flex-col gap-6 max-w-[1700px]">
      {/* Title & Save Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Avatar Editor
          </h1>
          <p className="text-xs md:text-sm text-white/50 mt-0.5">
            Customize your Novelo avatar's appearance, equipped gear, and skin tones
          </p>
        </div>

        <button
          onClick={handleSave}
          className="h-10 px-5 rounded-xl bg-white text-black hover:bg-neutral-200 transition-all font-bold text-xs flex items-center gap-2 cursor-pointer border-none shadow-lg active:scale-95"
        >
          {savedNotification ? <Check className="size-4" /> : <Save className="size-4" />}
          <span>{savedNotification ? 'Outfit Saved!' : 'Save Outfit'}</span>
        </button>
      </div>

      {/* Editor Layout: Left 3D Viewport + Right Customization Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Avatar Stage */}
        <div className="lg:col-span-5 rounded-2xl bg-[#121212]/90 border border-white/10 p-6 flex flex-col items-center gap-6 shadow-xl relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs text-white/40">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Avatar Preview</span>
            <div className="flex items-center gap-1.5">
              <RotateCw className="size-3 text-white/50" />
              <span>Blocky R6 Model</span>
            </div>
          </div>

          {/* Blocky Character Canvas */}
          <div className="relative h-80 w-full flex items-center justify-center">
            {/* Ambient Shadow */}
            <div className="absolute bottom-6 w-48 h-6 bg-black/60 rounded-full blur-md" />

            {/* Character Body Structure */}
            <div
              className="relative flex flex-col items-center transition-transform duration-200"
              style={{ transform: `scale(${avatarScale / 100})` }}
            >
              {/* Equipped Hat indicator */}
              {equippedIds.includes(1) && (
                <div className="w-20 h-6 bg-amber-400 rounded-t-lg -mb-2 z-20 flex items-center justify-center shadow-md border-b-2 border-amber-600">
                  <div className="size-2 bg-red-600 rounded-full shadow-inner" />
                </div>
              )}

              {/* Head */}
              <div
                onClick={() => setSelectedPart('head')}
                className={`size-20 rounded-md flex flex-col items-center justify-center relative cursor-pointer transition-all shadow-md ${
                  selectedPart === 'head' ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''
                }`}
                style={{ backgroundColor: headColor }}
              >
                {/* Eyes */}
                <div className="flex gap-4 mb-1">
                  <div className="size-2 rounded-full bg-black shadow-xs" />
                  <div className="size-2 rounded-full bg-black shadow-xs" />
                </div>
                {/* Smile */}
                <div className="w-5 h-2 border-b-2 border-black rounded-b-full" />
              </div>

              {/* Torso & Arms Row */}
              <div className="flex items-start gap-1 mt-1">
                {/* Left Arm */}
                <div
                  className="w-10 h-28 rounded-sm shadow-md"
                  style={{ backgroundColor: torsoColor }}
                />

                {/* Torso */}
                <div
                  onClick={() => setSelectedPart('torso')}
                  className={`w-24 h-28 rounded-sm shadow-md flex items-center justify-center relative cursor-pointer transition-all ${
                    selectedPart === 'torso' ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''
                  }`}
                  style={{ backgroundColor: torsoColor }}
                >
                  {/* Novelo Logo on Torso */}
                  <div className="size-8 rounded-full bg-black/30 border border-white/20 flex items-center justify-center">
                    <Sparkles className="size-4 text-white/80" />
                  </div>
                </div>

                {/* Right Arm */}
                <div
                  className="w-10 h-28 rounded-sm shadow-md"
                  style={{ backgroundColor: torsoColor }}
                />
              </div>

              {/* Legs Row */}
              <div className="flex items-center gap-1 mt-1">
                {/* Left Leg */}
                <div className="w-11 h-28 bg-[#18181b] rounded-b-sm shadow-md" />
                {/* Right Leg */}
                <div className="w-11 h-28 bg-[#18181b] rounded-b-sm shadow-md" />
              </div>
            </div>
          </div>

          {/* Scale Slider */}
          <div className="w-full flex items-center gap-3 pt-4 border-t border-white/[0.08]">
            <span className="text-xs text-white/50 shrink-0">Scale: {avatarScale}%</span>
            <input
              type="range"
              min="85"
              max="115"
              value={avatarScale}
              onChange={(e) => setAvatarScale(Number(e.target.value))}
              className="flex-1 accent-white cursor-pointer"
            />
          </div>
        </div>

        {/* Right: Customization Controls */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Skin Tone Palette Section */}
          <div className="p-5 rounded-2xl bg-[#121212]/90 border border-white/10 flex flex-col gap-3.5 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                Skin Color: <span className="capitalize text-white/70">{selectedPart}</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedPart('head')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer border-none ${
                    selectedPart === 'head' ? 'bg-white text-black' : 'bg-white/10 text-white/70'
                  }`}
                >
                  Head
                </button>
                <button
                  onClick={() => setSelectedPart('torso')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer border-none ${
                    selectedPart === 'torso' ? 'bg-white text-black' : 'bg-white/10 text-white/70'
                  }`}
                >
                  Torso
                </button>
              </div>
            </div>

            {/* Color Swatches Grid */}
            <div className="flex flex-wrap gap-2.5">
              {SKIN_TONES.map((color) => {
                const isSelected = selectedPart === 'head' ? headColor === color : torsoColor === color
                return (
                  <button
                    key={color}
                    onClick={() => {
                      if (selectedPart === 'head') setHeadColor(color)
                      else setTorsoColor(color)
                    }}
                    style={{ backgroundColor: color }}
                    className={`size-8 rounded-lg cursor-pointer transition-all border border-black/20 ${
                      isSelected ? 'ring-2 ring-white scale-110 shadow-lg' : 'hover:scale-105 opacity-90 hover:opacity-100'
                    }`}
                  />
                )
              })}
            </div>
          </div>

          {/* Items & Wardrobe Section */}
          <div className="p-5 rounded-2xl bg-[#121212]/90 border border-white/10 flex flex-col gap-4 shadow-xl">
            {/* Category Tabs (Soft translucent highlight when active, transparent when unselected) */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {(['hat', 'hair', 'face', 'clothing', 'accessory'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 h-9 rounded-[10px] text-xs font-semibold capitalize shrink-0 transition-all duration-150 cursor-pointer border-none outline-none select-none active:scale-[0.97] ${
                    activeCategory === cat
                      ? 'bg-white/[0.08] backdrop-blur-sm text-white font-bold shadow-xs'
                      : 'bg-transparent text-white/50 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  {cat}s
                </button>
              ))}
            </div>

            {/* Inventory Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredItems.map((item) => {
                const isEquipped = equippedIds.includes(item.id)
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleEquip(item.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center gap-2 text-center ${
                      isEquipped
                        ? 'bg-white/10 border-white text-white shadow-md'
                        : 'bg-[#161616] border-white/10 text-white/70 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className="size-14 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center">
                      <Sparkles className="size-5 text-white/40" />
                    </div>
                    <span className="text-xs font-bold truncate max-w-full">{item.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isEquipped ? 'bg-white text-black' : 'bg-white/5 text-white/50'
                      }`}
                    >
                      {isEquipped ? 'Equipped' : 'Equip'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
