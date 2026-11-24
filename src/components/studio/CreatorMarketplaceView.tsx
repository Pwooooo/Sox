import { useState, useEffect, useRef } from 'react'
import { Plus, Upload, X, Trash2, Menu } from 'lucide-react'
import { CustomDropdown, DropdownOption } from '@/components/CustomDropdown'
import { PlayerModel3D, ClothingSelection } from '@/components/PlayerModel3D'
import { useAuth } from '@/lib/auth'
import {
  ClothingType,
  CreatedClothingItem,
  loadCreatedClothing,
  addCreatedClothing,
  deleteCreatedClothing,
  downloadClothingTemplate,
  CLOTHING_UPDATED_EVENT,
} from '@/data/clothingStore'

interface CreatorMarketplaceViewProps {
  title?: string
}

const FILTER_TABS: ('All' | ClothingType)[] = ['All', 'Shirt', 'Pants', 'T-Shirt']
const TYPE_OPTIONS: DropdownOption<ClothingType>[] = [
  { value: 'Shirt', label: 'Shirt' },
  { value: 'Pants', label: 'Pants' },
  { value: 'T-Shirt', label: 'T-Shirt' },
]

function toClothingSelection(type: ClothingType, textureDataUrl: string): ClothingSelection {
  if (type === 'Shirt') return { shirt: textureDataUrl }
  if (type === 'Pants') return { pants: textureDataUrl }
  return { tshirt: textureDataUrl }
}

