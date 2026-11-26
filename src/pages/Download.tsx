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
    <div className="relative w-full">
      <style>{`
        @keyframes novelo-card-bokeh {
          0% { transform: translate3d(0, -16px, 0); }
          50% { transform: translate3d(12px, 160px, 0); }
          100% { transform: translate3d(-8px, 340px, 0); }
        }
        @keyframes novelo-clouds-1 {
          from { background-position: 0 0; }
          to { background-position: -1000px 0; }
        }
        @keyframes novelo-clouds-2 {
          from { background-position: 0 0; }
          to { background-position: -1200px 0; }
        }
        @keyframes novelo-clouds-3 {
          from { background-position: 0 0; }
          to { background-position: -1400px 0; }
        }
        .novelo-clouds {
          opacity: 0.5;
          pointer-events: none;
          position: fixed;
          overflow: hidden;
          top: 0;
          left: 0;
          right: 0;
          height: 420px;
          z-index: 0;
          mask-image: linear-gradient(to bottom, black 45%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 45%, transparent 100%);
        }
        .novelo-clouds-1,
        .novelo-clouds-2,
        .novelo-clouds-3 {
          background-repeat: repeat-x;
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          height: 420px;
        }
        .novelo-clouds-1 {
          background-size: 1000px 420px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1000' height='420' viewBox='0 0 1000 420'%3E%3Cdefs%3E%3Cfilter id='b1' x='-20%25' y='-20%25' width='140%25' height='140%25'%3E%3CfeGaussianBlur stdDeviation='24'/%3E%3C/filter%3E%3C/defs%3E%3Cg filter='url(%23b1)' fill='%23cbd5e1' fill-opacity='0.28'%3E%3Cellipse cx='140' cy='110' rx='180' ry='65'/%3E%3Cellipse cx='340' cy='150' rx='210' ry='75'/%3E%3Cellipse cx='620' cy='95' rx='220' ry='70'/%3E%3Cellipse cx='860' cy='140' rx='190' ry='68'/%3E%3C/g%3E%3C/svg%3E");
          animation: novelo-clouds-1 28s infinite linear;
        }
        .novelo-clouds-2 {
          background-size: 1200px 420px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='420' viewBox='0 0 1200 420'%3E%3Cdefs%3E%3Cfilter id='b2' x='-20%25' y='-20%25' width='140%25' height='140%25'%3E%3CfeGaussianBlur stdDeviation='18'/%3E%3C/filter%3E%3C/defs%3E%3Cg filter='url(%23b2)' fill='%23e2e8f0' fill-opacity='0.24'%3E%3Cellipse cx='200' cy='175' rx='190' ry='55'/%3E%3Cellipse cx='520' cy='125' rx='240' ry='65'/%3E%3Cellipse cx='840' cy='180' rx='210' ry='58'/%3E%3Cellipse cx='1090' cy='135' rx='160' ry='52'/%3E%3C/g%3E%3C/svg%3E");
          animation: novelo-clouds-2 20s infinite linear;
        }
        .novelo-clouds-3 {
          background-size: 1400px 420px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1400' height='420' viewBox='0 0 1400 420'%3E%3Cdefs%3E%3Cfilter id='b3' x='-20%25' y='-20%25' width='140%25' height='140%25'%3E%3CfeGaussianBlur stdDeviation='30'/%3E%3C/filter%3E%3C/defs%3E%3Cg filter='url(%23b3)' fill='%2394a3b8' fill-opacity='0.22'%3E%3Cellipse cx='180' cy='220' rx='260' ry='80'/%3E%3Cellipse cx='650' cy='190' rx='290' ry='85'/%3E%3Cellipse cx='1120' cy='230' rx='270' ry='78'/%3E%3C/g%3E%3C/svg%3E");
          animation: novelo-clouds-3 24s infinite linear;
        }
      `}</style>

      {/* Parallax drifting clouds header */}
      <div className="novelo-clouds" aria-hidden="true">
        <div className="novelo-clouds-1" />
        <div className="novelo-clouds-2" />
        <div className="novelo-clouds-3" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">

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
      <section className="flex flex-col md:flex-row items-center gap-8 pt-2">
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
