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
import { hydrateFromUserMetadata, schedulePushUserSync, PROFILE_UPDATED_EVENT } from '@/lib/userSync'
import { FRIENDS_EVENT } from '@/lib/friendsStore'
import { NOTIFICATIONS_EVENT } from '@/lib/notifications'
import { GAME_STATS_EVENT } from '@/lib/gameStats'
import { NOVLUX_BALANCE_EVENT, EQUIPPED_CLOTHING_EVENT } from '@/data/clothingStore'
import { AVATAR_COLORS_EVENT } from '@/components/PlayerModel3D'
import { supabase } from '@/lib/supabase'
import { GamePlayerView } from '@/components/GamePlayerView'

function parseJoinIdFromUrl(raw: string): string | null {
  try {
    const qIdx = raw.indexOf('?')
    if (qIdx === -1) return null
    const params = new URLSearchParams(raw.slice(qIdx))
    return params.get('entry') || params.get('join') || null
  } catch {
    return null
  }
}

function parseProfileIdFromPath(pathname: string): number | null {
  const m = pathname.match(/^\/profile\/(\d+)/i)
  if (!m) return null
  const num = Number(m[1])
  return Number.isFinite(num) && num > 0 ? num : null
}

function parseItemIdFromPath(pathname: string): string | null {
  const m = pathname.match(/^\/item\/([^/?#]+)/i)
  return m ? decodeURIComponent(m[1]) : null
}

function AppContent() {
  const { user, profile, loading } = useAuth()

  useEffect(() => {
    if (!user) return
    hydrateFromUserMetadata(user, profile?.id)

    const pullFresh = async () => {
      if (!supabase) return
      try {
        const { data } = await supabase.auth.getUser()
        if (data?.user) hydrateFromUserMetadata(data.user, profile?.id)
      } catch {
        // ignore
      }
    }

    const onSyncChange = () => schedulePushUserSync(user, profile?.id)
    const events = [
      FRIENDS_EVENT,
      NOTIFICATIONS_EVENT,
      PROFILE_UPDATED_EVENT,
      GAME_STATS_EVENT,
      NOVLUX_BALANCE_EVENT,
      AVATAR_COLORS_EVENT,
      EQUIPPED_CLOTHING_EVENT,
    ]
    for (const ev of events) window.addEventListener(ev, onSyncChange)
    window.addEventListener('focus', pullFresh)

    const channel = supabase
      ? supabase
          .channel(`novelo-user-sync:${user.id}`)
          .on('broadcast', { event: 'sync' }, () => {
            void pullFresh()
          })
          .subscribe()
      : null

    return () => {
      for (const ev of events) window.removeEventListener(ev, onSyncChange)
      window.removeEventListener('focus', pullFresh)
      if (channel && supabase) {
        void supabase.removeChannel(channel)
      }
    }
  }, [user, profile?.id])
  const [viewedProfileId, setViewedProfileId] = useState<number | null>(() =>
    parseProfileIdFromPath(window.location.pathname),
  )
  const [viewedItemId, setViewedItemId] = useState<string | null>(() =>
    parseItemIdFromPath(window.location.pathname),
  )
  const [activeGameId, setActiveGameId] = useState<string | null>(() =>
    parseJoinIdFromUrl(window.location.search),
  )

  useEffect(() => {
    const onJoinEvent = (e: Event) => {
      const id = (e as CustomEvent<{ id?: string }>).detail?.id
      if (id) setActiveGameId(id)
    }
    const onContextMenu = (e: MouseEvent) => {
      if ((e.target as HTMLElement | null)?.closest('img, svg')) {
        e.preventDefault()
      }
    }
    const onDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement | null)?.closest('img, svg')) {
        e.preventDefault()
      }
    }
    document.addEventListener('contextmenu', onContextMenu)
    document.addEventListener('dragstart', onDragStart)
    window.addEventListener('novelo-join-game', onJoinEvent)
    let unlistenDeepLink: (() => void) | undefined
    if ((window as any).__TAURI_INTERNALS__) {
      import('@tauri-apps/api/core')
        .then(({ invoke }) => invoke<string | null>('get_launch_deep_link'))
        .then((deepLink) => {
          if (!deepLink) return
          const entryId = parseJoinIdFromUrl(deepLink)
          if (entryId) setActiveGameId(entryId)
        })
        .catch(() => {})
      import('@tauri-apps/api/event')
        .then(({ listen }) =>
          listen<string>('novelo-deep-link', (event) => {
            if (!event.payload) return
            const entryId = parseJoinIdFromUrl(event.payload)
            if (entryId) setActiveGameId(entryId)
          }),
        )
        .then((fn) => {
          unlistenDeepLink = fn
        })
        .catch(() => {})
    }
    return () => {
      document.removeEventListener('contextmenu', onContextMenu)
      document.removeEventListener('dragstart', onDragStart)
      window.removeEventListener('novelo-join-game', onJoinEvent)
      if (unlistenDeepLink) unlistenDeepLink()
    }
  }, [])
  const [activeTab, setActiveTab] = useState(() => {
    if (parseProfileIdFromPath(window.location.pathname) !== null) {
      return 'Profile'
    }
    if (parseItemIdFromPath(window.location.pathname) !== null) {
      return 'Marketplace'
    }
    const params = new URLSearchParams(window.location.search)
    return params.get('tab') || 'Home'
  })

  useEffect(() => {
    const onPopState = () => {
      const pid = parseProfileIdFromPath(window.location.pathname)
      const iid = parseItemIdFromPath(window.location.pathname)
      if (pid !== null) {
        setViewedProfileId(pid)
        setActiveTab('Profile')
      } else if (iid !== null) {
        setViewedItemId(iid)
        setActiveTab('Marketplace')
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

  if (activeGameId) {
    return <GamePlayerView gameId={activeGameId} onLeave={() => setActiveGameId(null)} />
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
        return <Marketplace initialItemId={viewedItemId} />
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
