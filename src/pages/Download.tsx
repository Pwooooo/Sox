import { Download as DownloadIcon, Gamepad2, Hammer, ShieldCheck, Monitor } from 'lucide-react'

interface DownloadCardProps {
  title: string
  subtitle: string
  description: string
  filename: string
  href: string
  sizeLabel: string
  highlights: string[]
  icon: 'player' | 'studio'
  accentClass: string
  buttonClass: string
}

const DOWNLOAD_ITEMS: DownloadCardProps[] = [
  {
    title: 'Novelo Player',
    subtitle: 'Desktop Game Client',
    description:
      'Play 3D worlds and multiplayer experiences natively on Windows with full hardware acceleration and instant deep-link launching.',
    filename: 'NoveloPlayer.exe',
    href: '/downloads/NoveloPlayer.exe',
    sizeLabel: '12.6 MB · Windows x64',
    highlights: [
      'Native desktop window with low-latency 3D rendering',
      'Synced avatar, clothing, friends, and Novlux balance',
      'Supports direct game launch links from the web',
    ],
    icon: 'player',
    accentClass: 'from-blue-500/20 to-indigo-500/10 border-blue-400/25 text-blue-300',
    buttonClass: 'bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/20',
  },
  {
    title: 'Novelo Studio',
    subtitle: 'World & Game Creation IDE',
    description:
      'Build 3D worlds, sculpt environments, script gameplay, and publish directly to Novelo from a dedicated desktop editor.',
    filename: 'NoveloStudio.exe',
    href: '/downloads/NoveloStudio.exe',
    sizeLabel: '12.6 MB · Windows x64',
    highlights: [
      'Full 3D viewport with terrain, parts, lighting, and models',
      'Built-in explorer, properties inspector, and playtest mode',
      'One-click publishing to your Novelo creator profile',
    ],
    icon: 'studio',
    accentClass: 'from-emerald-500/20 to-teal-500/10 border-emerald-400/25 text-emerald-300',
    buttonClass: 'bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shadow-lg shadow-emerald-500/20',
  },
]

export function Download() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs font-medium text-white/75 mb-3">
          <Monitor className="size-3.5" />
          Windows Desktop Apps
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Download Novelo</h1>
        <p className="mt-2 text-sm text-white/60 max-w-2xl">
          Get the standalone desktop client to play worlds natively, or download Novelo Studio to create and publish your own 3D experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DOWNLOAD_ITEMS.map((item) => {
          const Icon = item.icon === 'player' ? Gamepad2 : Hammer
          return (
            <div
              key={item.filename}
              className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 flex flex-col justify-between backdrop-blur-md hover:border-white/[0.14] transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`size-12 rounded-xl bg-gradient-to-br border flex items-center justify-center shrink-0 ${item.accentClass}`}
                    >
                      <Icon className="size-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white leading-tight">{item.title}</h2>
                      <p className="text-xs font-medium text-white/50 mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-white/70 leading-relaxed mb-5">{item.description}</p>

                <ul className="space-y-2 mb-6">
                  {item.highlights.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-xs text-white/65">
                      <span className="mt-1.5 size-1.5 rounded-full bg-white/40 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex flex-col gap-3">
                <a
                  href={item.href}
                  download={item.filename}
                  className={`w-full h-11 rounded-xl px-4 flex items-center justify-center gap-2 text-sm font-medium transition-all no-underline cursor-pointer ${item.buttonClass}`}
                >
                  <DownloadIcon className="size-4" />
                  <span>Download {item.title}</span>
                </a>
                <div className="flex items-center justify-between text-[11px] text-white/45 px-1">
                  <span className="font-mono">{item.filename}</span>
                  <span>{item.sizeLabel}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 rounded-xl bg-white/[0.02] border border-white/[0.06] px-4 py-3 flex items-center gap-3 text-xs text-white/55">
        <ShieldCheck className="size-4 text-white/50 shrink-0" />
        <span>
          If Windows SmartScreen appears on first launch, click <strong className="text-white/80 font-medium">More info</strong> and select <strong className="text-white/80 font-medium">Run anyway</strong>.
        </span>
      </div>
    </div>
  )
}
