import { useMemo } from 'react'

interface HexCell {
  cx: number
  cy: number
  hex: string
}

function hslToHex(h: number, s: number, l: number): string {
  const sNorm = Math.max(0, Math.min(1, s / 100))
  const lNorm = Math.max(0, Math.min(1, l / 100))
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = lNorm - c / 2
  let r = 0
  let g = 0
  let b = 0
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]

  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function hexPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 30)
    pts.push(`${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`)
  }
  return pts.join(' ')
}

const GRAYSCALE_ROW = [
  '#050505',
  '#5a5a5a',
  '#8c8c8c',
  '#b4b4b4',
  '#d8d8d8',
  '#ececec',
  '#1b262c',
  '#4f5561',
  '#8b93a1',
  '#bfc5cf',
  '#e2e5ea',
  '#f4f5f7',
  '#ffffff',
]

const HEX_RADIUS = 9.2
const GRID_RADIUS = 6
const SVG_CENTER_X = 112
const SVG_CENTER_Y = 98

export function HexColorPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (hex: string) => void
}) {
  const cells = useMemo(() => {
    const list: HexCell[] = []
    const maxDist = HEX_RADIUS * Math.sqrt(3) * GRID_RADIUS

    for (let r = -GRID_RADIUS; r <= GRID_RADIUS; r++) {
      const qMin = Math.max(-GRID_RADIUS, -r - GRID_RADIUS)
      const qMax = Math.min(GRID_RADIUS, -r + GRID_RADIUS)
      for (let q = qMin; q <= qMax; q++) {
        const dx = HEX_RADIUS * Math.sqrt(3) * (q + r / 2)
        const dy = HEX_RADIUS * 1.5 * r
        const dist = Math.hypot(dx, dy)
        const normDist = Math.min(1, dist / maxDist)

        // Match Studio hex palette orientation: red right, yellow left, green top-left, blue top-right
        let angleDeg = (Math.atan2(-dy, dx) * 180) / Math.PI
        if (angleDeg < 0) angleDeg += 360

        const hue = (angleDeg + 360) % 360
        const sat = normDist === 0 ? 0 : Math.min(98, 22 + normDist * 78)
        // Top is deeper/richer, bottom-center is warmer/lighter, outer edge slightly darker
        const verticalBias = (dy / maxDist) * 14
        const light = Math.max(16, Math.min(90, 74 - normDist * 36 + verticalBias))

        list.push({
          cx: SVG_CENTER_X + dx,
          cy: SVG_CENTER_Y + dy,
          hex: hslToHex(hue, sat, light),
        })
      }
    }
    return list
  }, [])

  const bottomRow = useMemo(() => {
    const startX = SVG_CENTER_X - HEX_RADIUS * Math.sqrt(3) * 6
    const y = SVG_CENTER_Y + HEX_RADIUS * 1.5 * (GRID_RADIUS + 1) + 4
    return GRAYSCALE_ROW.map((hex, idx) => ({
      cx: startX + idx * HEX_RADIUS * Math.sqrt(3),
      cy: y,
      hex,
    }))
  }, [])

  const normalizedValue = value.toLowerCase()
  const allCells = [...cells, ...bottomRow]
  const selectedCell = allCells.find((c) => c.hex.toLowerCase() === normalizedValue)

  return (
    <svg
      viewBox="0 0 224 214"
      className="w-full h-auto select-none block overflow-visible"
      role="listbox"
      aria-label="Color Palette"
    >
      {allCells.map((cell, idx) => (
        <g
          key={idx}
          onClick={() => onChange(cell.hex)}
          className="cursor-pointer"
        >
          <polygon
            points={hexPoints(cell.cx, cell.cy, HEX_RADIUS)}
            fill={cell.hex}
            stroke="#111215"
            strokeWidth={1.1}
          />
        </g>
      ))}
      {selectedCell && (
        <polygon
          points={hexPoints(selectedCell.cx, selectedCell.cy, HEX_RADIUS)}
          fill={selectedCell.hex}
          stroke="#ffffff"
          strokeWidth={1.8}
          className="pointer-events-none"
        />
      )}
    </svg>
  )
}
