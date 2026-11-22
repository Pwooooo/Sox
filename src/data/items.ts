export interface Item {
  id: number
  name: string
  type: 'hat' | 'hair' | 'face' | 'clothing' | 'accessory' | 'tool'
  price: number
  sales: number
  creator: string
  rating: number
  desc: string
}

export const ITEMS: Item[] = []

export const CATEGORIES = [
  { key: '', name: 'All Items', count: 0 },
  { key: 'hat', name: 'Hats', count: 0 },
  { key: 'hair', name: 'Hair', count: 0 },
  { key: 'face', name: 'Faces', count: 0 },
  { key: 'clothing', name: 'Clothing', count: 0 },
  { key: 'accessory', name: 'Accessories', count: 0 },
  { key: 'tool', name: 'Tools', count: 0 },
]

export const CREATORS: { name: string; sales: number; items: number }[] = []

export const INVENTORY_IDS: number[] = []

export const TYPE_LABELS: Record<string, string> = {
  hat: 'Hat',
  hair: 'Hair',
  face: 'Face',
  clothing: 'Shirt',
  accessory: 'Acc',
  tool: 'Tool',
}

export function formatPrice(price: number) {
  if (price === 0) return 'FREE'
  return price.toLocaleString()
}
