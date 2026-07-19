import { useState } from 'react'
import { User, Mail, Lock, Calendar, Key, Eye, EyeOff } from 'lucide-react'

export function Auth({ onAuth }: { onAuth: () => void }) {
  const [mode, setMode] = useState<'signup' | 'login'>('signup')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [form, setForm] = useState({
    username: '',
    email: '',
    dob: '',
    inviteKey: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'signup' && !agreed) return
    onAuth()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[960px] flex overflow-hidden rounded-[var(--radius)] border border-border min-h-[600px]">
        {/* Left Panel - Brand */}
        <div className="hidden md:flex flex-1 bg-primary items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 50%, rgba(255,255,255,0.15) 0%, transparent 50%),
                               radial-gradient(circle at 70% 80%, rgba(0,0,0,0.1) 0%, transparent 50%)`,
            }}
          />
          <div className="relative text-center text-white z-10">
            <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-[16px] flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl font-extrabold font-sans">N</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-3 font-sans" style={{ fontFamily: "'Rubik', sans-serif" }}>
              Novelo
            </h1>
            <p className="text-lg font-medium text-white/80">Make it Awesome</p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 bg-card p-8 md:p-10 flex flex-col justify-center">
          <div className="w-full max-w-[400px] mx-auto">
            <div className="mb-6">
              <div className="flex md:hidden items-center justify-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary text-white rounded-[10px] flex items-center justify-center font-extrabold text-lg">
                  N
                </div>
                <span className="text-xl font-bold">Novelo</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight mb-1">
                {mode === 'signup' ? 'Create an account' : 'Welcome back'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {mode === 'signup'
                  ? 'Enter your details below to create your account'
                  : 'Enter your credentials to sign in'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === 'signup' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Enter a username"
                        value={form.username}
                        onChange={handleChange('username')}
                        className="w-full h-10 pl-10 pr-3 rounded-[calc(var(--radius)-2px)] border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none transition-[border-color] focus:border-ring"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={form.email}
                        onChange={handleChange('email')}
                        className="w-full h-10 pl-10 pr-3 rounded-[calc(var(--radius)-2px)] border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none transition-[border-color] focus:border-ring"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        type="date"
                        placeholder="mm / dd / yyyy"
                        value={form.dob}
                        onChange={handleChange('dob')}
                        className="w-full h-10 pl-10 pr-3 rounded-[calc(var(--radius)-2px)] border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none transition-[border-color] focus:border-ring"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Invite Key</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Enter your invite key"
                        value={form.inviteKey}
                        onChange={handleChange('inviteKey')}
                        className="w-full h-10 pl-10 pr-3 rounded-[calc(var(--radius)-2px)] border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none transition-[border-color] focus:border-ring"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  {mode === 'signup' ? 'Password' : 'Username or Email'}
                </label>
                <div className="relative">
                  {mode === 'signup' ? (
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  ) : (
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  )}
                  <input
                    type={mode === 'signup' && showPassword ? 'text' : 'password'}
                    placeholder={mode === 'signup' ? 'Create a password' : 'Enter your username or email'}
                    value={form.password}
                    onChange={handleChange('password')}
                    className="w-full h-10 pl-10 pr-10 rounded-[calc(var(--radius)-2px)] border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none transition-[border-color] focus:border-ring"
                  />
                  {mode === 'signup' && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  )}
                </div>
                {mode === 'signup' && (
                  <p className="text-xs text-muted-foreground">Must be at least 8 characters long</p>
                )}
              </div>

              {mode === 'signup' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={form.confirmPassword}
                      onChange={handleChange('confirmPassword')}
                      className="w-full h-10 pl-10 pr-10 rounded-[calc(var(--radius)-2px)] border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none transition-[border-color] focus:border-ring"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange('password')}
                      className="w-full h-10 pl-10 pr-10 rounded-[calc(var(--radius)-2px)] border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none transition-[border-color] focus:border-ring"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'signup' && (
                <label className="flex items-start gap-2 cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 size-4 rounded accent-primary"
                  />
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    I agree to the{' '}
                    <a href="#" className="text-primary hover:underline">Terms of Service</a>,{' '}
                    <a href="#" className="text-primary hover:underline">Privacy Policy</a>,{' '}
                    <a href="#" className="text-primary hover:underline">Community Guidelines</a>, and{' '}
                    <a href="#" className="text-primary hover:underline">Creator Guidelines</a>
                  </span>
                </label>
              )}

              <button
                type="submit"
                className="w-full h-11 rounded-[calc(var(--radius)-2px)] bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors cursor-pointer mt-2"
              >
                {mode === 'signup' ? 'Sign Up' : 'Sign In'}
              </button>

              <button
                type="button"
                onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                className="w-full h-11 rounded-[calc(var(--radius)-2px)] bg-transparent border border-border text-sm font-medium hover:bg-accent/50 transition-colors cursor-pointer"
              >
                {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-border text-center">
              <button
                onClick={onAuth}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none"
              >
                Continue without account &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
