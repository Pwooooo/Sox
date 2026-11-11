import { useState } from 'react'
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

export default function App() {
  const [activeTab, setActiveTab] = useState('Home')

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
        return <Profile />
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
      default:
        return <Home />
    }
  }

  return (
    <Layout activeTab={activeTab} onSelectTab={setActiveTab}>
      {renderContent()}
    </Layout>
  )
}
