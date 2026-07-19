import { useState } from 'react'
import { cn } from '@/lib/utils'
import { MoreHorizontal, Pencil, ChevronLeft, ChevronRight } from 'lucide-react'

const WEARING_ITEMS = [
  { name: 'Dizzy', index: 0 },
  { name: 'Long Ponytail', index: 1 },
  { name: 'Pwo', index: 2 },
  { name: 'Pwo', index: 3 },
  { name: 'Classic Tee', index: 4 },
  { name: 'Black Jeans', index: 5 },
]

function gradientFor(i: number) {
  const gradients = [
    'linear-gradient(135deg, #555 0%, #333 100%)',
    'linear-gradient(135deg, #666 0%, #444 100%)',
    'linear-gradient(135deg, #777 0%, #555 100%)',
    'linear-gradient(135deg, #555 0%, #222 100%)',
    'linear-gradient(135deg, #444 0%, #333 100%)',
    'linear-gradient(135deg, #666 0%, #222 100%)',
  ]
  return gradients[i % gradients.length]
}

export function Profile() {
  const [wearingIndex, setWearingIndex] = useState(0)
  const visible = WEARING_ITEMS.slice(wearingIndex, wearingIndex + 4)

  return (
    <div className="max-w-[850px] mx-auto p-4 md:p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div
              className="w-28 h-28 md:w-32 md:h-32 rounded-xl shrink-0"
              style={{ background: gradientFor(4) }}
            />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Sky</h1>
              <p className="text-muted-foreground text-base">@sky</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span><strong className="text-foreground font-semibold">0</strong> Friends</span>
                <span><strong className="text-foreground font-semibold">0</strong> Followers</span>
                <span><strong className="text-foreground font-semibold">0</strong> Following</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors cursor-pointer">
              <Pencil className="size-4" />
              Edit Profile
            </button>
            <button className="size-9 rounded-lg border border-border bg-secondary text-foreground flex items-center justify-center hover:bg-secondary/80 transition-colors cursor-pointer">
              <MoreHorizontal className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* About Tab */}
      <div className="bg-card rounded-2xl border border-border">
        <button className="w-full py-3 text-sm font-medium text-foreground bg-secondary/60 rounded-2xl cursor-pointer border-none">
          About
        </button>
      </div>

      {/* About Content */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="text-lg font-bold text-foreground mb-1">About</h2>
        <p className="text-muted-foreground text-sm mb-6">Pwo Luduvian</p>

        <h3 className="text-sm font-bold text-foreground mb-4">Currently Wearing</h3>
        <div className="flex items-start gap-8">
          {/* Full body avatar */}
          <div
            className="w-44 h-52 md:w-52 md:h-60 rounded-xl shrink-0"
            style={{ background: gradientFor(4) }}
          />

          {/* Worn items */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-4 gap-3">
              {visible.map((item) => (
                <div key={item.name + item.index} className="flex flex-col items-center gap-2">
                  <div
                    className="w-full aspect-square rounded-xl border border-border"
                    style={{ background: gradientFor(item.index) }}
                  />
                  <span className="text-xs text-muted-foreground text-center">{item.name}</span>
                </div>
              ))}
            </div>
            {WEARING_ITEMS.length > 4 && (
              <div className="flex items-center justify-end gap-1 mt-3">
                <button
                  onClick={() => setWearingIndex(Math.max(0, wearingIndex - 1))}
                  disabled={wearingIndex === 0}
                  className="size-7 rounded-md bg-secondary flex items-center justify-center disabled:opacity-30 hover:bg-secondary/80 transition-colors cursor-pointer border-none"
                >
                  <ChevronLeft className="size-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => setWearingIndex(Math.min(WEARING_ITEMS.length - 4, wearingIndex + 1))}
                  disabled={wearingIndex >= WEARING_ITEMS.length - 4}
                  className="size-7 rounded-md bg-secondary flex items-center justify-center disabled:opacity-30 hover:bg-secondary/80 transition-colors cursor-pointer border-none"
                >
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
