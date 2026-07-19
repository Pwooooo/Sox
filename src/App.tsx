import { Menu } from '@/components/Menu'

export default function App() {
  return (
    <Menu
      loggedIn
      balance={12450}
      unreadMessages={3}
      onNav={(href) => console.log('navigate', href)}
    />
  )
}
