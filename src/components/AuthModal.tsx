import { useState, type FormEvent } from 'react'
import { X, LogIn, UserPlus, AlertCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth'

interface AuthModalProps {
  mode?: 'both' | 'login-only'
  dismissible?: boolean
  onClose?: () => void
}

export function AuthModal({
  mode = 'both',
  dismissible = true,
  onClose,
}: AuthModalProps) {
  const { signIn, signUp, isConfigured } = useAuth()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [identifier, setIdentifier] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const activeTab = mode === 'login-only' ? 'login' : tab

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setSubmitting(true)
    try {
      if (activeTab === 'login') {
        const res = await signIn(identifier, password)
        if (res.error) {
          setError(res.error)
        } else {
          onClose?.()
        }
      } else {
        const res = await signUp(username, email, password)
        if (res.error) {
          setError(res.error)
        } else if (res.needsVerification) {
          setInfo('Account created! Check your email to verify, then sign in.')
        } else {
          onClose?.()
        }
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-[400px] rounded-2xl bg-[#121212] border border-white/[0.1] shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/novelo-logo.svg" alt="Novelo" className="size-6 object-contain" />
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white m-0">
                {mode === 'login-only' ? 'Sign in to Novelo Studio' : 'Welcome to Novelo'}
              </h2>
              <p className="text-[11px] text-white/45 m-0">
                {mode === 'login-only'
                  ? 'Log into your Novelo account to build and publish'
                  : 'Sign in or create an account to play & publish'}
              </p>
            </div>
          </div>
          {dismissible && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="size-7 rounded-[6px] bg-white/[0.06] hover:bg-white/[0.12] text-white/60 hover:text-white flex items-center justify-center border-none cursor-pointer transition-colors"
              title="Close"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Mode Tabs (only on Web & Player) */}
        {mode === 'both' && (
          <div className="px-6 pt-4 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setTab('login')
                setError(null)
                setInfo(null)
              }}
              className={`flex-1 h-9 rounded-[8px] text-xs font-bold flex items-center justify-center gap-1.5 border cursor-pointer transition-colors ${
                activeTab === 'login'
                  ? 'bg-[#1e1e1e] border-white/25 text-white'
                  : 'bg-[#0b0b0b] border-white/[0.06] text-white/50 hover:text-white'
              }`}
            >
              <LogIn className="size-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('register')
                setError(null)
                setInfo(null)
              }}
              className={`flex-1 h-9 rounded-[8px] text-xs font-bold flex items-center justify-center gap-1.5 border cursor-pointer transition-colors ${
                activeTab === 'register'
                  ? 'bg-[#1e1e1e] border-white/25 text-white'
                  : 'bg-[#0b0b0b] border-white/[0.06] text-white/50 hover:text-white'
              }`}
            >
              <UserPlus className="size-3.5" />
              <span>Register</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-3.5">
          {!isConfigured && (
            <div className="p-3 rounded-[8px] bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-200 flex items-start gap-2">
              <AlertCircle className="size-4 shrink-0 mt-0.5 text-amber-400" />
              <span>
                Database keys not set yet. Add <code className="text-white">VITE_SUPABASE_URL</code> and{' '}
                <code className="text-white">VITE_SUPABASE_ANON_KEY</code> in Vercel / <code className="text-white">.env</code>.
              </span>
            </div>
          )}

          {error && (
            <div className="p-2.5 rounded-[8px] bg-red-500/10 border border-red-500/25 text-[11px] text-red-300">
              {error}
            </div>
          )}

          {info && (
            <div className="p-2.5 rounded-[8px] bg-emerald-500/10 border border-emerald-500/25 text-[11px] text-emerald-300">
              {info}
            </div>
          )}

          {activeTab === 'login' ? (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-white/90">Username or Email</label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter username or email"
                  className="w-full h-10 px-3.5 rounded-[8px] bg-[#0b0b0b] border border-white/[0.08] text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-white/25"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-white/90">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-10 px-3.5 rounded-[8px] bg-[#0b0b0b] border border-white/[0.08] text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-white/25"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-white/90">Username</label>
                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={24}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Sky"
                  className="w-full h-10 px-3.5 rounded-[8px] bg-[#0b0b0b] border border-white/[0.08] text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-white/25"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-white/90">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-10 px-3.5 rounded-[8px] bg-[#0b0b0b] border border-white/[0.08] text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-white/25"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-white/90">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full h-10 px-3.5 rounded-[8px] bg-[#0b0b0b] border border-white/[0.08] text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-white/25"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 h-10 w-full rounded-[8px] bg-white hover:bg-white/90 disabled:opacity-50 text-[#0c0d10] font-bold text-xs cursor-pointer border-none transition-colors"
          >
            {submitting
              ? 'Please wait...'
              : activeTab === 'login'
                ? 'Sign In'
                : 'Create Account'}
          </button>

          {mode === 'login-only' && (
            <p className="text-[11px] text-white/45 text-center m-0 pt-1">
              Registration is only available on the Novelo website or Novelo Player.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
