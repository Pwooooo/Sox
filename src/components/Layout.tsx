import { useState, ReactNode } from 'react'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { WaveBackground } from '@/components/WaveBackground'
import { cn } from '@/lib/utils'

interface LayoutProps {
  activeTab?: string
  onSelectTab?: (tab: string) => void
  children?: ReactNode
}

export function Layout({ activeTab = 'Home', onSelectTab, children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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
        onOpenSettings={() => alert('Settings opened')}
        onNavigate={onSelectTab}
      />

      {/* Left Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        activeItem={activeTab}
        username="Sky"
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
