import { useNavigate, useLocation } from 'react-router-dom'
import { Bell, MessageSquare, Settings, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const links = [
    { path: '/', label: 'Home' },
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/create', label: 'Create' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border h-14">
      <div className="h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); navigate('/') }}
            className="flex items-center gap-2 no-underline"
          >
            <div className="w-[30px] h-[30px] bg-primary text-white rounded-lg flex items-center justify-center font-extrabold text-[15px] font-sans">
              N
            </div>
            <span className="text-[15px] font-bold tracking-tight text-foreground hidden lg:block">Novelo</span>
          </a>
          <div className="hidden md:flex gap-0.5">
            {links.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => { e.preventDefault(); navigate(link.path) }}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors no-underline ${
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

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/marketplace')}
          >
            <Search className="size-[18px]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-muted-foreground hover:text-foreground relative"
          >
            <Bell className="size-[18px]" />
            <span className="absolute top-1 right-1 size-2 bg-primary rounded-full" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-muted-foreground hover:text-foreground"
          >
            <MessageSquare className="size-[18px]" />
          </Button>

          <div className="w-px h-5 bg-border mx-1" />

          <div className="flex items-center gap-1.5 bg-card border border-border rounded-lg px-2.5 py-1.5 text-[13px]">
            <span className="text-gold font-bold">B</span>
            <span className="font-medium">12,450</span>
          </div>

          <div
            className="size-8 rounded-full border-2 border-border overflow-hidden cursor-pointer flex-shrink-0 transition-colors hover:border-primary ml-1"
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
