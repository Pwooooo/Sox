import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { Home } from '@/pages/Home'
import { Games } from '@/pages/Games'
import { Friends } from '@/pages/Friends'
import { Messages } from '@/pages/Messages'
import { Profile } from '@/pages/Profile'
import { AvatarEditor } from '@/pages/AvatarEditor'
import { Inventory } from '@/pages/Inventory'
import { Marketplace } from '@/pages/Marketplace'
import { Store } from '@/pages/Store'
import { Trade } from '@/pages/Trade'
import { Create } from '@/pages/Create'
import { Forum } from '@/pages/Forum'
import { Settings } from '@/pages/Settings'
import { AuthProvider, useAuth } from '@/lib/auth'
import { AuthModal } from '@/components/AuthModal'

function parseProfileIdFromPath(pathname: string): number | null {
  const m = pathname.match(/^\/profile\/(\d+)/i)
  if (!m) return null
  const num = Number(m[1])
  return Number.isFinite(num) && num > 0 ? num : null
}

function AppContent() {
  const { user, profile, loading } = useAuth()
  const [viewedProfileId, setViewedProfileId] = useState<number | null>(() =>
    parseProfileIdFromPath(window.location.pathname),
  )
  const [activeTab, setActiveTab] = useState(() => {
    if (parseProfileIdFromPath(window.location.pathname) !== null) {
      return 'Profile'
    }
    const params = new URLSearchParams(window.location.search)
    return params.get('tab') || 'Home'
  })

  useEffect(() => {
    const onPopState = () => {
      const pid = parseProfileIdFromPath(window.location.pathname)
      if (pid !== null) {
        setViewedProfileId(pid)
        setActiveTab('Profile')
      } else {
        const params = new URLSearchParams(window.location.search)
        setActiveTab(params.get('tab') || 'Home')
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab)
    if (tab === 'Profile' && profile?.id) {
      const targetId = profile.id
      setViewedProfileId(targetId)
      if (window.location.pathname !== `/Profile/${targetId}`) {
        window.history.pushState({}, '', `/Profile/${targetId}`)
      }
    } else if (tab === 'Create') {
      window.history.pushState({}, '', '/?tab=Create')
    } else if (window.location.pathname !== '/' || window.location.search) {
      window.history.pushState({}, '', '/')
    }
  }

  if (loading) {
    return <div className="min-h-screen w-full bg-[#090909]" />
  }

  if (!user) {
    return <AuthModal mode="both" />
  }

  // Creator Hub & Studio opens as its own dedicated standalone UI (like Roblox)
  if (activeTab === 'Create') {
    return <Create onClose={() => handleSelectTab('Home')} />
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <Home />
      case 'Games':
        return <Games />
      case 'Friends':
        return <Friends />
      case 'Messages':
        return <Messages />
      case 'Profile':
        return <Profile profileId={viewedProfileId ?? profile?.id ?? null} />
      case 'Avatar':
        return <AvatarEditor />
      case 'Inventory':
        return <Inventory />
      case 'Marketplace':
        return <Marketplace />
      case 'Store':
        return <Store />
      case 'Trade':
        return <Trade />
      case 'Create':
        return <Create />
      case 'Forum':
        return <Forum />
      case 'Settings':
        return <Settings />
      default:
        return <Home />
    }
  }

  return (
    <Layout activeTab={activeTab} onSelectTab={handleSelectTab}>
      {renderContent()}
    </Layout>
  )
}

export default function App() {
  return (
    <AuthProvider autoPromptWhenLoggedOut>
      <AppContent />
    </AuthProvider>
  )
}
