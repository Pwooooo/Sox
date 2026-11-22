import { useMemo, useState, type FormEvent } from 'react'
import { Eye, EyeOff, Check, User, Mail, Lock, Calendar } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { Auth3DBackground } from '@/components/Auth3DBackground'

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
    <div className="min-h-screen w-full bg-[#070709] text-white select-none flex items-center justify-center p-4 md:p-6 relative overflow-hidden isolate">
      {/* Live 3D Three.js World Background */}
      <Auth3DBackground />

      {/* Soft Vignette */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at center, rgba(14,10,16,0.02) 35%, rgba(14,10,16,0.28) 100%)',
        }}
      />

      {/* Frosted Glass Card with Top Specular Edge */}
      <div className="w-full max-w-[460px] relative z-10 rounded-3xl bg-[#141c15]/68 backdrop-blur-2xl border border-[#ffe0aa]/[0.12] shadow-[0_32px_100px_rgba(0,0,0,0.78)] p-7 md:p-8 overflow-hidden">
        {/* Firewatch-Style Layered Paper-Cut Sunset Forest Backdrop */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            maskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.92) 70%, rgba(0,0,0,0.65) 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.92) 70%, rgba(0,0,0,0.65) 100%)',
          }}
        >
          <svg
            viewBox="0 0 460 560"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              {/* Atmospheric sunset sky wash */}
              <linearGradient id="fw-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f5b887" stopOpacity="0.22" />
                <stop offset="38%" stopColor="#d98779" stopOpacity="0.16" />
                <stop offset="75%" stopColor="#35443a" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#0d120f" stopOpacity="0.3" />
              </linearGradient>
              <radialGradient id="fw-sun-glow" cx="78%" cy="13%" r="48%">
                <stop offset="0%" stopColor="#fff0cc" stopOpacity="0.65" />
                <stop offset="28%" stopColor="#ffc585" stopOpacity="0.28" />
                <stop offset="68%" stopColor="#e88d67" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#e88d67" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="fw-ray" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffe4b5" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#ffe4b5" stopOpacity="0" />
              </linearGradient>

              {/* 5 Depth-Layered Atmospheric Silhouettes (far -> near) */}
              <linearGradient id="fw-layer-1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c49389" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#6b5862" stopOpacity="0.22" />
              </linearGradient>
              <linearGradient id="fw-layer-2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#758f6e" stopOpacity="0.52" />
                <stop offset="100%" stopColor="#344537" stopOpacity="0.34" />
              </linearGradient>
              <linearGradient id="fw-layer-3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4c6b46" stopOpacity="0.68" />
                <stop offset="100%" stopColor="#223322" stopOpacity="0.52" />
              </linearGradient>
              <linearGradient id="fw-layer-4" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2f4a2c" stopOpacity="0.82" />
                <stop offset="100%" stopColor="#142114" stopOpacity="0.72" />
              </linearGradient>
              <linearGradient id="fw-layer-5" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#162415" stopOpacity="0.92" />
                <stop offset="100%" stopColor="#0a100a" stopOpacity="0.95" />
              </linearGradient>

              {/* Soft paper-grain texture */}
              <filter id="fw-grain" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
              </filter>
            </defs>

            {/* Sky & Glowing Sunset Sun */}
            <rect width="460" height="560" fill="url(#fw-sky)" />
            <rect width="460" height="560" fill="url(#fw-sun-glow)" />

            {/* Soft Volumetric Sunbeams */}
            <polygon points="362,72 60,310 155,340" fill="url(#fw-ray)" />
            <polygon points="362,72 195,355 295,375" fill="url(#fw-ray)" />

            {/* Glowing Sun Disc */}
            <circle cx="362" cy="72" r="34" fill="#ffe0aa" fillOpacity="0.24" />
            <circle cx="362" cy="72" r="20" fill="#ffefd1" fillOpacity="0.55" />
            <circle cx="362" cy="72" r="12" fill="#fff8e8" fillOpacity="0.88" />

            {/* Layer 1: Distant Misty Mountain Ridge */}
            <path
              d="M0 202 L58 174 L118 194 L182 158 L248 188 L322 152 L392 180 L460 162 L460 560 L0 560 Z"
              fill="url(#fw-layer-1)"
            />

            {/* Layer 2: Hazy Pine Ridge with Soft Forest Crest */}
            <path
              d="M0 232 Q74 202 146 226 Q220 198 296 220 Q378 192 460 214 L460 560 L0 560 Z"
              fill="url(#fw-layer-2)"
            />
            <g fill="url(#fw-layer-2)">
              <path d="M18 226 L28 192 L38 226 Z M34 224 L46 186 L58 224 Z M344 210 L356 174 L368 210 Z M366 208 L378 178 L390 208 Z M408 212 L422 170 L436 212 Z" />
            </g>

            {/* Layer 3: Midground Rolling Forest Hills & Pine Silhouettes */}
            <path
              d="M0 284 Q112 248 228 278 T460 256 L460 560 L0 560 Z"
              fill="url(#fw-layer-3)"
            />
            <g fill="url(#fw-layer-3)">
              <path d="M8 282 L22 232 L36 282 Z M32 278 L48 220 L64 278 Z M58 274 L72 236 L86 274 Z" />
              <path d="M312 272 L326 228 L340 272 Z M336 270 L354 212 L372 270 Z M368 266 L384 224 L400 266 Z M404 262 L424 208 L444 262 Z" />
            </g>

            {/* Layer 4: Closer Lush Treeline & Meadow Valley */}
            <path
              d="M0 366 Q130 332 252 358 T460 342 L460 560 L0 560 Z"
              fill="url(#fw-layer-4)"
            />
            <g fill="url(#fw-layer-4)">
              <path d="M-8 368 L14 294 L36 368 Z M26 364 L46 306 L66 364 Z" />
              <path d="M388 352 L410 288 L432 352 Z M420 350 L444 276 L468 350 Z" />
            </g>

            {/* Layer 5: Deep Foreground Pine Framing (Bottom Corners) */}
            <path
              d="M0 448 Q125 426 240 448 T460 436 L460 560 L0 560 Z"
              fill="url(#fw-layer-5)"
            />
            <g fill="url(#fw-layer-5)">
              <path d="M-10 462 L18 362 L46 462 Z M24 468 L48 390 L72 468 Z" />
              <path d="M396 456 L422 374 L448 456 Z M428 460 L456 356 L484 460 Z" />
            </g>

            {/* Subtle Tactile Paper Grain */}
            <rect width="460" height="560" filter="url(#fw-grain)" opacity="0.045" />
          </svg>

          {/* Soft center readability scrim so form text stays crisp over the layers */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 56% at 50% 56%, rgba(17,26,18,0.42) 0%, rgba(17,26,18,0.14) 74%, transparent 100%)',
            }}
          />
        </div>

        <div
          className="absolute inset-x-8 top-0 h-px pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,228,184,0.38), transparent)',
          }}
        />

        {/* Floating Cat Icon with Soft Spotlight Glow */}
        <div className="relative z-10 mb-3 flex items-center justify-center">
          <div
            className="absolute size-24 rounded-full blur-2xl opacity-35 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,228,184,0.45), transparent 70%)' }}
          />
          <img
            src="/logo.png"
            alt="Novelo"
            className="relative size-16 object-contain drop-shadow-[0_10px_22px_rgba(0,0,0,0.65)]"
          />
        </div>

        <h1 className="relative z-10 text-[24px] md:text-[26px] font-black tracking-tight text-white text-center m-0 mb-5 leading-tight">
          {activeTab === 'register'
            ? 'Create a Novelo account'
            : mode === 'login-only'
              ? 'Log in to Novelo Studio'
              : 'Log in to Novelo'}
        </h1>

        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-3.5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/12 border border-rose-500/25 text-xs text-rose-200 leading-snug">
              {error}
            </div>
          )}

          {info && (
            <div className="p-3 rounded-xl bg-emerald-500/12 border border-emerald-500/25 text-xs text-emerald-200 leading-snug">
              {info}
            </div>
          )}

          {activeTab === 'register' ? (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/90">Birthday</label>
                <div className="relative">
                  <Calendar className="size-3.5 text-white/55 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={birthday}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full h-10 pl-9 pr-3.5 rounded-xl bg-[#2e221b]/55 backdrop-blur-md hover:bg-[#382a21]/65 border border-[#f2c394]/[0.22] text-xs text-white focus:outline-none focus:border-[#ffe4b8]/50 focus:bg-[#36281f]/75 transition-all [color-scheme:dark]"
                  />
                </div>
                <span className="text-[11px] text-white/65">
                  You must be at least 13 years old.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/90">Username</label>
                  <div className="relative">
                    <User className="size-3.5 text-white/55 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      minLength={3}
                      maxLength={24}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Preferred username"
                      className="w-full h-10 pl-9 pr-3.5 rounded-xl bg-[#233423]/55 backdrop-blur-md hover:bg-[#2a3f2a]/65 border border-[#a8cf98]/[0.20] text-xs text-white placeholder:text-white/50 focus:outline-none focus:border-[#ffe4b8]/45 focus:bg-[#283c28]/75 transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/90">Email</label>
                  <div className="relative">
                    <Mail className="size-3.5 text-white/55 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-10 pl-9 pr-3.5 rounded-xl bg-[#233423]/55 backdrop-blur-md hover:bg-[#2a3f2a]/65 border border-[#a8cf98]/[0.20] text-xs text-white placeholder:text-white/50 focus:outline-none focus:border-[#ffe4b8]/45 focus:bg-[#283c28]/75 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/90">Password</label>
                <div className="relative">
                  <Lock className="size-3.5 text-white/55 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-10 pl-9 pr-10 rounded-xl bg-[#152216]/60 backdrop-blur-md hover:bg-[#1a2a1b]/70 border border-[#88b37c]/[0.18] text-xs text-white placeholder:text-white/50 focus:outline-none focus:border-[#ffe4b8]/45 focus:bg-[#19281a]/78 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="size-8 rounded-lg flex items-center justify-center text-white/55 hover:text-white bg-transparent border-none cursor-pointer absolute right-1.5 top-1/2 -translate-y-1/2 transition-colors"
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
                        strength >= seg ? strengthColors[strength] : 'bg-white/[0.12]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-white/65">
                  Must be at least 8 characters long
                </span>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer pt-0.5">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={agreedTerms}
                  onClick={() => setAgreedTerms((v) => !v)}
                  className={`size-4 rounded-[6px] mt-0.5 shrink-0 flex items-center justify-center border transition-all cursor-pointer ${
                    agreedTerms
                      ? 'bg-white border-white text-[#0c0d10]'
                      : 'bg-white/[0.04] border-white/15 hover:border-white/35 text-transparent'
                  }`}
                >
                  <Check className="size-3 stroke-[3]" />
                </button>
                <span className="text-[11px] text-white/55 leading-relaxed">
                  I agree to the{' '}
                  <span className="text-white/85 underline">Terms of Service</span>,{' '}
                  <span className="text-white/85 underline">Privacy Policy</span>,{' '}
                  <span className="text-white/85 underline">Community Guidelines</span>, and{' '}
                  <span className="text-white/85 underline">Creator Guidelines</span>.
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={keepLoggedIn}
                  onClick={() => setKeepLoggedIn((v) => !v)}
                  className={`size-4 rounded-[6px] shrink-0 flex items-center justify-center border transition-all cursor-pointer ${
                    keepLoggedIn
                      ? 'bg-white border-white text-[#0c0d10]'
                      : 'bg-white/[0.04] border-white/15 hover:border-white/35 text-transparent'
                  }`}
                >
                  <Check className="size-3 stroke-[3]" />
                </button>
                <span className="text-[11px] text-white/70">Keep me logged in</span>
              </label>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/90">Username or Email</label>
                <div className="relative">
                  <User className="size-3.5 text-white/55 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your username or email"
                    className="w-full h-10 pl-9 pr-3.5 rounded-xl bg-[#2e221b]/55 backdrop-blur-md hover:bg-[#382a21]/65 border border-[#f2c394]/[0.22] text-xs text-white placeholder:text-white/50 focus:outline-none focus:border-[#ffe4b8]/50 focus:bg-[#36281f]/75 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/90">Password</label>
                <div className="relative">
                  <Lock className="size-3.5 text-white/55 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-10 pl-9 pr-10 rounded-xl bg-[#152216]/60 backdrop-blur-md hover:bg-[#1a2a1b]/70 border border-[#88b37c]/[0.18] text-xs text-white placeholder:text-white/50 focus:outline-none focus:border-[#ffe4b8]/45 focus:bg-[#19281a]/78 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="size-8 rounded-lg flex items-center justify-center text-white/55 hover:text-white bg-transparent border-none cursor-pointer absolute right-1.5 top-1/2 -translate-y-1/2 transition-colors"
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
                  className={`size-4 rounded-[6px] shrink-0 flex items-center justify-center border transition-all cursor-pointer ${
                    keepLoggedIn
                      ? 'bg-white border-white text-[#0c0d10]'
                      : 'bg-white/[0.04] border-white/15 hover:border-white/35 text-transparent'
                  }`}
                >
                  <Check className="size-3 stroke-[3]" />
                </button>
                <span className="text-[11px] text-white/70">Keep me logged in</span>
              </label>
            </>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 h-10 w-full rounded-xl bg-white/95 hover:bg-white disabled:opacity-50 text-[#0c0d10] font-bold text-xs cursor-pointer border-none transition-all shadow-[0_8px_24px_rgba(255,255,255,0.14)] active:scale-[0.99]"
          >
            {submitting
              ? 'Please wait...'
              : activeTab === 'register'
                ? 'Create an account'
                : 'Log in'}
          </button>

          {mode === 'both' && (
            <p className="text-xs text-white/50 text-center m-0 pt-2">
              {activeTab === 'register' ? 'Already have an account? ' : "Don't have an account? "}
              <button
                type="button"
                onClick={() => switchTab(activeTab === 'register' ? 'login' : 'register')}
                className="text-white font-bold bg-transparent border-none p-0 cursor-pointer hover:underline"
              >
                {activeTab === 'register' ? 'Log in' : 'Sign up'}
              </button>
            </p>
          )}

          {mode === 'login-only' && (
            <p className="text-[11px] text-white/40 text-center m-0 pt-1">
              Registration is only available on playnovelo.vercel.app or Novelo Player.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
