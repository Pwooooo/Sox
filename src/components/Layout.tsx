import { useState, useEffect, ReactNode } from 'react'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { WaveBackground } from '@/components/WaveBackground'
import { Auth3DBackground } from '@/components/Auth3DBackground'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'
import { loadNovluxBalance, NOVLUX_BALANCE_EVENT } from '@/data/clothingStore'
import { loadNotifications, NOTIFICATIONS_EVENT } from '@/lib/notifications'

interface LayoutProps {
  activeTab?: string
  onSelectTab?: (tab: string) => void
  children?: ReactNode
}

export function Layout({ activeTab = 'Home', onSelectTab, children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [balance, setBalance] = useState(() => loadNovluxBalance())
  const [unreadNotifications, setUnreadNotifications] = useState(
    () => loadNotifications().filter((n) => !n.read).length,
  )
  const { user, profile } = useAuth()

  useEffect(() => {
    const syncBalance = () => setBalance(loadNovluxBalance())
    const syncNotifs = () =>
      setUnreadNotifications(loadNotifications().filter((n) => !n.read).length)
    window.addEventListener(NOVLUX_BALANCE_EVENT, syncBalance)
    window.addEventListener(NOTIFICATIONS_EVENT, syncNotifs)
    window.addEventListener('storage', syncBalance)
    window.addEventListener('storage', syncNotifs)
    return () => {
      window.removeEventListener(NOVLUX_BALANCE_EVENT, syncBalance)
      window.removeEventListener(NOTIFICATIONS_EVENT, syncNotifs)
      window.removeEventListener('storage', syncBalance)
      window.removeEventListener('storage', syncNotifs)
    }
  }, [])
  const displayUsername =
    profile?.username ||
    (user?.user_metadata?.username as string | undefined) ||
    user?.email?.split('@')[0] ||
    'Guest'

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative isolate select-none">
      {/* Fullscreen Background: live 3D scene on Download, Wave Drift elsewhere */}
      {activeTab === 'Download' ? (
        <>
          <Auth3DBackground />
          <div className="fixed inset-0 pointer-events-none z-0 bg-black/35" aria-hidden="true" />
        </>
      ) : (
        <WaveBackground />
      )}

      {/* Top Navbar */}
      <Navbar
        balance={balance}
        unreadNotifications={unreadNotifications}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenSettings={() => onSelectTab?.('Settings')}
        onNavigate={onSelectTab}
      />

      {/* Left Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        activeItem={activeTab}
        username={displayUsername}
        onSelect={(item) => onSelectTab?.(item)}
        onToggleCollapse={() => setSidebarCollapsed(true)}
      />

      {/* Main Content Area */}
      <main
        className={cn(
          "relative z-10 min-h-screen pt-14 transition-all duration-300",
          sidebarCollapsed ? "pl-0" : "pl-[230px]"
        )}
      >
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
