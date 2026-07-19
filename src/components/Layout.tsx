import { useState, useEffect, useRef, ReactNode } from 'react'
import { Menu } from '@/components/Menu'
import { Sidebar } from '@/components/Sidebar'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children?: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [headerHidden, setHeaderHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY
      if (current > 80 && current > lastScrollY.current) {
        setHeaderHidden(true)
      } else if (current < lastScrollY.current) {
        setHeaderHidden(false)
      }
      lastScrollY.current = current
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Menu
        loggedIn
        balance={12450}
        unreadMessages={3}
        onNav={(href) => console.log('navigate', href)}
        headerHidden={headerHidden}
      />
      <Sidebar headerHidden={headerHidden} />
      <main className={cn(
        "pl-[240px] min-h-screen transition-all duration-300",
        headerHidden ? "pt-0" : "pt-16"
      )}>
        {children}
      </main>
    </div>
  )
}
