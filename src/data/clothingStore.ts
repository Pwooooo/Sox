import { supabase } from '@/lib/supabase'

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
const EQUIPPED_STORAGE_KEY = 'novelo_equipped_clothing_v1'
const BALANCE_STORAGE_KEY = 'novelo_novlux_balance_v1'
const OWNED_STORAGE_KEY = 'novelo_owned_items_v1'
const FAVORITES_STORAGE_KEY = 'novelo_favorite_items_v1'
const VOTES_STORAGE_KEY = 'novelo_item_votes_v1'

export const CLOTHING_UPDATED_EVENT = 'novelo-clothing-updated'
export const EQUIPPED_CLOTHING_EVENT = 'novelo-equipped-clothing-updated'
export const NOVLUX_BALANCE_EVENT = 'novelo-novlux-balance-updated'
export const OWNED_ITEMS_EVENT = 'novelo-owned-items-updated'
export const FAVORITE_ITEMS_EVENT = 'novelo-favorite-items-updated'
export const ITEM_VOTES_EVENT = 'novelo-item-votes-updated'

let pendingMetadataPatch: Record<string, unknown> = {}
let metadataSyncTimer: ReturnType<typeof setTimeout> | null = null

export function syncUserMetadata(patch: Record<string, unknown>): void {
  if (!supabase) return
  pendingMetadataPatch = { ...pendingMetadataPatch, ...patch }
  if (metadataSyncTimer) clearTimeout(metadataSyncTimer)
  metadataSyncTimer = setTimeout(async () => {
    const payload = pendingMetadataPatch
    pendingMetadataPatch = {}
    metadataSyncTimer = null
    if (!supabase) return
    try {
      const { data } = await supabase.auth.getSession()
      if (!data.session?.user) return
      await supabase.auth.updateUser({ data: payload })
    } catch {
      // ignore network/auth sync errors
    }
  }, 250)
}

export function hasStoredNovluxBalance(): boolean {
  try {
    return localStorage.getItem(BALANCE_STORAGE_KEY) !== null
  } catch {
    return false
  }
}

export function loadNovluxBalance(): number {
  try {
    const raw = localStorage.getItem(BALANCE_STORAGE_KEY)
    if (raw === null) return 1250
    const parsed = Number(raw)
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 1250
  } catch {
    return 1250
  }
}

export function saveNovluxBalance(amount: number, syncRemote = true): void {
  const safe = Math.max(0, Math.floor(amount))
  try {
    localStorage.setItem(BALANCE_STORAGE_KEY, String(safe))
    window.dispatchEvent(new CustomEvent(NOVLUX_BALANCE_EVENT, { detail: safe }))
  } catch {
    // ignore
  }
  if (syncRemote) {
    syncUserMetadata({ novlux_balance: safe })
  }
}

export function loadOwnedItemIds(): string[] {
  try {
    const raw = localStorage.getItem(OWNED_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

export function saveOwnedItemIds(ids: string[], syncRemote = true): string[] {
  const next = Array.from(new Set(ids.map(String)))
  try {
    localStorage.setItem(OWNED_STORAGE_KEY, JSON.stringify(next))
    window.dispatchEvent(new CustomEvent(OWNED_ITEMS_EVENT, { detail: next }))
  } catch {
    // ignore
  }
  if (syncRemote) {
    syncUserMetadata({ owned_items: next })
  }
  return next
}

export function addOwnedItemId(id: string): string[] {
  const current = loadOwnedItemIds()
  if (current.includes(id)) return current
  return saveOwnedItemIds([...current, id], true)
}

export function removeOwnedItemId(id: string): string[] {
  const next = saveOwnedItemIds(loadOwnedItemIds().filter((x) => x !== id), true)
  const equipped = loadEquippedClothingIds()
  if (equipped.shirtId === id || equipped.pantsId === id || equipped.tshirtId === id) {
    saveEquippedClothingIds({
      ...equipped,
      shirtId: equipped.shirtId === id ? undefined : equipped.shirtId,
      pantsId: equipped.pantsId === id ? undefined : equipped.pantsId,
      tshirtId: equipped.tshirtId === id ? undefined : equipped.tshirtId,
    })
  }
  return next
}

export function loadFavoriteItemIds(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

export function saveFavoriteItemIds(ids: string[], syncRemote = true): string[] {
  const next = Array.from(new Set(ids.map(String)))
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next))
    window.dispatchEvent(new CustomEvent(FAVORITE_ITEMS_EVENT, { detail: next }))
  } catch {
    // ignore
  }
  if (syncRemote) {
    syncUserMetadata({ favorite_items: next })
  }
  return next
}

export function toggleFavoriteItemId(id: string): boolean {
  const current = loadFavoriteItemIds()
  const exists = current.includes(id)
  const next = exists ? current.filter((x) => x !== id) : [...current, id]
  saveFavoriteItemIds(next, true)
  return !exists
}

export type ItemVoteState = 'up' | 'down' | null

export function loadItemVotes(): Record<string, 'up' | 'down'> {
  try {
    const raw = localStorage.getItem(VOTES_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, 'up' | 'down'>) : {}
  } catch {
    return {}
  }
}

export function toggleItemVote(id: string, vote: 'up' | 'down'): ItemVoteState {
  const current = loadItemVotes()
  const nextVal: ItemVoteState = current[id] === vote ? null : vote
  const next = { ...current }
  if (nextVal === null) {
    delete next[id]
  } else {
    next[id] = nextVal
  }
  try {
    localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(next))
    window.dispatchEvent(new CustomEvent(ITEM_VOTES_EVENT, { detail: next }))
  } catch {
    // ignore
  }
  return nextVal
}

