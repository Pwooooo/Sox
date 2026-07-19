import { useState } from 'react'
import { ITEMS, Item } from '@/data/items'
import { ItemCard } from '@/components/ItemCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useNavigate } from 'react-router-dom'
import { Upload, Package, Shirt, Smile, Wrench, Music, Crown } from 'lucide-react'

const creationTypes = [
  { key: 'model', label: 'Model', icon: Package, desc: 'Upload 3D models for accessories, tools, and more.' },
  { key: 'clothing', label: 'Clothing', icon: Shirt, desc: 'Design shirts, pants, and full outfits.' },
  { key: 'hat', label: 'Hat & Hair', icon: Crown, desc: 'Create hats, hair styles, and head accessories.' },
  { key: 'face', label: 'Face', icon: Smile, desc: 'Design custom faces and expressions.' },
  { key: 'tool', label: 'Tool & Gear', icon: Wrench, desc: 'Build interactive tools and gear items.' },
  { key: 'audio', label: 'Audio', icon: Music, desc: 'Upload music and sound effects.' },
]

export function Create() {
  const navigate = useNavigate()
  const [showUpload, setShowUpload] = useState(false)
  const [uploadType, setUploadType] = useState('')
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [price, setPrice] = useState('')
  const [myItems, setMyItems] = useState<Item[]>(ITEMS.filter((i) => i.creator === 'NoveloUser'))

  const openUpload = (type: string) => {
    setUploadType(type)
    setName('')
    setDesc('')
    setPrice('')
    setShowUpload(true)
  }

  const publish = () => {
    if (!name.trim()) return
    const newItem: Item = {
      id: ITEMS.length + myItems.length + 1,
      name: name.trim(),
      type: uploadType as Item['type'],
      price: parseInt(price) || 0,
      sales: 0,
      creator: 'NoveloUser',
      rating: 0,
      desc: desc.trim() || 'No description provided.',
    }
    setMyItems((prev) => [newItem, ...prev])
    setShowUpload(false)
  }

  return (
    <div>
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Creator Dashboard</h1>
        <p className="text-muted-foreground">Publish your creations to the Novelo marketplace.</p>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {creationTypes.map((type) => (
          <Card
            key={type.key}
            className="p-8 cursor-pointer transition-all hover:border-primary hover:-translate-y-0.5"
            onClick={() => openUpload(type.key)}
          >
            <div className="size-12 bg-primary/15 text-primary rounded-[calc(var(--radius)-4px)] flex items-center justify-center font-extrabold text-lg mb-4">
              <type.icon className="size-5" />
            </div>
            <h3 className="text-base font-semibold mb-2">{type.label}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{type.desc}</p>
          </Card>
        ))}
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <h2 className="text-xl font-bold tracking-tight mb-6">My Creations</h2>
        {myItems.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            You haven't created any items yet. Use the cards above to publish your first creation!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {myItems.map((item) => (
              <ItemCard key={item.id} item={item} onClick={() => navigate(`/item/${item.id}`)} />
            ))}
          </div>
        )}
      </div>

      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogHeader>
          <DialogTitle>Upload {uploadType.charAt(0).toUpperCase() + uploadType.slice(1)}</DialogTitle>
          <DialogDescription>Fill in the details to publish your creation.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Item Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="My Awesome Creation" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe your item..."
              className="border-input bg-input text-foreground flex w-full min-w-0 rounded-[calc(var(--radius)-2px)] border px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 resize-none"
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Price</label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0 = Free" min={0} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Upload File</label>
            <div className="border-2 border-dashed border-border rounded-[calc(var(--radius)-2px)] p-8 text-center cursor-pointer hover:border-primary hover:bg-accent/20 transition-colors">
              <Upload className="size-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag & drop your file here, or{' '}
                <span className="text-primary font-semibold cursor-pointer">browse</span>
              </p>
            </div>
          </div>
          <Button onClick={publish} className="w-full">Publish to Marketplace</Button>
        </div>
      </Dialog>
    </div>
  )
}
