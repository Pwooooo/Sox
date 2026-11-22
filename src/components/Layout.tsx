import { useState, ReactNode } from 'react'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { WaveBackground } from '@/components/WaveBackground'
import { SettingsModal } from '@/components/SettingsModal'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'

interface LayoutProps {
  activeTab?: string
  onSelectTab?: (tab: string) => void
  children?: ReactNode
}

export function Layout({ activeTab = 'Home', onSelectTab, children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { user, profile } = useAuth()
  const displayUsername =
    profile?.username ||
    (user?.user_metadata?.username as string | undefined) ||
    user?.email?.split('@')[0] ||
    'Guest'

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative isolate select-none">
      {/* Fullscreen Encoded Wave Drift Background */}
      <WaveBackground />

      {/* Top Navbar */}
      <Navbar
        balance={1250}
        unreadNotifications={1}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenSettings={() => setSettingsOpen(true)}
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

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