export function incrementItemSales(id: string): void {
  const items = loadCreatedClothing()
  let changed = false
  const next = items.map((it) => {
    if (it.id === id) {
      changed = true
      return { ...it, sold: (it.sold ?? 0) + 1 }
    }
    return it
  })
  if (changed) {
    saveCreatedClothing(next)
  }
}

export interface EquippedClothingIds {
  shirtId?: string
  pantsId?: string
  tshirtId?: string
}

export function loadEquippedClothingIds(): EquippedClothingIds {
  try {
    const raw = localStorage.getItem(EQUIPPED_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as EquippedClothingIds) : {}
  } catch {
    return {}
  }
}

export function saveEquippedClothingIds(ids: EquippedClothingIds, syncRemote = true): void {
  try {
    localStorage.setItem(EQUIPPED_STORAGE_KEY, JSON.stringify(ids))
    window.dispatchEvent(new CustomEvent(EQUIPPED_CLOTHING_EVENT, { detail: ids }))
  } catch {
    // ignore
  }
  if (syncRemote) {
    syncUserMetadata({ equipped_clothing: ids })
  }
}

export function resolveEquippedClothing(ids: EquippedClothingIds): {
  shirt?: string
  pants?: string
  tshirt?: string
} {
  const all = loadCreatedClothing()
  const byId = new Map(all.map((i) => [i.id, i]))
  return {
    shirt: ids.shirtId ? byId.get(ids.shirtId)?.textureDataUrl : undefined,
    pants: ids.pantsId ? byId.get(ids.pantsId)?.textureDataUrl : undefined,
    tshirt: ids.tshirtId ? byId.get(ids.tshirtId)?.textureDataUrl : undefined,
  }
}

export function loadCreatedClothing(): CreatedClothingItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const items = parsed as CreatedClothingItem[]

    // Migrate legacy non-numeric IDs (e.g. cloth_...) to sequential numeric IDs ("1", "2", ...)
    if (items.some((item) => !/^\d+$/.test(String(item.id)))) {
      const usedIds = new Set(
        items.filter((i) => /^\d+$/.test(String(i.id))).map((i) => Number(i.id)),
      )
      let nextNum = usedIds.size > 0 ? Math.max(...usedIds) + 1 : 1
      const idMap = new Map<string, string>()

      // Assign lowest numbers to oldest items first
      const byOldest = [...items].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
      for (const item of byOldest) {
        if (!/^\d+$/.test(String(item.id))) {
          while (usedIds.has(nextNum)) nextNum++
          idMap.set(item.id, String(nextNum))
          usedIds.add(nextNum)
          nextNum++
        }
      }

      const migrated = items.map((item) =>
        idMap.has(item.id) ? { ...item, id: idMap.get(item.id)! } : item,
      )
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))

      const equipped = loadEquippedClothingIds()
      let eqChanged = false
      const nextEq = { ...equipped }
      if (nextEq.shirtId && idMap.has(nextEq.shirtId)) {
        nextEq.shirtId = idMap.get(nextEq.shirtId)
        eqChanged = true
      }
      if (nextEq.pantsId && idMap.has(nextEq.pantsId)) {
        nextEq.pantsId = idMap.get(nextEq.pantsId)
        eqChanged = true
      }
      if (nextEq.tshirtId && idMap.has(nextEq.tshirtId)) {
        nextEq.tshirtId = idMap.get(nextEq.tshirtId)
        eqChanged = true
      }
      if (eqChanged) {
        localStorage.setItem(EQUIPPED_STORAGE_KEY, JSON.stringify(nextEq))
      }
      return migrated
    }

    return items
  } catch {
    return []
  }
}

export function saveCreatedClothing(items: CreatedClothingItem[], syncRemote = true): void {
  try {
    const serialized = JSON.stringify(items)
    localStorage.setItem(STORAGE_KEY, serialized)
    window.dispatchEvent(new CustomEvent(CLOTHING_UPDATED_EVENT, { detail: items }))
    if (syncRemote && serialized.length <= 24000) {
      syncUserMetadata({ created_clothing: items })
    }
  } catch {
    // ignore storage quota errors
  }
}

export function addCreatedClothing(
  item: Omit<CreatedClothingItem, 'id' | 'sold' | 'createdAt'>
): CreatedClothingItem {
  const existing = loadCreatedClothing()
  const maxId = existing.reduce((max, cur) => {
    const n = Number(cur.id)
    return Number.isFinite(n) && n > max ? n : max
  }, 0)
  const created: CreatedClothingItem = {
    ...item,
    id: String(maxId + 1),
    sold: 0,
    createdAt: Date.now(),
  }
  const next = [created, ...existing]
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
