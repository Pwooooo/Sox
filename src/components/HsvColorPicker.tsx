import { useCallback, useEffect, useRef, useState } from 'react'

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  s /= 100
  v /= 100
  const k = (n: number) => (n + h / 60) % 6
  const f = (n: number) => v * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)))
  return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)]
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '').trim()
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16)
    const g = parseInt(clean[1] + clean[1], 16)
    const b = parseInt(clean[2] + clean[2], 16)
    if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) return [r, g, b]
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16)
    const g = parseInt(clean.slice(2, 4), 16)
    const b = parseInt(clean.slice(4, 6), 16)
    if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) return [r, g, b]
  }
  return null
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  const s = max === 0 ? 0 : d / max
  const v = max
  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)]
}

interface HsvColorPickerProps {
  value: string
  onChange: (hex: string) => void
  spectrumClassName?: string
}

export function HsvColorPicker({
  value: hexValue,
  onChange,
  spectrumClassName = 'h-32',
}: HsvColorPickerProps) {
  const [hue, setHue] = useState(0)
  const [saturation, setSaturation] = useState(0)
  const [brightness, setBrightness] = useState(6)
  const spectrumRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)

  useEffect(() => {
    const rgb = hexToRgb(hexValue)
    if (!rgb) return
    const [h, s, v] = rgbToHsv(...rgb)
    setHue(h)
    setSaturation(s)
    setBrightness(v)
  }, [hexValue])

  const emitColor = useCallback(
    (h: number, s: number, v: number) => {
      const [r, g, b] = hsvToRgb(h, s, v)
      onChange(rgbToHex(r, g, b))
    },
    [onChange],
  )

  const handleSpectrumMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!spectrumRef.current) return
      const rect = spectrumRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left))
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top))
      const s = Math.round((x / rect.width) * 100)
      const v = Math.round(100 - (y / rect.height) * 100)
      setSaturation(s)
      setBrightness(v)
      emitColor(hue, s, v)
    },
    [hue, emitColor],
  )

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (draggingRef.current) handleSpectrumMove(e.clientX, e.clientY)
    }
    const onUp = () => {
      draggingRef.current = false
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [handleSpectrumMove])

  return (
    <div className="flex flex-col gap-3">
      {/* 2D Saturation / Value Gradient Canvas */}
      <div
        ref={spectrumRef}
        onMouseDown={(e) => {
          draggingRef.current = true
          handleSpectrumMove(e.clientX, e.clientY)
        }}
        className={`relative w-full ${spectrumClassName} rounded-xl cursor-crosshair overflow-hidden shadow-inner select-none`}
        style={{ backgroundColor: `hsl(${hue}, 100%, 50%)` }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, #ffffff, transparent)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, #000000, transparent)' }}
        />
        <div
          className="absolute size-4 rounded-full border-2 border-white shadow-[0_0_4px_rgba(0,0,0,0.8)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: `${saturation}%`,
            top: `${100 - brightness}%`,
            backgroundColor: hexValue,
          }}
        />
      </div>

      {/* Rainbow Hue Slider */}
      <div className="flex flex-col gap-1">
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
              emitColor(h, saturation, brightness)
            }}
            className="hue-slider w-full h-2.5 rounded-full cursor-pointer outline-none"
            style={{
              background:
                'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
