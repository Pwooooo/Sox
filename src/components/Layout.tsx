import { useState, useEffect, useRef, ReactNode } from 'react'
import { Menu } from '@/components/Menu'
import { Sidebar } from '@/components/Sidebar'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children?: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [announcementDismissed, setAnnouncementDismissed] = useState(false)
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
        announcementDismissed={announcementDismissed}
        onDismissAnnouncement={() => setAnnouncementDismissed(true)}
        headerHidden={headerHidden}
      />
      <Sidebar announcementDismissed={announcementDismissed} headerHidden={headerHidden} />
      <main className={cn(
        "pl-[240px] min-h-screen transition-all duration-300",
        announcementDismissed
          ? headerHidden ? "" : "pt-16"
          : headerHidden ? "pt-0" : "pt-[calc(52px+64px)]"
      )}>
        {children}
      </main>
    </div>
  )
}
