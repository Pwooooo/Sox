import { useMemo, useState, type FormEvent } from 'react'
import { Eye, EyeOff, Check } from 'lucide-react'
import { useAuth } from '@/lib/auth'

interface AuthModalProps {
  mode?: 'both' | 'login-only'
  onClose?: () => void
}

function getPasswordStrength(pw: string): number {
  if (!pw) return 0
  let score = 0
  if (pw.length >= 8) score += 1
  if (pw.length >= 12) score += 1
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 1
  if (/[0-9]/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score += 1
  return Math.min(4, Math.max(pw.length > 0 ? 1 : 0, score))
}

function isAtLeast13(birthday: string): boolean {
  if (!birthday) return false
  const dob = new Date(birthday)
  if (Number.isNaN(dob.getTime())) return false
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age -= 1
  }
  return age >= 13
}

export function AuthModal({ mode = 'both', onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth()
  const [tab, setTab] = useState<'login' | 'register'>(mode === 'both' ? 'register' : 'login')
  const [birthday, setBirthday] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreedTerms, setAgreedTerms] = useState(false)
  const [keepLoggedIn, setKeepLoggedIn] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const activeTab = mode === 'login-only' ? 'login' : tab
  const strength = useMemo(() => getPasswordStrength(password), [password])

  const switchTab = (next: 'login' | 'register') => {
    setTab(next)
    setError(null)
    setInfo(null)
    setPassword('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)

    if (activeTab === 'register') {
      if (!isAtLeast13(birthday)) {
        setError('You must be at least 13 years old to create an account.')
        return
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.')
        return
      }
      if (!agreedTerms) {
        setError('Please agree to the Terms of Service and Guidelines to continue.')
        return
      }
    }

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
          setInfo('Account created! Check your email to verify, then log in.')
        } else {
          onClose?.()
        }
      }
    } finally {
      setSubmitting(false)
    }
  }

  const strengthColors = [
    'bg-white/10',
    'bg-rose-500',
    'bg-amber-400',
    'bg-sky-400',
    'bg-emerald-400',
  ]

  return (
    <div className="min-h-screen w-full bg-[#090909] text-white select-none flex items-center justify-center p-6">
      <div className="w-full max-w-[420px]">
        <div className="flex items-center gap-2.5 mb-5">
          <img src="/novelo-icon.png" alt="Novelo" className="size-7 object-contain" />
          <span className="text-sm font-bold tracking-tight text-white/85">Novelo</span>
        </div>

        <h1 className="text-[28px] md:text-[32px] font-black tracking-tight text-white m-0 mb-6 leading-tight">
          {activeTab === 'register'
            ? 'Create a Novelo account'
            : mode === 'login-only'
              ? 'Log in to Novelo Studio'
              : 'Log in to Novelo'}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-[10px] bg-rose-500/10 border border-rose-500/25 text-xs text-rose-300 leading-snug">
              {error}
            </div>
          )}

          {info && (
            <div className="p-3 rounded-[10px] bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-300 leading-snug">
              {info}
            </div>
          )}

          {activeTab === 'register' ? (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/90">Birthday</label>
                <input
                  type="date"
                  required
                  value={birthday}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-[10px] bg-[#141414] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-white/25 transition-colors [color-scheme:dark]"
                />
                <span className="text-[11px] text-white/45">
                  You must be at least 13 years old.
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/90">Username</label>
                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={24}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your preferred username"
                  className="w-full h-10 px-3.5 rounded-[10px] bg-[#141414] border border-white/[0.08] text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-white/25 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/90">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-10 px-3.5 rounded-[10px] bg-[#141414] border border-white/[0.08] text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-white/25 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/90">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-10 pl-3.5 pr-10 rounded-[10px] bg-[#141414] border border-white/[0.08] text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-white/25 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="size-8 rounded-md flex items-center justify-center text-white/45 hover:text-white bg-transparent border-none cursor-pointer absolute right-1.5 top-1/2 -translate-y-1/2 transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[1, 2, 3, 4].map((seg) => (
                    <div
                      key={seg}
                      className={`h-[3px] rounded-full transition-colors duration-200 ${
                        strength >= seg ? strengthColors[strength] : 'bg-white/[0.1]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-white/45">
                  Must be at least 8 characters long
                </span>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer pt-0.5">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={agreedTerms}
                  onClick={() => setAgreedTerms((v) => !v)}
                  className={`size-4 rounded-[4px] mt-0.5 shrink-0 flex items-center justify-center border transition-colors cursor-pointer ${
                    agreedTerms
                      ? 'bg-white border-white text-[#0c0d10]'
                      : 'bg-transparent border-white/25 hover:border-white/45 text-transparent'
                  }`}
                >
                  <Check className="size-3 stroke-[3]" />
                </button>
                <span className="text-[11px] text-white/60 leading-relaxed">
                  I agree to the{' '}
                  <span className="text-white/90 underline">Terms of Service</span>,{' '}
                  <span className="text-white/90 underline">Privacy Policy</span>,{' '}
                  <span className="text-white/90 underline">Community Guidelines</span>, and{' '}
                  <span className="text-white/90 underline">Creator Guidelines</span>.
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={keepLoggedIn}
                  onClick={() => setKeepLoggedIn((v) => !v)}
                  className={`size-4 rounded-[4px] shrink-0 flex items-center justify-center border transition-colors cursor-pointer ${
                    keepLoggedIn
                      ? 'bg-white border-white text-[#0c0d10]'
                      : 'bg-transparent border-white/25 hover:border-white/45 text-transparent'
                  }`}
                >
                  <Check className="size-3 stroke-[3]" />
                </button>
                <span className="text-[11px] text-white/75">Keep me logged in</span>
              </label>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/90">Username or Email</label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your username or email"
                  className="w-full h-10 px-3.5 rounded-[10px] bg-[#141414] border border-white/[0.08] text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-white/25 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/90">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-10 pl-3.5 pr-10 rounded-[10px] bg-[#141414] border border-white/[0.08] text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-white/25 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="size-8 rounded-md flex items-center justify-center text-white/45 hover:text-white bg-transparent border-none cursor-pointer absolute right-1.5 top-1/2 -translate-y-1/2 transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer pt-0.5">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={keepLoggedIn}
                  onClick={() => setKeepLoggedIn((v) => !v)}
                  className={`size-4 rounded-[4px] shrink-0 flex items-center justify-center border transition-colors cursor-pointer ${
                    keepLoggedIn
                      ? 'bg-white border-white text-[#0c0d10]'
                      : 'bg-transparent border-white/25 hover:border-white/45 text-transparent'
                  }`}
                >
                  <Check className="size-3 stroke-[3]" />
                </button>
                <span className="text-[11px] text-white/75">Keep me logged in</span>
              </label>
            </>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 h-10 w-full rounded-[10px] bg-white hover:bg-white/90 disabled:opacity-50 text-[#0c0d10] font-bold text-xs cursor-pointer border-none transition-all shadow-sm active:scale-[0.99]"
          >
            {submitting
              ? 'Please wait...'
              : activeTab === 'register'
                ? 'Create an account'
                : 'Log in'}
          </button>

          {mode === 'both' ? (
            <div className="text-center text-xs text-white/50 pt-1">
              {activeTab === 'register' ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchTab('login')}
                    className="text-white font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
                  >
                    Log in
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchTab('register')}
                    className="text-white font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
                  >
                    Create an account
                  </button>
                </>
              )}
            </div>
          ) : (
            <p className="text-[11px] text-white/45 text-center m-0 pt-1">
              Registration is only available on playnovelo.vercel.app or Novelo Player.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
