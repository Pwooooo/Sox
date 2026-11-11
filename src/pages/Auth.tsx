import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User, Calendar, ShieldCheck, ArrowRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Auth() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'signup'>('signup')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'unspecified'>('unspecified')
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 1200)
    }, 800)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#111111] border border-white/[0.08] shadow-2xl p-6 md:p-8 flex flex-col gap-6">
        {/* Brand logo & Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="size-11 rounded-xl bg-white text-black font-extrabold flex items-center justify-center text-xl tracking-tight shadow-md">
            S
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {mode === 'signup' ? 'Create a Sox Account' : 'Welcome back to Sox'}
          </h1>
          <p className="text-xs text-white/50">
            {mode === 'signup'
              ? 'Join millions of players creating and exploring together'
              : 'Enter your credentials to continue to your account'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 rounded-xl bg-[#141414] border border-white/[0.08]">
          <button
            onClick={() => setMode('signup')}
            className={cn(
              "flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border-none",
              mode === 'signup'
                ? "bg-white text-black shadow-sm"
                : "bg-transparent text-white/60 hover:text-white"
            )}
          >
            Sign Up
          </button>
          <button
            onClick={() => setMode('login')}
            className={cn(
              "flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border-none",
              mode === 'login'
                ? "bg-white text-black shadow-sm"
                : "bg-transparent text-white/60 hover:text-white"
            )}
          >
            Log In
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/70">Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/40" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username..."
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#161616] border border-white/[0.08] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/70">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#161616] border border-white/[0.08] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-all"
              />
            </div>
          </div>

          {/* Additional fields for Sign Up */}
          {mode === 'signup' && (
            <>
              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/70">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password..."
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#161616] border border-white/[0.08] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-all"
                  />
                </div>
              </div>

              {/* Birthday Selectors */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/70 flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-white/40" />
                  Birthday
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <select className="h-10 px-2 rounded-xl bg-[#161616] border border-white/[0.08] text-xs text-white">
                    <option>January</option>
                    <option>February</option>
                    <option>March</option>
                    <option>April</option>
                    <option>May</option>
                    <option>June</option>
                    <option>July</option>
                    <option>August</option>
                    <option>September</option>
                    <option>October</option>
                    <option>November</option>
                    <option>December</option>
                  </select>
                  <select className="h-10 px-2 rounded-xl bg-[#161616] border border-white/[0.08] text-xs text-white">
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                  <select className="h-10 px-2 rounded-xl bg-[#161616] border border-white/[0.08] text-xs text-white">
                    {Array.from({ length: 40 }, (_, i) => (
                      <option key={2024 - i}>{2024 - i}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gender selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/70">Gender (Optional)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={cn(
                      "py-2 rounded-xl text-xs font-semibold border cursor-pointer transition-colors",
                      gender === 'female'
                        ? "bg-white/10 text-white border-white/40"
                        : "bg-[#161616] text-white/50 border-white/[0.08] hover:text-white"
                    )}
                  >
                    Female
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={cn(
                      "py-2 rounded-xl text-xs font-semibold border cursor-pointer transition-colors",
                      gender === 'male'
                        ? "bg-white/10 text-white border-white/40"
                        : "bg-[#161616] text-white/50 border-white/[0.08] hover:text-white"
                    )}
                  >
                    Male
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Remember me & Submit button */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-white/70 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-3.5 rounded bg-[#161616] border-white/20 accent-white cursor-pointer"
              />
              Remember me
            </label>
            {mode === 'login' && (
              <a href="#" className="text-white/50 hover:text-white underline">
                Forgot password?
              </a>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full h-11 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer border-none shadow-lg mt-2 disabled:opacity-50"
          >
            {success ? (
              <>
                <Check className="size-4" /> Logged In
              </>
            ) : loading ? (
              <div className="size-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
            ) : (
              <>
                {mode === 'signup' ? 'Create Account' : 'Log In'}
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-white/40 text-center leading-relaxed">
          By continuing, you agree to the Sox Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
