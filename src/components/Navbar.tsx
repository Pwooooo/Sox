import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')

  const links = [
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/create', label: 'Create' },
    { path: '/avatar', label: 'Avatar' },
  ]

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/88 backdrop-blur-xl border-b border-border">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); navigate('/') }}
            className="flex items-center gap-2.5 no-underline"
          >
            <div className="w-[34px] h-[34px] bg-primary text-white rounded-[9px] flex items-center justify-center font-extrabold text-[17px] font-sans">
              N
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">Novelo</span>
          </a>
          <div className="hidden md:flex gap-0.5">
            {links.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => { e.preventDefault(); navigate(link.path) }}
                className={`px-4 py-2 rounded-[calc(var(--radius)-4px)] text-sm font-medium transition-colors no-underline ${
                  location.pathname === link.path
                    ? 'text-foreground bg-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-card border border-border rounded-[calc(var(--radius)-4px)] px-3 py-1.5 text-sm">
            <span className="text-gold font-bold text-sm">B</span>
            <span className="font-medium">12,450</span>
          </div>
          <div className="hidden sm:flex items-center">
            <Input
              placeholder="Search marketplace..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-[180px] lg:w-[220px] rounded-r-none h-9 text-xs"
            />
            <Button
              size="sm"
              className="rounded-l-none h-9"
              onClick={handleSearch}
            >
              <Search className="size-3.5" />
            </Button>
          </div>
          <div
            className="size-9 rounded-full border-2 border-border overflow-hidden cursor-pointer flex-shrink-0 transition-colors hover:border-primary"
            onClick={() => navigate('/profile')}
          >
            <img
              src="https://api.dicebear.com/7.x/bottts/svg?seed=novelo1"
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </nav>
  )
}
