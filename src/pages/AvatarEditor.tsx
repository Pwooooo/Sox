import { useState, useRef, useEffect, useCallback } from 'react'
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

// Quick skin tone dots under the hue bar matching Image 3
const PRESET_SKIN_TONES = [
  '#2a1b18',
  '#3f271d',
  '#593826',
  '#784c33',
  '#996242',
  '#b87a52',
  '#d19366',
  '#e2aa80',
  '#ebbfa0',
  '#f2d2b8',
  '#f7e1cf',
  '#faeee2',
  '#ffffff',
]

// HSV Color utilities
function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  s = s / 100
  v = v / 100
  const i = Math.floor((h / 60) % 6)
  const f = h / 60 - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)
  let r = 0, g = 0, b = 0
  switch (i) {
    case 0: r = v; g = t; b = p; break
    case 1: r = q; g = v; b = p; break
    case 2: r = p; g = v; b = t; break
    case 3: r = p; g = q; b = v; break
    case 4: r = t; g = p; b = v; break
    case 5: r = v; g = p; b = q; break
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('').toUpperCase()
}

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return null
  const num = parseInt(clean, 16)
  if (isNaN(num)) return null
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const diff = max - min
  let h = 0
  if (diff !== 0) {
    if (max === r) h = ((g - b) / diff) % 6
    else if (max === g) h = (b - r) / diff + 2
    else h = (r - g) / diff + 4
    h = Math.round(h * 60)
    if (h < 0) h += 360
  }
  const s = max === 0 ? 0 : (diff / max) * 100
  const v = max * 100
  return [h, Math.round(s), Math.round(v)]
}

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

  // Color picker HSV state
  const [hue, setHue] = useState(0)
  const [saturation, setSaturation] = useState(0)
  const [value, setValue] = useState(100)
  const [hexInput, setHexInput] = useState('#FFFFFF')

  const spectrumRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)

  // Sync color changes to body part
  const applyColor = useCallback((h: number, s: number, v: number) => {
    const [r, g, b] = hsvToRgb(h, s, v)
    const hex = rgbToHex(r, g, b)
    setHexInput(hex)

    setBodyColors((prev) => {
      if (selectedPart === 'all') {
        return {
          head: hex,
          torso: hex,
          leftArm: hex,
          rightArm: hex,
          leftLeg: hex,
          rightLeg: hex,
        }
      }
      return {
        ...prev,
        [selectedPart]: hex,
      }
    })
  }, [selectedPart])

  // When selected part changes, sync HSV to that part's current color
  useEffect(() => {
    const currentColor = selectedPart === 'all' ? bodyColors.head : bodyColors[selectedPart as keyof BodyColors]
    const rgb = hexToRgb(currentColor)
    if (rgb) {
      const [h, s, v] = rgbToHsv(...rgb)
      setHue(h)
      setSaturation(s)
      setValue(v)
      setHexInput(currentColor.toUpperCase())
    }
  }, [selectedPart])

  // 2D Saturation / Value picker handler
  const handleSpectrumMove = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!spectrumRef.current) return
    const rect = spectrumRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top))
    const s = Math.round((x / rect.width) * 100)
    const v = Math.round((1 - y / rect.height) * 100)
    setSaturation(s)
    setValue(v)
    applyColor(hue, s, v)
  }, [hue, applyColor])

  const handleSpectrumDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true
    handleSpectrumMove(e)
  }

  useEffect(() => {
    const handleUp = () => {
      isDraggingRef.current = false
    }
    const handleMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        handleSpectrumMove(e)
      }
    }
    window.addEventListener('mouseup', handleUp)
    window.addEventListener('mousemove', handleMove)
    return () => {
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('mousemove', handleMove)
    }
  }, [handleSpectrumMove])

  // Hex text input change
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value
    if (!val.startsWith('#')) val = '#' + val
    setHexInput(val)
    if (val.length === 7) {
      const rgb = hexToRgb(val)
      if (rgb) {
        const [h, s, v] = rgbToHsv(...rgb)
        setHue(h)
        setSaturation(s)
        setValue(v)
        setBodyColors((prev) => ({
          ...prev,
          ...(selectedPart === 'all'
            ? { head: val, torso: val, leftArm: val, rightArm: val, leftLeg: val, rightLeg: val }
            : { [selectedPart]: val }),
        }))
      }
    }
  }

  // Quick preset click
  const handlePresetClick = (hex: string) => {
    setHexInput(hex.toUpperCase())
    const rgb = hexToRgb(hex)
    if (rgb) {
      const [h, s, v] = rgbToHsv(...rgb)
      setHue(h)
      setSaturation(s)
      setValue(v)
      setBodyColors((prev) => ({
        ...prev,
        ...(selectedPart === 'all'
          ? { head: hex, torso: hex, leftArm: hex, rightArm: hex, leftLeg: hex, rightLeg: hex }
          : { [selectedPart]: hex }),
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

      {/* Main Workspace: Character on Left + Image 3 Color Wheel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: The Single Clean Character (Black Selection Outline) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0e0e10] border border-white/[0.04] p-8 flex flex-col items-center justify-center min-h-[540px] shadow-2xl relative select-none">
          {/* Top Control: All Toggle */}
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider">Body Parts</span>
            <button
              onClick={() => setSelectedPart(selectedPart === 'all' ? 'torso' : 'all')}
              className={`px-3 py-1 rounded-[8px] text-xs font-bold transition-all cursor-pointer border-none ${
                selectedPart === 'all'
                  ? 'bg-black text-white border border-white/20 shadow-md'
                  : 'bg-white/10 text-white/60 hover:text-white'
              }`}
            >
              Color All
            </button>
          </div>

          {/* Interactive Roblox Humanoid Structure (Black Selection Outlines, Not Too Round) */}
          <div className="flex flex-col items-center select-none py-2">
            {/* Head */}
            <button
              onClick={() => setSelectedPart('head')}
              title="Head"
              className={`w-28 h-28 rounded-[14px] mb-2.5 transition-all cursor-pointer relative ${
                selectedPart === 'head' || selectedPart === 'all'
                  ? 'border-[3px] border-black shadow-[0_0_0_1px_rgba(255,255,255,0.2)] scale-[1.02]'
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
                className={`w-20 h-40 rounded-[14px] transition-all cursor-pointer ${
                  selectedPart === 'leftArm' || selectedPart === 'all'
                    ? 'border-[3px] border-black shadow-[0_0_0_1px_rgba(255,255,255,0.2)] scale-[1.02]'
                    : 'border border-black/20 hover:brightness-105'
                }`}
                style={{ backgroundColor: bodyColors.leftArm }}
              />

              {/* Torso */}
              <button
                onClick={() => setSelectedPart('torso')}
                title="Torso"
                className={`w-44 h-40 rounded-[14px] transition-all cursor-pointer relative ${
                  selectedPart === 'torso' || selectedPart === 'all'
                    ? 'border-[3px] border-black shadow-[0_0_0_1px_rgba(255,255,255,0.2)] scale-[1.02]'
                    : 'border border-black/20 hover:brightness-105'
                }`}
                style={{ backgroundColor: bodyColors.torso }}
              />

              {/* Right Arm */}
              <button
                onClick={() => setSelectedPart('rightArm')}
                title="Right Arm"
                className={`w-20 h-40 rounded-[14px] transition-all cursor-pointer ${
                  selectedPart === 'rightArm' || selectedPart === 'all'
                    ? 'border-[3px] border-black shadow-[0_0_0_1px_rgba(255,255,255,0.2)] scale-[1.02]'
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
                className={`w-21 h-44 rounded-[14px] transition-all cursor-pointer ${
                  selectedPart === 'leftLeg' || selectedPart === 'all'
                    ? 'border-[3px] border-black shadow-[0_0_0_1px_rgba(255,255,255,0.2)] scale-[1.02]'
                    : 'border border-black/20 hover:brightness-105'
                }`}
                style={{ backgroundColor: bodyColors.leftLeg }}
              />

              {/* Right Leg */}
              <button
                onClick={() => setSelectedPart('rightLeg')}
                title="Right Leg"
                className={`w-21 h-44 rounded-[14px] transition-all cursor-pointer ${
                  selectedPart === 'rightLeg' || selectedPart === 'all'
                    ? 'border-[3px] border-black shadow-[0_0_0_1px_rgba(255,255,255,0.2)] scale-[1.02]'
                    : 'border border-black/20 hover:brightness-105'
                }`}
                style={{ backgroundColor: bodyColors.rightLeg }}
              />
            </div>
          </div>

          {/* White Part Label matching Image 1 request */}
          <span className="text-sm font-bold text-white tracking-wide mt-4">
            {getPartLabel(selectedPart)}
          </span>
        </div>

        {/* Right: Full 2D Color Picker matching Image 3 */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-[#0e0e10] border border-white/[0.04] flex flex-col gap-5 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">
                Coloring: <span className="text-white font-extrabold">{getPartLabel(selectedPart)}</span>
              </span>
              <span className="text-xs text-white/40">Drag spectrum or pick from skin presets</span>
            </div>

            {/* 1. Large 2D Saturation / Value Gradient Canvas matching Image 3 */}
            <div
              ref={spectrumRef}
              onMouseDown={handleSpectrumDown}
              className="relative w-full h-72 rounded-2xl cursor-crosshair overflow-hidden shadow-inner select-none"
              style={{
                backgroundColor: `hsl(${hue}, 100%, 50%)`,
              }}
            >
              {/* White to Transparent (Horizontal Saturation) */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to right, #ffffff, transparent)',
                }}
              />
              {/* Transparent to Black (Vertical Value / Brightness) */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, #000000, transparent)',
                }}
              />

              {/* Draggable Circle Selector Point matching Image 3 */}
              <div
                className="absolute size-4 rounded-full border-2 border-white shadow-[0_0_4px_rgba(0,0,0,0.8)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  left: `${saturation}%`,
                  top: `${100 - value}%`,
                  backgroundColor: hexInput,
                }}
              />
            </div>

            {/* 2. Rainbow Hue Slider matching Image 3 */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span className="font-semibold text-white/70">Hue</span>
              </div>
              <div className="relative flex items-center h-5 w-full">
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hue}
                  onChange={(e) => {
                    const h = Number(e.target.value)
                    setHue(h)
                    applyColor(h, saturation, value)
                  }}
                  className="hue-slider w-full h-2.5 rounded-full cursor-pointer outline-none"
                  style={{
                    background:
                      'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
                  }}
                />
              </div>
            </div>

            {/* 3. Skin Tone Swatches Row matching Image 3 */}
            <div className="flex items-center justify-between gap-1.5 py-1 overflow-x-auto no-scrollbar">
              {PRESET_SKIN_TONES.map((color) => (
                <button
                  key={color}
                  onClick={() => handlePresetClick(color)}
                  style={{ backgroundColor: color }}
                  className={`size-6 rounded-full cursor-pointer transition-transform hover:scale-110 border border-black/20 shrink-0 ${
                    hexInput.toLowerCase() === color.toLowerCase() ? 'ring-2 ring-white scale-110' : ''
                  }`}
                />
              ))}
            </div>

            {/* 4. Saturation & Brightness Readout matching Image 3 */}
            <div className="flex items-center justify-between text-xs text-white/50 pt-1">
              <span>Saturation {saturation}%</span>
              <span>Brightness {value}%</span>
            </div>

            {/* 5. Hex Input Box matching Image 3 */}
            <div className="flex items-center gap-3 pt-2 border-t border-white/[0.04]">
              <span className="text-xs font-semibold text-white/70">Hex</span>
              <div className="flex-1 flex items-center justify-between h-9 px-3.5 rounded-[10px] bg-[#141416] border border-white/10">
                <input
                  type="text"
                  value={hexInput}
                  onChange={handleHexChange}
                  maxLength={7}
                  className="w-full bg-transparent text-xs font-mono font-bold text-white focus:outline-none tracking-wider uppercase"
                />
                <div
                  className="size-5 rounded-md border border-white/20 shrink-0 ml-2"
                  style={{ backgroundColor: hexInput }}
                />
              </div>
            </div>
          </div>

          {/* Wardrobe Items Section */}
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
