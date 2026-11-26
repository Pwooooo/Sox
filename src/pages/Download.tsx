import { Download as DownloadIcon } from 'lucide-react'

interface DownloadRow {
  title: string
  version: string
  subtitle: string
  filename: string
  href: string
}

const DOWNLOAD_ROWS: DownloadRow[] = [
  {
    title: 'Novelo Player',
    version: 'v1.0.0',
    subtitle: 'Windows 64-bit · NoveloPlayer.exe · 12.6 MB',
    filename: 'NoveloPlayer.exe',
    href: '/downloads/NoveloPlayer.exe',
  },
  {
    title: 'Novelo Studio',
    version: 'v1.0.0',
    subtitle: 'Windows 64-bit · NoveloStudio.exe · 12.6 MB',
    filename: 'NoveloStudio.exe',
    href: '/downloads/NoveloStudio.exe',
  },
]

export function Download() {
  const scrollToAllApps = () => {
    document.getElementById('all-apps')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="w-full pb-16">
      {/* Full-bleed seamless monochrome/frost hero (no box, no border) */}
      <section className="relative w-full overflow-hidden -mt-14 pt-14">
        {/* Cool obsidian / icy-slate radial atmosphere */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 75% 95% at 74% 38%, rgba(148, 163, 184, 0.18) 0%, rgba(51, 65, 85, 0.14) 40%, rgba(10, 10, 10, 0) 78%)',
          }}
        />

        {/* Subtle halftone dot-matrix texture fading out at bottom */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)',
            backgroundSize: '6px 6px',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 35%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 35%, transparent 100%)',
          }}
        />

        {/* Large blurred atmospheric silhouette on the right */}
        <img
          src="/christmas-entropy.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute right-6 sm:right-20 top-1/2 -translate-y-1/2 w-64 sm:w-80 h-64 sm:h-80 object-contain opacity-20 blur-[3px] grayscale contrast-125"
        />

        {/* Seamless bottom dissolve into page background */}
        <div
          className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent, #0a0a0a)',
          }}
        />

        {/* Hero Copy & Primary CTA */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-lg">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Download Novelo
            </h1>
            <p className="mt-2.5 text-sm text-white/70 leading-relaxed">
              Get Novelo Player to play games and Novelo Studio to create 3D worlds.
            </p>

            <div className="mt-5">
              <a
                href="/downloads/NoveloPlayer.exe"
                download="NoveloPlayer.exe"
                className="h-9 px-4 rounded-lg bg-white hover:bg-white/90 text-black text-xs font-semibold inline-flex items-center gap-2 transition-colors no-underline cursor-pointer shadow-sm"
              >
                <DownloadIcon className="size-3.5" />
                <span>Download for Windows</span>
              </a>
            </div>

            <p className="mt-2.5 text-[11px] text-white/50">
              Windows, 64-bit · v1.0.0.{' '}
              <button
                type="button"
                onClick={scrollToAllApps}
                className="underline underline-offset-2 text-white/70 hover:text-white bg-transparent border-none p-0 cursor-pointer text-[11px]"
              >
                All apps
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* All Apps List */}
      <section id="all-apps" className="max-w-5xl mx-auto px-4 sm:px-6 pt-2">
        <h2 className="text-lg font-bold tracking-tight text-white mb-3.5">All apps</h2>

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] divide-y divide-white/[0.06] overflow-hidden backdrop-blur-sm">
          {DOWNLOAD_ROWS.map((item) => (
            <div
              key={item.filename}
              className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-white/[0.025] transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="size-11 flex items-center justify-center shrink-0">
                  <img
                    src="/christmas-entropy.png"
                    alt={item.title}
                    className="size-11 object-contain"
                  />
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
