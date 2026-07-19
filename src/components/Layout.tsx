import { useState, ReactNode } from 'react'
import { Menu } from '@/components/Menu'
import { Sidebar } from '@/components/Sidebar'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children?: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [announcementDismissed, setAnnouncementDismissed] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Menu
        loggedIn
        balance={12450}
        unreadMessages={3}
        onNav={(href) => console.log('navigate', href)}
        announcementDismissed={announcementDismissed}
        onDismissAnnouncement={() => setAnnouncementDismissed(true)}
      />
      <Sidebar announcementDismissed={announcementDismissed} />
      <main className={cn(
        "pl-[240px] min-h-screen",
        announcementDismissed ? "pt-16" : "pt-[calc(52px+64px)]"
      )}>
        {children}
      </main>
    </div>
  )
}
