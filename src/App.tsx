import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Home } from '@/pages/Home'
import { Profile } from '@/pages/Profile'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/games" element={<Home />} />
        <Route path="/profile/:username?" element={<Profile />} />
      </Routes>
    </Layout>
  )
}
