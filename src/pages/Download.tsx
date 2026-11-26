import { Download as DownloadIcon, Hammer } from 'lucide-react'

interface DownloadRow {
  title: string
  version: string
  subtitle: string
  filename: string
  href: string
  kind: 'player' | 'studio'
}

const DOWNLOAD_ROWS: DownloadRow[] = [
  {
    title: 'Novelo Player',
    version: 'v1.0.0',
    subtitle: 'Windows 64-bit · NoveloPlayer.exe · 12.6 MB',
    filename: 'NoveloPlayer.exe',
    href: '/downloads/NoveloPlayer.exe',
    kind: 'player',
  },
  {
    title: 'Novelo Studio',
    version: 'v1.0.0',
    subtitle: 'Windows 64-bit · NoveloStudio.exe · 12.6 MB',
    filename: 'NoveloStudio.exe',
    href: '/downloads/NoveloStudio.exe',
    kind: 'studio',
  },
]

export function Download() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 pt-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold tracking-tight text-white">Download</h1>
        <p className="text-xs text-white/45 mt-1">Desktop clients for Windows 64-bit</p>
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] divide-y divide-white/[0.06] overflow-hidden backdrop-blur-sm">
        {DOWNLOAD_ROWS.map((item) => (
          <div
            key={item.filename}
            className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-white/[0.025] transition-colors"
          >
            <div className="flex items-center gap-4 min-w-0">
              {/* Custom Novelo App Icon (no background) */}
              <div className="relative size-11 flex items-center justify-center shrink-0">
                <img
                  src="/christmas-entropy.png"
                  alt={item.title}
                  className="size-11 object-contain"
                />
                {item.kind === 'studio' && (
                  <span className="absolute -bottom-0.5 -right-0.5 size-4 rounded-md bg-white text-black flex items-center justify-center shadow-xs">
                    <Hammer className="size-2.5" />
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white leading-tight">
                    {item.title}
                  </span>
                  <span className="text-[11px] font-medium text-white/55 bg-white/[0.06] border border-white/[0.08] px-1.5 py-0.5 rounded-md leading-none">
                    {item.version}
                  </span>
                </div>
                <div className="text-xs text-white/45 mt-1 truncate">{item.subtitle}</div>
              </div>
            </div>

            <a
              href={item.href}
              download={item.filename}
              className="shrink-0 h-8 px-3.5 rounded-lg bg-white hover:bg-white/90 text-black text-xs font-semibold inline-flex items-center gap-1.5 transition-colors no-underline cursor-pointer shadow-xs"
            >
              <DownloadIcon className="size-3.5" />
              <span>Download for Windows</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
