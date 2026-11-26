import { Download as DownloadIcon } from 'lucide-react'

interface DownloadApp {
  title: string
  version: string
  filename: string
  href: string
}

const DOWNLOAD_APPS: DownloadApp[] = [
  {
    title: 'Novelo Player',
    version: 'v1.0.0',
    filename: 'NoveloPlayer.exe',
    href: '/downloads/NoveloPlayer.exe',
  },
  {
    title: 'Novelo Studio',
    version: 'v1.0.0',
    filename: 'NoveloStudio.exe',
    href: '/downloads/NoveloStudio.exe',
  },
]

export function Download() {
  return (
    <div className="relative w-full min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="relative z-10 max-w-2xl w-full">
        <section id="all-platforms" className="w-full">
          <h2 className="text-lg font-bold tracking-tight text-white mb-3.5">All platforms</h2>

          <div className="rounded-xl border border-white/[0.12] bg-black/40 divide-y divide-white/[0.08] overflow-hidden backdrop-blur-md shadow-2xl">
            {DOWNLOAD_APPS.map((app) => (
              <div
                key={app.filename}
                className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-white/[0.04] transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white leading-tight">
                    {app.title}
                  </div>
                  <div className="text-xs text-white/55 mt-0.5 truncate">
                    64-bit installer · {app.version}
                  </div>
                </div>

                <a
                  href={app.href}
                  download={app.filename}
                  style={{
                    background: 'linear-gradient(180deg, #ffffff 0%, #e4effa 55%, #c9dff3 100%)',
                    boxShadow:
                      'inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 4px 16px rgba(186, 220, 255, 0.18)',
                  }}
                  className="shrink-0 h-8 px-3.5 rounded-lg border border-white/80 text-[#0f172a] hover:brightness-105 text-xs font-semibold inline-flex items-center gap-1.5 transition-all no-underline cursor-pointer"
                >
                  <DownloadIcon className="size-3.5" />
                  <span>Download for Windows</span>
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
