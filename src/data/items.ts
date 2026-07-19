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

export const ITEMS: Item[] = [
  { id: 1, name: 'Crown of Novelo', type: 'hat', price: 250, sales: 15320, creator: 'PixelMaster', rating: 4.9, desc: 'A majestic crown fit for royalty. Stand out from the crowd with golden trim and embedded gems.' },
  { id: 2, name: 'Dragon Wings', type: 'accessory', price: 450, sales: 8940, creator: 'FantasyForge', rating: 4.8, desc: 'Soar through the skies with these magnificent dragon wings. Animated with realistic feather physics.' },
  { id: 3, name: 'Neon Shades', type: 'face', price: 35, sales: 44200, creator: 'CyberStyle', rating: 4.5, desc: 'LED-lit sunglasses with customizable colors. Sync with your outfit for the perfect look.' },
  { id: 4, name: 'Samurai Armor', type: 'clothing', price: 180, sales: 6750, creator: 'LunarDesigns', rating: 4.7, desc: 'Full samurai armor set with intricate patterns. Lightweight and battle-ready.' },
  { id: 5, name: 'Pink Bomber', type: 'hat', price: 0, sales: 28100, creator: 'UrbanWear', rating: 4.2, desc: 'A stylish pink bomber hat. Free for everyone!' },
  { id: 6, name: 'Starfall Staff', type: 'tool', price: 320, sales: 5600, creator: 'MagicWorks', rating: 4.9, desc: 'Channel cosmic energy with this enchanted staff. Includes particle effects and custom animations.' },
  { id: 7, name: 'Cat Ears', type: 'hair', price: 60, sales: 38900, creator: 'KawaiiClub', rating: 4.6, desc: 'Adorable cat ears with 12 color options. Meow!' },
  { id: 8, name: 'Cyberpunk Jacket', type: 'clothing', price: 150, sales: 12400, creator: 'NeonNation', rating: 4.7, desc: 'A futuristic jacket with LED trim and holographic patches.' },
  { id: 9, name: 'Ghostly Aura', type: 'accessory', price: 200, sales: 7200, creator: 'SpookyStudio', rating: 4.4, desc: 'An ethereal ghost effect that follows your movements.' },
  { id: 10, name: 'Golden Watch', type: 'accessory', price: 500, sales: 3400, creator: 'LuxuryLabs', rating: 4.8, desc: 'A premium golden wristwatch with working clock face.' },
  { id: 11, name: 'Flame Skull', type: 'face', price: 120, sales: 8900, creator: 'HellfireHUD', rating: 4.3, desc: 'A blazing skull face with animated fire effects.' },
  { id: 12, name: 'Jetpack', type: 'tool', price: 380, sales: 4500, creator: 'TechTitan', rating: 4.6, desc: 'Rocket-powered jetpack with flight mechanics and trail effects.' },
  { id: 13, name: 'Angel Halo', type: 'hat', price: 175, sales: 11200, creator: 'DivineDesigns', rating: 4.7, desc: 'A radiant halo that gently rotates above your head.' },
  { id: 14, name: 'Ripped Jeans', type: 'clothing', price: 45, sales: 21500, creator: 'UrbanWear', rating: 4.1, desc: 'Classic ripped jeans with distressed detailing.' },
  { id: 15, name: 'Wizard Beard', type: 'hair', price: 85, sales: 6800, creator: 'FantasyForge', rating: 4.5, desc: 'A long flowing wizard beard. Comes in 8 colors.' },
  { id: 16, name: 'Pixel Sword', type: 'tool', price: 90, sales: 31200, creator: 'RetroRealm', rating: 4.4, desc: 'An 8-bit inspired pixel sword with retro sound effects.' },
  { id: 17, name: 'Top Hat', type: 'hat', price: 70, sales: 18900, creator: 'ClassicCuts', rating: 4.3, desc: 'A classic black top hat. Timeless elegance.' },
  { id: 18, name: 'Diamond Necklace', type: 'accessory', price: 600, sales: 2100, creator: 'LuxuryLabs', rating: 4.9, desc: 'A stunning diamond necklace with real-time reflections.' },
  { id: 19, name: 'Alien Antenna', type: 'hair', price: 40, sales: 15600, creator: 'SpaceStyle', rating: 4.0, desc: 'Extraterrestrial antenna headband with blinking lights.' },
  { id: 20, name: 'Viking Helmet', type: 'hat', price: 130, sales: 5400, creator: 'NordicNorse', rating: 4.6, desc: 'A fearsome Viking helmet with authentic horn details.' },
  { id: 21, name: 'Tuxedo Suit', type: 'clothing', price: 200, sales: 9800, creator: 'ClassicCuts', rating: 4.7, desc: 'A sharp tuxedo for formal occasions.' },
  { id: 22, name: 'Laser Gun', type: 'tool', price: 280, sales: 8300, creator: 'TechTitan', rating: 4.5, desc: 'A high-powered laser gun with customizable beam colors.' },
  { id: 23, name: 'Butterfly Wings', type: 'accessory', price: 300, sales: 6700, creator: 'FantasyForge', rating: 4.7, desc: 'Delicate butterfly wings with iridescent shimmer.' },
  { id: 24, name: 'Monocle', type: 'face', price: 55, sales: 12400, creator: 'ClassicCuts', rating: 4.2, desc: 'A sophisticated monocle with gold chain.' },
]

export const CATEGORIES = [
  { key: '', name: 'All Items', icon: '📦', count: 50 },
  { key: 'hat', name: 'Hats', icon: '🎩', count: 8 },
  { key: 'hair', name: 'Hair', icon: '💇', count: 4 },
  { key: 'face', name: 'Faces', icon: '😊', count: 3 },
  { key: 'clothing', name: 'Clothing', icon: '👕', count: 4 },
  { key: 'accessory', name: 'Accessories', icon: '💎', count: 5 },
  { key: 'tool', name: 'Tools', icon: '🔧', count: 4 },
]

export const CREATORS = [
  { name: 'PixelMaster', sales: 45200, items: 28 },
  { name: 'FantasyForge', sales: 38100, items: 22 },
  { name: 'TechTitan', sales: 29400, items: 18 },
  { name: 'UrbanWear', sales: 26700, items: 15 },
  { name: 'LuxuryLabs', sales: 23100, items: 12 },
  { name: 'ClassicCuts', sales: 19800, items: 14 },
]

export const INVENTORY_IDS = [1, 5, 7, 10, 13, 16, 17, 19, 24]

export const TYPE_ICONS: Record<string, string> = {
  hat: '🎩', hair: '💇', face: '😊', clothing: '👕', accessory: '💎', tool: '🔧',
}

export function formatPrice(price: number) {
  if (price === 0) return 'FREE'
  return price.toLocaleString() + ' B'
}
