import { Download as DownloadIcon } from 'lucide-react'

interface HeroApp {
  title: string
  version: string
  description: string
  meta: string
  filename: string
  href: string
  glow: string
}

const HERO_APPS: HeroApp[] = [
  {
    title: 'Novelo Player',
    version: 'v1.0.0',
    description:
      'Play 3D worlds and multiplayer experiences natively on Windows with low-latency rendering and instant game launching.',
    meta: 'Windows 64-bit · NoveloPlayer.exe · 12.6 MB',
    filename: 'NoveloPlayer.exe',
    href: '/downloads/NoveloPlayer.exe',
    glow: 'radial-gradient(ellipse 70% 90% at 72% 45%, rgba(148, 163, 184, 0.16) 0%, rgba(51, 65, 85, 0.1) 45%, transparent 78%)',
  },
  {
    title: 'Novelo Studio',
    version: 'v1.0.0',
    description:
      'Build 3D worlds, sculpt terrain, script gameplay, and publish directly to Novelo from a dedicated desktop editor.',
    meta: 'Windows 64-bit · NoveloStudio.exe · 12.6 MB',
    filename: 'NoveloStudio.exe',
    href: '/downloads/NoveloStudio.exe',
    glow: 'radial-gradient(ellipse 70% 90% at 72% 45%, rgba(161, 161, 170, 0.14) 0%, rgba(63, 63, 70, 0.09) 45%, transparent 78%)',
  },
]

export function Download() {
  return (
    <div className="relative w-full -mt-14 pb-12">
      {/* Fullscreen Wintry Trail Video Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <video
          src="/wintry-trail.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(10,10,12,0.78) 0%, rgba(10,10,12,0.52) 55%, rgba(10,10,12,0.38) 100%)',
          }}
        />
      </div>

      {HERO_APPS.map((app, idx) => (
        <section
          key={app.filename}
          className={`relative w-full overflow-hidden ${idx === 0 ? 'pt-14' : ''}`}
          style={{
            maskImage:
              idx === 0
                ? 'linear-gradient(to bottom, black 72%, transparent 100%)'
                : 'linear-gradient(to bottom, transparent 0%, black 16%, black 78%, transparent 100%)',
            WebkitMaskImage:
              idx === 0
                ? 'linear-gradient(to bottom, black 72%, transparent 100%)'
                : 'linear-gradient(to bottom, transparent 0%, black 16%, black 78%, transparent 100%)',
          }}
        >
          {/* Monochrome / frost radial atmosphere */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: app.glow }}
          />

          {/* Subtle halftone dot-matrix texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)',
              backgroundSize: '6px 6px',
            }}
          />

          {/* Blurred atmospheric silhouette on the first hero section */}
          {idx === 0 && (
            <img
              src="/christmas-entropy.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute right-8 sm:right-20 top-1/2 -translate-y-1/2 w-60 sm:w-72 h-60 sm:h-72 object-contain opacity-20 blur-[2.5px] grayscale contrast-125"
            />
          )}

          {/* Copy & Download CTA */}
          <div
            className={`relative z-10 max-w-5xl mx-auto px-4 sm:px-6 ${
              idx === 0 ? 'py-14 sm:py-18' : 'py-12 sm:py-16'
            }`}
          >
            <div className="max-w-lg">
              <div className="flex items-center gap-3.5">
                <img
                  src="/christmas-entropy.png"
                  alt={app.title}
                  className="size-11 object-contain shrink-0"
                />
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                    {app.title}
                  </h1>
                  <span className="text-xs font-medium text-white/60 bg-white/[0.06] border border-white/[0.1] px-2 py-0.5 rounded-md">
                    {app.version}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                {app.description}
              </p>

              <div className="mt-5">
                <a
                  href={app.href}
                  download={app.filename}
                  className="h-9 px-4 rounded-lg bg-white hover:bg-white/90 text-black text-xs font-semibold inline-flex items-center gap-2 transition-all hover:-translate-y-px no-underline cursor-pointer shadow-sm"
                >
                  <DownloadIcon className="size-3.5" />
                  <span>Download for Windows</span>
                </a>
              </div>

              <p className="mt-2.5 text-[11px] text-white/45">{app.meta}</p>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
