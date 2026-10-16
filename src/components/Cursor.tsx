import { useEffect, useRef } from 'react'

// Mouse and trackpad only; touch screens keep their native behaviour.
const FINE_POINTER = '(hover: hover) and (pointer: fine)'
// Share of the remaining distance covered per 60fps frame. Lower is lazier.
const FOLLOW = 0.15
// Surfaces darker than this relative luminance get the light cursor.
const DARK_LUMINANCE = 0.25

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = dot.current
    const fine = window.matchMedia(FINE_POINTER)
    if (!el || !fine.matches) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const root = document.documentElement
    root.dataset.customCursor = ''

    const target = { x: -100, y: -100 }
    const pos = { ...target }
    let frame = 0
    let last = 0

    const render = (now: number) => {
      const step = reduceMotion.matches
        ? 1
        : 1 - Math.pow(1 - FOLLOW, Math.min(now - last, 100) / (1000 / 60))
      last = now
      pos.x += (target.x - pos.x) * step
      pos.y += (target.y - pos.y) * step
      el.style.translate = `${pos.x}px ${pos.y}px`
      const settled = Math.abs(target.x - pos.x) < 0.1 && Math.abs(target.y - pos.y) < 0.1
      frame = settled ? 0 : requestAnimationFrame(render)
    }

    const updateSurface = () => {
      const under = document.elementFromPoint(target.x, target.y)
      el.dataset.surface = under && isDark(under) ? 'dark' : 'light'
    }

    const onMove = (e: MouseEvent) => {
      if (el.dataset.visible === undefined) {
        // First move: start at the pointer instead of sliding in from a corner.
        pos.x = e.clientX
        pos.y = e.clientY
      }
      target.x = e.clientX
      target.y = e.clientY
      el.dataset.visible = ''
      updateSurface()
      if (!frame) {
        last = performance.now()
        frame = requestAnimationFrame(render)
      }
    }
    const onLeave = () => delete el.dataset.visible

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', updateSurface, { passive: true })
    root.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', updateSurface)
      root.removeEventListener('mouseleave', onLeave)
      delete root.dataset.customCursor
    }
  }, [])

  return (
    <div
      ref={dot}
      aria-hidden
      data-cursor-dot
      className="pointer-events-none fixed top-0 left-0 z-100 -mt-2 -ml-2 size-4 rounded-full bg-brand opacity-0 transition-[background-color,opacity] duration-200 data-visible:opacity-100 data-[surface=dark]:bg-grey"
    />
  )
}

// Walks up from the element to the first painted background, blending any
// translucency over white, and checks how dark it is.
function isDark(start: Element) {
  for (let node: Element | null = start; node; node = node.parentElement) {
    const [r, g, b, a] = toRgba(getComputedStyle(node).backgroundColor)
    if (a === 0) continue
    const [lr, lg, lb] = [r, g, b].map((c) => {
      const s = (c * a + 255 * (1 - a)) / 255
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb < DARK_LUMINANCE
  }
  return false
}

// Any CSS colour (rgb, oklab, color-mix output…) to 0–255 RGB plus 0–1 alpha.
let swatch: CanvasRenderingContext2D | null = null
function toRgba(color: string): [number, number, number, number] {
  swatch ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })
  if (!swatch) return [255, 255, 255, 0]
  swatch.clearRect(0, 0, 1, 1)
  swatch.fillStyle = color
  swatch.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = swatch.getImageData(0, 0, 1, 1).data
  return [r, g, b, a / 255]
}
