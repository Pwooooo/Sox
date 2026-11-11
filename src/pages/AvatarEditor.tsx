import { useState } from 'react'
import { Sparkles, Check, Save } from 'lucide-react'
import { ITEMS } from '@/data/items'

type BodyPart = 'all' | 'head' | 'torso' | 'leftArm' | 'rightArm' | 'leftLeg' | 'rightLeg'

interface BodyColors {
  head: string
  torso: string
  leftArm: string
  rightArm: string
  leftLeg: string
  rightLeg: string
}

const SKIN_TONES = [
  '#f5cd2f', // Classic Yellow
  '#eab308', // Gold
  '#fcd34d', // Light Yellow
  '#d4a373', // Tan
  '#a98467', // Warm Brown
  '#6f4e37', // Brown
  '#3e2723', // Deep Brown
  '#ffffff', // White
  '#d1d5db', // Grey
  '#18181b', // Black / Obsidian
  '#3b82f6', // Bright Blue
  '#0284c7', // Sky Blue
  '#10b981', // Green
  '#15803d', // Dark Green
  '#ef4444', // Red
  '#b91c1c', // Dark Red
  '#a855f7', // Purple
  '#ec4899', // Pink
]

export function AvatarEditor() {
  const [bodyColors, setBodyColors] = useState<BodyColors>({
    head: '#ffffff',
    torso: '#ffffff',
    leftArm: '#ffffff',
    rightArm: '#ffffff',
    leftLeg: '#ffffff',
    rightLeg: '#ffffff',
  })

  const [selectedPart, setSelectedPart] = useState<BodyPart>('torso')
  const [activeCategory, setActiveCategory] = useState<'hat' | 'hair' | 'face' | 'clothing' | 'accessory'>('hat')
  const [equippedIds, setEquippedIds] = useState<number[]>([1])
  const [savedNotification, setSavedNotification] = useState(false)

  const handleColorSelect = (color: string) => {
    if (selectedPart === 'all') {
      setBodyColors({
        head: color,
        torso: color,
        leftArm: color,
        rightArm: color,
        leftLeg: color,
        rightLeg: color,
      })
    } else {
      setBodyColors((prev) => ({
        ...prev,
        [selectedPart]: color,
      }))
    }
  }

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

  const getPartLabel = (part: BodyPart) => {
    switch (part) {
      case 'all': return 'All'
      case 'head': return 'Head'
      case 'torso': return 'Torso'
      case 'leftArm': return 'Left Arm'
      case 'rightArm': return 'Right Arm'
      case 'leftLeg': return 'Left Leg'
      case 'rightLeg': return 'Right Leg'
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-7 flex flex-col gap-6 max-w-[1400px]">
      {/* Title & Save Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Avatar Editor
          </h1>
          <p className="text-xs md:text-sm text-white/50 mt-0.5">
            Click any body part on your avatar to color it, or equip accessories from your inventory
          </p>
        </div>

        <button
          onClick={handleSave}
          className="h-9 px-4 rounded-[10px] bg-white text-black hover:bg-neutral-200 transition-all font-bold text-xs flex items-center gap-1.5 cursor-pointer border-none shadow-md active:scale-95"
        >
          {savedNotification ? <Check className="size-4" /> : <Save className="size-4" />}
          <span>{savedNotification ? 'Outfit Saved!' : 'Save Outfit'}</span>
        </button>
      </div>

      {/* Main Upper Workspace: THE Single Interactive Character (Image 2) on Left + Color Swatches on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: The Only Character — Exact Replica of Image 2 */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0e0e10] border border-white/[0.04] p-8 flex flex-col items-center justify-center min-h-[520px] shadow-2xl relative select-none">
          {/* Top Control: All Toggle */}
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider">Body Parts</span>
            <button
              onClick={() => setSelectedPart(selectedPart === 'all' ? 'torso' : 'all')}
              className={`px-3 py-1 rounded-[8px] text-xs font-bold transition-all cursor-pointer border-none ${
                selectedPart === 'all'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-white/10 text-white/60 hover:text-white'
              }`}
            >
              Color All
            </button>
          </div>

          {/* Interactive Roblox Humanoid Structure matching Image 2 */}
          <div className="flex flex-col items-center select-none py-2">
            {/* Head */}
            <button
              onClick={() => setSelectedPart('head')}
              title="Head"
              className={`w-28 h-28 rounded-2xl mb-2.5 transition-all cursor-pointer relative ${
                selectedPart === 'head' || selectedPart === 'all'
                  ? 'border-[2.5px] border-[#ef4444] shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                  : 'border border-black/20 hover:brightness-105'
              }`}
              style={{ backgroundColor: bodyColors.head }}
            />

            {/* Torso & Arms Row */}
            <div className="flex items-start gap-2.5 mb-2.5">
              {/* Left Arm */}
              <button
                onClick={() => setSelectedPart('leftArm')}
                title="Left Arm"
                className={`w-20 h-40 rounded-2xl transition-all cursor-pointer ${
                  selectedPart === 'leftArm' || selectedPart === 'all'
                    ? 'border-[2.5px] border-[#ef4444] shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                    : 'border border-black/20 hover:brightness-105'
                }`}
                style={{ backgroundColor: bodyColors.leftArm }}
              />

              {/* Torso */}
              <button
                onClick={() => setSelectedPart('torso')}
                title="Torso"
                className={`w-44 h-40 rounded-2xl transition-all cursor-pointer relative ${
                  selectedPart === 'torso' || selectedPart === 'all'
                    ? 'border-[2.5px] border-[#ef4444] shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                    : 'border border-black/20 hover:brightness-105'
                }`}
                style={{ backgroundColor: bodyColors.torso }}
              />

              {/* Right Arm */}
              <button
                onClick={() => setSelectedPart('rightArm')}
                title="Right Arm"
                className={`w-20 h-40 rounded-2xl transition-all cursor-pointer ${
                  selectedPart === 'rightArm' || selectedPart === 'all'
                    ? 'border-[2.5px] border-[#ef4444] shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                    : 'border border-black/20 hover:brightness-105'
                }`}
                style={{ backgroundColor: bodyColors.rightArm }}
              />
            </div>

            {/* Legs Row */}
            <div className="flex items-center gap-2.5">
              {/* Left Leg */}
              <button
                onClick={() => setSelectedPart('leftLeg')}
                title="Left Leg"
                className={`w-21 h-44 rounded-2xl transition-all cursor-pointer ${
                  selectedPart === 'leftLeg' || selectedPart === 'all'
                    ? 'border-[2.5px] border-[#ef4444] shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                    : 'border border-black/20 hover:brightness-105'
                }`}
                style={{ backgroundColor: bodyColors.leftLeg }}
              />

              {/* Right Leg */}
              <button
                onClick={() => setSelectedPart('rightLeg')}
                title="Right Leg"
                className={`w-21 h-44 rounded-2xl transition-all cursor-pointer ${
                  selectedPart === 'rightLeg' || selectedPart === 'all'
                    ? 'border-[2.5px] border-[#ef4444] shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                    : 'border border-black/20 hover:brightness-105'
                }`}
                style={{ backgroundColor: bodyColors.rightLeg }}
              />
            </div>
          </div>

          {/* Selected Part Label matching Image 2 */}
          <span className="text-sm font-semibold text-cyan-400 tracking-wide mt-4">
            {getPartLabel(selectedPart)}
          </span>
        </div>

        {/* Right: Color Swatches & Options */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Color Palette Box */}
          <div className="p-6 rounded-2xl bg-[#0e0e10] border border-white/[0.04] flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                Skin Color: <span className="text-cyan-400 font-bold">{getPartLabel(selectedPart)}</span>
              </h3>
              <span className="text-xs text-white/40">Select a body part, then choose color</span>
            </div>

            {/* Swatches Grid */}
            <div className="grid grid-cols-6 gap-3 pt-2">
              {SKIN_TONES.map((color) => {
                const currentPartColor = selectedPart === 'all' ? bodyColors.head : bodyColors[selectedPart as keyof BodyColors]
                const isSelected = currentPartColor === color
                return (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    style={{ backgroundColor: color }}
                    className={`aspect-square rounded-xl cursor-pointer transition-all border border-black/30 ${
                      isSelected ? 'ring-2 ring-white scale-105 shadow-xl' : 'hover:scale-105 opacity-90 hover:opacity-100'
                    }`}
                  />
                )
              })}
            </div>
          </div>

          {/* Wardrobe Items Drawer */}
          <div className="p-6 rounded-2xl bg-[#0e0e10] border border-white/[0.04] flex flex-col gap-4 shadow-xl">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {(['hat', 'hair', 'face', 'clothing', 'accessory'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 h-8 rounded-[10px] text-xs font-semibold capitalize shrink-0 transition-all duration-150 cursor-pointer border-none outline-none select-none active:scale-[0.97] ${
                    activeCategory === cat
                      ? 'bg-white/[0.08] text-white font-bold'
                      : 'bg-transparent text-white/50 hover:text-white'
                  }`}
                >
                  {cat}s
                </button>
              ))}
            </div>

            {/* Inventory Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {filteredItems.map((item) => {
                const isEquipped = equippedIds.includes(item.id)
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleEquip(item.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center gap-2 text-center ${
                      isEquipped
                        ? 'bg-white/[0.08] border-white/20 text-white shadow-md'
                        : 'bg-[#141416] border-white/5 text-white/70 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <div className="size-12 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center">
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
