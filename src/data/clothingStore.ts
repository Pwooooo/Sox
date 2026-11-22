export type ClothingType = 'Shirt' | 'Pants' | 'T-Shirt'

export interface CreatedClothingItem {
  id: string
  type: ClothingType
  name: string
  description: string
  price: number
  textureDataUrl: string
  creator: string
  sold: number
  createdAt: number
}

const STORAGE_KEY = 'novelo_created_clothing_v1'
export const CLOTHING_UPDATED_EVENT = 'novelo-clothing-updated'

export function loadCreatedClothing(): CreatedClothingItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as CreatedClothingItem[]) : []
  } catch {
    return []
  }
}

export function saveCreatedClothing(items: CreatedClothingItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    window.dispatchEvent(new CustomEvent(CLOTHING_UPDATED_EVENT, { detail: items }))
  } catch {
    // ignore storage quota errors
  }
}

export function addCreatedClothing(
  item: Omit<CreatedClothingItem, 'id' | 'sold' | 'createdAt'>
): CreatedClothingItem {
  const created: CreatedClothingItem = {
    ...item,
    id: `cloth_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    sold: 0,
    createdAt: Date.now(),
  }
  const next = [created, ...loadCreatedClothing()]
  saveCreatedClothing(next)
  return created
}

export function deleteCreatedClothing(id: string): void {
  const next = loadCreatedClothing().filter((item) => item.id !== id)
  saveCreatedClothing(next)
}

/** Generates and downloads a standard 585x559 Roblox/Novelo clothing template PNG. */
export function downloadClothingTemplate(type: ClothingType): void {
  const canvas = document.createElement('canvas')
  canvas.width = 585
  canvas.height = 559
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, 585, 559)

  const drawBox = (x: number, y: number, w: number, h: number, color: string, label: string) => {
    ctx.fillStyle = color
    ctx.fillRect(x, y, w, h)
    ctx.strokeStyle = 'rgba(0,0,0,0.45)'
    ctx.lineWidth = 2
    ctx.strokeRect(x + 1, y + 1, w - 2, h - 2)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 12px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, x + w / 2, y + h / 2)
  }

  if (type === 'T-Shirt') {
    canvas.width = 512
    canvas.height = 512
    drawBox(32, 32, 448, 448, '#2563eb', 'T-SHIRT GRAPHIC')
  } else {
    // Torso
    drawBox(231, 8, 128, 64, '#ef4444', 'UP')
    drawBox(165, 74, 64, 128, '#f97316', 'L')
    drawBox(231, 74, 128, 128, '#3b82f6', 'FRONT')
    drawBox(361, 74, 64, 128, '#eab308', 'R')
    drawBox(427, 74, 128, 128, '#8b5cf6', 'BACK')
    drawBox(231, 204, 128, 64, '#10b981', 'DOWN')

    const limbPrefix = type === 'Shirt' ? 'ARM' : 'LEG'
    // Right limb
    drawBox(217, 289, 64, 64, '#ef4444', 'UP')
    drawBox(19, 355, 64, 128, '#f97316', `R ${limbPrefix}`)
    drawBox(85, 355, 64, 128, '#8b5cf6', 'BACK')
    drawBox(151, 355, 64, 128, '#eab308', 'IN')
    drawBox(217, 355, 64, 128, '#3b82f6', 'FRONT')
    drawBox(217, 485, 64, 64, '#10b981', 'DOWN')

    // Left limb
    drawBox(308, 289, 64, 64, '#ef4444', 'UP')
    drawBox(308, 355, 64, 128, '#3b82f6', 'FRONT')
    drawBox(374, 355, 64, 128, '#eab308', 'IN')
    drawBox(440, 355, 64, 128, '#f97316', `L ${limbPrefix}`)
    drawBox(506, 355, 64, 128, '#8b5cf6', 'BACK')
    drawBox(308, 485, 64, 64, '#10b981', 'DOWN')
  }

  const link = document.createElement('a')
  link.download = `novelo_${type.toLowerCase().replace('-', '')}_template.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}
