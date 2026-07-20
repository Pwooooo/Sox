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
  const visible = WEARING_ITEMS.slice(wearingIndex, wearingIndex + 4)

  return (
    <div className="max-w-[820px] mx-auto p-4 md:py-6 flex flex-col gap-3">
      {/* Header card */}
      <div className="bg-card rounded-2xl border border-border p-6 pt-8 pb-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div
              className="w-[110px] h-[110px] rounded-xl shrink-0 -mt-12 border-2 border-border shadow-xl"
              style={{ background: grad(4) }}
            />
            <div>
              <h1 className="text-[28px] font-bold text-foreground leading-tight">Sky</h1>
              <p className="text-muted-foreground text-[15px] mt-0.5">@sky</p>
              <div className="flex items-center gap-3 mt-2.5 text-[13px]">
                <span className="text-muted-foreground"><strong className="text-foreground font-semibold">0</strong> Friends</span>
                <span className="text-muted-foreground"><strong className="text-foreground font-semibold">0</strong> Followers</span>
                <span className="text-muted-foreground"><strong className="text-foreground font-semibold">0</strong> Following</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
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

      {/* About tab bar */}
      <div className="bg-card rounded-2xl border border-border py-3 text-center">
        <span className="text-sm font-medium text-foreground">About</span>
      </div>

      {/* About content */}
      <div className="bg-card rounded-2xl border border-border p-7">
        <h2 className="text-[17px] font-bold text-foreground mb-0.5">About</h2>
        <p className="text-muted-foreground text-[14px] mb-6">Pwo Luduvian</p>

        <h3 className="text-[15px] font-bold text-foreground mb-4">Currently Wearing</h3>
        <div className="flex items-start gap-6">
          <div
            className="w-[180px] h-[220px] rounded-xl shrink-0 border border-border"
            style={{ background: grad(4) }}
          />
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-4 gap-3">
              {visible.map((item) => (
                <div key={item.index} className="flex flex-col items-center gap-2">
                  <div
                    className="w-full aspect-square rounded-xl"
                    style={{ background: grad(item.index) }}
                  />
                  <span className="text-[12px] text-muted-foreground text-center leading-tight">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
          {WEARING_ITEMS.length > 4 && (
            <div className="flex items-center gap-1 shrink-0">
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
    </div>
  )
}
