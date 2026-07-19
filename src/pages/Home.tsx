import { useNavigate } from 'react-router-dom'
import { ITEMS, CATEGORIES, CREATORS, Item } from '@/data/items'
import { ItemCard } from '@/components/ItemCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

function typeIcon(type: string) {
  const icons: Record<string, string> = { hat: '🎩', hair: '💇', face: '😊', clothing: '👕', accessory: '💎', tool: '🔧' }
  return icons[type] || '📦'
}

export function Home() {
  const navigate = useNavigate()
  const featured = [...ITEMS].sort((a, b) => b.sales - a.sales).slice(0, 8)

  return (
    <div>
      <section className="relative min-h-[520px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(210,10,46,0.08)_0%,transparent_60%),radial-gradient(ellipse_60%_50%_at_30%_60%,rgba(210,10,46,0.04)_0%,transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative text-center max-w-[700px] px-6 py-10">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
            Welcome to <span className="text-primary">Novelo</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            The ultimate UGC platform. Create, customize, and collect unique items for your avatar.
          </p>
          <div className="flex gap-3 justify-center">
            <Button size="lg" onClick={() => navigate('/marketplace')}>
              Explore Marketplace
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/create')}>
              Start Creating
            </Button>
          </div>
        </div>
      </section>

      <div className="flex justify-center gap-12 px-6 py-10 bg-secondary/30 border-y border-border flex-wrap">
        {[
          { num: '50,000+', label: 'Items' },
          { num: '1.2M', label: 'Creators' },
          { num: '85M', label: 'Purchases' },
          { num: '4.8', label: 'Avg Rating' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <span className="block text-3xl font-extrabold tracking-tight">{stat.num}</span>
            <span className="text-sm text-muted-foreground font-medium mt-0.5">{stat.label}</span>
          </div>
        ))}
      </div>

      <Section title="Featured Items">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {featured.map((item) => (
            <ItemCard key={item.id} item={item} onClick={() => navigate(`/item/${item.id}`)} />
          ))}
        </div>
      </Section>

      <Section title="Browse Categories">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {CATEGORIES.filter((c) => c.key).map((cat) => (
            <Card
              key={cat.key}
              className="p-6 text-center cursor-pointer transition-all hover:border-primary hover:bg-accent/30"
              onClick={() => navigate(`/marketplace?category=${cat.key}`)}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="text-sm font-semibold">{cat.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{cat.count} items</div>
            </Card>
          ))}
        </div>
      </Section>

      <div className="max-w-[1400px] mx-auto px-6 pb-12">
        <h2 className="text-xl font-bold tracking-tight mb-5">Top Creators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {CREATORS.map((creator) => (
            <Card
              key={creator.name}
              className="p-5 text-center cursor-pointer transition-all hover:border-border hover:bg-accent/20"
            >
              <img
                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${creator.name}`}
                alt={creator.name}
                className="size-14 rounded-full mx-auto mb-3"
              />
              <div className="font-semibold text-sm">{creator.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{creator.sales.toLocaleString()} total sales</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 border-b border-border">
      <h2 className="text-xl font-bold tracking-tight mb-5">{title}</h2>
      {children}
    </div>
  )
}
