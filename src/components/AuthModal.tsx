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
        {/* Hand-Drawn Ink & Wash Sunny Cozy Forest Backdrop */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            maskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 62%, rgba(0,0,0,0.5) 88%, rgba(0,0,0,0.22) 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 62%, rgba(0,0,0,0.5) 88%, rgba(0,0,0,0.22) 100%)',
          }}
        >
          {/* Warm Sunlit Sky Wash */}
          <div
            className="absolute -top-14 right-0 size-72 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(255,216,148,0.24) 0%, rgba(255,180,110,0.09) 48%, transparent 74%)',
            }}
          />

          <svg
            viewBox="0 0 460 560"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              {/* Subtle organic pencil/ink paper wobble */}
              <filter id="novelo-sketch" x="-5%" y="-5%" width="110%" height="110%">
                <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
              </filter>
              <linearGradient id="novelo-wash-hill1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9ec87d" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#354f2b" stopOpacity="0.06" />
              </linearGradient>
              <linearGradient id="novelo-wash-hill2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#81b462" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#263b1e" stopOpacity="0.08" />
              </linearGradient>
              <linearGradient id="novelo-wash-hill3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6ea350" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#1b2b15" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            <g filter="url(#novelo-sketch)" strokeLinecap="round" strokeLinejoin="round">
              {/* Hand-Drawn Sun & Sketchy Rays */}
              <g transform="translate(374, 58)">
                <circle cx="0" cy="0" r="24" fill="#ffe4b5" fillOpacity="0.26" stroke="#ffdfa6" strokeWidth="1.5" strokeOpacity="0.65" />
                <circle cx="0" cy="0" r="15" fill="#fff0cf" fillOpacity="0.32" />
                <g stroke="#ffdfa6" strokeWidth="1.35" strokeOpacity="0.52">
                  <path d="M-34 -2 Q-42 -3 -48 -1" />
                  <path d="M-28 20 Q-37 26 -44 33" />
                  <path d="M-12 32 Q-16 42 -19 50" />
                  <path d="M12 32 Q16 41 19 48" />
                  <path d="M29 19 Q38 25 45 30" />
                  <path d="M-29 -21 Q-37 -27 -44 -32" />
                  <path d="M-10 -33 Q-13 -42 -15 -49" />
                  <path d="M14 -32 Q18 -40 22 -46" />
                </g>
              </g>

              {/* Sketchy Storybook Clouds */}
              <g fill="#ffedd4" fillOpacity="0.1" stroke="#ffe5c2" strokeWidth="1.3" strokeOpacity="0.42">
                <path d="M26 56 C26 44, 42 36, 54 42 C60 28, 82 26, 92 38 C106 34, 120 42, 118 54 C126 58, 122 66, 108 66 L34 66 C22 66, 20 58, 26 56 Z" />
                <path d="M220 42 C222 33, 236 28, 246 34 C254 24, 272 24, 278 35 C288 33, 298 40, 294 48 L224 48 Z" />
              </g>

              {/* Distant Rolling Hills */}
              <path
                d="M-8 238 Q95 190 212 222 T468 208 L468 560 L-8 560 Z"
                fill="url(#novelo-wash-hill1)"
                stroke="#b7de99"
                strokeWidth="1.4"
                strokeOpacity="0.38"
              />

              {/* Midground Hand-Sketched Pine & Leafy Oak Trees */}
              <g fill="#9ed17f" fillOpacity="0.2" stroke="#c3e8a6" strokeWidth="1.35" strokeOpacity="0.46">
                {/* Left cluster */}
                <path d="M16 254 Q26 218 32 184 Q40 218 50 254 Q34 250 16 254 Z" />
                <path d="M21 224 Q29 196 32 172 Q37 196 45 224" fill="none" />
                <path d="M32 252 L32 272" fill="none" />

                <path d="M48 262 Q60 214 68 168 Q78 214 90 262 Q70 256 48 262 Z" />
                <path d="M54 226 Q64 190 68 156 Q74 190 84 226" fill="none" />
                <path d="M68 260 L68 282" fill="none" />

                {/* Left leafy oak */}
                <path d="M84 228 C76 214, 88 196, 104 200 C112 186, 134 188, 138 204 C152 204, 158 222, 146 232 C136 240, 94 240, 84 228 Z" />
                <path d="M114 236 L114 268 M114 248 L104 238 M114 244 L126 236" fill="none" />

                {/* Right cluster */}
                <path d="M332 254 Q344 210 352 168 Q362 210 374 254 Q354 248 332 254 Z" />
                <path d="M338 220 Q347 186 352 154 Q358 186 368 220" fill="none" />
                <path d="M352 252 L352 276" fill="none" />

                <path d="M372 248 Q382 212 390 180 Q400 212 410 248 Q392 244 372 248 Z" />
                <path d="M390 246 L390 268" fill="none" />

                {/* Right leafy oak */}
                <path d="M402 224 C394 208, 408 190, 424 194 C434 180, 454 184, 458 202 C466 208, 464 226, 450 232 C438 236, 410 236, 402 224 Z" />
                <path d="M432 232 L432 266 M432 244 L420 234" fill="none" />
              </g>

              {/* Rolling Midground & Foreground Meadow Slopes */}
              <path
                d="M-8 292 Q132 256 264 286 T468 272 L468 560 L-8 560 Z"
                fill="url(#novelo-wash-hill2)"
                stroke="#a5d384"
                strokeWidth="1.3"
                strokeOpacity="0.34"
              />
              <path
                d="M-8 386 Q128 354 268 382 T468 370 L468 560 L-8 560 Z"
                fill="url(#novelo-wash-hill3)"
                stroke="#8ec26d"
                strokeWidth="1.25"
                strokeOpacity="0.32"
              />

              {/* Foreground Framing Pines & Meadow Grass Tufts */}
              <g fill="#7fb862" fillOpacity="0.22" stroke="#a8d88a" strokeWidth="1.4" strokeOpacity="0.45">
                <path d="M-6 410 Q12 356 22 310 Q34 356 48 410 Z" />
                <path d="M412 412 Q428 352 438 302 Q450 352 466 412 Z" />
                {/* Sketchy grass & wildflower tufts */}
                <path d="M48 420 Q44 406 38 400 M48 420 Q50 404 52 396 M48 420 Q56 408 62 402" fill="none" />
                <path d="M376 426 Q372 412 366 406 M376 426 Q378 410 380 402 M376 426 Q384 414 390 408" fill="none" />
                <path d="M180 498 Q176 486 172 480 M180 498 Q182 484 184 476 M180 498 Q188 488 192 482" fill="none" />
                <path d="M310 506 Q306 494 302 488 M310 506 Q312 492 314 484" fill="none" />
              </g>
            </g>

            {/* Warm Sunlit Fireflies / Pollen Specks */}
            <g fill="#fff0c9">
              <circle cx="88" cy="112" r="1.5" opacity="0.65" />
              <circle cx="144" cy="74" r="1.1" opacity="0.5" />
              <circle cx="298" cy="108" r="1.3" opacity="0.6" />
              <circle cx="418" cy="136" r="1.4" opacity="0.6" />
              <circle cx="34" cy="322" r="1.3" opacity="0.55" />
              <circle cx="426" cy="340" r="1.4" opacity="0.55" />
            </g>
          </svg>

          {/* Soft center readability scrim so form text stays crisp over the sketch */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 78% 58% at 50% 56%, rgba(10,11,15,0.68) 0%, rgba(10,11,15,0.28) 72%, transparent 100%)',
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
                    className="w-full h-10 pl-9 pr-3.5 rounded-xl bg-[#0a0b0f]/75 hover:bg-[#0a0b0f]/85 border border-white/[0.12] text-xs text-white focus:outline-none focus:border-white/30 focus:bg-[#0a0b0f]/92 transition-all [color-scheme:dark]"
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
                      className="w-full h-10 pl-9 pr-3.5 rounded-xl bg-[#0a0b0f]/75 hover:bg-[#0a0b0f]/85 border border-white/[0.12] text-xs text-white placeholder:text-white/45 focus:outline-none focus:border-white/30 focus:bg-[#0a0b0f]/92 transition-all"
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
                      className="w-full h-10 pl-9 pr-3.5 rounded-xl bg-[#0a0b0f]/75 hover:bg-[#0a0b0f]/85 border border-white/[0.12] text-xs text-white placeholder:text-white/45 focus:outline-none focus:border-white/30 focus:bg-[#0a0b0f]/92 transition-all"
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
                    className="w-full h-10 pl-9 pr-10 rounded-xl bg-[#0a0b0f]/75 hover:bg-[#0a0b0f]/85 border border-white/[0.12] text-xs text-white placeholder:text-white/45 focus:outline-none focus:border-white/30 focus:bg-[#0a0b0f]/92 transition-all"
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
                    className="w-full h-10 pl-9 pr-3.5 rounded-xl bg-[#0a0b0f]/75 hover:bg-[#0a0b0f]/85 border border-white/[0.12] text-xs text-white placeholder:text-white/45 focus:outline-none focus:border-white/30 focus:bg-[#0a0b0f]/92 transition-all"
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
                    className="w-full h-10 pl-9 pr-10 rounded-xl bg-[#0a0b0f]/75 hover:bg-[#0a0b0f]/85 border border-white/[0.12] text-xs text-white placeholder:text-white/45 focus:outline-none focus:border-white/30 focus:bg-[#0a0b0f]/92 transition-all"
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
