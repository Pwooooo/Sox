import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
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
    <div className="bg-background flex flex-col items-center min-h-screen">
      <a href="#main-content" className="skip-link focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-[200] focus-visible:h-auto focus-visible:w-auto focus-visible:m-0 focus-visible:overflow-visible focus-visible:whitespace-normal focus-visible:[clip:auto] focus-visible:rounded-md focus-visible:bg-primary focus-visible:px-4 focus-visible:py-2 focus-visible:text-primary-foreground">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="relative isolate flex-1 min-h-0 w-full flex flex-col pt-16">
        {children}
      </main>
      <Footer />
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
