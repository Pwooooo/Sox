import { useRef, useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface HorizontalScrollProps {
  children: React.ReactNode
  className?: string
  outerClassName?: string
  scrollStep?: number
  leftButtonClassName?: string
  rightButtonClassName?: string
}

export function HorizontalScroll({
  children,
  className = '',
  outerClassName = '',
  scrollStep = 300,
  leftButtonClassName = '',
  rightButtonClassName = '',
}: HorizontalScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const outerRef = useRef<HTMLDivElement>(null)
  const state = useRef({ isDown: false, startX: 0, scrollLeft: 0, moved: false, lastX: 0, lastTime: 0, velocity: 0, momentumId: 0, dragJustFinished: false })
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 0)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    const ro = new ResizeObserver(updateScrollState)
    ro.observe(el)
    for (const child of el.children) ro.observe(child)
    el.addEventListener('scroll', updateScrollState)
    return () => { ro.disconnect(); el.removeEventListener('scroll', updateScrollState) }
  }, [updateScrollState])

  useEffect(() => {
    return () => { state.current.momentumId && cancelAnimationFrame(state.current.momentumId) }
  }, [])

  const scrollLeft = useCallback(() => {
    scrollRef.current?.scrollBy({ left: -scrollStep, behavior: 'smooth' })
  }, [scrollStep])

  const scrollRight = useCallback(() => {
    scrollRef.current?.scrollBy({ left: scrollStep, behavior: 'smooth' })
  }, [scrollStep])

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    const el = scrollRef.current
    if (!el) return
    const s = state.current
    s.isDown = true
    s.startX = e.pageX - (el.offsetLeft || 0)
    s.scrollLeft = el.scrollLeft
    s.moved = false
    s.lastX = e.pageX
    s.lastTime = Date.now()
    s.velocity = 0
    s.momentumId && cancelAnimationFrame(s.momentumId)
    document.body.style.userSelect = 'none'
  }

  const onMouseUp = () => {
    const s = state.current
    s.isDown = false
    document.body.style.userSelect = ''
    if (Math.abs(s.velocity) > 0.1) {
      let vel = s.velocity
      const friction = 0.95
      const minVel = 0.1
      const step = () => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft -= vel
          vel *= friction
          if (Math.abs(vel) > minVel) s.momentumId = requestAnimationFrame(step)
          else s.momentumId = 0
        }
      }
      s.momentumId = requestAnimationFrame(step)
    }
    if (s.moved) s.dragJustFinished = true
    setTimeout(() => { s.moved = false }, 0)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    const s = state.current
    if (!s.isDown) return
    e.preventDefault()
    const el = scrollRef.current
    if (!el) return
    const x = e.pageX - (el.offsetLeft || 0) - s.startX
    if (Math.abs(x) > 5) s.moved = true
    el.scrollLeft = s.scrollLeft - x
    const now = Date.now()
    const dx = e.pageX - s.lastX
    const dt = now - s.lastTime
    if (dt > 0) s.velocity = (dx / dt) * 10
    s.lastX = e.pageX
    s.lastTime = now
  }

  const onClickCapture = (e: React.MouseEvent) => {
    if (state.current.dragJustFinished) {
      e.preventDefault()
      e.stopPropagation()
      state.current.dragJustFinished = false
    }
  }

  return (
    <div ref={outerRef} className={`relative ${outerClassName}`}>
      <div
        ref={scrollRef}
        className={`scroll-mask-x hide-scrollbar overflow-x-auto rounded-lg ${className}`}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseUp}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onClickCapture={onClickCapture}
        style={{ cursor: state.current.isDown ? 'grabbing' : 'grab' }}
      >
        {children}
      </div>
      {!atStart && (
        <button
          type="button"
          onClick={scrollLeft}
          className={`scroll-btn-l absolute left-0 top-1/2 z-20 ml-2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 p-3 text-white md:flex ${leftButtonClassName}`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="size-5" />
        </button>
      )}
      {!atEnd && (
        <button
          type="button"
          onClick={scrollRight}
          className={`scroll-btn-r absolute right-0 top-1/2 z-20 mr-2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 p-3 text-white md:flex ${rightButtonClassName}`}
          aria-label="Scroll right"
        >
          <ChevronRight className="size-5" />
        </button>
      )}
    </div>
  )
}
