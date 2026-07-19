import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { Footer } from '@/components/Footer'
import { Home } from '@/pages/Home'
import { Marketplace } from '@/pages/Marketplace'
import { ItemDetail } from '@/pages/ItemDetail'
import { Create } from '@/pages/Create'
import { Avatar } from '@/pages/Avatar'
import { Profile } from '@/pages/Profile'
import { Auth } from '@/pages/Auth'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Sidebar />
      <main className="pt-16 md:ml-[220px] min-h-[calc(100vh-4rem)]">
        {children}
      </main>
      <div className="md:ml-[220px]">
        <Footer />
      </div>
    </div>
  )
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  if (!isLoggedIn) {
    return <Auth onAuth={() => setIsLoggedIn(true)} />
  }

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
