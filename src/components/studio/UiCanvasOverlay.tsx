import { useState, useEffect } from 'react'
import type { NvloInstanceData } from '@engine/index'

interface UiCanvasOverlayProps {
  starterGuiChildren: NvloInstanceData[]
  selectedId: string
  isEditMode: boolean
  isPlaying: boolean
  onSelect: (id: string) => void
  onUpdateLayout: (id: string, updates: Record<string, number>) => void
}

function hexToRgba(hex: string, transparency: number): string {
  const clean = hex.replace('#', '')
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  const alpha = Math.max(0, Math.min(1, 1 - transparency))
  return `rgba(${Number.isNaN(r) ? 255 : r}, ${Number.isNaN(g) ? 255 : g}, ${Number.isNaN(b) ? 255 : b}, ${alpha})`
}

export function UiCanvasOverlay({
  starterGuiChildren,
  selectedId,
  isEditMode,
  isPlaying,
  onSelect,
  onUpdateLayout,
}: UiCanvasOverlayProps) {
  const [dragState, setDragState] = useState<{
    id: string
    mode: 'move' | 'resize'
    startX: number
    startY: number
    origX: number
    origY: number
    origW: number
    origH: number
  } | null>(null)

  useEffect(() => {
    if (!dragState) return
    const onMove = (e: PointerEvent) => {
      const dx = Math.round(e.clientX - dragState.startX)
      const dy = Math.round(e.clientY - dragState.startY)
      if (dragState.mode === 'move') {
        onUpdateLayout(dragState.id, {
          PositionX: Math.max(0, dragState.origX + dx),
          PositionY: Math.max(0, dragState.origY + dy),
        })
      } else {
        onUpdateLayout(dragState.id, {
          Width: Math.max(16, dragState.origW + dx),
          Height: Math.max(16, dragState.origH + dy),
        })
      }
    }
    const onUp = () => setDragState(null)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [dragState, onUpdateLayout])

  const isUiElement = (cls: string) =>
    cls === 'Frame' ||
    cls === 'TextLabel' ||
    cls === 'TextButton' ||
    cls === 'ImageLabel' ||
    cls === 'ImageButton' ||
    cls === 'TextBox' ||
    cls === 'ScrollingFrame'

  const renderUiNode = (el: NvloInstanceData) => {
    const p = el.properties || {}
    if (p.Visible === false) return null

    const x = Number(p.PositionX ?? 120)
    const y = Number(p.PositionY ?? 120)
    const w = Number(p.Width ?? 200)
    const h = Number(p.Height ?? 120)
    const bgColor = String(p.BackgroundColor ?? '#ffffff')
    const bgTrans = Number(p.BackgroundTransparency ?? 0)
    const radius = Number(p.CornerRadius ?? 0)
    const text = String(p.Text ?? '')
    const textColor = String(p.TextColor ?? '#0a0a0a')
    const fontSize = Number(p.FontSize ?? 14)
    const imgUrl = String(p.ImageUrl ?? '')
    const isSelected = isEditMode && selectedId === el.id
    const nestedUi = (el.children || []).filter((c) => isUiElement(c.className))

    return (
      <div
        key={el.id}
        onPointerDown={(e) => {
          if (!isEditMode) return
          e.stopPropagation()
          onSelect(el.id)
          setDragState({
            id: el.id,
            mode: 'move',
            startX: e.clientX,
            startY: e.clientY,
            origX: x,
            origY: y,
            origW: w,
            origH: h,
          })
        }}
        style={{
          left: x,
          top: y,
          width: w,
          height: h,
          backgroundColor: hexToRgba(bgColor, bgTrans),
          borderRadius: radius,
        }}
        className={`absolute flex items-center justify-center select-none ${
          isEditMode
            ? 'pointer-events-auto cursor-move'
            : isPlaying && el.className === 'TextButton'
              ? 'pointer-events-auto cursor-pointer active:scale-95 transition-transform'
              : 'pointer-events-none'
        } ${isSelected ? 'ring-1 ring-[#38bdf8] shadow-[0_0_0_1px_rgba(0,0,0,0.45)]' : ''}`}
      >
        {(el.className === 'TextLabel' || el.className === 'TextButton') && (
          <span
            style={{ color: textColor, fontSize }}
            className="font-normal px-2 truncate pointer-events-none"
          >
            {text}
          </span>
        )}

        {el.className === 'ImageLabel' && imgUrl.trim() !== '' && (
          <img
            src={imgUrl}
            alt={el.name}
            draggable={false}
            className="w-full h-full object-contain pointer-events-none"
          />
        )}

        {nestedUi.map((child) => renderUiNode(child))}

        {isSelected && (
          <div
            onPointerDown={(e) => {
              e.stopPropagation()
              setDragState({
                id: el.id,
                mode: 'resize',
                startX: e.clientX,
                startY: e.clientY,
                origX: x,
                origY: y,
                origW: w,
                origH: h,
              })
            }}
            className="absolute -bottom-1 -right-1 size-2.5 bg-white border border-black/70 cursor-nwse-resize"
            title="Resize"
          />
        )}
      </div>
    )
  }

  // Only render top-level UI elements (either inside enabled ScreenGui or directly in StarterGui); nested children render inside their parent
  const topElements: NvloInstanceData[] = []
  for (const node of starterGuiChildren) {
    if (node.className === 'ScreenGui') {
      if (node.properties?.Enabled !== false && node.children) {
        topElements.push(...node.children.filter((c) => isUiElement(c.className)))
      }
    } else if (isUiElement(node.className)) {
      topElements.push(node)
    }
  }

  if (topElements.length === 0) return null

  return (
    <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
      {topElements.map((el) => renderUiNode(el))}
    </div>
  )
}
