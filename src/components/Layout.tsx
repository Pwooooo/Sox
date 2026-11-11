import { useState, ReactNode } from 'react'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children?: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState('Home')

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Navbar */}
      <Navbar
        balance={12450}
        unreadMessages={3}
        unreadNotifications={1}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Left Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        activeItem={activeItem}
        onSelect={(item) => setActiveItem(item)}
      />

      {/* Main Content Area */}
      <main
        className={cn(
          "min-h-screen pt-14 transition-all duration-300",
          sidebarCollapsed ? "pl-[60px]" : "pl-[210px]"
        )}
      >
        <div className="w-full max-w-[1650px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
