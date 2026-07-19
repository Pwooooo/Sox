import { Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Home } from '@/pages/Home'
import { Marketplace } from '@/pages/Marketplace'
import { ItemDetail } from '@/pages/ItemDetail'
import { Create } from '@/pages/Create'
import { Avatar } from '@/pages/Avatar'
import { Profile } from '@/pages/Profile'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/create" element={<Create />} />
        <Route path="/avatar" element={<Avatar />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Layout>
  )
}
