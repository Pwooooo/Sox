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
      <div className="w-full max-w-[460px] relative z-10 rounded-3xl bg-[#0e0e12]/70 backdrop-blur-2xl border border-white/[0.08] shadow-[0_32px_100px_rgba(0,0,0,0.85)] p-7 md:p-8 overflow-hidden">
        {/* Halftone Sunny Cozy Forest Header & Mid-Card Texture */}
        <div
          className="absolute inset-x-0 top-0 h-[85%] pointer-events-none overflow-hidden"
          style={{
            maskImage:
              'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.88) 55%, rgba(0,0,0,0.45) 80%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.88) 55%, rgba(0,0,0,0.45) 80%, transparent 100%)',
          }}
        >
          {/* Warm Sun Glow */}
          <div
            className="absolute -top-12 right-2 size-64 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(255,214,145,0.34) 0%, rgba(255,180,110,0.14) 48%, transparent 74%)',
            }}
          />
          {/* Dotted Halftone Sun, Sunbeams, Clouds & Layered Forest Silhouette */}
          <svg
            viewBox="0 0 460 460"
            className="w-full h-full"
            preserveAspectRatio="xMidYMin slice"
            aria-hidden="true"
          >
            <defs>
              <pattern id="novelo-halftone" width="5" height="5" patternUnits="userSpaceOnUse">
                <circle cx="2.2" cy="2.2" r="1.35" fill="currentColor" />
              </pattern>
              <mask id="novelo-dot-mask">
                <rect width="460" height="460" fill="url(#novelo-halftone)" className="text-white" />
              </mask>
              <linearGradient id="novelo-sun-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffebb8" stopOpacity="1" />
                <stop offset="100%" stopColor="#f5a566" stopOpacity="0.45" />
              </linearGradient>
              <linearGradient id="novelo-beam-grad" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffe5b4" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#ffe5b4" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="novelo-hill-back" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b0db95" stopOpacity="0.58" />
                <stop offset="100%" stopColor="#405d34" stopOpacity="0.16" />
              </linearGradient>
              <linearGradient id="novelo-hill-mid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94c973" stopOpacity="0.68" />
                <stop offset="100%" stopColor="#314a27" stopOpacity="0.18" />
              </linearGradient>
              <linearGradient id="novelo-hill-front" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7db85e" stopOpacity="0.72" />
                <stop offset="100%" stopColor="#23361c" stopOpacity="0.08" />
              </linearGradient>
            </defs>

            <g mask="url(#novelo-dot-mask)">
              {/* Diagonal Warm Sunbeams */}
              <polygon points="366,54 110,270 195,305" fill="url(#novelo-beam-grad)" />
              <polygon points="366,54 220,315 315,335" fill="url(#novelo-beam-grad)" />

              {/* Halftone Sky & Sun Halo */}
              <circle cx="366" cy="54" r="76" fill="url(#novelo-sun-grad)" opacity="0.36" />
              <circle cx="366" cy="54" r="42" fill="url(#novelo-sun-grad)" opacity="0.6" />
              <circle cx="366" cy="54" r="20" fill="#fff4da" opacity="0.95" />

              {/* Soft Dotted Cloud Wisps */}
              <path
                d="M28 54 Q48 32 74 44 Q98 26 124 44 Q146 40 152 56 L22 56 Z"
                fill="#ffeed6"
                opacity="0.34"
              />
              <path
                d="M214 38 Q232 22 254 32 Q272 18 292 34 L210 40 Z"
                fill="#ffeed6"
                opacity="0.28"
              />

              {/* Distant Rolling Meadow Ridge */}
              <path
                d="M0 205 Q96 154 205 186 T390 168 T460 185 L460 460 L0 460 Z"
                fill="url(#novelo-hill-back)"
              />

              {/* Midground Forest Tree Line */}
              <g fill="#b8e39a" opacity="0.56">
                <path d="M12 248 L30 172 L48 248 Z M16 216 L30 156 L44 216 Z" />
                <path d="M46 254 L66 164 L86 254 Z M51 218 L66 146 L81 218 Z" />
                <path d="M84 256 L100 188 L116 256 Z" />
                <circle cx="136" cy="206" r="22" />
                <circle cx="158" cy="214" r="17" />
                <circle cx="290" cy="218" r="16" />
                <path d="M312 252 L328 180 L344 252 Z" />
                <path d="M342 256 L362 160 L382 256 Z M347 218 L362 142 L377 218 Z" />
                <path d="M382 250 L400 174 L418 250 Z" />
                <circle cx="428" cy="202" r="24" />
                <circle cx="448" cy="214" r="18" />
              </g>

              {/* Midground Slope */}
              <path
                d="M0 242 Q125 204 248 232 T460 220 L460 460 L0 460 Z"
                fill="url(#novelo-hill-mid)"
              />

              {/* Foreground Cozy Pines & Sunlit Meadow */}
              <g fill="#90cc6e" opacity="0.62">
                <path d="M-4 328 L18 236 L40 328 Z M2 288 L18 214 L34 288 Z" />
                <path d="M38 334 L56 260 L74 334 Z" />
                <path d="M386 332 L406 248 L426 332 Z" />
                <path d="M416 336 L440 232 L464 336 Z M422 292 L440 212 L458 292 Z" />
              </g>

              <path
                d="M0 306 Q140 276 260 298 T460 288 L460 460 L0 460 Z"
                fill="url(#novelo-hill-front)"
              />
            </g>

            {/* Subtle Sunlit Pollen / Firefly Sparkles */}
            <g fill="#fff0cc">
              <circle cx="72" cy="82" r="1.4" opacity="0.7" />
              <circle cx="128" cy="48" r="1.1" opacity="0.55" />
              <circle cx="176" cy="112" r="1.3" opacity="0.6" />
              <circle cx="272" cy="158" r="1.2" opacity="0.55" />
              <circle cx="312" cy="96" r="1.3" opacity="0.65" />
              <circle cx="332" cy="36" r="1.1" opacity="0.55" />
              <circle cx="412" cy="108" r="1.4" opacity="0.7" />
              <circle cx="430" cy="46" r="1.1" opacity="0.5" />
              <circle cx="104" cy="264" r="1.2" opacity="0.5" />
              <circle cx="356" cy="276" r="1.3" opacity="0.55" />
            </g>
          </svg>
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
                <label className="text-xs font-semibold text-white/80">Birthday</label>
                <div className="relative">
                  <Calendar className="size-3.5 text-white/35 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={birthday}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full h-10 pl-9 pr-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.07] text-xs text-white focus:outline-none focus:border-white/25 focus:bg-white/[0.07] transition-all [color-scheme:dark]"
                  />
                </div>
                <span className="text-[11px] text-white/40">
                  You must be at least 13 years old.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/80">Username</label>
                  <div className="relative">
                    <User className="size-3.5 text-white/35 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      minLength={3}
                      maxLength={24}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Preferred username"
                      className="w-full h-10 pl-9 pr-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.07] text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/25 focus:bg-white/[0.07] transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/80">Email</label>
                  <div className="relative">
                    <Mail className="size-3.5 text-white/35 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-10 pl-9 pr-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.07] text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/25 focus:bg-white/[0.07] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/80">Password</label>
                <div className="relative">
                  <Lock className="size-3.5 text-white/35 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-10 pl-9 pr-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.07] text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/25 focus:bg-white/[0.07] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="size-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white bg-transparent border-none cursor-pointer absolute right-1.5 top-1/2 -translate-y-1/2 transition-colors"
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
                        strength >= seg ? strengthColors[strength] : 'bg-white/[0.08]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-white/40">
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
                <label className="text-xs font-semibold text-white/80">Username or Email</label>
                <div className="relative">
                  <User className="size-3.5 text-white/35 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your username or email"
                    className="w-full h-10 pl-9 pr-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.07] text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/25 focus:bg-white/[0.07] transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/80">Password</label>
                <div className="relative">
                  <Lock className="size-3.5 text-white/35 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-10 pl-9 pr-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.07] text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/25 focus:bg-white/[0.07] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="size-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white bg-transparent border-none cursor-pointer absolute right-1.5 top-1/2 -translate-y-1/2 transition-colors"
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
