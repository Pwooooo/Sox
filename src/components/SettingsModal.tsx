import { useState } from 'react'
import { X, Mail, CheckCircle2, AlertCircle, User as UserIcon, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/auth'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { user, profile, resendVerification, signOut } = useAuth()
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  if (!open) return null

  const isVerified = Boolean(user?.email_confirmed_at)
  const userEmail = user?.email || ''

  const handleVerifyEmail = async () => {
    if (!userEmail || sending) return
    setSending(true)
    setStatus(null)
    try {
      const res = await resendVerification(userEmail)
      if (res.error) {
        setStatus({ type: 'err', text: res.error })
      } else {
        setStatus({
          type: 'ok',
          text: `Verification link sent to ${userEmail}. Check your inbox and spam folder.`,
        })
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] rounded-2xl bg-[#111216] border border-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.8)] p-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold tracking-tight m-0">Account Settings</h2>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg flex items-center justify-center text-white/55 hover:text-white hover:bg-white/[0.06] bg-transparent border-none cursor-pointer transition-colors"
            title="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
            <div className="size-9 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/75 shrink-0">
              <UserIcon className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-white/50">Username</div>
              <div className="text-sm font-semibold truncate">
                {profile?.username || user?.user_metadata?.username || 'Guest'}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-9 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/75 shrink-0">
                  <Mail className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] text-white/50">Email</div>
                  <div className="text-sm font-medium truncate">
                    {userEmail || 'No email linked'}
                  </div>
                </div>
              </div>

              {userEmail && (
                <span
                  className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                    isVerified
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                  }`}
                >
                  {isVerified ? (
                    <>
                      <CheckCircle2 className="size-3" />
                      Verified
                    </>
                  ) : (
                    <>
                      <AlertCircle className="size-3" />
                      Unverified
                    </>
                  )}
                </span>
              )}
            </div>

            {userEmail && !isVerified && (
              <button
                type="button"
                disabled={sending}
                onClick={handleVerifyEmail}
                className="h-9 w-full rounded-lg bg-white text-[#0c0d10] hover:bg-white/90 disabled:opacity-50 text-xs font-bold border-none cursor-pointer transition-colors"
              >
                {sending ? 'Sending verification email...' : 'Verify email'}
              </button>
            )}

            {status && (
              <p
                className={`text-xs m-0 leading-snug ${
                  status.type === 'ok' ? 'text-emerald-300' : 'text-rose-300'
                }`}
              >
                {status.text}
              </p>
            )}
          </div>

          {user && (
            <button
              type="button"
              onClick={async () => {
                await signOut()
                onClose()
              }}
              className="mt-1 h-9 w-full rounded-lg bg-white/[0.06] hover:bg-rose-500/20 text-white/80 hover:text-rose-200 border border-white/[0.08] text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="size-3.5" />
              Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
