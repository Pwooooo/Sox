import { Download as DownloadIcon } from 'lucide-react'

interface HeroApp {
  title: string
  description: string
  meta: string
  filename: string
  href: string
  glow: string
  silhouetteAlign: string
}

const HERO_APPS: HeroApp[] = [
  {
    title: 'Download Novelo Player',
    description:
      'Play 3D worlds and multiplayer experiences natively on Windows with low-latency rendering and instant game launching.',
    meta: 'Windows, 64-bit · NoveloPlayer.exe · 12.6 MB · v1.0.0',
    filename: 'NoveloPlayer.exe',
    href: '/downloads/NoveloPlayer.exe',
    glow: 'radial-gradient(ellipse 75% 95% at 76% 45%, rgba(148, 163, 184, 0.2) 0%, rgba(51, 65, 85, 0.14) 42%, transparent 78%)',
    silhouetteAlign: 'right-8 sm:right-20',
  },
  {
    title: 'Download Novelo Studio',
    description:
      'Build 3D worlds, sculpt terrain, script gameplay, and publish directly to Novelo from a dedicated desktop editor.',
    meta: 'Windows, 64-bit · NoveloStudio.exe · 12.6 MB · v1.0.0',
    filename: 'NoveloStudio.exe',
    href: '/downloads/NoveloStudio.exe',
    glow: 'radial-gradient(ellipse 75% 95% at 76% 45%, rgba(161, 161, 170, 0.18) 0%, rgba(63, 63, 70, 0.14) 42%, transparent 78%)',
    silhouetteAlign: 'right-12 sm:right-28',
  },
]

export function Download() {
  return (
    <div className="w-full -mt-14 pb-12">
      {HERO_APPS.map((app, idx) => (
        <section
          key={app.filename}
          className={`relative w-full overflow-hidden ${idx === 0 ? 'pt-14' : ''}`}
          style={{
            maskImage:
              idx === 0
                ? 'linear-gradient(to bottom, black 68%, transparent 100%)'
                : 'linear-gradient(to bottom, transparent 0%, black 18%, black 75%, transparent 100%)',
            WebkitMaskImage:
              idx === 0
                ? 'linear-gradient(to bottom, black 68%, transparent 100%)'
                : 'linear-gradient(to bottom, transparent 0%, black 18%, black 75%, transparent 100%)',
          }}
        >
          {/* Monochrome / frost radial atmosphere */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: app.glow }}
          />

          {/* Halftone dot-matrix texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)',
              backgroundSize: '6px 6px',
            }}
          />

          {/* Large blurred atmospheric silhouette on the right */}
          <img
            src="/christmas-entropy.png"
            alt=""
            aria-hidden="true"
            className={`pointer-events-none select-none absolute ${app.silhouetteAlign} top-1/2 -translate-y-1/2 w-60 sm:w-72 h-60 sm:h-72 object-contain opacity-20 blur-[2.5px] grayscale contrast-125`}
          />

          {/* Copy & Download CTA */}
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
            <div className="max-w-lg">
              <div className="flex items-center gap-3">
                <img
                  src="/christmas-entropy.png"
                  alt=""
                  aria-hidden="true"
                  className="size-10 object-contain shrink-0"
                />
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  {app.title}
                </h1>
              </div>

              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                {app.description}
              </p>

              <div className="mt-5">
                <a
                  href={app.href}
                  download={app.filename}
                  className="h-9 px-4 rounded-lg bg-white hover:bg-white/90 text-black text-xs font-semibold inline-flex items-center gap-2 transition-colors no-underline cursor-pointer shadow-sm"
                >
                  <DownloadIcon className="size-3.5" />
                  <span>Download for Windows</span>
                </a>
              </div>

              <p className="mt-2.5 text-[11px] text-white/50">{app.meta}</p>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
