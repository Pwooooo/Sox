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

          {/* Copy & Download CTA */}
          <div
            className={`relative z-10 max-w-5xl mx-auto px-4 sm:px-6 ${
              idx === 0 ? 'py-14 sm:py-18' : 'py-12 sm:py-16'
            }`}
          >
            <div className="max-w-lg">
              <div className="flex items-center gap-0">
                <img
                  src="/christmas-entropy.png"
                  alt={app.title}
                  className="size-16 -ml-2 -mr-2 object-contain shrink-0"
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
                  style={{
                    background: 'linear-gradient(180deg, #ffffff 0%, #e4effa 55%, #c9dff3 100%)',
                    boxShadow:
                      'inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 4px 16px rgba(186, 220, 255, 0.22)',
                  }}
                  className="h-9 px-4 rounded-lg border border-white/80 text-[#0f172a] hover:brightness-105 text-xs font-semibold inline-flex items-center gap-2 transition-all hover:-translate-y-px no-underline cursor-pointer"
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
