export const WHOP_PACKAGE_URLS: Record<string, string | undefined> = {
  p1: (import.meta.env.VITE_WHOP_URL_P1 as string | undefined)?.trim() || undefined,
  p2: (import.meta.env.VITE_WHOP_URL_P2 as string | undefined)?.trim() || undefined,
  p3: (import.meta.env.VITE_WHOP_URL_P3 as string | undefined)?.trim() || undefined,
  p4: (import.meta.env.VITE_WHOP_URL_P4 as string | undefined)?.trim() || undefined,
  p5: (import.meta.env.VITE_WHOP_URL_P5 as string | undefined)?.trim() || undefined,
  p6: (import.meta.env.VITE_WHOP_URL_P6 as string | undefined)?.trim() || undefined,
  p7: (import.meta.env.VITE_WHOP_URL_P7 as string | undefined)?.trim() || undefined,
  p8:
    (import.meta.env.VITE_WHOP_URL_P8 as string | undefined)?.trim() ||
    'https://whop.com/novelo/500-novlux',
}

export async function openWhopCheckout(
  baseUrl: string,
  opts?: { email?: string; userId?: string; username?: string },
): Promise<void> {
  const url = new URL(baseUrl)
  if (opts?.email) url.searchParams.set('email', opts.email)
  if (opts?.userId) url.searchParams.set('novelo_uid', opts.userId)
  if (opts?.username) url.searchParams.set('novelo_user', opts.username)

  const targetUrl = url.toString()
  if (typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__) {
    try {
      const { invoke } = await import('@tauri-apps/api/core')
      await invoke('open_external_url', { url: targetUrl })
      return
    } catch {
      // Fall back to window.open below
    }
  }
  window.open(targetUrl, '_blank', 'noopener,noreferrer')
}
