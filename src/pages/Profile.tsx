import { ITEMS } from '@/data/items'
import { ItemCard } from '@/components/ItemCard'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'

export function Profile() {
  const navigate = useNavigate()
  const myItems = ITEMS.filter((i) => i.creator === 'NoveloUser')

  return (
    <div>
      <div className="h-[200px] bg-gradient-to-br from-[#1a0a0e] via-background to-[#0f0a1a] border-b border-border" />
      <div className="max-w-[1400px] mx-auto px-6 flex gap-6 items-end -mt-16 relative">
        <img
          src="https://api.dicebear.com/7.x/bottts/svg?seed=novelo1"
          alt="Avatar"
          className="size-32 rounded-full border-4 border-background"
        />
        <div className="pb-4">
          <h1 className="text-2xl font-bold tracking-tight mb-1">NoveloUser</h1>
          <div className="flex gap-2 mb-2">
            <Badge variant="secondary">Creator</Badge>
            <Badge variant="premium">Premium</Badge>
          </div>
          <p className="text-muted-foreground text-sm mb-3">Building the future of UGC on Novelo.</p>
          <div className="flex gap-6">
            {[
              { num: '1,247', label: 'Followers' },
              { num: '83', label: 'Creations' },
              { num: '12.5K', label: 'Sales' },
              { num: '45.2K', label: 'Visits' },
            ].map((stat) => (
              <div key={stat.label} className="text-xs text-muted-foreground">
                <strong className="block text-sm text-foreground">{stat.num}</strong>
                {stat.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <h2 className="text-xl font-bold tracking-tight mb-5">Creations</h2>
        {myItems.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No creations yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {myItems.map((item) => (
              <ItemCard key={item.id} item={item} onClick={() => navigate(`/item/${item.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
