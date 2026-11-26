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
  const scrollToAllApps = () => {
    document.getElementById('all-apps')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 pt-4">
      {/* Atmospheric Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0c0c0e] mb-8">
        {/* Deep atmospheric gradient + subtle halftone texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 90% at 75% 35%, rgba(165, 22, 46, 0.38) 0%, rgba(72, 12, 24, 0.28) 42%, rgba(9, 9, 11, 0.96) 100%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)',
            backgroundSize: '6px 6px',
          }}
        />

        {/* Blurred atmospheric emblem silhouette on the right */}
        <img
          src="/novelo-icon.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute right-6 sm:right-14 top-1/2 -translate-y-1/2 w-52 sm:w-64 h-52 sm:h-64 object-contain opacity-20 blur-[2px] brightness-75 contrast-125"
        />

        {/* Bottom fade into page background */}
        <div
          className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(9, 9, 11, 0.92))',
          }}
        />

        {/* Hero Copy & Primary CTA */}
        <div className="relative z-10 px-6 sm:px-10 py-12 sm:py-16 max-w-xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Download Novelo
          </h1>
          <p className="mt-2.5 text-sm text-white/75 leading-relaxed">
            Get Novelo Player to play games and Novelo Studio to create 3D worlds.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href="/downloads/NoveloPlayer.exe"
              download="NoveloPlayer.exe"
              className="h-9 px-4 rounded-lg bg-white hover:bg-white/90 text-black text-xs font-semibold inline-flex items-center gap-2 transition-colors no-underline cursor-pointer shadow-sm"
            >
              <DownloadIcon className="size-3.5" />
              <span>Download for Windows</span>
            </a>
          </div>

          <p className="mt-2.5 text-[11px] text-white/55">
            Windows, 64-bit · v1.0.0.{' '}
            <button
              type="button"
              onClick={scrollToAllApps}
              className="underline underline-offset-2 text-white/75 hover:text-white bg-transparent border-none p-0 cursor-pointer text-[11px]"
            >
              All apps
            </button>
          </p>
        </div>
      </section>

      {/* All Apps List */}
      <section id="all-apps">
        <h2 className="text-lg font-bold tracking-tight text-white mb-3.5">All apps</h2>

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] divide-y divide-white/[0.06] overflow-hidden backdrop-blur-sm">
          {DOWNLOAD_ROWS.map((item) => (
            <div
              key={item.filename}
              className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-white/[0.025] transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Custom Novelo App Icon */}
                <div className="relative size-10 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0">
                  <img
                    src="/novelo-icon.png"
                    alt={item.title}
                    className="size-6 object-contain"
                  />
                  {item.kind === 'studio' && (
                    <span className="absolute -bottom-1 -right-1 size-4 rounded-md bg-white text-black flex items-center justify-center shadow-xs">
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
      </section>
    </div>
  )
}
