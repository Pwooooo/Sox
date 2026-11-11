import { useState } from 'react'
import { Sparkles, RotateCw, Check, Save } from 'lucide-react'
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
  '#0284c7', // Sky Blue
  '#10b981', // Emerald
  '#15803d', // Forest Green
  '#ef4444', // Crimson
  '#b91c1c', // Dark Red
  '#a855f7', // Purple
  '#ec4899', // Pink
]

export function AvatarEditor() {
  const [bodyColors, setBodyColors] = useState<BodyColors>({
    head: '#f5cd2f',
    torso: '#18181b',
    leftArm: '#f5cd2f',
    rightArm: '#f5cd2f',
    leftLeg: '#18181b',
    rightLeg: '#18181b',
  })

  const [selectedPart, setSelectedPart] = useState<BodyPart>('torso')
  const [activeCategory, setActiveCategory] = useState<'hat' | 'hair' | 'face' | 'clothing' | 'accessory'>('hat')
  const [equippedIds, setEquippedIds] = useState<number[]>([1, 4, 10])
  const [avatarScale, setAvatarScale] = useState(100)
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
      case 'all': return 'All Body Parts'
      case 'head': return 'Head'
      case 'torso': return 'Torso'
      case 'leftArm': return 'Left Arm'
      case 'rightArm': return 'Right Arm'
      case 'leftLeg': return 'Left Leg'
      case 'rightLeg': return 'Right Leg'
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-7 flex flex-col gap-6 max-w-[1700px]">
      {/* Title & Save Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Avatar Editor
          </h1>
          <p className="text-xs md:text-sm text-white/50 mt-0.5">
            Customize all body parts, skin tones, and equipped items on your Novelo avatar
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

      {/* Editor Layout: Left Avatar Stage + Right Customization Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Clean Roblox R6 Avatar Preview Stage */}
        <div className="lg:col-span-5 rounded-2xl bg-[#121214] border border-white/[0.06] p-6 flex flex-col items-center gap-6 shadow-xl relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs text-white/40">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Avatar Preview</span>
            <div className="flex items-center gap-1.5">
              <RotateCw className="size-3 text-white/50" />
              <span>R6 Humanoid</span>
            </div>
          </div>

          {/* Clean Blocky R6 Character */}
          <div className="relative h-88 w-full flex items-center justify-center">
            {/* Soft Ambient Ground Shadow */}
            <div className="absolute bottom-4 w-48 h-6 bg-black/70 rounded-full blur-md" />

            {/* Character Humanoid */}
            <div
              className="relative flex flex-col items-center transition-transform duration-200"
              style={{ transform: `scale(${avatarScale / 100})` }}
            >
              {/* Equipped Hat accessory */}
              {equippedIds.includes(1) && (
                <div className="w-20 h-6 bg-amber-400 rounded-t-lg -mb-2 z-20 flex items-center justify-center shadow-md border-b-2 border-amber-600">
                  <div className="size-2 bg-red-600 rounded-full shadow-inner" />
                </div>
              )}

              {/* Head */}
              <div
                onClick={() => setSelectedPart('head')}
                className={`size-20 rounded-xl flex flex-col items-center justify-center relative cursor-pointer transition-all shadow-md z-10 ${
                  selectedPart === 'head' ? 'ring-2 ring-red-500' : ''
                }`}
                style={{ backgroundColor: bodyColors.head }}
              >
                {/* Eyes & Smile */}
                <div className="flex gap-4 mb-1">
                  <div className="size-2 rounded-full bg-black" />
                  <div className="size-2 rounded-full bg-black" />
                </div>
                <div className="w-5 h-1.5 border-b-2 border-black rounded-b-full" />
              </div>

              {/* Torso & Arms Row */}
              <div className="flex items-start gap-1 mt-1 z-10">
                {/* Left Arm */}
                <div
                  onClick={() => setSelectedPart('leftArm')}
                  className={`w-11 h-28 rounded-md shadow-md cursor-pointer transition-all ${
                    selectedPart === 'leftArm' ? 'ring-2 ring-red-500' : ''
                  }`}
                  style={{ backgroundColor: bodyColors.leftArm }}
                />

                {/* Torso */}
                <div
                  onClick={() => setSelectedPart('torso')}
                  className={`w-24 h-28 rounded-md shadow-md flex items-center justify-center relative cursor-pointer transition-all ${
                    selectedPart === 'torso' ? 'ring-2 ring-red-500' : ''
                  }`}
                  style={{ backgroundColor: bodyColors.torso }}
                >
                  {/* Subtle Novelo Emblem on Torso */}
                  <div className="size-8 rounded-full bg-black/20 border border-white/10 flex items-center justify-center">
                    <Sparkles className="size-4 text-white/60" />
                  </div>
                </div>

                {/* Right Arm */}
                <div
                  onClick={() => setSelectedPart('rightArm')}
                  className={`w-11 h-28 rounded-md shadow-md cursor-pointer transition-all ${
                    selectedPart === 'rightArm' ? 'ring-2 ring-red-500' : ''
                  }`}
                  style={{ backgroundColor: bodyColors.rightArm }}
                />
              </div>

              {/* Legs Row */}
              <div className="flex items-center gap-1 mt-1 z-10">
                {/* Left Leg */}
                <div
                  onClick={() => setSelectedPart('leftLeg')}
                  className={`w-11.5 h-28 rounded-b-md shadow-md cursor-pointer transition-all ${
                    selectedPart === 'leftLeg' ? 'ring-2 ring-red-500' : ''
                  }`}
                  style={{ backgroundColor: bodyColors.leftLeg }}
                />
                {/* Right Leg */}
                <div
                  onClick={() => setSelectedPart('rightLeg')}
                  className={`w-11.5 h-28 rounded-b-md shadow-md cursor-pointer transition-all ${
                    selectedPart === 'rightLeg' ? 'ring-2 ring-red-500' : ''
                  }`}
                  style={{ backgroundColor: bodyColors.rightLeg }}
                />
              </div>
            </div>
          </div>

          {/* Scale Slider */}
          <div className="w-full flex items-center gap-3 pt-3 border-t border-white/[0.06]">
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

        {/* Right: Body Part Selector (Image 2) & Color Palette */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Skin & Body Part Schematic Section matching Image 2 */}
          <div className="p-5 rounded-2xl bg-[#121214] border border-white/[0.06] flex flex-col md:flex-row gap-6 shadow-xl">
            {/* Left: 2D Schematic Humanoid matching Image 2 */}
            <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-[#0b0b0d] border border-white/[0.03] shrink-0 min-w-[210px]">
              <div className="w-full flex items-center justify-between">
                <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider">Body Parts</span>
                <button
                  onClick={() => setSelectedPart('all')}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer border-none ${
                    selectedPart === 'all'
                      ? 'bg-red-500 text-white'
                      : 'bg-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  All
                </button>
              </div>

              {/* Clickable Schematic Layout matching Image 2 */}
              <div className="flex flex-col items-center gap-1 select-none my-1">
                {/* Head */}
                <button
                  onClick={() => setSelectedPart('head')}
                  title="Head"
                  className={`w-12 h-12 rounded-xl transition-all cursor-pointer shadow-sm ${
                    selectedPart === 'head'
                      ? 'border-2 border-red-500 scale-105'
                      : 'border border-black/30 hover:scale-105'
                  }`}
                  style={{ backgroundColor: bodyColors.head }}
                />

                {/* Torso & Arms Row */}
                <div className="flex items-start gap-1">
                  {/* Left Arm */}
                  <button
                    onClick={() => setSelectedPart('leftArm')}
                    title="Left Arm"
                    className={`w-10 h-20 rounded-xl transition-all cursor-pointer shadow-sm ${
                      selectedPart === 'leftArm'
                        ? 'border-2 border-red-500 scale-105'
                        : 'border border-black/30 hover:scale-105'
                    }`}
                    style={{ backgroundColor: bodyColors.leftArm }}
                  />

                  {/* Torso */}
                  <button
                    onClick={() => setSelectedPart('torso')}
                    title="Torso"
                    className={`w-20 h-20 rounded-xl transition-all cursor-pointer shadow-sm ${
                      selectedPart === 'torso'
                        ? 'border-2 border-red-500 scale-105'
                        : 'border border-black/30 hover:scale-105'
                    }`}
                    style={{ backgroundColor: bodyColors.torso }}
                  />

                  {/* Right Arm */}
                  <button
                    onClick={() => setSelectedPart('rightArm')}
                    title="Right Arm"
                    className={`w-10 h-20 rounded-xl transition-all cursor-pointer shadow-sm ${
                      selectedPart === 'rightArm'
                        ? 'border-2 border-red-500 scale-105'
                        : 'border border-black/30 hover:scale-105'
                    }`}
                    style={{ backgroundColor: bodyColors.rightArm }}
                  />
                </div>

                {/* Legs Row */}
                <div className="flex items-center gap-1">
                  {/* Left Leg */}
                  <button
                    onClick={() => setSelectedPart('leftLeg')}
                    title="Left Leg"
                    className={`w-9.5 h-20 rounded-xl transition-all cursor-pointer shadow-sm ${
                      selectedPart === 'leftLeg'
                        ? 'border-2 border-red-500 scale-105'
                        : 'border border-black/30 hover:scale-105'
                    }`}
                    style={{ backgroundColor: bodyColors.leftLeg }}
                  />

                  {/* Right Leg */}
                  <button
                    onClick={() => setSelectedPart('rightLeg')}
                    title="Right Leg"
                    className={`w-9.5 h-20 rounded-xl transition-all cursor-pointer shadow-sm ${
                      selectedPart === 'rightLeg'
                        ? 'border-2 border-red-500 scale-105'
                        : 'border border-black/30 hover:scale-105'
                    }`}
                    style={{ backgroundColor: bodyColors.rightLeg }}
                  />
                </div>
              </div>

              {/* Part Label Under Diagram matching Image 2 */}
              <span className="text-xs font-bold text-cyan-400 tracking-wide">
                {getPartLabel(selectedPart)}
              </span>
            </div>

            {/* Right: Color Swatches Grid */}
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  Color: <span className="text-cyan-400 font-bold">{getPartLabel(selectedPart)}</span>
                </h3>
                <span className="text-xs text-white/40">Select part then pick color</span>
              </div>

              <div className="grid grid-cols-6 sm:grid-cols-6 md:grid-cols-6 gap-2.5 pt-1">
                {SKIN_TONES.map((color) => {
                  const currentPartColor = selectedPart === 'all' ? bodyColors.head : bodyColors[selectedPart as keyof BodyColors]
                  const isSelected = currentPartColor === color
                  return (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      style={{ backgroundColor: color }}
                      className={`aspect-square rounded-xl cursor-pointer transition-all border border-black/20 ${
                        isSelected ? 'ring-2 ring-white scale-110 shadow-lg' : 'hover:scale-105 opacity-90 hover:opacity-100'
                      }`}
                    />
                  )
                })}
              </div>
            </div>
          </div>

          {/* Wardrobe Items Section */}
          <div className="p-5 rounded-2xl bg-[#121214] border border-white/[0.06] flex flex-col gap-4 shadow-xl">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {(['hat', 'hair', 'face', 'clothing', 'accessory'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 h-8 rounded-[10px] text-xs font-semibold capitalize shrink-0 transition-all duration-150 cursor-pointer border-none outline-none select-none active:scale-[0.97] ${
                    activeCategory === cat
                      ? 'bg-white/[0.08] backdrop-blur-sm text-white font-bold shadow-xs'
                      : 'bg-transparent text-white/50 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  {cat}s
                </button>
              ))}
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredItems.map((item) => {
                const isEquipped = equippedIds.includes(item.id)
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleEquip(item.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center gap-2 text-center ${
                      isEquipped
                        ? 'bg-white/[0.08] border-white/20 text-white shadow-md'
                        : 'bg-[#161618] border-white/5 text-white/70 hover:border-white/10 hover:text-white'
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
