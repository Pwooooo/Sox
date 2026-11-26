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

const SNOWFLAKES = [
  { left: '6%', size: 3, duration: '9s', delay: '-2s', opacity: 0.45 },
  { left: '14%', size: 2, duration: '12s', delay: '-7s', opacity: 0.3 },
  { left: '23%', size: 4, duration: '10s', delay: '-4s', opacity: 0.5 },
  { left: '34%', size: 2.5, duration: '13s', delay: '-9s', opacity: 0.35 },
  { left: '43%', size: 3, duration: '8.5s', delay: '-1s', opacity: 0.45 },
  { left: '54%', size: 2, duration: '11.5s', delay: '-5s', opacity: 0.3 },
  { left: '63%', size: 3.5, duration: '9.5s', delay: '-3s', opacity: 0.55 },
  { left: '72%', size: 2.5, duration: '12.5s', delay: '-8s', opacity: 0.35 },
  { left: '81%', size: 4, duration: '10.5s', delay: '-6s', opacity: 0.5 },
  { left: '90%', size: 2, duration: '11s', delay: '-2.5s', opacity: 0.4 },
  { left: '95%', size: 3, duration: '9.2s', delay: '-4.5s', opacity: 0.45 },
]

export function Download() {
  const scrollToAllApps = () => {
    document.getElementById('all-apps')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 pt-4">
      <style>{`
        @keyframes novelo-snowfall {
          0% { transform: translate3d(0, -12px, 0); }
          50% { transform: translate3d(8px, 140px, 0); }
          100% { transform: translate3d(-4px, 300px, 0); }
        }
      `}</style>
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

        {/* Subtle seasonal snowfall */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {SNOWFLAKES.map((flake, idx) => (
            <span
              key={idx}
              className="absolute top-0 rounded-full bg-white blur-[0.4px]"
              style={{
                left: flake.left,
                width: `${flake.size}px`,
                height: `${flake.size}px`,
                opacity: flake.opacity,
                animation: `novelo-snowfall ${flake.duration} linear ${flake.delay} infinite`,
              }}
            />
          ))}
        </div>

        {/* Blurred atmospheric emblem silhouette on the right */}
        <img
          src="/christmas-entropy.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute right-6 sm:right-14 top-1/2 -translate-y-1/2 w-52 sm:w-64 h-52 sm:h-64 object-contain opacity-25 blur-[1.5px] brightness-90 contrast-110"
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
      </section>
    </div>
  )
}
