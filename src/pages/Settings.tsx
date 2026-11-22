import { useState } from 'react'
import { Pencil, Trash2, Check, X, LogOut, Eye, EyeOff, User as UserIcon } from 'lucide-react'
import { useAuth, validateUsername } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

const SETTINGS_TABS = [
  'Account',
  'Security',
  'Privacy',
  'Connections',
  'Notifications',
  'Appearance',
  'Accessibility',
  'Parental controls',
  'Billing',
] as const

type SettingsTab = (typeof SETTINGS_TABS)[number]
type ModalField = 'displayName' | 'username' | 'email' | 'password' | 'birthday' | null

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain) return email
  if (local.length <= 2) return `${local[0] ?? ''}****@${domain}`
  return `${local[0]}****@${domain}`
}

export function Settings() {
  const { user, profile, resendVerification, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState<SettingsTab>('Account')

  const rawUsername =
    profile?.username ||
    (user?.user_metadata?.username as string | undefined) ||
    user?.email?.split('@')[0] ||
    'guest'
  const rawDisplayName =
    profile?.display_name ||
    (user?.user_metadata?.display_name as string | undefined) ||
    rawUsername
  const rawEmail = user?.email || ''
  const isVerified = Boolean(user?.email_confirmed_at)
  const rawBirthday = (user?.user_metadata?.birthday as string | undefined) || ''

  const [modalField, setModalField] = useState<ModalField>(null)
  const [draftValue, setDraftValue] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const openModal = (field: Exclude<ModalField, null>, initial: string) => {
    setModalError(null)
    setFeedback(null)
    setCurrentPassword('')
    setShowCurrentPassword(false)
    setDraftValue(initial)
    setModalField(field)
  }

  const closeModal = () => {
    setModalField(null)
    setDraftValue('')
    setCurrentPassword('')
    setModalError(null)
  }

  const handleSaveModal = async () => {
    if (!supabase || !user || !modalField || saving) return
    setSaving(true)
    setModalError(null)
    try {
      const val = draftValue.trim()

      if (modalField === 'displayName') {
        if (val.length > 20) {
          setModalError('Display name must be up to 20 characters.')
          return
        }
        const nextDisplay = val || rawUsername
        await supabase.auth.updateUser({ data: { display_name: nextDisplay } })
        if (profile?.id) {
          await supabase.from('profiles').update({ display_name: val || null }).eq('id', profile.id)
        }
        setFeedback({ type: 'ok', text: 'Display name updated.' })
      } else if (modalField === 'username') {
        const err = validateUsername(val)
        if (err) {
          setModalError(err)
          return
        }
        if (!currentPassword) {
          setModalError('Please enter your current password.')
          return
        }
        if (rawEmail) {
          const { error: pwErr } = await supabase.auth.signInWithPassword({
            email: rawEmail,
            password: currentPassword,
          })
          if (pwErr) {
            setModalError('Current password is incorrect.')
            return
          }
        }
        if (val.toLowerCase() !== rawUsername.toLowerCase()) {
          const { data: existing } = await supabase
            .from('profiles')
            .select('id')
            .ilike('username', val)
            .maybeSingle()
          if (existing) {
            setModalError('That username is already taken.')
            return
          }
        }
        await supabase.auth.updateUser({ data: { username: val } })
        if (profile?.id) {
          await supabase.from('profiles').update({ username: val }).eq('id', profile.id)
        }
        setFeedback({ type: 'ok', text: 'Username updated.' })
      } else if (modalField === 'email') {
        if (!val.includes('@')) {
          setModalError('Enter a valid email address.')
          return
        }
        const { error } = await supabase.auth.updateUser({ email: val })
        if (error) {
          setModalError(error.message)
          return
        }
        setFeedback({ type: 'ok', text: 'Confirmation link sent to your new email.' })
      } else if (modalField === 'password') {
        if (draftValue.length < 8) {
          setModalError('Password must be at least 8 characters.')
          return
        }
        const { error } = await supabase.auth.updateUser({ password: draftValue })
        if (error) {
          setModalError(error.message)
          return
        }
        setFeedback({ type: 'ok', text: 'Password updated.' })
      } else if (modalField === 'birthday') {
        if (!val) {
          setModalError('Select a valid date.')
          return
        }
        const { error } = await supabase.auth.updateUser({ data: { birthday: val } })
        if (error) {
          setModalError(error.message)
          return
        }
        setFeedback({ type: 'ok', text: 'Birthday updated.' })
      }

      closeModal()
    } finally {
      setSaving(false)
    }
  }

  const handleVerifyEmail = async () => {
    if (!rawEmail || verifying) return
    setVerifying(true)
    setFeedback(null)
    try {
      const res = await resendVerification(rawEmail)
      if (res.error) setFeedback({ type: 'err', text: res.error })
      else setFeedback({ type: 'ok', text: `Verification email sent to ${rawEmail}.` })
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6 max-w-[920px] mx-auto text-white select-none">
      {/* Page Header */}
      <div className="flex flex-col gap-1 pb-2 border-b border-white/[0.05]">
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight m-0">
          Settings
        </h1>
        <p className="text-xs md:text-sm text-white/50 m-0">
          Manage your Novelo account details, security, and preferences
        </p>
      </div>

      {/* Main Layout: Content on Left, Tabs on Right */}
      <div className="flex flex-col-reverse md:flex-row items-start gap-6">
        <div className="flex-1 min-w-0 w-full">
          {activeTab === 'Account' ? (
        <div className="flex flex-col gap-5 pb-10">
          {/* Account Details Card */}
          <div className="relative rounded-2xl bg-[#101012]/90 backdrop-blur-xl border border-white/[0.06] shadow-2xl p-5 md:p-6 flex flex-col gap-4 overflow-hidden">
            <div
              className="absolute inset-x-8 top-0 h-px pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              }}
            />
            <h2 className="text-base md:text-lg font-bold text-white m-0 tracking-tight">
              Account details
            </h2>

            {feedback && (
              <p
                className={`text-xs m-0 leading-snug ${
                  feedback.type === 'ok' ? 'text-emerald-300' : 'text-rose-300'
                }`}
              >
                {feedback.text}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Display Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/80">Display name</label>
                <div className="h-10 px-3.5 rounded-[9px] bg-[#161619] border border-white/[0.07] hover:border-white/[0.14] flex items-center justify-between transition-colors">
                  <span className="text-xs text-white/90 truncate">{rawDisplayName}</span>
                  <button
                    type="button"
                    onClick={() => openModal('displayName', rawDisplayName)}
                    className="text-white/50 hover:text-white bg-transparent border-none p-1 cursor-pointer transition-colors"
                    title="Edit display name"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/80">Username</label>
                <div className="h-10 px-3.5 rounded-[9px] bg-[#161619] border border-white/[0.07] hover:border-white/[0.14] flex items-center justify-between transition-colors">
                  <span className="text-xs text-white/90 truncate">@{rawUsername}</span>
                  <button
                    type="button"
                    onClick={() => openModal('username', '')}
                    className="text-white/50 hover:text-white bg-transparent border-none p-1 cursor-pointer transition-colors"
                    title="Change username"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-white/80">Email</label>
                    {rawEmail && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          isVerified
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                        }`}
                      >
                        {isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    )}
                  </div>
                  {rawEmail && !isVerified && (
                    <button
                      type="button"
                      disabled={verifying}
                      onClick={handleVerifyEmail}
                      className="text-[11px] font-semibold text-amber-300 hover:text-amber-200 underline bg-transparent border-none p-0 cursor-pointer disabled:opacity-50"
                    >
                      {verifying ? 'Sending...' : 'Verify email'}
                    </button>
                  )}
                </div>
                <div className="h-10 px-3.5 rounded-[9px] bg-[#161619] border border-white/[0.07] hover:border-white/[0.14] flex items-center justify-between transition-colors">
                  <span className="text-xs text-white/90 truncate">
                    {rawEmail ? maskEmail(rawEmail) : 'No email'}
                  </span>
                  <button
                    type="button"
                    onClick={() => openModal('email', rawEmail)}
                    className="text-white/50 hover:text-white bg-transparent border-none p-1 cursor-pointer transition-colors"
                    title="Edit email"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/80">Password</label>
                <div className="h-10 px-3.5 rounded-[9px] bg-[#161619] border border-white/[0.07] hover:border-white/[0.14] flex items-center justify-between transition-colors">
                  <span className="text-xs text-white/90 tracking-widest">•••••••••••</span>
                  <button
                    type="button"
                    onClick={() => openModal('password', '')}
                    className="text-white/50 hover:text-white bg-transparent border-none p-1 cursor-pointer transition-colors"
                    title="Change password"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Birthday */}
              <div className="flex flex-col gap-1.5 md:col-span-2 max-w-[420px]">
                <label className="text-xs font-semibold text-white/80">Birthday</label>
                <div className="h-10 px-3.5 rounded-[9px] bg-[#161619] border border-white/[0.07] hover:border-white/[0.14] flex items-center justify-between transition-colors">
                  <span className="text-xs text-white/90">{rawBirthday || 'Not set'}</span>
                  <button
                    type="button"
                    onClick={() => openModal('birthday', rawBirthday)}
                    className="text-white/50 hover:text-white bg-transparent border-none p-1 cursor-pointer transition-colors"
                    title="Edit birthday"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Session & Account Management Card */}
          <div className="rounded-2xl bg-[#101012]/90 backdrop-blur-xl border border-white/[0.06] shadow-2xl p-5 md:p-6 flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white m-0">Sign out</h3>
                <p className="text-xs text-white/50 m-0 mt-0.5">
                  Sign out of your Novelo account on this device.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void signOut()}
                className="h-9 px-4 rounded-[9px] bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-semibold flex items-center gap-2 border border-white/[0.08] cursor-pointer shrink-0 self-start sm:self-auto transition-colors"
              >
                <LogOut className="size-3.5" />
                <span>Sign out</span>
              </button>
            </div>

            <div className="h-px bg-white/[0.06]" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white m-0">Delete account</h3>
                <p className="text-xs text-white/50 m-0 mt-0.5 leading-snug">
                  Schedule your account for permanent deletion. A 2-week grace period applies before data is removed.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!confirmDelete) {
                    setConfirmDelete(true)
                    setFeedback({
                      type: 'err',
                      text: 'Click "Confirm delete" to schedule account deletion.',
                    })
                  } else {
                    setConfirmDelete(false)
                    setFeedback({
                      type: 'ok',
                      text: 'Account deletion scheduled (2-week grace period).',
                    })
                  }
                }}
                className="h-9 px-4 rounded-[9px] bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-xs font-semibold flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto transition-colors"
              >
                <Trash2 className="size-3.5" />
                <span>{confirmDelete ? 'Confirm delete' : 'Delete account'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#101012]/90 backdrop-blur-xl border border-white/[0.06] shadow-2xl p-6">
          <h2 className="text-base font-bold text-white m-0 mb-1.5">{activeTab}</h2>
          <p className="text-xs text-white/50 m-0">
            {activeTab} settings will be available in a future update.
          </p>
        </div>
      )}
        </div>

        {/* Right-Side Vertical Pill Tab Bar */}
        <aside className="w-full md:w-52 shrink-0 rounded-2xl bg-[#101012]/90 backdrop-blur-xl border border-white/[0.06] shadow-2xl p-1.5 flex flex-row md:flex-col gap-1 overflow-x-auto no-scrollbar">
          {SETTINGS_TABS.map((t) => {
            const active = activeTab === t
            return (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setActiveTab(t)
                  setFeedback(null)
                }}
                className={`h-9 px-3.5 rounded-[9px] text-xs font-semibold whitespace-nowrap text-left border-none cursor-pointer transition-all ${
                  active
                    ? 'bg-white text-[#0c0d10] shadow-sm'
                    : 'bg-transparent text-white/55 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {t}
              </button>
            )
          })}
        </aside>
      </div>

      {/* Edit Modal matching Images 1 & 2 */}
      {modalField && (
        <div
          className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-[440px] rounded-2xl bg-[#161619] border border-white/[0.1] shadow-[0_24px_80px_rgba(0,0,0,0.85)] p-6 text-white flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold m-0">
                  {modalField === 'displayName'
                    ? 'Edit display name'
                    : modalField === 'username'
                      ? 'Change username'
                      : modalField === 'email'
                        ? 'Change email'
                        : modalField === 'password'
                          ? 'Change password'
                          : 'Edit birthday'}
                </h3>
                <p className="text-xs text-white/55 m-0 mt-1">
                  {modalField === 'displayName'
                    ? 'Your display name is how you appear to other people.'
                    : modalField === 'username'
                      ? 'Your username is your unique handle on Novelo.'
                      : modalField === 'email'
                        ? 'We will send a confirmation link to your new email.'
                        : modalField === 'password'
                          ? 'Choose a strong password of at least 8 characters.'
                          : 'Update your account birthday.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="size-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.06] bg-transparent border-none cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {modalField === 'username' && (
              <p className="text-xs text-white/55 m-0">
                Changing your username costs 500 Novelo on the free tier.
              </p>
            )}

            {modalError && (
              <p className="text-xs text-rose-300 m-0 leading-snug">{modalError}</p>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white/90">
                {modalField === 'displayName'
                  ? 'Display name'
                  : modalField === 'username'
                    ? 'New username'
                    : modalField === 'email'
                      ? 'New email'
                      : modalField === 'password'
                        ? 'New password'
                        : 'Birthday'}
              </label>
              <input
                type={
                  modalField === 'email'
                    ? 'email'
                    : modalField === 'password'
                      ? 'password'
                      : modalField === 'birthday'
                        ? 'date'
                        : 'text'
                }
                value={draftValue}
                maxLength={modalField === 'displayName' || modalField === 'username' ? 20 : undefined}
                max={modalField === 'birthday' ? new Date().toISOString().split('T')[0] : undefined}
                onChange={(e) => setDraftValue(e.target.value)}
                placeholder={
                  modalField === 'username'
                    ? 'Username'
                    : modalField === 'displayName'
                      ? 'Display name'
                      : modalField === 'email'
                        ? 'you@example.com'
                        : modalField === 'password'
                          ? 'Enter new password'
                          : undefined
                }
                className="w-full h-10 px-3 rounded-[7px] bg-[#101013] border border-white/[0.16] focus:border-white/40 text-xs text-white placeholder:text-white/35 focus:outline-none [color-scheme:dark]"
                autoFocus
              />
              {modalField === 'displayName' && (
                <span className="text-[11px] text-white/50">
                  Up to 20 characters. Leave blank to use your username.
                </span>
              )}
            </div>

            {modalField === 'username' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/90">Current password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full h-10 pl-3 pr-10 rounded-[7px] bg-[#101013] border border-white/[0.16] focus:border-white/40 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((v) => !v)}
                    className="size-8 rounded-lg flex items-center justify-center text-white/45 hover:text-white bg-transparent border-none cursor-pointer absolute right-1.5 top-1/2 -translate-y-1/2"
                  >
                    {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={closeModal}
                className="h-9 px-4 rounded-[9px] bg-white/[0.06] hover:bg-white/[0.11] text-white/85 text-xs font-semibold border border-white/[0.08] cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveModal}
                className="h-9 px-4 rounded-[9px] bg-white hover:bg-white/90 disabled:opacity-50 text-[#0c0d10] text-xs font-bold flex items-center gap-1.5 border-none cursor-pointer shadow-[0_6px_20px_rgba(255,255,255,0.14)] transition-colors"
              >
                {modalField === 'username' ? (
                  <>
                    <UserIcon className="size-3.5" />
                    <span>{saving ? 'Saving...' : 'Change for 500'}</span>
                    <img src="/novelo-currency.png" alt="Novelo" className="size-3.5 object-contain" />
                  </>
                ) : (
                  <>
                    <Check className="size-3.5" />
                    <span>{saving ? 'Saving...' : 'Save changes'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
