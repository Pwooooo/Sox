import { Download as DownloadIcon, Gamepad2, Hammer } from 'lucide-react'

interface DownloadRow {
  title: string
  subtitle: string
  filename: string
  href: string
  icon: 'player' | 'studio'
}

const DOWNLOAD_ROWS: DownloadRow[] = [
  {
    title: 'Novelo Player',
    subtitle: 'Windows 64-bit · 12.6 MB',
    filename: 'NoveloPlayer.exe',
    href: '/downloads/NoveloPlayer.exe',
    icon: 'player',
  },
  {
    title: 'Novelo Studio',
    subtitle: 'Windows 64-bit · 12.6 MB',
    filename: 'NoveloStudio.exe',
    href: '/downloads/NoveloStudio.exe',
    icon: 'studio',
  },
]

export function Download() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold tracking-tight text-white mb-4">Download</h1>

      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] divide-y divide-white/[0.06] overflow-hidden">
        {DOWNLOAD_ROWS.map((item) => {
          const Icon = item.icon === 'player' ? Gamepad2 : Hammer
          return (
            <div
              key={item.filename}
              className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <Icon className="size-6 text-white shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white leading-tight">{item.title}</div>
                  <div className="text-xs text-white/45 mt-0.5 truncate">{item.subtitle}</div>
                </div>
              </div>

              <a
                href={item.href}
                download={item.filename}
                className="shrink-0 h-8 px-3.5 rounded-lg bg-white hover:bg-white/90 text-black text-xs font-semibold inline-flex items-center gap-1.5 transition-colors no-underline cursor-pointer"
              >
                <DownloadIcon className="size-3.5" />
                <span>Download for Windows</span>
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}