export function CreatorMarketplaceView({ title = 'Marketplace' }: CreatorMarketplaceViewProps) {
  const { user, profile } = useAuth()
  const currentUsername =
    profile?.username || (user?.user_metadata?.username as string) || 'Player'
  const [items, setItems] = useState<CreatedClothingItem[]>(() => loadCreatedClothing())
  const [filterTab, setFilterTab] = useState<'All' | ClothingType>('All')
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Create modal form state
  const [itemType, setItemType] = useState<ClothingType>('Shirt')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('5')
  const [textureDataUrl, setTextureDataUrl] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileError, setFileError] = useState('')
  const [isDraggingFile, setIsDraggingFile] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const sync = () => setItems(loadCreatedClothing())
    window.addEventListener(CLOTHING_UPDATED_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(CLOTHING_UPDATED_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const resetForm = () => {
    setItemType('Shirt')
    setName('')
    setDescription('')
    setPrice('5')
    setTextureDataUrl('')
    setFileName('')
    setFileError('')
  }

  const handleFile = (file: File) => {
    setFileError('')
    if (!file.type.includes('png') && !file.name.toLowerCase().endsWith('.png')) {
      setFileError('Please upload a PNG file.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setFileError('File must be at most 2 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setTextureDataUrl(reader.result)
        setFileName(file.name)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleCreate = () => {
    if (!name.trim() || !textureDataUrl) return
    const parsedPrice = Math.max(0, parseInt(price, 10) || 0)
    addCreatedClothing({
      type: itemType,
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      textureDataUrl,
      creator: currentUsername,
    })
    resetForm()
    setIsCreateOpen(false)
  }

  const filteredItems =
    filterTab === 'All' ? items : items.filter((it) => it.type === filterTab)

  const previewClothing: ClothingSelection | undefined = textureDataUrl
    ? toClothingSelection(itemType, textureDataUrl)
    : undefined

  return (
    <div className="relative flex-1 flex flex-col min-h-0">
      {/* Header Bar */}
      <div className="h-14 px-6 md:px-8 border-b border-white/[0.04] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Menu className="size-4 text-white/70" />
          <h1 className="text-lg md:text-xl font-black text-white tracking-tight">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="h-8 px-3.5 rounded-[8px] bg-white/30 hover:bg-white/40 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-white/20 transition-all active:scale-95 mr-1"
          >
            <Plus className="size-3.5 stroke-[2.5]" />
            <span>Create New</span>
          </button>

          <div className="flex items-center gap-1.5">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3 h-8 rounded-[10px] text-xs font-semibold transition-all duration-150 cursor-pointer border-none select-none ${
                  filterTab === tab
                    ? 'bg-white/[0.08] backdrop-blur-xs text-white font-bold shadow-xs'
                    : 'bg-transparent text-white/50 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {tab === 'All' ? 'All' : `${tab}s`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="p-6 md:p-8 flex-1 overflow-y-auto no-scrollbar">
        {filteredItems.length === 0 ? (
          <div className="h-full min-h-[360px] flex flex-col items-center justify-center text-center gap-3">
            <div className="size-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/40">
              <Plus className="size-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">No clothing items yet</h2>
              <p className="text-xs text-white/45 mt-1 max-w-xs">
                Upload a Shirt, Pants, or T-Shirt PNG template to preview it in 3D and publish it to the Marketplace.
              </p>
            </div>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-2 h-9 px-4 rounded-[10px] bg-white text-black hover:bg-neutral-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer border-none transition-all active:scale-95"
            >
              <Plus className="size-4" />
              <span>Create an item</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col gap-2 rounded-2xl bg-[#111114] border border-white/[0.05] hover:border-white/[0.14] p-2.5 transition-all"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden">
                  <PlayerModel3D
                    mode="full"
                    useSavedColors={false}
                    useSavedClothing={false}
                    autoRotate={false}
                    initialYaw={0.22}
                    clothing={toClothingSelection(item.type, item.textureDataUrl)}
                    className="w-full h-full"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-[6px] bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white/80 border border-white/10">
                    {item.type}
                  </span>
                  <button
                    onClick={() => deleteCreatedClothing(item.id)}
                    title="Delete item"
                    className="absolute top-2 right-2 size-6 rounded-[7px] bg-black/70 hover:bg-red-500/90 text-white/70 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-white/10"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>

                <div className="px-1 pb-0.5 flex flex-col gap-0.5">
                  <div className="text-xs font-bold text-white truncate">{item.name}</div>
                  <div className="flex items-center gap-2 text-[11px] text-white/50">
                    <span className="inline-flex items-center gap-1 font-semibold text-white/80">
                      <img src="/novelo-currency.png" alt="Novelo" className="size-3 object-contain" />
                      {item.price}
                    </span>
                    <span>•</span>
                    <span>{item.sold} sold</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create an Item Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-[840px] rounded-2xl bg-[#141414] border border-white/[0.08] shadow-2xl grid grid-cols-1 md:grid-cols-12 overflow-hidden">
            {/* Left Column: Form */}
            <div className="md:col-span-6 p-6 flex flex-col gap-4 bg-[#141414]">
              <h2 className="text-base font-black text-white tracking-tight">Create an item</h2>

              {/* Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/75">Type</label>
                <CustomDropdown
                  value={itemType}
                  onChange={setItemType}
                  options={TYPE_OPTIONS}
                  className="w-full"
                  buttonClassName="w-full justify-between h-9 !bg-[#1c1c1c] hover:!bg-[#222222] !border-white/[0.12] rounded-[8px]"
                  menuClassName="w-full !bg-[#1c1c1c] !border-white/[0.12]"
                />
              </div>

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/75">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-9 px-3 rounded-[8px] bg-[#1c1c1c] border border-white/[0.12] text-xs text-white outline-none focus:border-white/30 transition-colors"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/75">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-[8px] bg-[#1c1c1c] border border-white/[0.12] text-xs text-white outline-none focus:border-white/30 resize-none transition-colors"
                />
              </div>

              {/* Price in Novelo */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/75">Price in Novelo</label>
                <div className="relative flex items-center">
                  <img
                    src="/novelo-currency.png"
                    alt="Novelo"
                    className="size-3.5 object-contain absolute left-3 pointer-events-none"
                  />
                  <input
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full h-9 pl-8 pr-3 rounded-[8px] bg-[#1c1c1c] border border-white/[0.12] text-xs text-white outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              </div>

              {/* Clothing File Dropzone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/75">Clothing file</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,.png"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleFile(f)
                  }}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDraggingFile(true)
                  }}
                  onDragLeave={() => setIsDraggingFile(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setIsDraggingFile(false)
                    const f = e.dataTransfer.files?.[0]
                    if (f) handleFile(f)
                  }}
                  className={`rounded-[8px] border border-dashed p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    isDraggingFile
                      ? 'border-white/35 bg-[#242424]'
                      : 'border-white/[0.14] hover:border-white/30 bg-[#1c1c1c] hover:bg-[#222222]'
                  }`}
                >
                  <div className="size-8 rounded-full bg-white/[0.06] flex items-center justify-center text-white/70">
                    <Upload className="size-4" />
                  </div>
                  <span className="text-xs font-semibold text-white/80 text-center truncate max-w-full">
                    {fileName || 'Drop a PNG here or click to browse'}
                  </span>
                </div>
                {fileError && <span className="text-[11px] text-red-400">{fileError}</span>}
                <p className="text-[11px] text-white/40 leading-relaxed">
                  {itemType === 'T-Shirt'
                    ? 'A square PNG of at most 2 MB. '
                    : 'A 585 by 559 or 1170 by 1118 PNG of at most 2 MB. '}
                  Start from the{' '}
                  <button
                    type="button"
                    onClick={() => downloadClothingTemplate(itemType)}
                    className="text-white/75 underline hover:text-white bg-transparent border-none p-0 cursor-pointer text-[11px] font-semibold"
                  >
                    {itemType.toLowerCase()} template
                  </button>
                  .
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    resetForm()
                    setIsCreateOpen(false)
                  }}
                  className="h-9 px-4 rounded-[8px] bg-[#262626] hover:bg-[#303030] border border-white/[0.06] text-white/90 hover:text-white text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!name.trim() || !textureDataUrl}
                  onClick={handleCreate}
                  className="h-9 px-4 rounded-[8px] bg-white text-black hover:bg-neutral-200 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold cursor-pointer border-none transition-all active:scale-95"
                >
                  Create item
                </button>
              </div>
            </div>

            {/* Right Column: Live 3D Preview */}
            <div className="md:col-span-6 relative bg-[#111111] min-h-[380px] md:min-h-[480px] flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  resetForm()
                  setIsCreateOpen(false)
                }}
                title="Close"
                className="absolute top-3 right-3 z-20 size-8 rounded-[8px] bg-transparent hover:bg-white/[0.06] border-none text-white/50 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="size-4" />
              </button>

              <PlayerModel3D
                mode="full"
                interactive
                useSavedColors={false}
                autoRotate={false}
                initialYaw={0.22}
                clothing={previewClothing}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
