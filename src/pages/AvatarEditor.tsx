import { useState, useRef, useEffect, useCallback } from 'react'
import { Sparkles, Check, Save, RotateCw, X, Plus } from 'lucide-react'
import { ITEMS, Item } from '@/data/items'

type BodyPart = 'all' | 'head' | 'torso' | 'leftArm' | 'rightArm' | 'leftLeg' | 'rightLeg'
type CategoryTab = 'Hats' | 'Hairs' | 'Faces' | 'Clothings' | 'Accessorys' | 'Body'

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
    head: '#eab308',
    torso: '#3b82f6',
    leftArm: '#eab308',
    rightArm: '#eab308',
    leftLeg: '#18181b',
    rightLeg: '#18181b',
  })

  const [selectedPart, setSelectedPart] = useState<BodyPart>('torso')
  const [activeTab, setActiveTab] = useState<CategoryTab>('Hats')
  const [equippedIds, setEquippedIds] = useState<number[]>([1, 4])
  const [savedNotification, setSavedNotification] = useState(false)
  const [is2DMode, setIs2DMode] = useState(true)
  const [isSpinning, setIsSpinning] = useState(false)

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
  }, [selectedPart, bodyColors])

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

    const onMouseMove = (ev: MouseEvent) => {
      if (isDraggingRef.current) {
        handleSpectrumMove(ev)
      }
    }
    const onMouseUp = () => {
      isDraggingRef.current = false
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  // Hex input change
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value
    if (!val.startsWith('#')) val = '#' + val
    setHexInput(val)
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
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

  const handleRedraw = () => {
    setIsSpinning(true)
    setTimeout(() => setIsSpinning(false), 800)
  }

  const handleSave = () => {
    setSavedNotification(true)
    setTimeout(() => setSavedNotification(false), 2500)
  }

  // Filter items based on active tab
  const getFilteredItems = (): Item[] => {
    switch (activeTab) {
      case 'Hats':
        return ITEMS.filter((item) => item.type === 'hat')
      case 'Hairs':
        return ITEMS.filter((item) => item.type === 'hair')
      case 'Faces':
        return ITEMS.filter((item) => item.type === 'face')
      case 'Clothings':
        return ITEMS.filter((item) => item.type === 'clothing')
      case 'Accessorys':
        return ITEMS.filter((item) => item.type === 'accessory' || item.type === 'tool')
      default:
        return []
    }
  }

  const equippedItemsList = ITEMS.filter((item) => equippedIds.includes(item.id))
  const filteredItems = getFilteredItems()

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

  const hasEquippedHat = equippedItemsList.some((i) => i.type === 'hat')
  const hasEquippedFace = equippedItemsList.some((i) => i.type === 'face')

  // Render 3D Isometric Mannequin matching Image 1 reference
  const renderCardThumbnail = (item: Item) => {
    const isShirt = item.type === 'clothing'
    const isHat = item.type === 'hat'
    const isHair = item.type === 'hair'
    const isFace = item.type === 'face'
    const isAccessory = item.type === 'accessory' || item.type === 'tool'

    // Shirt & clothing styles
    const isCatShirt = item.name === 'i like cats'
    let shirtColor = '#e4e4e7'
    let shirtSideColor = '#cbd5e1'
    if (isShirt) {
      if (isCatShirt) {
        shirtColor = '#141416'
        shirtSideColor = '#0a0a0c'
      } else if (item.name === 'Samurai Armor') {
        shirtColor = '#991b1b'
        shirtSideColor = '#7f1d1d'
      } else if (item.name === 'Cyberpunk Jacket') {
        shirtColor = '#0f172a'
        shirtSideColor = '#020617'
      } else if (item.name === 'Tuxedo Suit') {
        shirtColor = '#18181b'
        shirtSideColor = '#09090b'
      }
    }

    return (
      <div className="w-full h-44 flex items-center justify-center relative select-none">
        <svg
          viewBox="0 0 160 190"
          className="w-full h-full max-h-44 object-contain filter drop-shadow-[0_10px_16px_rgba(0,0,0,0.45)]"
        >
          <defs>
            {/* Smooth 3D lighting gradients matching Image 1 */}
            <linearGradient id="headFrontGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#d4d4d8" />
            </linearGradient>
            <linearGradient id="headSideGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d4d4d8" />
              <stop offset="100%" stopColor="#a1a1aa" />
            </linearGradient>
            <linearGradient id="legFrontGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f4f4f5" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <linearGradient id="legRightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>

          {/* 1. Ground Drop Shadow */}
          <ellipse cx="80" cy="180" rx="44" ry="8" fill="rgba(0, 0, 0, 0.45)" />

          {/* 2. Accessories Behind (e.g. Wings) */}
          {isAccessory && item.name.includes('Wings') && (
            <g opacity="0.95">
              <path d="M 50 65 Q 15 35 10 75 Q 35 85 55 85 Z" fill="#a855f7" />
              <path d="M 110 65 Q 145 35 150 75 Q 125 85 105 85 Z" fill="#9333ea" />
            </g>
          )}

          {/* 3. Legs (Full 3D White Mannequin Legs matching Image 1) */}
          {/* Left Leg */}
          <rect x="58" y="104" width="21" height="66" rx="4" fill="url(#legFrontGrad)" />
          {item.name === 'Ripped Jeans' && (
            <rect x="58" y="104" width="21" height="50" rx="3" fill="#2563eb" />
          )}

          {/* Right Leg (Angled side depth) */}
          <rect x="80" y="101" width="21" height="66" rx="4" fill="url(#legRightGrad)" />
          {item.name === 'Ripped Jeans' && (
            <rect x="80" y="101" width="21" height="50" rx="3" fill="#1d4ed8" />
          )}

          {/* 4. Torso */}
          {/* Front Face */}
          <rect
            x="54"
            y="52"
            width="48"
            height="52"
            rx="4"
            fill={shirtColor}
          />
          {/* Right Side 3D Depth Face */}
          <polygon
            points="102,52 108,46 108,96 102,104"
            fill={shirtSideColor}
          />

          {/* Cat Shirt Graphic matching Image 1 */}
          {isCatShirt ? (
            <g>
              <rect x="62" y="58" width="32" height="34" rx="2" fill="#242427" />
              <image href="/entropy.png" x="64" y="60" width="28" height="28" preserveAspectRatio="xMidYMid slice" />
              {/* Lollipop Stick & Candy matching Image 1 */}
              <line x1="88" y1="88" x2="94" y2="76" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="95" cy="74" r="3.5" fill="#ef4444" />
            </g>
          ) : isShirt && item.name === 'Samurai Armor' ? (
            <g>
              <rect x="60" y="58" width="36" height="40" rx="2" fill="#7f1d1d" />
              <line x1="60" y1="70" x2="96" y2="70" stroke="#f59e0b" strokeWidth="2" />
              <line x1="60" y1="84" x2="96" y2="84" stroke="#f59e0b" strokeWidth="2" />
            </g>
          ) : (
            !isShirt && (
              <circle cx="78" cy="78" r="5" fill="#cbd5e1" opacity="0.5" />
            )
          )}

          {/* 5. Left Arm (Angled block matching Image 1) */}
          <rect
            x="32"
            y="54"
            width="20"
            height="50"
            rx="4"
            fill={isCatShirt ? '#141416' : shirtColor}
          />
          {isCatShirt && (
            <rect x="32" y="76" width="20" height="28" rx="3" fill="#e4e4e7" />
          )}

          {/* 6. Right Arm (Angled back with 3D depth matching Image 1) */}
          <rect
            x="104"
            y="50"
            width="20"
            height="50"
            rx="4"
            fill={isCatShirt ? '#0a0a0c' : shirtSideColor}
          />
          {isCatShirt && (
            <rect x="104" y="72" width="20" height="28" rx="3" fill="#cbd5e1" />
          )}

          {/* 7. Head (3D Cylinder Head with authentic round cap) */}
          <rect x="65" y="16" width="32" height="34" rx="9" fill="url(#headFrontGrad)" />
          <path d="M 87 16 Q 97 16 97 25 L 97 41 Q 97 50 87 50 Z" fill="url(#headSideGrad)" opacity="0.65" />

          {/* Face Features */}
          {item.name === 'Single Celled ...' ? (
            <g>
              <circle cx="75" cy="30" r="1.5" fill="#000000" />
              <circle cx="89" cy="30" r="1.5" fill="#000000" />
              <path d="M 77 39 Q 82 45 87 40" fill="none" stroke="#000000" strokeWidth="1.8" strokeLinecap="round" />
            </g>
          ) : item.name === 'D-Delayed?' ? (
            <g>
              <line x1="88" y1="20" x2="94" y2="22" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
              <ellipse cx="76" cy="27" rx="2.5" ry="3.5" fill="#ffffff" stroke="#000000" strokeWidth="1.2" />
              <ellipse cx="88" cy="27" rx="2.5" ry="3.5" fill="#ffffff" stroke="#000000" strokeWidth="1.2" />
              <circle cx="76" cy="27" r="1" fill="#000000" />
              <circle cx="88" cy="27" r="1" fill="#000000" />
              <path d="M 74 32 Q 76 34 78 32" fill="none" stroke="#000000" strokeWidth="1" opacity="0.6" />
              <path d="M 86 32 Q 88 34 90 32" fill="none" stroke="#000000" strokeWidth="1" opacity="0.6" />
              <path d="M 77 39 Q 82 42 87 39" fill="none" stroke="#000000" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          ) : item.name === 'Neon Shades' ? (
            <g>
              <rect x="68" y="26" width="26" height="8" rx="2" fill="#09090b" />
              <line x1="70" y1="30" x2="92" y2="30" stroke="#06b6d4" strokeWidth="2" />
            </g>
          ) : item.name === 'Monocle' ? (
            <g>
              <circle cx="75" cy="30" r="1.5" fill="#000000" />
              <circle cx="88" cy="30" r="4.5" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
              <circle cx="88" cy="30" r="1.5" fill="#000000" />
              <path d="M 88 35 Q 92 40 94 48" fill="none" stroke="#f59e0b" strokeWidth="1" />
              <path d="M 78 38 Q 81 41 84 38" fill="none" stroke="#000000" strokeWidth="1.4" />
            </g>
          ) : (
            !isFace && (
              <g opacity="0.5">
                <circle cx="76" cy="30" r="1.2" fill="#000000" />
                <circle cx="86" cy="30" r="1.2" fill="#000000" />
                <path d="M 78 37 Q 81 40 84 37" fill="none" stroke="#000000" strokeWidth="1.2" />
              </g>
            )
          )}

          {/* Hats */}
          {isHat && (
            <g>
              {item.name === 'Crown of Novelo' && (
                <path d="M 64 16 L 68 8 L 74 14 L 81 6 L 88 14 L 94 8 L 98 16 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
              )}
              {item.name === 'Angel Halo' && (
                <ellipse cx="81" cy="8" rx="16" ry="4" fill="none" stroke="#facc15" strokeWidth="2.5" />
              )}
              {item.name === 'Top Hat' && (
                <g>
                  <rect x="71" y="2" width="20" height="15" rx="1" fill="#18181b" />
                  <ellipse cx="81" cy="16" rx="16" ry="3" fill="#18181b" />
                </g>
              )}
              {item.name === 'Pink Bomber' && (
                <path d="M 63 16 Q 81 8 99 16 L 97 22 Q 81 18 65 22 Z" fill="#ec4899" />
              )}
              {item.name === 'Viking Helmet' && (
                <g>
                  <path d="M 64 20 Q 81 8 98 20 Z" fill="#475569" />
                  <path d="M 64 20 Q 56 12 58 6" fill="none" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 98 20 Q 106 12 104 6" fill="none" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
                </g>
              )}
            </g>
          )}

          {/* Hair */}
          {isHair && (
            <path d="M 63 22 Q 81 10 99 22 Q 95 12 81 12 Q 67 12 63 22 Z" fill="#78350f" />
          )}
        </svg>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-7 flex flex-col gap-6 max-w-[1500px]">
      {/* Title & Save Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Avatar Editor
          </h1>
          <p className="text-xs md:text-sm text-white/50 mt-0.5">
            Customize your Novelo avatar appearance, skin tones, and equipped wardrobe items
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

      {/* Main 2-Column Roblox Layout matching Screenshot 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =========================================================================
            LEFT COLUMN: AVATAR DISPLAY (Screenshot 2: Preview, Currently Wearing, R6)
            ========================================================================= */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5">
          {/* 1. Avatar Visual Display Card */}
          <div className="relative rounded-2xl bg-[#101012] border border-white/[0.06] p-6 flex flex-col items-center justify-center min-h-[440px] shadow-2xl overflow-hidden group">
            {/* Ambient Studio Lighting Backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_0%,_transparent_75%)] pointer-events-none" />

            {/* The Avatar Display Character matching Screenshot 2 */}
            <div
              className={`relative z-10 flex flex-col items-center select-none transition-transform duration-700 ${
                isSpinning ? 'rotate-[360deg] scale-105' : ''
              }`}
            >
              {/* Equipped Hat accessory hovering/sitting on head */}
              {hasEquippedHat && (
                <div className="absolute -top-6 z-20 flex items-center justify-center pointer-events-none">
                  <div className="px-3 py-1 rounded-t-xl bg-[#2a5a3a] border border-black/40 text-[10px] font-bold text-emerald-100 shadow-md">
                    Novelo Cap
                  </div>
                </div>
              )}

              {/* Head */}
              <div
                className="w-24 h-24 rounded-[14px] mb-2 transition-all relative flex flex-col items-center justify-center border border-black/20 shadow-md"
                style={{ backgroundColor: bodyColors.head }}
              >
                {/* Face Expression */}
                <div className="flex flex-col items-center gap-1.5 pointer-events-none">
                  {hasEquippedFace ? (
                    <div className="w-12 h-3.5 bg-black rounded-full border border-white/40 flex items-center justify-center">
                      <div className="w-3 h-1 bg-cyan-400 rounded-full" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="size-2 rounded-full bg-black" />
                        <div className="size-2 rounded-full bg-black" />
                      </div>
                      <div className="w-4 h-2 border-b-2 border-black rounded-b-full" />
                    </>
                  )}
                </div>
              </div>

              {/* Torso & Arms */}
              <div className="flex items-start gap-2 mb-2">
                {/* Left Arm */}
                <div
                  className="w-14 h-36 rounded-[14px] border border-black/20 transition-all shadow-md"
                  style={{ backgroundColor: bodyColors.leftArm }}
                />

                {/* Torso */}
                <div
                  className="w-32 h-36 rounded-[14px] border border-black/20 transition-all shadow-md relative flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: bodyColors.torso }}
                >
                  {/* Novelo Emblem / Clothing Print */}
                  <div className="size-10 rounded-full bg-black/20 flex items-center justify-center border border-white/10">
                    <Sparkles className="size-5 text-white/50" />
                  </div>
                </div>

                {/* Right Arm */}
                <div
                  className="w-14 h-36 rounded-[14px] border border-black/20 transition-all shadow-md"
                  style={{ backgroundColor: bodyColors.rightArm }}
                />
              </div>

              {/* Legs */}
              <div className="flex items-center gap-2">
                <div
                  className="w-15 h-36 rounded-[14px] border border-black/20 transition-all shadow-md"
                  style={{ backgroundColor: bodyColors.leftLeg }}
                />
                <div
                  className="w-15 h-36 rounded-[14px] border border-black/20 transition-all shadow-md"
                  style={{ backgroundColor: bodyColors.rightLeg }}
                />
              </div>

              {/* Ground Pedestal Shadow */}
              <div className="w-48 h-6 bg-black/50 rounded-full blur-md -mt-2 pointer-events-none" />
            </div>

            {/* 2D / 3D Mode Toggle Badge matching Screenshot 2 */}
            <button
              onClick={() => setIs2DMode(!is2DMode)}
              className="absolute bottom-3 right-3 px-2.5 py-1 rounded-[8px] bg-black/70 hover:bg-black border border-white/10 text-[11px] font-bold text-white/80 hover:text-white transition-all cursor-pointer z-20 backdrop-blur-xs"
            >
              {is2DMode ? '2D' : '3D'}
            </button>
          </div>

          {/* 2. Outfit Cost readout matching Screenshot 2 */}
          <div className="flex items-center justify-between text-xs text-white/50 px-1">
            <span className="flex items-center gap-1.5">
              Outfit Cost:
              <span className="inline-flex items-center gap-1 text-white font-mono font-bold">
                <img src="/novelo-currency.png" alt="Currency" className="size-3.5 object-contain" />
                0
              </span>
              <span className="text-white/40">• 6 offsale</span>
            </span>
          </div>

          {/* 3. Currently Wearing Section matching Screenshot 2 */}
          <div className="p-4 rounded-xl bg-[#0e0e10] border border-white/[0.04] flex flex-col gap-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Currently Wearing</h3>
                <p className="text-[11px] text-white/40">Click the red X to unequip items.</p>
              </div>

              {/* Redraw Avatar Button (Clean White) */}
              <button
                onClick={handleRedraw}
                title="Redraw Avatar"
                className="px-2.5 py-1 rounded-[8px] bg-white hover:bg-neutral-200 text-black font-bold text-xs flex items-center gap-1 transition-all cursor-pointer border-none shadow-sm active:scale-95"
              >
                <RotateCw className={`size-3 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>Redraw</span>
              </button>
            </div>

            {/* Equipped Items Horizontal Slot Strip matching Screenshot 2 */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {equippedItemsList.map((item) => (
                <div
                  key={item.id}
                  className="relative size-14 rounded-xl bg-[#151518] border border-white/10 flex flex-col items-center justify-center p-1 shrink-0 group/slot"
                >
                  <Sparkles className="size-5 text-white/50" />
                  <span className="text-[9px] font-bold text-white/70 truncate w-full text-center">
                    {item.name.slice(0, 7)}..
                  </span>

                  {/* Red X to unequip directly matching Screenshot 2 */}
                  <button
                    onClick={() => toggleEquip(item.id)}
                    title={`Unequip ${item.name}`}
                    className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center cursor-pointer border-none shadow-md transition-transform hover:scale-110"
                  >
                    <X className="size-2.5 stroke-[3]" />
                  </button>
                </div>
              ))}

              {/* Empty Add Slot */}
              <button
                onClick={() => setActiveTab('Hats')}
                title="Add more items"
                className="size-14 rounded-xl border border-dashed border-white/10 hover:border-white/30 flex items-center justify-center text-white/30 hover:text-white transition-all cursor-pointer bg-transparent shrink-0"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: CATEGORY TABS + CONTENT (Body or Wardrobe Items Grid)
            ========================================================================= */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
          {/* Top Category Tabs Row matching Screenshot 1 + "Body" Tab behind Accessories */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {(['Hats', 'Hairs', 'Faces', 'Clothings', 'Accessorys', 'Body'] as CategoryTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 h-8 rounded-[10px] text-xs font-semibold shrink-0 transition-all duration-150 cursor-pointer border-none outline-none select-none active:scale-[0.97] ${
                  activeTab === tab
                    ? 'bg-[#1d1d1d] text-white font-bold shadow-xs'
                    : 'bg-transparent text-white/50 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TAB CONTENT: Either "Body" (Avatar Editor + Color Selector) OR Items Grid */}
          {activeTab === 'Body' ? (
            /* =======================================================================
               BODY TAB: 6-Part Humanoid Schematic + 2D HSV Color Spectrum (Image 3)
               ======================================================================= */
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
              {/* Left: The Humanoid Body Part Clicker */}
              <div className="xl:col-span-5 rounded-2xl bg-[#0e0e10] border border-white/[0.04] p-6 flex flex-col items-center justify-center min-h-[460px] shadow-2xl relative select-none">
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
                    className={`w-24 h-24 rounded-[14px] mb-2 transition-all cursor-pointer relative ${
                      selectedPart === 'head' || selectedPart === 'all'
                        ? 'border-[3px] border-black shadow-[0_0_0_1px_rgba(255,255,255,0.2)] scale-[1.02]'
                        : 'border border-black/20 hover:brightness-105'
                    }`}
                    style={{ backgroundColor: bodyColors.head }}
                  />

                  {/* Torso & Arms Row */}
                  <div className="flex items-start gap-2 mb-2">
                    {/* Left Arm */}
                    <button
                      onClick={() => setSelectedPart('leftArm')}
                      title="Left Arm"
                      className={`w-16 h-36 rounded-[14px] transition-all cursor-pointer ${
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
                      className={`w-36 h-36 rounded-[14px] transition-all cursor-pointer relative ${
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
                      className={`w-16 h-36 rounded-[14px] transition-all cursor-pointer ${
                        selectedPart === 'rightArm' || selectedPart === 'all'
                          ? 'border-[3px] border-black shadow-[0_0_0_1px_rgba(255,255,255,0.2)] scale-[1.02]'
                          : 'border border-black/20 hover:brightness-105'
                      }`}
                      style={{ backgroundColor: bodyColors.rightArm }}
                    />
                  </div>

                  {/* Legs Row */}
                  <div className="flex items-center gap-2">
                    {/* Left Leg */}
                    <button
                      onClick={() => setSelectedPart('leftLeg')}
                      title="Left Leg"
                      className={`w-17 h-38 rounded-[14px] transition-all cursor-pointer ${
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
                      className={`w-17 h-38 rounded-[14px] transition-all cursor-pointer ${
                        selectedPart === 'rightLeg' || selectedPart === 'all'
                          ? 'border-[3px] border-black shadow-[0_0_0_1px_rgba(255,255,255,0.2)] scale-[1.02]'
                          : 'border border-black/20 hover:brightness-105'
                      }`}
                      style={{ backgroundColor: bodyColors.rightLeg }}
                    />
                  </div>
                </div>

                {/* White Part Label matching Image 1 request */}
                <span className="text-sm font-bold text-white tracking-wide mt-3">
                  {getPartLabel(selectedPart)}
                </span>
              </div>

              {/* Right: Full 2D Color Picker matching Image 3 */}
              <div className="xl:col-span-7 p-6 rounded-2xl bg-[#0e0e10] border border-white/[0.04] flex flex-col gap-4 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    Coloring: <span className="text-white font-extrabold">{getPartLabel(selectedPart)}</span>
                  </span>
                  <span className="text-xs text-white/40">Drag spectrum or pick from skin presets</span>
                </div>

                {/* 1. Large 2D Saturation / Value Gradient Canvas */}
                <div
                  ref={spectrumRef}
                  onMouseDown={handleSpectrumDown}
                  className="relative w-full h-64 rounded-2xl cursor-crosshair overflow-hidden shadow-inner select-none"
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

                  {/* Draggable Circle Selector Point */}
                  <div
                    className="absolute size-4 rounded-full border-2 border-white shadow-[0_0_4px_rgba(0,0,0,0.8)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{
                      left: `${saturation}%`,
                      top: `${100 - value}%`,
                      backgroundColor: hexInput,
                    }}
                  />
                </div>

                {/* 2. Rainbow Hue Slider */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span className="font-semibold text-white/70">Hue</span>
                  </div>
                  <div className="relative flex items-center h-5 w-full px-1">
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

                {/* 3. Skin Tone Swatches Row (With horizontal padding so ends are never cropped) */}
                <div className="flex items-center justify-between gap-1.5 px-3 py-2 overflow-x-auto no-scrollbar">
                  {PRESET_SKIN_TONES.map((color) => {
                    const isSelected = hexInput.toLowerCase() === color.toLowerCase()
                    return (
                      <button
                        key={color}
                        onClick={() => handlePresetClick(color)}
                        style={{ backgroundColor: color }}
                        className={`size-6 rounded-full cursor-pointer transition-all duration-150 border border-black/30 shrink-0 ${
                          isSelected
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0e0e10] scale-110 z-10'
                            : 'hover:scale-110 opacity-90 hover:opacity-100'
                        }`}
                      />
                    )
                  })}
                </div>

                {/* 4. Saturation & Brightness Readout */}
                <div className="flex items-center justify-between text-xs text-white/50 pt-0.5">
                  <span>Saturation {saturation}%</span>
                  <span>Brightness {value}%</span>
                </div>

                {/* 5. Hex Input Box */}
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
            </div>
          ) : (
            /* =======================================================================
               WARDROBE ITEMS GRID TAB matching Screenshot 2 (Hats, Hairs, Faces, etc.)
               ======================================================================= */
            <div className="p-6 rounded-2xl bg-[#0e0e10] border border-white/[0.04] flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between pb-1 border-b border-white/[0.04]">
                <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
                  {activeTab} ({filteredItems.length} items)
                </span>
                <span className="text-xs text-white/40">Click any item to equip or unequip</span>
              </div>

              {/* 5-Column Grid matching Screenshot 2 & Card Design */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3.5">
                {filteredItems.map((item) => {
                  const isEquipped = equippedIds.includes(item.id)
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleEquip(item.id)}
                      className={`group rounded-[12px] p-2.5 flex flex-col gap-2 cursor-pointer transition-colors duration-150 relative select-none ${
                        isEquipped
                          ? 'bg-[#1c1c1f] ring-1 ring-white/20 shadow-lg'
                          : 'bg-[#121214] hover:bg-[#1c1c1f]'
                      }`}
                    >
                      {/* Top Right Equipped Checkmark Circle */}
                      {isEquipped && (
                        <div className="absolute top-2 right-2 size-5 rounded-full bg-white text-black flex items-center justify-center shadow-md z-20">
                          <Check className="size-3 stroke-[3]" />
                        </div>
                      )}

                      {/* Mannequin Thumbnail matching user reference */}
                      {renderCardThumbnail(item)}

                      {/* Left-Aligned Card Details matching reference */}
                      <div className="w-full flex flex-col gap-0.5 text-left">
                        <h4 className="text-xs md:text-[13px] font-bold text-white truncate leading-tight group-hover:text-white">
                          {item.name}
                        </h4>
                        <span className="text-[11px] text-white/50 truncate">
                          By <span className="text-white/70 font-medium">{item.creator}</span>
                        </span>
                        <div className="flex items-center gap-1 mt-0.5 text-xs font-bold text-white">
                          {item.price === 0 ? (
                            <span className="text-[11px] font-bold text-white/80">Free</span>
                          ) : (
                            <>
                              <img
                                src="/novelo-currency.png"
                                alt="Currency"
                                className="size-3 object-contain shrink-0"
                              />
                              <span>{item.price}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}