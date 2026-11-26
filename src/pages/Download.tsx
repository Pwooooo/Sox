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
  { left: '12%', size: 8, duration: '18s', delay: '-3s', opacity: 0.22, warm: false },
  { left: '26%', size: 12, duration: '24s', delay: '-11s', opacity: 0.16, warm: true },
  { left: '41%', size: 6, duration: '16s', delay: '-6s', opacity: 0.25, warm: false },
  { left: '58%', size: 14, duration: '26s', delay: '-14s', opacity: 0.14, warm: true },
  { left: '71%', size: 9, duration: '20s', delay: '-8s', opacity: 0.2, warm: false },
  { left: '84%', size: 11, duration: '22s', delay: '-16s', opacity: 0.18, warm: true },
  { left: '93%', size: 7, duration: '17s', delay: '-2s', opacity: 0.22, warm: false },
]

export function Download() {
  return (
    <div className="relative w-full -mt-14 pb-12">
      <style>{`
        @keyframes novelo-cozy-bokeh {
          0% { transform: translate3d(0, -4vh, 0); }
          50% { transform: translate3d(16px, 52vh, 0); }
          100% { transform: translate3d(-10px, 108vh, 0); }
        }
      `}</style>

      {/* Fullscreen Cozy Wintry Trail Video Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <video
          src="/wintry-trail.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover blur-[1.5px] scale-[1.02] saturate-[1.15] sepia-[0.08] brightness-95"
        />

        {/* Warm hearth / golden-hour horizon glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 65% 60% at 64% 62%, rgba(255, 178, 107, 0.16) 0%, rgba(194, 118, 72, 0.08) 45%, transparent 78%)',
          }}
        />

        {/* Soft warm-dark reading vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(12,10,10,0.8) 0%, rgba(14,11,11,0.52) 55%, rgba(12,10,10,0.34) 100%)',
          }}
        />

        {/* Slow drifting foreground bokeh snow */}
        {COZY_BOKEH.map((orb, i) => (
          <span
            key={i}
            className="absolute top-0 rounded-full blur-[2.5px]"
            style={{
              left: orb.left,
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              opacity: orb.opacity,
              backgroundColor: orb.warm ? '#ffe4c4' : '#f8fafc',
              animation: `novelo-cozy-bokeh ${orb.duration} linear ${orb.delay} infinite`,
            }}
          />
        ))}
      </div>

      {HERO_APPS.map((app, idx) => (
        <section
          key={app.filename}
          className={`relative z-10 w-full ${idx === 0 ? 'pt-14' : ''}`}
        >
          {/* Copy & Download CTA */}
          <div
            className={`max-w-5xl mx-auto px-4 sm:px-6 ${
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
          </div>
        </section>
      ))}
    </div>
  )
}
