import { Download as DownloadIcon } from 'lucide-react'

interface HeroApp {
  title: string
  version: string
  description: string
  meta: string
  filename: string
  href: string
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
  },
  {
    title: 'Novelo Studio',
    version: 'v1.0.0',
    description:
      'Build 3D worlds, sculpt terrain, script gameplay, and publish directly to Novelo from a dedicated desktop editor.',
    meta: 'Windows 64-bit · NoveloStudio.exe · 12.6 MB',
    filename: 'NoveloStudio.exe',
    href: '/downloads/NoveloStudio.exe',
  },
]

const COZY_BOKEH = [
  { left: '12%', size: 8, duration: '14s', delay: '-3s', opacity: 0.24, warm: false },
  { left: '28%', size: 11, duration: '18s', delay: '-9s', opacity: 0.18, warm: true },
  { left: '46%', size: 6, duration: '12s', delay: '-5s', opacity: 0.26, warm: false },
  { left: '64%', size: 12, duration: '19s', delay: '-11s', opacity: 0.16, warm: true },
  { left: '79%', size: 8, duration: '15s', delay: '-7s', opacity: 0.22, warm: false },
  { left: '91%', size: 10, duration: '17s', delay: '-13s', opacity: 0.2, warm: true },
]

const SHOW_FROST_CARDS = false

export function Download() {
  return (
    <div className="relative w-full py-12">
      <style>{`
        @keyframes novelo-card-bokeh {
          0% { transform: translate3d(0, -16px, 0); }
          50% { transform: translate3d(12px, 160px, 0); }
          100% { transform: translate3d(-8px, 340px, 0); }
        }
      `}</style>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">

      {SHOW_FROST_CARDS && HERO_APPS.map((app) => (
        <section
          key={app.filename}
          className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-[#070b14] shadow-2xl"
        >
          {/* Card Video Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <video
              src="/wintry-trail.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover blur-[1.5px] scale-[1.03] saturate-[1.15] brightness-95"
            />

            {/* Cool icy-blue frost horizon glow */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 70% 75% at 72% 55%, rgba(125, 195, 255, 0.2) 0%, rgba(56, 130, 210, 0.1) 48%, transparent 80%)',
              }}
            />

            {/* Deep midnight-blue frost vignette */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, rgba(6,11,20,0.85) 0%, rgba(8,15,28,0.58) 55%, rgba(6,12,24,0.34) 100%)',
              }}
            />

            {/* Slow drifting bokeh snow inside card */}
            {COZY_BOKEH.map((orb, i) => (
              <span
                key={i}
                className="absolute top-0 rounded-full blur-[2.5px]"
                style={{
                  left: orb.left,
                  width: `${orb.size}px`,
                  height: `${orb.size}px`,
                  opacity: orb.opacity,
                  backgroundColor: orb.warm ? '#bae6fd' : '#f8fafc',
                  animation: `novelo-card-bokeh ${orb.duration} linear ${orb.delay} infinite`,
                }}
              />
            ))}
          </div>

          {/* Card Content */}
          <div className="relative z-10 px-6 sm:px-10 py-10 sm:py-12 max-w-xl">
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

            <p className="mt-3 text-sm text-white/75 leading-relaxed">
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

            <p className="mt-2.5 text-[11px] text-white/50">{app.meta}</p>
          </div>
        </section>
      ))}

      {/* Side character/icon + basic styled platform list */}
      <section id="all-platforms" className="flex flex-col md:flex-row items-center gap-8 pt-2">
        <div className="shrink-0 flex items-center justify-center">
          <img
            src="/windows-logo.png"
            alt="Novelo"
            className="w-48 sm:w-56 h-auto object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.6)]"
          />
        </div>

        <div className="flex-1 w-full">
          <h2 className="text-lg font-bold tracking-tight text-white mb-3.5">All platforms</h2>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] divide-y divide-white/[0.06] overflow-hidden backdrop-blur-sm">
            {HERO_APPS.map((app) => (
              <div
                key={`row-${app.filename}`}
                className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-white/[0.025] transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white leading-tight">
                    {app.title}
                  </div>
                  <div className="text-xs text-white/45 mt-0.5 truncate">
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
        </div>
      </section>
      </div>
    </div>
  )
}
