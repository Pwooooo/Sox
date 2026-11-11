import { useState, ReactNode } from 'react'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { WaveBackground } from '@/components/WaveBackground'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children?: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState('Home')

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative isolate select-none">
      {/* Fullscreen Encoded Wave Drift Background */}
      <WaveBackground />

      {/* Top Navbar */}
      <Navbar
        balance={0}
        unreadNotifications={1}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenSettings={() => alert('Settings opened')}
      />

      {/* Left Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        activeItem={activeItem}
        username="Sky"
        onSelect={(item) => setActiveItem(item)}
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
