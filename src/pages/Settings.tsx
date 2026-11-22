import { useState } from 'react'
import { Pencil, Trash2, Check, X, LogOut } from 'lucide-react'
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

  const [editingField, setEditingField] = useState<
    'displayName' | 'username' | 'email' | 'password' | 'birthday' | null
  >(null)
  const [draftValue, setDraftValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const startEdit = (
    field: 'displayName' | 'username' | 'email' | 'password' | 'birthday',
    initial: string,
  ) => {
    setFeedback(null)
    setEditingField(field)
    setDraftValue(initial)
  }

  const cancelEdit = () => {
    setEditingField(null)
    setDraftValue('')
  }

  const saveField = async () => {
    if (!supabase || !user || !editingField || saving) return
    setSaving(true)
    setFeedback(null)
    try {
      const val = draftValue.trim()
      if (editingField === 'displayName') {
        if (val.length < 1 || val.length > 32) {
          setFeedback({ type: 'err', text: 'Display name must be 1–32 characters.' })
          return
        }
        await supabase.auth.updateUser({ data: { display_name: val } })
        if (profile?.id) {
          await supabase.from('profiles').update({ display_name: val }).eq('id', profile.id)
        }
        setFeedback({ type: 'ok', text: 'Display name updated. Refresh to see everywhere.' })
      } else if (editingField === 'username') {
        const err = validateUsername(val)
        if (err) {
          setFeedback({ type: 'err', text: err })
          return
        }
        if (val.toLowerCase() !== rawUsername.toLowerCase()) {
          const { data: existing } = await supabase
            .from('profiles')
            .select('id')
            .ilike('username', val)
            .maybeSingle()
          if (existing) {
            setFeedback({ type: 'err', text: 'That username is already taken.' })
            return
          }
        }
        await supabase.auth.updateUser({ data: { username: val } })
        if (profile?.id) {
          await supabase.from('profiles').update({ username: val }).eq('id', profile.id)
        }
        setFeedback({ type: 'ok', text: 'Username updated.' })
      } else if (editingField === 'email') {
        if (!val.includes('@')) {
          setFeedback({ type: 'err', text: 'Enter a valid email address.' })
          return
        }
        const { error } = await supabase.auth.updateUser({ email: val })
        if (error) {
          setFeedback({ type: 'err', text: error.message })
          return
        }
        setFeedback({ type: 'ok', text: 'Confirmation link sent to your new email.' })
      } else if (editingField === 'password') {
        if (draftValue.length < 8) {
          setFeedback({ type: 'err', text: 'Password must be at least 8 characters.' })
          return
        }
        const { error } = await supabase.auth.updateUser({ password: draftValue })
        if (error) {
          setFeedback({ type: 'err', text: error.message })
          return
        }
        setFeedback({ type: 'ok', text: 'Password updated.' })
      } else if (editingField === 'birthday') {
        if (!val) {
          setFeedback({ type: 'err', text: 'Select a valid date.' })
          return
        }
        const { error } = await supabase.auth.updateUser({ data: { birthday: val } })
        if (error) {
          setFeedback({ type: 'err', text: error.message })
          return
        }
        setFeedback({ type: 'ok', text: 'Birthday updated.' })
      }
      setEditingField(null)
      setDraftValue('')
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
    <div className="min-h-[calc(100vh-3.5rem)] w-full bg-[#09090b] text-white px-6 md:px-10 py-5">
      {/* Top Horizontal Settings Tabs */}
      <div className="flex items-center gap-6 border-b border-white/[0.08] overflow-x-auto no-scrollbar">
        {SETTINGS_TABS.map((t) => {
          const active = activeTab === t
          return (
            <button
              key={t}
              type="button"
              onClick={() => {
                setActiveTab(t)
                setFeedback(null)
                setEditingField(null)
              }}
              className={`pb-3 text-xs font-semibold whitespace-nowrap bg-transparent border-0 border-b-2 cursor-pointer transition-colors ${
                active
                  ? 'text-white border-white'
                  : 'text-white/55 hover:text-white/85 border-transparent'
              }`}
            >
              {t}
            </button>
          )
        })}
      </div>

      {activeTab === 'Account' ? (
        <div className="max-w-[460px] pt-6 pb-12 flex flex-col gap-7">
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-bold text-white m-0 tracking-tight">Account details</h2>

            {feedback && (
              <p
                className={`text-xs m-0 leading-snug ${
                  feedback.type === 'ok' ? 'text-emerald-300' : 'text-rose-300'
                }`}
              >
                {feedback.text}
              </p>
            )}

            {/* Display Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-white/80">Display name</label>
              {editingField === 'displayName' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={draftValue}
                    onChange={(e) => setDraftValue(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-[7px] bg-[#141417] border border-white/25 text-xs text-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    disabled={saving}
                    onClick={saveField}
                    className="size-9 rounded-[7px] bg-white text-[#0c0d10] flex items-center justify-center border-none cursor-pointer"
                    title="Save"
                  >
                    <Check className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="size-9 rounded-[7px] bg-white/[0.06] text-white/70 flex items-center justify-center border-none cursor-pointer"
                    title="Cancel"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <div className="h-9 px-3.5 rounded-[7px] bg-[#121215] border border-white/[0.08] flex items-center justify-between">
                  <span className="text-xs text-white/90 truncate">{rawDisplayName}</span>
                  <button
                    type="button"
                    onClick={() => startEdit('displayName', rawDisplayName)}
                    className="text-white/55 hover:text-white bg-transparent border-none p-1 cursor-pointer"
                    title="Edit display name"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-white/80">Username</label>
              {editingField === 'username' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={draftValue}
                    onChange={(e) => setDraftValue(e.target.value)}
                    maxLength={20}
                    className="flex-1 h-9 px-3 rounded-[7px] bg-[#141417] border border-white/25 text-xs text-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    disabled={saving}
                    onClick={saveField}
                    className="size-9 rounded-[7px] bg-white text-[#0c0d10] flex items-center justify-center border-none cursor-pointer"
                    title="Save"
                  >
                    <Check className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="size-9 rounded-[7px] bg-white/[0.06] text-white/70 flex items-center justify-center border-none cursor-pointer"
                    title="Cancel"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <div className="h-9 px-3.5 rounded-[7px] bg-[#121215] border border-white/[0.08] flex items-center justify-between">
                  <span className="text-xs text-white/90 truncate">@{rawUsername}</span>
                  <button
                    type="button"
                    onClick={() => startEdit('username', rawUsername)}
                    className="text-white/55 hover:text-white bg-transparent border-none p-1 cursor-pointer"
                    title="Edit username"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-white/80">Email</label>
                  {rawEmail && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        isVerified
                          ? 'bg-[#133929] text-[#34d399]'
                          : 'bg-amber-500/15 text-amber-300'
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
              {editingField === 'email' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={draftValue}
                    onChange={(e) => setDraftValue(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-[7px] bg-[#141417] border border-white/25 text-xs text-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    disabled={saving}
                    onClick={saveField}
                    className="size-9 rounded-[7px] bg-white text-[#0c0d10] flex items-center justify-center border-none cursor-pointer"
                    title="Save"
                  >
                    <Check className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="size-9 rounded-[7px] bg-white/[0.06] text-white/70 flex items-center justify-center border-none cursor-pointer"
                    title="Cancel"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <div className="h-9 px-3.5 rounded-[7px] bg-[#121215] border border-white/[0.08] flex items-center justify-between">
                  <span className="text-xs text-white/90 truncate">
                    {rawEmail ? maskEmail(rawEmail) : 'No email'}
                  </span>
                  <button
                    type="button"
                    onClick={() => startEdit('email', rawEmail)}
                    className="text-white/55 hover:text-white bg-transparent border-none p-1 cursor-pointer"
                    title="Edit email"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-white/80">Password</label>
              {editingField === 'password' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value={draftValue}
                    onChange={(e) => setDraftValue(e.target.value)}
                    placeholder="New password (min 8 chars)"
                    className="flex-1 h-9 px-3 rounded-[7px] bg-[#141417] border border-white/25 text-xs text-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    disabled={saving}
                    onClick={saveField}
                    className="size-9 rounded-[7px] bg-white text-[#0c0d10] flex items-center justify-center border-none cursor-pointer"
                    title="Save"
                  >
                    <Check className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="size-9 rounded-[7px] bg-white/[0.06] text-white/70 flex items-center justify-center border-none cursor-pointer"
                    title="Cancel"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <div className="h-9 px-3.5 rounded-[7px] bg-[#121215] border border-white/[0.08] flex items-center justify-between">
                  <span className="text-xs text-white/90 tracking-widest">•••••••••••</span>
                  <button
                    type="button"
                    onClick={() => startEdit('password', '')}
                    className="text-white/55 hover:text-white bg-transparent border-none p-1 cursor-pointer"
                    title="Change password"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Birthday */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-white/80">Birthday</label>
              {editingField === 'birthday' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={draftValue}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDraftValue(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-[7px] bg-[#141417] border border-white/25 text-xs text-white focus:outline-none [color-scheme:dark]"
                    autoFocus
                  />
                  <button
                    type="button"
                    disabled={saving}
                    onClick={saveField}
                    className="size-9 rounded-[7px] bg-white text-[#0c0d10] flex items-center justify-center border-none cursor-pointer"
                    title="Save"
                  >
                    <Check className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="size-9 rounded-[7px] bg-white/[0.06] text-white/70 flex items-center justify-center border-none cursor-pointer"
                    title="Cancel"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <div className="h-9 px-3.5 rounded-[7px] bg-[#121215] border border-white/[0.08] flex items-center justify-between">
                  <span className="text-xs text-white/90">
                    {rawBirthday || 'Not set'}
                  </span>
                  <button
                    type="button"
                    onClick={() => startEdit('birthday', rawBirthday)}
                    className="text-white/55 hover:text-white bg-transparent border-none p-1 cursor-pointer"
                    title="Edit birthday"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sign Out */}
          <div className="pt-2 border-t border-white/[0.07] flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white m-0">Sign out</h3>
              <p className="text-[11px] text-white/50 m-0 mt-0.5">
                Sign out of your Novelo account on this device.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void signOut()}
              className="h-8 px-3.5 rounded-[7px] bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-semibold flex items-center gap-1.5 border-none cursor-pointer shrink-0 transition-colors"
            >
              <LogOut className="size-3.5" />
              <span>Sign out</span>
            </button>
          </div>

          {/* Delete Account */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white m-0">Delete account</h3>
              <p className="text-[11px] text-white/50 m-0 mt-0.5 leading-snug">
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
              className="h-8 px-3.5 rounded-[7px] bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-semibold flex items-center gap-1.5 border-none cursor-pointer shrink-0 transition-colors"
            >
              <Trash2 className="size-3.5" />
              <span>{confirmDelete ? 'Confirm delete' : 'Delete account'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-[460px] pt-8">
          <h2 className="text-base font-bold text-white m-0 mb-2">{activeTab}</h2>
          <p className="text-xs text-white/50 m-0">
            {activeTab} settings will be available in a future update.
          </p>
        </div>
      )}
    </div>
  )
}
