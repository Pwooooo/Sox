import { useState } from 'react'
import { MoreHorizontal, Pencil, ChevronLeft, ChevronRight } from 'lucide-react'

const WEARING_ITEMS = [
  { name: 'Dizzy', index: 0 },
  { name: 'Long Ponytail', index: 1 },
  { name: 'Pwo', index: 2 },
  { name: 'Pwo', index: 3 },
  { name: 'Classic Tee', index: 4 },
  { name: 'Black Jeans', index: 5 },
]

function grad(i: number) {
  const g = [
    'linear-gradient(135deg, #3a3a3a 0%, #222 100%)',
    'linear-gradient(135deg, #444 0%, #2a2a2a 100%)',
    'linear-gradient(135deg, #383838 0%, #1e1e1e 100%)',
    'linear-gradient(135deg, #404040 0%, #252525 100%)',
    'linear-gradient(135deg, #333 0%, #1a1a1a 100%)',
    'linear-gradient(135deg, #3c3c3c 0%, #202020 100%)',
  ]
  return g[i % g.length]
}

export function Profile() {
  const [wearingIndex, setWearingIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<'about' | 'portfolio'>('about')
  const visible = WEARING_ITEMS.slice(wearingIndex, wearingIndex + 4)

  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-3">
      {/* Header card */}
      <div className="bg-card rounded-3xl border border-border px-8 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div
              className="w-[120px] h-[120px] rounded-full shrink-0 border-2 border-border shadow-2xl"
              style={{ background: grad(4) }}
            />
            <div>
              <h1 className="text-[28px] font-bold text-foreground leading-tight">Sky</h1>
              <p className="text-muted-foreground text-[15px] mt-0.5">@sky</p>
              <div className="flex items-center gap-3 mt-2 text-[13px]">
                <span className="text-muted-foreground"><strong className="text-foreground font-semibold">0</strong> Friends</span>
                <span className="text-muted-foreground"><strong className="text-foreground font-semibold">0</strong> Followers</span>
                <span className="text-muted-foreground"><strong className="text-foreground font-semibold">0</strong> Following</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm font-medium hover:bg-secondary transition-colors cursor-pointer">
              <Pencil className="size-4" />
              Edit Profile
            </button>
            <button className="size-9 rounded-lg border border-border bg-card text-foreground flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer">
              <MoreHorizontal className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-xl border border-border overflow-hidden h-[32px] flex items-center p-[3px]">
        <button
          onClick={() => setActiveTab('about')}
          className={`h-full flex-1 text-[12px] font-medium cursor-pointer border-none capitalize rounded-lg transition-colors ${
            activeTab === 'about'
              ? 'bg-[#282828] text-foreground shadow-sm'
              : 'bg-transparent text-[#888] hover:text-foreground'
          }`}
        >
          About
        </button>
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`h-full flex-1 text-[12px] font-medium cursor-pointer border-none capitalize rounded-lg transition-colors ${
            activeTab === 'portfolio'
              ? 'bg-[#282828] text-foreground shadow-sm'
              : 'bg-transparent text-[#888] hover:text-foreground'
          }`}
        >
          Portfolio
        </button>
      </div>

      {activeTab === 'about' && (
        <>
          {/* About content */}
          <div className="bg-card rounded-3xl border border-border px-10 py-7">
            <h2 className="text-[17px] font-bold text-foreground mb-0.5 ml-[200px]">About</h2>
            <p className="text-muted-foreground text-[14px] italic mb-6 ml-[200px]">No bio yet.</p>

            <h3 className="text-[15px] font-bold text-foreground mb-4 ml-[200px]">Currently Wearing</h3>
            <div className="flex items-start gap-0">
              <div
                className="w-[180px] h-[240px] rounded-2xl shrink-0 border border-border"
                style={{ background: grad(4) }}
              />
              <div className="flex-1 min-w-0 px-4">
                <div className="grid grid-cols-4 gap-3">
                  {visible.map((item) => (
                    <div key={item.index} className="flex flex-col items-center gap-2">
                      <div className="w-full aspect-square rounded-xl bg-[#1e1e1e] p-2 border border-[#2a2a2a]">
                        <div className="w-full h-full rounded-lg" style={{ background: grad(item.index) }} />
                      </div>
                      <span className="text-[12px] text-muted-foreground text-center leading-tight">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              {WEARING_ITEMS.length > 4 && (
                <div className="flex items-center gap-0.5 shrink-0 pt-1 pr-1">
                  <button
                    onClick={() => setWearingIndex(Math.max(0, wearingIndex - 1))}
                    disabled={wearingIndex === 0}
                    className="size-7 rounded-md flex items-center justify-center disabled:opacity-25 hover:bg-secondary transition-colors cursor-pointer border-none bg-transparent"
                  >
                    <ChevronLeft className="size-5 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => setWearingIndex(Math.min(WEARING_ITEMS.length - 4, wearingIndex + 1))}
                    disabled={wearingIndex >= WEARING_ITEMS.length - 4}
                    className="size-7 rounded-md flex items-center justify-center disabled:opacity-25 hover:bg-secondary transition-colors cursor-pointer border-none bg-transparent"
                  >
                    <ChevronRight className="size-5 text-muted-foreground" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats bar */}
          <div className="bg-card rounded-3xl border border-border px-8 py-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[13px] font-bold text-foreground mb-0.5">Joined</p>
                <p className="text-[13px] text-muted-foreground">Jul 5, 2026</p>
              </div>
              <div>
                <p className="text-[13px] font-bold text-foreground mb-0.5">Net Worth</p>
                <p className="text-[13px] text-muted-foreground flex items-center justify-center gap-1">
                  <img src="/currency.png" alt="" className="size-3.5" />
                  0
                </p>
              </div>
              <div>
                <p className="text-[13px] font-bold text-foreground mb-0.5">Last Online</p>
                <p className="text-[13px] text-muted-foreground">Jul 17, 2026</p>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'portfolio' && (
        <div className="bg-card rounded-3xl border border-border p-8">
          <p className="text-muted-foreground text-[14px] italic">No portfolio items yet.</p>
        </div>
      )}
    </div>
  )
}
