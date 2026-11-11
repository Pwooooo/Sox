import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Home } from '@/pages/Home'
import { Profile } from '@/pages/Profile'
import { Marketplace } from '@/pages/Marketplace'
import { ItemDetail } from '@/pages/ItemDetail'
import { Avatar } from '@/pages/Avatar'
import { Create } from '@/pages/Create'
import { Auth } from '@/pages/Auth'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/games" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/:id" element={<ItemDetail />} />
        <Route path="/avatar" element={<Avatar />} />
        <Route path="/create" element={<Create />} />
        <Route path="/profile/:username?" element={<Profile />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
      </Routes>
    </Layout>
  )
}
